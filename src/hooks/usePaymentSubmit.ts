import { useState } from 'react'
import { supabase } from '../lib/supabase' // legacy: migrate to ctx8-api
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

/**
 * Hook for submitting crypto payment to database
 */
export function usePaymentSubmit(): UsePaymentSubmitReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const submitPayment = async (data: PaymentSubmitData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      if (!user) {
        throw new Error('You must be logged in to submit a payment')
      }

      // legacy: migrate to ctx8-api
      const { error: insertError } = await supabase.from('payment_submissions').insert({
        user_id: user.id,
        plan: 'pro',
        tx_hash: data.txHash,
        chain: data.chain,
        amount: PLAN_PRICES.pro,
        status: 'pending'
      })

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('This transaction hash has already been submitted')
        }
        throw insertError
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
