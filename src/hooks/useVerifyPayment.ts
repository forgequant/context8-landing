import { useState } from 'react'
import { supabase } from '../lib/supabase'

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

  const verifyPayment = async (
    paymentId: string,
    action: 'verified' | 'rejected',
    notes: string
  ) => {
    setIsVerifying(true)
    setError(null)

    try {
      // Get current user (admin)
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('You must be logged in to verify payments')
      }

      // Check admin status
      if (!user.user_metadata?.is_admin) {
        throw new Error('Unauthorized: Admin access required')
      }

      // Update payment submission status
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

      // Note: If action is 'verified', the database trigger will automatically:
      // 1. Create/update the user's subscription record
      // 2. Set plan to 'pro'
      // 3. Set starts_at to now
      // 4. Set expires_at to now + 30 days
      // This is handled by the activate_subscription_on_payment_approval trigger
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
