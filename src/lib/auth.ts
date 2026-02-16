import type { AuthProviderProps } from 'react-oidc-context'
import { UserManager, WebStorageStateStore, type UserManagerSettings } from 'oidc-client-ts'

import { getEnvString } from './runtimeEnv'

function requiredEnv(key: string, value: string): string {
  if (value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const ZITADEL_AUTHORITY = requiredEnv(
  'VITE_ZITADEL_AUTHORITY',
  getEnvString(
    'VITE_ZITADEL_AUTHORITY',
    (import.meta.env.VITE_ZITADEL_AUTHORITY as string | undefined) ?? '',
  ),
)
export const ZITADEL_CLIENT_ID = requiredEnv(
  'VITE_ZITADEL_CLIENT_ID',
  getEnvString(
    'VITE_ZITADEL_CLIENT_ID',
    (import.meta.env.VITE_ZITADEL_CLIENT_ID as string | undefined) ?? '',
  ),
)
export const ZITADEL_PROJECT_ID = requiredEnv(
  'VITE_ZITADEL_PROJECT_ID',
  getEnvString(
    'VITE_ZITADEL_PROJECT_ID',
    (import.meta.env.VITE_ZITADEL_PROJECT_ID as string | undefined) ?? '',
  ),
)

const oidcSettings: UserManagerSettings = {
  authority: ZITADEL_AUTHORITY,
  client_id: ZITADEL_CLIENT_ID,
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  scope: [
    'openid',
    'profile',
    'email',
    'offline_access',
    `urn:zitadel:iam:org:project:id:${ZITADEL_PROJECT_ID}:aud`,
    'urn:zitadel:iam:org:project:roles',
  ].join(' '),
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
}

export const oidcUserManager = new UserManager(oidcSettings)

export const oidcConfig: AuthProviderProps = {
  userManager: oidcUserManager,
  // We handle the redirect callback explicitly in the /auth/callback route.
  // This avoids edge cases where the provider processes it too early/late and
  // the app bounces back into a fresh signin redirect.
  skipSigninCallback: true,
}

export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

const TIER_ORDER: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
}

export function tierAtLeast(
  current: SubscriptionTier,
  minimum: SubscriptionTier,
): boolean {
  return TIER_ORDER[current] >= TIER_ORDER[minimum]
}
