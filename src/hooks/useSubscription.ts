import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Subscription } from '../types/subscription'
import { isInGracePeriod, getDaysRemaining } from '../lib/subscription'

interface UseSubscriptionReturn {
  subscription: Subscription | null
  loading: boolean
  error: string | null
  isActive: boolean
  isExpired: boolean
  isInGrace: boolean
  daysRemaining: number
  refetch: () => Promise<void>
}

/**
 * Hook for fetching user's active subscription with grace period logic
 * Grace period: 48 hours after end_date
 */
export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscription = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get current user
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setSubscription(null)
        return
      }

      // Fetch active subscription
      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('end_date', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (fetchError) throw fetchError

      setSubscription(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subscription'
      setError(message)
      console.error('Error fetching subscription:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscription()

    // Subscribe to real-time updates for subscriptions table
    const subscription_channel = supabase
      .channel('subscriptions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions'
        },
        () => {
          // Refetch on any change to subscriptions
          fetchSubscription()
        }
      )
      .subscribe()

    return () => {
      subscription_channel.unsubscribe()
    }
  }, [])

  // Compute derived states
  const now = new Date()
  const isActive = subscription
    ? new Date(subscription.end_date) > now || isInGracePeriod(subscription)
    : false
  const isExpired = subscription ? !isActive : false
  const isInGrace = subscription ? isInGracePeriod(subscription) : false
  const daysRemaining = subscription ? getDaysRemaining(subscription) : 0

  return {
    subscription,
    loading,
    error,
    isActive,
    isExpired,
    isInGrace,
    daysRemaining,
    refetch: fetchSubscription
  }
}
