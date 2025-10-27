import { addDays, differenceInDays, isBefore, isAfter } from 'date-fns'
import { Subscription, TxHashValidationResult, GRACE_PERIOD_HOURS } from '../types/subscription'

/**
 * Validate transaction hash format
 * Must be 0x followed by 64 hexadecimal characters
 */
export function validateTxHash(txHash: string): TxHashValidationResult {
  const trimmed = txHash.trim()

  if (!trimmed) {
    return { valid: false, error: 'Transaction hash is required' }
  }

  if (!trimmed.startsWith('0x')) {
    return { valid: false, error: 'Transaction hash must start with "0x"' }
  }

  if (trimmed.length !== 66) {
    return { valid: false, error: 'Transaction hash must be 66 characters long (0x + 64 hex characters)' }
  }

  const hexPart = trimmed.slice(2)
  if (!/^[a-fA-F0-9]{64}$/.test(hexPart)) {
    return { valid: false, error: 'Transaction hash must contain only hexadecimal characters (0-9, a-f, A-F)' }
  }

  return { valid: true }
}

/**
 * Calculate days remaining in subscription
 */
export function getDaysRemaining(subscription: Subscription): number {
  const now = new Date()
  const endDate = new Date(subscription.end_date)
  return Math.max(0, differenceInDays(endDate, now))
}

/**
 * Check if subscription is in grace period (48 hours after expiration)
 */
export function isInGracePeriod(subscription: Subscription): boolean {
  const now = new Date()
  const endDate = new Date(subscription.end_date)
  const graceEndDate = addDays(endDate, GRACE_PERIOD_HOURS / 24)

  return isAfter(now, endDate) && isBefore(now, graceEndDate)
}

/**
 * Check if subscription is active (including grace period)
 */
export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription || subscription.status !== 'active') {
    return false
  }

  const now = new Date()
  const endDate = new Date(subscription.end_date)
  const graceEndDate = addDays(endDate, GRACE_PERIOD_HOURS / 24)

  return isBefore(now, graceEndDate)
}

/**
 * Check if subscription is expiring soon (within 7 days)
 */
export function isExpiringSoon(subscription: Subscription): boolean {
  const daysRemaining = getDaysRemaining(subscription)
  return daysRemaining > 0 && daysRemaining <= 7
}

/**
 * Format date for display (e.g., "Jan 15, 2025")
 */
export function formatSubscriptionDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Get subscription status message
 */
export function getSubscriptionStatusMessage(subscription: Subscription | null): string {
  if (!subscription) {
    return 'No active subscription'
  }

  if (subscription.status === 'cancelled') {
    return 'Subscription cancelled'
  }

  const daysRemaining = getDaysRemaining(subscription)
  const inGracePeriod = isInGracePeriod(subscription)

  if (inGracePeriod) {
    return 'Subscription expired - Grace period active'
  }

  if (daysRemaining === 0) {
    return 'Expires today'
  }

  if (daysRemaining === 1) {
    return 'Expires tomorrow'
  }

  return `${daysRemaining} days remaining`
}
