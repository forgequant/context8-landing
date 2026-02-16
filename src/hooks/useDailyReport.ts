import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { DailyReport, DailyReportWithMeta } from '../types/dailyReport'
import {
  ApiError,
  apiFetchWithFallback,
  extractArrayFromResponse,
  extractObjectFromResponse,
} from '../lib/api'

interface UseDailyReportOptions {
  /** Specific date to fetch (YYYY-MM-DD), defaults to latest */
  date?: string
  /** Whether to auto-refresh with polling */
  realtime?: boolean
}

interface UseDailyReportReturn {
  /** The fetched report with metadata */
  report: DailyReportWithMeta | null
  /** Loading state */
  loading: boolean
  /** Error message if any */
  error: string | null
  /** Whether the report exists */
  exists: boolean
  /** Manually refetch the report */
  refetch: () => Promise<void>
}

interface DailyReportListPayload {
  total?: number
  page?: number
  limit?: number
  total_count?: number
}

function isDailyReport(value: unknown): value is DailyReport {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const report = value as Record<string, unknown>
  return (
    typeof report.id === 'string' &&
    typeof report.report_date === 'string' &&
    typeof report.generated_at === 'string' &&
    typeof report.metrics === 'object' &&
    typeof report.status === 'string' &&
    typeof report.executive_summary !== 'undefined'
  )
}

function extractSingleDailyReport(response: unknown): DailyReport | null {
  if (isDailyReport(response)) {
    return response
  }

  const payload = extractObjectFromResponse<DailyReport>(response, [
    'report',
    'item',
    'data',
    'result',
  ])
  if (isDailyReport(payload)) {
    return payload
  }

  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const rec = response as Record<string, unknown>
    if (isDailyReport(rec.payload)) {
      return rec.payload
    }
  }

  const list = extractArrayFromResponse<DailyReport>(
    response,
    ['items', 'data', 'results', 'reports', 'rows'],
    isDailyReport,
  )
  return list[0] ?? null
}

function estimateTotalFromPage(offset: number, pageSize: number): number {
  return offset + pageSize
}

function parseTotalValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return null
}

/**
 * Hook for fetching a single daily report (latest or by date)
 */
export function useDailyReport(options: UseDailyReportOptions = {}): UseDailyReportReturn {
  const { date, realtime = false } = options
  const { accessToken } = useAuth()

  const [report, setReport] = useState<DailyReportWithMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const buildMetaReport = useCallback((data: DailyReport): DailyReportWithMeta => {
    const reportDate = new Date(data.report_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const isToday = reportDate.toDateString() === today.toDateString()
    const formattedDate = reportDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const generatedAt = new Date(data.generated_at)
    const daysSinceGenerated = Math.floor(
      (Date.now() - generatedAt.getTime()) / (1000 * 60 * 60 * 24),
    )

    return {
      ...data,
      isToday,
      formattedDate,
      daysSinceGenerated,
    }
  }, [])

  const fetchReport = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiFetchWithFallback<unknown>(
        date
          ? [
              `/api/v1/reports/MARKET/${encodeURIComponent(date)}`,
              `/api/v1/reports?asset=MARKET&date=${encodeURIComponent(date)}`,
            ]
          : [
              '/api/v1/reports/MARKET/latest',
              '/api/v1/reports/latest?asset=MARKET',
            ],
        {
          method: 'GET',
          token: accessToken,
        },
      )

      const nextReport = extractSingleDailyReport(response)
      if (!nextReport) {
        setReport(null)
        return
      }

      setReport(buildMetaReport(nextReport))
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setReport(null)
        return
      }

      const message = err instanceof Error ? err.message : 'Failed to fetch report'
      setError(message)
      console.error('Error fetching daily report:', err)
    } finally {
      setLoading(false)
    }
  }, [accessToken, date, buildMetaReport])

  useEffect(() => {
    let timer: number | undefined

    void fetchReport()

    if (realtime) {
      timer = window.setInterval(fetchReport, 30000)
    }

    return () => {
      if (timer) {
        window.clearInterval(timer)
      }
    }
  }, [fetchReport, realtime])

  return {
    report,
    loading,
    error,
    exists: report !== null,
    refetch: fetchReport,
  }
}

// ============================================================================
// REPORTS LIST HOOK
// ============================================================================

