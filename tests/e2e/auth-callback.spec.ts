import { test, expect, type Page } from '@playwright/test'
import { createSign, generateKeyPairSync, randomBytes } from 'crypto'
import type { KeyObject } from 'crypto'

const authority = process.env.VITE_ZITADEL_AUTHORITY ?? 'http://localhost:8080'
const clientId = process.env.VITE_ZITADEL_CLIENT_ID ?? 'e2e-client'

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function base64UrlFromBuffer(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function base64UrlFromJson(obj: unknown): string {
  return base64UrlFromBuffer(Buffer.from(JSON.stringify(obj), 'utf8'))
}

function signJwtRS256(opts: {
  kid: string
  privateKey: KeyObject
  payload: Record<string, unknown>
}): string {
  const header = { alg: 'RS256', typ: 'JWT', kid: opts.kid }
  const data = `${base64UrlFromJson(header)}.${base64UrlFromJson(opts.payload)}`
  const sig = createSign('RSA-SHA256').update(data).end().sign(opts.privateKey) as Buffer
  return `${data}.${base64UrlFromBuffer(sig)}`
}

async function mockOidcProvider(page: Page) {
  const kid = 'e2e-kid'
  const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
  const jwk = publicKey.export({ format: 'jwk' }) as Record<string, unknown>
  const jwks = {
    keys: [{ ...jwk, kid, use: 'sig', alg: 'RS256' }],
  }

  // Map "auth code" -> nonce so the ID token can echo it back.
  const codeNonce = new Map<string, string>()

  await page.route(
    new RegExp(`^${escapeRegex(authority)}/\\.well-known/openid-configuration(?:\\?.*)?$`),
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          issuer: authority,
          authorization_endpoint: `${authority}/oauth/v2/authorize`,
          token_endpoint: `${authority}/oauth/v2/token`,
          jwks_uri: `${authority}/oauth/v2/keys`,
          userinfo_endpoint: `${authority}/oidc/v1/userinfo`,
          end_session_endpoint: `${authority}/oidc/v1/end_session`,
          response_types_supported: ['code'],
          subject_types_supported: ['public'],
          id_token_signing_alg_values_supported: ['RS256'],
        }),
      })
    },
  )

  await page.route(
    new RegExp(`^${escapeRegex(authority)}/oauth/v2/keys(?:\\?.*)?$`),
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(jwks),
      })
    },
  )

  // Mock the authorize endpoint: immediately redirect back to redirect_uri with code+state.
  await page.route(
    new RegExp(`^${escapeRegex(authority)}/oauth/v2/authorize\\b.*$`),
    async (route) => {
      const reqUrl = new URL(route.request().url())
      const redirectUri = reqUrl.searchParams.get('redirect_uri') ?? 'http://localhost:5173/auth/callback'
      const state = reqUrl.searchParams.get('state') ?? ''
      const nonce = reqUrl.searchParams.get('nonce') ?? ''

      const code = `e2e-code-${randomBytes(8).toString('hex')}`
      if (nonce) codeNonce.set(code, nonce)

      const cb = new URL(redirectUri)
      cb.searchParams.set('code', code)
      if (state) cb.searchParams.set('state', state)

      await route.fulfill({
        status: 302,
        headers: { location: cb.toString() },
        body: '',
      })
    },
  )

  await page.route(
    new RegExp(`^${escapeRegex(authority)}/oauth/v2/token(?:\\?.*)?$`),
    async (route) => {
      const body = route.request().postData() ?? ''
      const params = new URLSearchParams(body)
      const code = params.get('code') ?? ''
      const nonce = codeNonce.get(code) ?? undefined

      const now = Math.floor(Date.now() / 1000)
      const rolesClaim: Record<string, unknown> = {}
      const tier = 'free'

      const idToken = signJwtRS256({
        kid,
        privateKey,
        payload: {
          iss: authority,
          aud: clientId,
          sub: 'e2e-user-123',
          iat: now,
          exp: now + 60 * 60,
          ...(nonce ? { nonce } : {}),
          email: 'e2e@context8.local',
          name: 'E2E User',
          'urn:zitadel:iam:org:project:roles': rolesClaim,
          'ctx8/tier': tier,
        },
      })

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'e2e-access-token',
          token_type: 'Bearer',
          expires_in: 60 * 60,
          scope: 'openid profile email offline_access',
          id_token: idToken,
        }),
      })
    },
  )

  await page.route(
    new RegExp(`^${escapeRegex(authority)}/oidc/v1/userinfo(?:\\?.*)?$`),
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sub: 'e2e-user-123',
          email: 'e2e@context8.local',
          name: 'E2E User',
          'urn:zitadel:iam:org:project:roles': {},
          'ctx8/tier': 'free',
        }),
      })
    },
  )
}

test.beforeEach(async ({ page }) => {
  await mockOidcProvider(page)
})

test('oidc code callback completes and lands on dashboard with stored session', async ({ page }) => {
  // Mock the protected report call to ensure the post-login page can render.
  await page.route('**/api/v1/reports/**', async (route) => {
    const auth = route.request().headers()['authorization']
    expect(auth).toBe('Bearer e2e-access-token')

    const nowIso = new Date().toISOString()
    const payload = {
      date: '2026-02-16',
      reportNumber: 1,
      headline: {
        headline: 'E2E mock report',
        conviction: 0,
        reportDate: 'Feb 16, 2026',
        reportNumber: 1,
        macro: { regime: 'mixed', fearGreed: 50, dxyTrend: 'flat' },
      },
      modules: [],
      conflicts: [],
      crowdedTrades: [],
      divergences: [],
      macro: { regime: 'mixed', fearGreed: 50, dxyTrend: 'flat' },
      assets: [],
      priceData: [],
      heatmapRows: [],
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'e2e-report-1',
        asset: 'MARKET',
        report_date: '2026-02-16',
        headline: 'E2E',
        payload,
        status: 'published',
        version: 2,
        created_at: nowIso,
        published_at: nowIso,
      }),
    })
  })

  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/auth$/)

  await page.getByRole('button', { name: /sign in/i }).click()

  // Callback handler hard-reloads; wait for a stable dashboard signal.
  await expect(page.getByLabel('Previous day')).toBeVisible({ timeout: 20000 })

  const hasOidcUser = await page.evaluate(() => {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k && k.startsWith('oidc.user:')) return true
    }
    return false
  })
  expect(hasOidcUser).toBe(true)
})
