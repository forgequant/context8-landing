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
  login: () => Promise<void>
  logout: () => Promise<void>
  hasRole: (role: string) => boolean
  hasTier: (minTier: SubscriptionTier) => boolean
}

function extractRoles(profile: Record<string, unknown> | undefined): string[] {
  if (!profile) return []
  const roleClaim = profile['urn:zitadel:iam:org:project:roles']
  if (!roleClaim || typeof roleClaim !== 'object') return []
  return Object.keys(roleClaim as Record<string, unknown>)
}

function extractTier(
  profile: Record<string, unknown> | undefined,
): SubscriptionTier {
  if (!profile) return 'free'
  const tier = profile['ctx8/tier']
  if (tier === 'pro' || tier === 'enterprise') return tier
  return 'free'
}

export function useAuth(): UseAuthReturn {
  const oidc = useOidcAuth()

  const profile = oidc.user?.profile
  const roles = extractRoles(profile)
  const subscriptionTier = extractTier(profile)

  const user: AuthUser | null =
    oidc.isAuthenticated && profile
      ? {
          id: profile.sub as string,
          email: (profile.email as string) ?? '',
          name: (profile.name as string) ?? '',
          roles,
        }
      : null

  return {
    user,
    isAuthenticated: oidc.isAuthenticated,
    isLoading: oidc.isLoading,
    isAdmin: roles.includes('admin'),
    accessToken: oidc.user?.access_token ?? null,
    subscriptionTier,
    login: () => oidc.signinRedirect(),
    logout: () =>
      oidc.signoutRedirect({ post_logout_redirect_uri: window.location.origin }),
    hasRole: (role: string) => roles.includes(role),
    hasTier: (minTier: SubscriptionTier) => tierAtLeast(subscriptionTier, minTier),
  }
}
