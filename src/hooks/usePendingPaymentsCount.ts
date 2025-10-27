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

      // Count pending payments
      const { count: pendingCount, error: fetchError } = await supabase
        .from('payment_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

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

    // Subscribe to real-time updates for payment_submissions table
    const subscription = supabase
      .channel('pending_payments_count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_submissions'
        },
        () => {
          // Refetch count on any change
          fetchCount()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    count,
    loading,
    error
  }
}
