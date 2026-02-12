import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase' // legacy: migrate to ctx8-api
import { useAuth } from './useAuth'

interface UsePendingPaymentsCountReturn {
  count: number
  loading: boolean
  error: string | null
}

/**
 * Hook for fetching count of pending payments (for admin badge)
 * Updates in real-time when payments are added/updated
 */
export function usePendingPaymentsCount(): UsePendingPaymentsCountReturn {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    if (!user || !isAdmin) {
      setCount(0)
      setLoading(false)
      return
    }

    const fetchCount = async () => {
      try {
        // legacy: migrate to ctx8-api
        const { data: countData, error: fetchError } = await supabase
          .rpc('count_pending_payments')

        if (fetchError) throw fetchError

        setCount(countData || 0)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch count'
        setError(message)
        console.error('Error fetching pending payments count:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCount()

    // Poll every 10 seconds for updates
    const interval = setInterval(fetchCount, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [user, isAdmin])

  return {
    count,
    loading,
    error
  }
}
