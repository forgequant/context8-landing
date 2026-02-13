import type { AuthProviderProps } from 'react-oidc-context'
import { WebStorageStateStore } from 'oidc-client-ts'

import { getEnvString } from './runtimeEnv'

const authority = getEnvString(
  'VITE_ZITADEL_AUTHORITY',
  import.meta.env.VITE_ZITADEL_AUTHORITY as string,
)
const clientId = getEnvString(
  'VITE_ZITADEL_CLIENT_ID',
  import.meta.env.VITE_ZITADEL_CLIENT_ID as string,
)
const projectId = getEnvString(
  'VITE_ZITADEL_PROJECT_ID',
  import.meta.env.VITE_ZITADEL_PROJECT_ID as string,
)

export const oidcConfig: AuthProviderProps = {
  authority,
  client_id: clientId,
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  scope: [
    'openid',
    'profile',
    'email',
    'offline_access',
    `urn:zitadel:iam:org:project:id:${projectId}:aud`,
    'urn:zitadel:iam:org:project:roles',
  ].join(' '),
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
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