interface UseDailyReportsListOptions {
  /** Number of reports to fetch */
  limit?: number
  /** Page number (1-indexed) */
  page?: number
}

interface UseDailyReportsListReturn {
  /** List of reports */
  reports: DailyReport[]
  /** Loading state */
  loading: boolean
  /** Error message if any */
  error: string | null
  /** Total count of reports */
  total: number
  /** Whether there are more reports to fetch */
  hasMore: boolean
  /** Manually refetch the list */
  refetch: () => Promise<void>
}

/**
 * Hook for fetching a list of daily reports with pagination
 */
export function useDailyReportsList(
  options: UseDailyReportsListOptions = {},
): UseDailyReportsListReturn {
  const { limit = 10, page = 1 } = options
  const { accessToken } = useAuth()

  const [reports, setReports] = useState<DailyReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const offset = (page - 1) * limit
      const query = new URLSearchParams({
        asset: 'MARKET',
        status: 'published',
        limit: String(limit),
        offset: String(offset),
      })
      const response = await apiFetchWithFallback<DailyReportListPayload | DailyReport[]>(
        [`/api/v1/reports?${query.toString()}`, `/api/v1/reports/list?${query.toString()}`],
        {
          method: 'GET',
          token: accessToken,
        },
      )

      if (Array.isArray(response)) {
        setReports(response)
        setTotal(estimateTotalFromPage(offset, response.length))
        setHasMore(response.length === limit)
        return
      }

      const list = extractArrayFromResponse<DailyReport>(response, ['items', 'data', 'results', 'reports'])
      setReports(list)

      const payload = extractObjectFromResponse<DailyReportListPayload>(response, ['meta', 'pagination', 'payload'])
      const totalValue =
        payload?.total ??
        payload?.total_count ??
        (typeof response === 'object' && response !== null
          ? (response as DailyReportListPayload).total ??
            (response as DailyReportListPayload).total_count
          : undefined)
      const parsedTotal = parseTotalValue(totalValue)
      setTotal(parsedTotal ?? estimateTotalFromPage(offset, list.length))
      setHasMore(parsedTotal !== null ? page * limit < parsedTotal : list.length === limit)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch reports'
      setError(message)
      console.error('Error fetching daily reports list:', err)
    } finally {
      setLoading(false)
    }
  }, [accessToken, page, limit])

  useEffect(() => {
    void fetchReports()
  }, [fetchReports])

  return {
    reports,
    loading,
    error,
    total,
    hasMore,
    refetch: fetchReports,
  }
}

// ============================================================================
// REPORT DATES HOOK (for calendar/navigation)
// ============================================================================

interface UseDailyReportDatesReturn {
  /** List of dates with published reports */
  dates: string[]
  /** Loading state */
  loading: boolean
  /** Error message if any */
  error: string | null
}

/**
 * Hook for fetching available report dates (useful for calendar navigation)
 */
export function useDailyReportDates(): UseDailyReportDatesReturn {
  const [dates, setDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { accessToken } = useAuth()

  useEffect(() => {
    const fetchDates = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await apiFetchWithFallback<unknown>(
          [
            '/api/v1/reports/dates?asset=MARKET&status=published&limit=90',
            '/api/v1/reports?asset=MARKET&status=published&fields=report_date&limit=90',
            '/api/v1/daily-reports/dates',
          ],
          {
            method: 'GET',
            token: accessToken,
          },
        )

        const payload = extractArrayFromResponse<string>(
          response,
          ['dates', 'items', 'data', 'results', 'rows'],
          (item): item is string => typeof item === 'string',
        )
        if (payload.length > 0) {
          setDates(payload)
          return
        }

        const rows = extractArrayFromResponse<Record<string, unknown>>(
          response,
          ['dates', 'items', 'data', 'results', 'rows'],
          (item): item is Record<string, unknown> =>
            !!item && typeof item === 'object' && 'report_date' in item,
        )

        setDates(
          rows
            .map((row) => {
              const value = row.report_date
              return typeof value === 'string' ? value : null
            })
            .filter((value): value is string => typeof value === 'string'),
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch report dates'
        setError(message)
        console.error('Error fetching report dates:', err)
      } finally {
        setLoading(false)
      }
    }

    void fetchDates()
  }, [accessToken])

  return {
    dates,
    loading,
    error,
  }
}
