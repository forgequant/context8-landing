import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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

  const fetchCount = async () => {
    try {
      // Get current user
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setCount(0)
        return
      }

      // Only fetch count if user is admin
      if (!user.user_metadata?.is_admin) {
        setCount(0)
        return
      }

      // Count pending payments using RPC (bypasses RLS issues)
      const { data: countData, error: fetchError } = await supabase
        .rpc('count_pending_payments')

      const pendingCount = countData || 0

      if (fetchError) throw fetchError

      setCount(pendingCount || 0)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch count'
      setError(message)
      console.error('Error fetching pending payments count:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCount()

    // Poll every 10 seconds for updates
    const interval = setInterval(fetchCount, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return {
    count,
    loading,
    error
  }
}
