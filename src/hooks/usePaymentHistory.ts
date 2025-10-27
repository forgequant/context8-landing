import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
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

  const fetchPayments = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get current user
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setPayments([])
        return
      }

      // Fetch user's payment submissions ordered by submitted_at DESC
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
  }

  useEffect(() => {
    fetchPayments()

    // Subscribe to real-time updates for payment_submissions table
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
          // Refetch on any change to payment_submissions
          fetchPayments()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments
  }
}
