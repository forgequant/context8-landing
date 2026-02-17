import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useAuth as useOidcAuth } from 'react-oidc-context'
import { type SubscriptionTier, tierAtLeast } from '../lib/auth'

interface AuthUser {
  id: string
  email: string
  name: string
  roles: string[]
}

interface UseAuthReturn {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
  accessToken: string | null
  subscriptionTier: SubscriptionTier
  login: (returnTo?: string) => Promise<void>
  logout: () => Promise<void>
  hasRole: (role: string) => boolean
  hasTier: (minTier: SubscriptionTier) => boolean
}

function decodeJwtPayload(token: string | null | undefined): Record<string, unknown> | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length < 2) return null

  const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  try {
    return JSON.parse(atob(padded)) as Record<string, unknown>
  } catch {
    return null
  }
}

function rolesFromClaims(claims: Record<string, unknown> | null): string[] {
  if (!claims) return []

  const out: string[] = []

  const projectRoles = claims['urn:zitadel:iam:org:project:roles']
  if (projectRoles && typeof projectRoles === 'object' && !Array.isArray(projectRoles)) {
    out.push(...Object.keys(projectRoles as Record<string, unknown>))
  }

  const flatRoles = claims.roles
  if (Array.isArray(flatRoles)) {
    for (const r of flatRoles) {
      if (typeof r === 'string' && r.trim() !== '') out.push(r)
    }
  }

  return out
}

function extractRoles(
  profile: Record<string, unknown> | undefined,
  accessToken: string | null,
): string[] {
  const fromProfile = rolesFromClaims(profile ?? null)
  const fromToken = rolesFromClaims(decodeJwtPayload(accessToken))
  return Array.from(new Set([...fromProfile, ...fromToken]))
}

function extractTier(
  profile: Record<string, unknown> | undefined,
  accessToken: string | null,
): SubscriptionTier {
  const tierFromProfile = profile ? profile['ctx8/tier'] : undefined
  if (tierFromProfile === 'free' || tierFromProfile === 'pro' || tierFromProfile === 'enterprise') {
    return tierFromProfile
  }

  const claims = decodeJwtPayload(accessToken)
  const tierFromToken = claims ? claims['ctx8/tier'] : undefined
  if (tierFromToken === 'free' || tierFromToken === 'pro' || tierFromToken === 'enterprise') {
    return tierFromToken
  }

  return 'free'
}

export function useAuth(): UseAuthReturn {
  const oidc = useOidcAuth()
  // `react-oidc-context` may provide a new object identity across renders.
  // Keep a ref so callbacks (login/logout) can be stable and not trigger
  // dependency cascades (e.g. effects that depend on `login`).
  const oidcRef = useRef(oidc)
  useEffect(() => {
    oidcRef.current = oidc
  }, [oidc])

  const profile = oidc.user?.profile
  const accessToken = oidc.user?.access_token ?? null
  const roles = useMemo(() => extractRoles(profile, accessToken), [profile, accessToken])
  const subscriptionTier = useMemo(() => extractTier(profile, accessToken), [profile, accessToken])

  const user: AuthUser | null = useMemo(() => {
    if (!oidc.isAuthenticated || !profile) return null
    return {
      id: profile.sub as string,
      email: (profile.email as string) ?? '',
      name: (profile.name as string) ?? '',
      roles,
    }
  }, [oidc.isAuthenticated, profile, roles])

  const login = useCallback(async (returnTo?: string) => {
    const current = oidcRef.current
    await current.signinRedirect(returnTo ? { state: { returnTo } } : undefined)
  }, [])

  const logout = useCallback(async () => {
    const current = oidcRef.current
    await current.signoutRedirect({ post_logout_redirect_uri: window.location.origin })
  }, [])

  const hasRole = useCallback((role: string) => roles.includes(role), [roles])

  const hasTier = useCallback(
    (minTier: SubscriptionTier) => tierAtLeast(subscriptionTier, minTier),
    [subscriptionTier],
  )

  return {
    user,
    isAuthenticated: oidc.isAuthenticated,
    isLoading: oidc.isLoading,
    isAdmin: roles.includes('admin'),
    accessToken,
    subscriptionTier,
    login,
    logout,
    hasRole,
    hasTier,
  }
}
