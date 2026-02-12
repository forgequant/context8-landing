import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase' // legacy: migrate to ctx8-api
import { useAuth } from './useAuth'
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
  const { user } = useAuth()

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // legacy: migrate to ctx8-api
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
  }, [user])

  useEffect(() => {
    fetchSubscription()

    // legacy: migrate to ctx8-api
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
          fetchSubscription()
        }
      )
      .subscribe()

    return () => {
      subscription_channel.unsubscribe()
    }
  }, [fetchSubscription])

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
