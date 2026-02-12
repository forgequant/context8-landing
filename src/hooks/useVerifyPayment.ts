import { useState } from 'react'
import { supabase } from '../lib/supabase' // legacy: migrate to ctx8-api
import { useAuth } from './useAuth'

interface UseVerifyPaymentReturn {
  verifyPayment: (paymentId: string, action: 'verified' | 'rejected', notes: string) => Promise<void>
  isVerifying: boolean
  error: string | null
}

/**
 * Hook for admin verification of payment submissions
 * Updates payment status and triggers subscription activation via database trigger
 */
export function useVerifyPayment(): UseVerifyPaymentReturn {
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, isAdmin } = useAuth()

  const verifyPayment = async (
    paymentId: string,
    action: 'verified' | 'rejected',
    notes: string
  ) => {
    setIsVerifying(true)
    setError(null)

    try {
      if (!user) {
        throw new Error('You must be logged in to verify payments')
      }

      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required')
      }

      // legacy: migrate to ctx8-api
      const { error: updateError } = await supabase
        .from('payment_submissions')
        .update({
          status: action,
          verification_notes: notes.trim() || null,
          verified_at: new Date().toISOString(),
          verified_by: user.id
        })
        .eq('id', paymentId)

      if (updateError) throw updateError
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify payment'
      setError(message)
      throw err
    } finally {
      setIsVerifying(false)
    }
  }

  return { verifyPayment, isVerifying, error }
}
