import { useState } from 'react'
import { useAuth } from './useAuth'
import { apiFetchWithFallback } from '../lib/api'

interface VerifyPayload {
  action: 'verified' | 'rejected'
  notes: string | null
}

interface VerifyResponse {
  success: boolean
  message?: string
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null
}

function extractVerificationRecord(response: unknown): Record<string, unknown> | null {
  if (Array.isArray(response)) {
    for (const item of response) {
      const nested = extractVerificationRecord(item)
      if (nested) {
        return nested
      }
    }
    return null
  }

  const root = asRecord(response)
  if (!root) return null

  const queue: Record<string, unknown>[] = [root]
  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) break

    if (
      'success' in current ||
      'ok' in current ||
      'status' in current ||
      'payment_status' in current ||
      'verification_status' in current
    ) {
      return current
    }

    for (const value of Object.values(current)) {
      const nested = asRecord(value)
      if (nested) {
        queue.push(nested)
      }
    }
  }

  return root
}

function parseStatusValue(value: unknown, action: 'verified' | 'rejected'): boolean | null {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return null

  const status = value.trim().toLowerCase()
  if (!status) return null

  const acceptedStatuses = new Set([
    'verified',
    'approve',
    'approved',
    'accept',
    'accepted',
    'ok',
    'success',
    'succeeded',
    'completed',
  ])
  const rejectedOutcomeStatuses = new Set([
    'rejected',
    'reject',
    'declined',
    'deny',
    'denied',
  ])
  const operationErrorStatuses = new Set([
    'failed',
    'failure',
    'error',
    'invalid',
    'not_found',
  ])
  const pendingStatuses = new Set([
    'pending',
    'processing',
    'in_review',
    'under_review',
  ])

  if (operationErrorStatuses.has(status)) return false
  if (pendingStatuses.has(status)) return false

  if (action === 'verified') {
    if (acceptedStatuses.has(status)) return true
    if (rejectedOutcomeStatuses.has(status)) return false
  }

  if (action === 'rejected') {
    if (rejectedOutcomeStatuses.has(status)) return true
    if (acceptedStatuses.has(status)) return false
  }

  return null
}

function extractMessage(payload: Record<string, unknown>): string | undefined {
  if (typeof payload.message === 'string') return payload.message
  if (typeof payload.error === 'string') return payload.error
  return undefined
}

function parseVerifyResponse(response: unknown, action: 'verified' | 'rejected'): VerifyResponse {
  if (response === null || response === undefined) {
    return { success: true }
  }

  const payload = extractVerificationRecord(response)
  if (!payload) {
    if (typeof response === 'string') {
      const message = response.trim()
      const parsed = parseStatusValue(message, action)
      return { success: parsed ?? false, message }
    }

    throw new Error('Invalid verification response')
  }

  const message = extractMessage(payload)

  if (typeof payload.success === 'boolean') {
    return {
      success: payload.success,
      message,
    }
  }

  if (typeof payload.ok === 'boolean') {
    return {
      success: payload.ok,
      message,
    }
  }

  const statusCandidates = [
    payload.status,
    payload.payment_status,
    payload.verification_status,
  ]
  for (const candidate of statusCandidates) {
    const parsed = parseStatusValue(candidate, action)
    if (parsed !== null) {
      return {
        success: parsed,
        message,
      }
    }
  }

  const unknownStatus = statusCandidates.find(
    (value) => typeof value === 'string' && value.trim().length > 0,
  )
  if (typeof unknownStatus === 'string') {
    return {
      success: false,
      message: message ?? `Unknown verification status: ${unknownStatus.trim()}`,
    }
  }

  return {
    success: false,
    message: message ?? 'Invalid verification response: missing success status',
  }
}

interface UseVerifyPaymentReturn {
  verifyPayment: (paymentId: string, action: 'verified' | 'rejected', notes: string) => Promise<void>
  isVerifying: boolean
  error: string | null
}

/**
 * Hook for admin verification of payment submissions
 * Updates payment status and activates subscription via API
 */
export function useVerifyPayment(): UseVerifyPaymentReturn {
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, isAdmin, accessToken } = useAuth()

  const verifyPayment = async (
    paymentId: string,
    action: 'verified' | 'rejected',
    notes: string,
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

      const body: VerifyPayload = {
        action,
        notes: notes.trim() || null,
      }

      const response = await apiFetchWithFallback<VerifyResponse | null>([
        `/api/v1/admin/payments/${encodeURIComponent(paymentId)}/verify`,
        `/api/v1/admin/payments/${encodeURIComponent(paymentId)}`,
      ], {
        method: 'POST',
        token: accessToken,
        body: JSON.stringify(body),
      })

      const verifyResponse = parseVerifyResponse(response, action)
      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || 'Verification was not successful')
      }
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
