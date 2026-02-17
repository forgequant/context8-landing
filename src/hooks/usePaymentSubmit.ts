import { useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from './useAuth'
import { BlockchainNetwork, StablecoinType, PLAN_PRICES } from '../types/subscription'

interface PaymentSubmitData {
  chain: BlockchainNetwork
  stablecoin: StablecoinType
  txHash: string
}

interface UsePaymentSubmitReturn {
  submitPayment: (data: PaymentSubmitData) => Promise<void>
  isSubmitting: boolean
  error: string | null
}

interface PaymentSubmitResponse {
  success: boolean
  submission_id?: string
  message?: string
}


export function usePaymentSubmit(): UsePaymentSubmitReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, accessToken } = useAuth()

  const submitPayment = async (data: PaymentSubmitData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      if (!user) {
        throw new Error('You must be logged in to submit a payment')
      }

      const body = {
        plan: 'pro',
        chain: data.chain,
        stablecoin: data.stablecoin,
        amount: PLAN_PRICES.pro,
        tx_hash: data.txHash,
      }

      const response = await apiFetch<unknown>('/api/v1/payments', {
        method: 'POST',
        token: accessToken,
        body: JSON.stringify(body),
      })

      if (response && typeof response === 'object' && !Array.isArray(response)) {
        const payload = response as PaymentSubmitResponse
        if (payload.success === false) {
          throw new Error(payload.message || 'Payment submission rejected')
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit payment'
      setError(message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submitPayment, isSubmitting, error }
}
