import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { apiFetch } from '../lib/api'

interface UsePendingPaymentsCountReturn {
  count: number
  loading: boolean
  error: string | null
}

/**
 * Hook for fetching count of pending payments (for admin badge)
 * Polls every 10 seconds for updates.
 */
export function usePendingPaymentsCount(): UsePendingPaymentsCountReturn {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isAdmin, accessToken } = useAuth()

  useEffect(() => {
    if (!user || !isAdmin) {
      setCount(0)
      setLoading(false)
      return
    }

    const fetchCount = async () => {
      try {
        const response = await apiFetch<unknown>('/api/v1/admin/payments/pending/count', {
          method: 'GET',
          token: accessToken,
        })

        if (typeof response === 'number') {
          setCount(response)
        } else if (typeof response === 'object' && response !== null) {
          const rec = response as { count?: unknown }
          const value = typeof rec.count === 'number' ? rec.count : Number(rec.count)
          setCount(Number.isFinite(value) ? value : 0)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch count'
        setError(message)
        console.error('Error fetching pending payments count:', err)
      } finally {
        setLoading(false)
      }
    }

    void fetchCount()

    const interval = setInterval(fetchCount, 10000)
    return () => clearInterval(interval)
  }, [user, isAdmin, accessToken])

  return {
    count,
    loading,
    error,
  }
}
