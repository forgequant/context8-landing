import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { PaymentSubmission } from '../types/subscription'
import { apiFetch, extractArrayFromResponse } from '../lib/api'

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
  const { accessToken, isAdmin, isLoading } = useAuth()

  const fetchPayments = useCallback(async () => {
    if (!isAdmin) {
      setPayments([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiFetch<
        PaymentSubmissionWithEmail[] | { items?: PaymentSubmissionWithEmail[] }
      >('/api/v1/admin/payments?status=pending', {
        method: 'GET',
        token: accessToken,
      })

      const pending = extractArrayFromResponse<PaymentSubmissionWithEmail>(response, [
        'items',
        'data',
        'results',
        'payments',
      ])

      setPayments(pending)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch payments'
      setError(message)
      console.error('Error fetching payment submissions:', err)
    } finally {
      setLoading(false)
    }
  }, [accessToken, isAdmin])

  useEffect(() => {
    if (isLoading) return

    if (!isAdmin) {
      setPayments([])
      setLoading(false)
      setError(null)
      return
    }

    void fetchPayments()

    const interval = setInterval(fetchPayments, 10000)
    return () => clearInterval(interval)
  }, [isAdmin, isLoading, fetchPayments])

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments,
  }
}
