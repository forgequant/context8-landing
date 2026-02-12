import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase' // legacy: migrate to ctx8-api
import { PaymentSubmission } from '../types/subscription'

interface PaymentSubmissionWithEmail extends PaymentSubmission {
  user_email: string
}

interface UsePaymentSubmissionsReturn {
  payments: PaymentSubmissionWithEmail[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook for fetching pending payment submissions with user email join
 * Used in admin panel to display payments awaiting verification
 */
export function usePaymentSubmissions(): UsePaymentSubmissionsReturn {
  const [payments, setPayments] = useState<PaymentSubmissionWithEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = async () => {
    setLoading(true)
    setError(null)

    try {
      // Call RPC function to get payments with user emails
      const { data, error: fetchError } = await supabase
        .rpc('get_pending_payments_with_emails')

      if (fetchError) throw fetchError

      setPayments(data || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch payments'
      setError(message)
      console.error('Error fetching payment submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()

    // Subscribe to real-time updates for payment_submissions table
    const subscription = supabase
      .channel('payment_submissions_changes')
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
