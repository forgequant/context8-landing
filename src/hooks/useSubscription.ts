import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { Subscription } from '../types/subscription'
import { isInGracePeriod, getDaysRemaining } from '../lib/subscription'
import {
  apiFetchWithFallback,
  extractObjectFromResponse,
  ApiError,
} from '../lib/api'

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

interface SubscriptionApiResponse {
  subscription?: Subscription | null
  has_active?: boolean
  days_remaining?: number | null
  is_grace_period?: boolean
}

/**
 * Hook for fetching user's active subscription with grace period logic
 */
export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, accessToken } = useAuth()

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiFetchWithFallback<SubscriptionApiResponse | Subscription | null>(
        ['/api/v1/subscriptions/me', '/api/v1/subscription/me', '/api/v1/me/subscription'],
        {
          token: accessToken,
        },
      )

      let nextSubscription: Subscription | null = null

      if (Array.isArray(response)) {
        nextSubscription = response[0] ?? null
      } else {
        const payload = extractObjectFromResponse<SubscriptionApiResponse>(response, [
          'subscription',
          'data',
          'result',
          'payload',
        ]) ?? null

        if (payload?.subscription) {
          nextSubscription = payload.subscription
        } else if (payload && 'plan' in payload && 'end_date' in payload) {
          nextSubscription = payload as Subscription
        }
      }

      setSubscription(nextSubscription)
    } catch (err) {
      // Fallback for legacy API response shape during backend transition
      if (err instanceof ApiError && err.status === 404) {
        setSubscription(null)
      } else {
        const message = err instanceof Error ? err.message : 'Failed to fetch subscription'
        setError(message)
        console.error('Error fetching subscription:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [user, accessToken])

  useEffect(() => {
    void fetchSubscription()
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
    refetch: fetchSubscription,
  }
}
