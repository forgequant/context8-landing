import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './useAuth'
import { PaymentSubmission } from '../types/subscription'
import { apiFetch, extractArrayFromResponse } from '../lib/api'

interface UsePaymentHistoryReturn {
  payments: PaymentSubmission[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}


export function usePaymentHistory(): UsePaymentHistoryReturn {
  const [payments, setPayments] = useState<PaymentSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, accessToken } = useAuth()
  const hasLoadedOnceRef = useRef(false)

  const fetchPayments = useCallback(async () => {
    if (!user) {
      setPayments([])
      setLoading(false)
      hasLoadedOnceRef.current = false
      return
    }
    setLoading(!hasLoadedOnceRef.current)
    setError(null)

    try {
      const response = await apiFetch<PaymentSubmission[] | { items?: PaymentSubmission[] }>(
        '/api/v1/payments?scope=self&sort=submitted_at:desc',
        {
          method: 'GET',
          token: accessToken,
        },
      )

      const history = extractArrayFromResponse<PaymentSubmission>(response, [
        'items',
        'data',
        'results',
        'payments',
      ])
      setPayments(history)
      hasLoadedOnceRef.current = true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch payment history'
      setError(message)
      console.error('Error fetching payment history:', err)
    } finally {
      setLoading(false)
    }
  }, [user, accessToken])

  useEffect(() => {
    void fetchPayments()

    if (!user) return

    const interval = setInterval(fetchPayments, 30000)

    return () => clearInterval(interval)
  }, [fetchPayments, user])

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments,
  }
}
