import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase' // legacy: migrate to ctx8-api
import { useAuth } from './useAuth'
import { PaymentSubmission } from '../types/subscription'

interface UsePaymentHistoryReturn {
  payments: PaymentSubmission[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook for fetching user's payment submission history
 * Returns all payment submissions (pending, verified, rejected) ordered by submitted_at DESC
 */
export function usePaymentHistory(): UsePaymentHistoryReturn {
  const [payments, setPayments] = useState<PaymentSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchPayments = useCallback(async () => {
    if (!user) {
      setPayments([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // legacy: migrate to ctx8-api
      const { data, error: fetchError } = await supabase
        .from('payment_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })

      if (fetchError) throw fetchError

      setPayments(data || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch payment history'
      setError(message)
      console.error('Error fetching payment history:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchPayments()

    // legacy: migrate to ctx8-api
    const subscription = supabase
      .channel('payment_submissions_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_submissions'
        },
        () => {
          fetchPayments()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchPayments])

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments
  }
}
