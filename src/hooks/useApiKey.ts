import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import {
  ApiError,
  apiFetch,
  apiFetchWithFallback,
  extractArrayFromResponse,
  extractObjectFromResponse,
} from '../lib/api'

interface ApiKey {
  id: string
  key_prefix: string
  name: string
  is_active: boolean
  created_at: string
  last_used_at: string | null
}

interface ApiUsage {
  daily_usage: number
  daily_limit: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseUsage(value: unknown): ApiUsage | null {
  if (!isRecord(value)) return null

  if (
    typeof value.daily_usage === 'number' &&
    typeof value.daily_limit === 'number'
  ) {
    return {
      daily_usage: value.daily_usage,
      daily_limit: value.daily_limit,
    }
  }

  if (isRecord(value.usage)) {
    return parseUsage(value.usage)
  }

  return null
}

function parseApiKey(value: unknown): ApiKey | null {
  if (!isRecord(value)) return null

  const candidate = value.key ?? value.api_key
  if (isRecord(candidate)) {
    const keyCandidate = extractObjectFromResponse<ApiKey>(candidate, ['key', 'api_key', 'result'])
    if (keyCandidate && keyCandidate.id && keyCandidate.key_prefix) {
      return {
        ...keyCandidate,
        is_active: Boolean(keyCandidate.is_active),
        last_used_at: keyCandidate.last_used_at ?? null,
      }
    }
  }

  if (value.id && typeof value.id === 'string') {
    const keyCandidate = extractObjectFromResponse<ApiKey>(value, ['result', 'payload', 'data'])
    if (
      keyCandidate &&
      keyCandidate.id &&
      keyCandidate.key_prefix
    ) {
      return keyCandidate
    }
  }

  return null
}

function parseGeneratedKey(response: unknown): string | null {
  if (typeof response === 'string') return response.trim() || null

  if (!isRecord(response)) return null

  if (typeof response.key === 'string') return response.key.trim() || null
  if (typeof response.api_key === 'string') return response.api_key.trim() || null
  if (typeof response.secret === 'string') return response.secret.trim() || null
  if (typeof response.secret_key === 'string') return response.secret_key.trim() || null
  if (typeof response.token === 'string') return response.token.trim() || null

  const envelope = extractObjectFromResponse<Record<string, unknown>>(response, ['data', 'result', 'payload'])
  if (isRecord(envelope)) {
    if (typeof envelope.key === 'string') return envelope.key.trim() || null
    if (typeof envelope.api_key === 'string') return envelope.api_key.trim() || null
    if (typeof envelope.secret === 'string') return envelope.secret.trim() || null
    if (typeof envelope.secret_key === 'string') return envelope.secret_key.trim() || null
    if (typeof envelope.token === 'string') return envelope.token.trim() || null
  }

  return null
}

function parseDefaultUsage() {
  return { daily_usage: 0, daily_limit: 2 }
}

export function useApiKey() {
  const [apiKey, setApiKey] = useState<ApiKey | null>(null)
  const [usage, setUsage] = useState<ApiUsage>(parseDefaultUsage())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newKey, setNewKey] = useState<string | null>(null)
  const { user, accessToken } = useAuth()

  const fetchApiKey = useCallback(async () => {
    if (!user) {
      setApiKey(null)
      setUsage(parseDefaultUsage())
      setLoading(false)
      return
    }

    try {
      setError(null)
      const response = await apiFetchWithFallback<unknown>(
        ['/api/v1/api-keys/me', '/api/v1/me/api-keys', '/api/v1/api-keys'],
        { method: 'GET', token: accessToken },
      )

      const responseRecord = isRecord(response) ? response : null
      let payload = responseRecord ? null : null
      if (responseRecord) {
        if (isRecord(responseRecord.result)) {
          payload = responseRecord.result
        } else if (isRecord(responseRecord.payload)) {
          payload = responseRecord.payload
        } else if (isRecord(responseRecord.data)) {
          payload = responseRecord.data
        } else {
          payload = responseRecord
        }
      }

      let nextKey = parseApiKey(payload)
      if (!nextKey) {
        const keys = extractArrayFromResponse<ApiKey>(response, ['keys', 'items', 'data'])
        nextKey = keys.length > 0 ? keys[0] : null
      }

      const nextUsage = parseUsage(payload) ?? parseDefaultUsage()
      setApiKey(nextKey)
      setUsage(nextUsage)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError(null)
        setApiKey(null)
        setUsage(parseDefaultUsage())
      } else {
        console.error('Error fetching API key:', err)
        setError('Failed to load API key')
        setApiKey(null)
        setUsage(parseDefaultUsage())
      }
    } finally {
      setLoading(false)
    }
  }, [user, accessToken])

  useEffect(() => {
    void fetchApiKey()
  }, [fetchApiKey])

  const generateKey = useCallback(async () => {
    if (!user) return null

    try {
      setError(null)

      const response = await apiFetchWithFallback<unknown>(
        ['/api/v1/api-keys', '/api/v1/me/api-keys'],
        {
          method: 'POST',
          token: accessToken,
          body: JSON.stringify({ name: 'Generated key' }),
        },
      )

      const rawKey = parseGeneratedKey(response)
      if (!rawKey) {
        throw new Error('Failed to create API key')
      }

      await fetchApiKey()
      setNewKey(rawKey)
      return rawKey
    } catch (err) {
      console.error('Error generating key:', err)
      setError('Failed to generate API key')
      return null
    }
  }, [accessToken, fetchApiKey, user])

  const revokeKey = useCallback(async () => {
    if (!apiKey) return

    try {
      setError(null)

      const endpoint = `/api/v1/api-keys/${encodeURIComponent(apiKey.id)}`
      await apiFetch(endpoint, {
        method: 'DELETE',
        token: accessToken,
      })

      setApiKey(null)
      setUsage(parseDefaultUsage())
      setNewKey(null)
    } catch (err) {
      console.error('Error revoking key:', err)
      setError('Failed to revoke API key')
    }
  }, [apiKey, accessToken])

  const clearNewKey = useCallback(() => {
    setNewKey(null)
  }, [])

  return {
    apiKey,
    usage,
    loading,
    error,
    newKey,
    generateKey,
    revokeKey,
    clearNewKey,
    refresh: fetchApiKey,
  }
}
