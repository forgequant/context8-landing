import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase' // legacy: migrate to ctx8-api
import { DailyReport, DailyReportWithMeta } from '../types/dailyReport'

interface UseDailyReportOptions {
  /** Specific date to fetch (YYYY-MM-DD), defaults to latest */
  date?: string
  /** Whether to auto-refresh on realtime updates */
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

/**
 * Hook for fetching a single daily report (latest or by date)
 */
export function useDailyReport(options: UseDailyReportOptions = {}): UseDailyReportReturn {
  const { date, realtime = false } = options

  const [report, setReport] = useState<DailyReportWithMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let data: DailyReport | null = null
      let fetchError: { code?: string; message: string } | null = null

      if (date) {
        // Fetch specific date
        const result = await supabase
          .from('daily_reports')
          .select('*')
          .eq('status', 'published')
          .eq('report_date', date)
          .single()
        data = result.data
        fetchError = result.error
      } else {
        // Fetch latest
        const result = await supabase
          .from('daily_reports')
          .select('*')
          .eq('status', 'published')
          .order('report_date', { ascending: false })
          .limit(1)
          .single()
        data = result.data
        fetchError = result.error
      }

      if (fetchError) {
        // PGRST116 = no rows returned (not an error for us)
        if (fetchError.code === 'PGRST116') {
          setReport(null)
        } else {
          throw new Error(fetchError.message)
        }
      } else if (data) {
        // Add metadata
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
          (Date.now() - generatedAt.getTime()) / (1000 * 60 * 60 * 24)
        )

        setReport({
          ...data,
          isToday,
          formattedDate,
          daysSinceGenerated,
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch report'
      setError(message)
      console.error('Error fetching daily report:', err)
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    fetchReport()

    // Optional realtime subscription
    if (realtime) {
      const channel = supabase
        .channel('daily_reports_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'daily_reports',
          },
          () => {
            fetchReport()
          }
        )
        .subscribe()

      return () => {
        channel.unsubscribe()
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
  options: UseDailyReportsListOptions = {}
): UseDailyReportsListReturn {
  const { limit = 10, page = 1 } = options

  const [reports, setReports] = useState<DailyReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const offset = (page - 1) * limit

      // Fetch reports with count
      const { data, error: fetchError, count } = await supabase
        .from('daily_reports')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('report_date', { ascending: false })
        .range(offset, offset + limit - 1)

      if (fetchError) throw fetchError

      setReports(data ?? [])
      setTotal(count ?? 0)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch reports'
      setError(message)
      console.error('Error fetching daily reports list:', err)
    } finally {
      setLoading(false)
    }
  }, [limit, page])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const hasMore = page * limit < total

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

  useEffect(() => {
    const fetchDates = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error: fetchError } = await supabase
          .from('daily_reports')
          .select('report_date')
          .eq('status', 'published')
          .order('report_date', { ascending: false })
          .limit(90) // Last ~3 months

        if (fetchError) throw fetchError

        setDates(data?.map((r) => r.report_date) ?? [])
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch report dates'
        setError(message)
        console.error('Error fetching report dates:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDates()
  }, [])

  return {
    dates,
    loading,
    error,
  }
}
