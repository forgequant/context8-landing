import { useState } from 'react'
import { supabase } from '../lib/supabase'
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

  const submitPayment = async (data: PaymentSubmitData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Get current user
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('You must be logged in to submit a payment')
      }

      // Insert payment submission
      const { error: insertError } = await supabase.from('payment_submissions').insert({
        user_id: user.id,
        plan: 'pro',
        tx_hash: data.txHash,
        chain: data.chain,
        amount: PLAN_PRICES.pro,
        status: 'pending'
      })

      if (insertError) {
        // Handle duplicate tx_hash error
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
