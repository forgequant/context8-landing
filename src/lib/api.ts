import { getEnvString } from './runtimeEnv'

export const API_BASE_URL = getEnvString(
  'VITE_API_URL',
  (import.meta.env.VITE_API_URL as string) ?? '',
)

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown,
  ) {
    super(`API ${status}: ${statusText}`)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers: extraHeaders, ...fetchOptions } = options

  const headers = new Headers(extraHeaders)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const method = (fetchOptions.method ?? 'GET').toUpperCase()
  const body = fetchOptions.body
  const shouldConsiderJsonContentType = method !== 'GET' && method !== 'HEAD' && body !== undefined && body !== null
  if (shouldConsiderJsonContentType && !headers.has('Content-Type')) {
    // Don't force Content-Type for requests without bodies, or for non-JSON bodies (FormData etc).
    if (typeof body === 'string') {
      const trimmed = body.trimStart()
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        headers.set('Content-Type', 'application/json')
      }
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    let body: unknown
    try {
      body = await response.json()
    } catch {
      body = await response.text().catch(() => null)
    }
    throw new ApiError(response.status, response.statusText, body)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export async function apiFetchWithFallback<T>(
  paths: string[],
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  let lastError: unknown = null
  const method = (options.method ?? 'GET').toUpperCase()
  const retryStatuses =
    method === 'GET' || method === 'HEAD'
      ? new Set([401, 403, 404, 405, 410, 422])
      // Safe to retry on 401/403: request was not authorized so should not have side effects.
      : new Set([401, 403, 404, 405, 410, 422])

  for (const path of paths) {
    try {
      return await apiFetch<T>(path, options)
    } catch (error) {
      lastError = error
      if (error instanceof ApiError && retryStatuses.has(error.status)) {
        continue
      }
      throw error
    }
  }

  if (lastError instanceof Error) throw lastError
  throw new Error('All API fallback endpoints failed')
}

export function extractObjectFromResponse<T>(
  response: unknown,
  keys: string[] = ['data', 'result', 'payload'],
): T | null {
  if (!response) return null
  if (typeof response === 'object' && !Array.isArray(response)) {
    const rec = response as Record<string, unknown>
    for (const key of keys) {
      const value = rec[key]
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value as T
      }
    }

    return response as T
  }
  return null
}

export function extractArrayFromResponse<T>(
  response: unknown,
  keys: string[] = ['data', 'items', 'results', 'payload'],
  validate?: (value: unknown) => value is T,
): T[] {
  if (!response) return []
  if (Array.isArray(response)) {
    return validate ? response.filter((value): value is T => validate(value)) : response as T[]
  }

  if (typeof response === 'object') {
    const rec = response as Record<string, unknown>
    for (const key of keys) {
      const value = rec[key]
      if (Array.isArray(value)) {
        return validate ? value.filter((item): item is T => validate(item)) : value as T[]
      }
      if (value && typeof value === 'object') {
        const nested = extractArrayFromResponse<T>(value, keys, validate)
        if (nested.length > 0) return nested
      }
    }
  }

  return []
}
