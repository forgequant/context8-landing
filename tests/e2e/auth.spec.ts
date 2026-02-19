import { test, expect, type Page } from '@playwright/test'

const authority = process.env.VITE_ZITADEL_AUTHORITY ?? 'http://localhost:8080'
const clientId = process.env.VITE_ZITADEL_CLIENT_ID ?? 'e2e-client'

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function oidcStorageKey(): string {
  // oidc-client-ts default key shape when using WebStorageStateStore.
  return `oidc.user:${authority}:${clientId}`
}

type Tier = 'free' | 'pro' | 'enterprise'

async function mockOidcProvider(page: Page) {
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
        body: JSON.stringify({ keys: [] }),
      })
    },
  )

  await page.route(
    new RegExp(`^${escapeRegex(authority)}/oidc/v1/end_session\\b.*$`),
    async (route) => {
      const url = new URL(route.request().url())
      const postLogout = url.searchParams.get('post_logout_redirect_uri') ?? 'http://localhost:5173'
      await route.fulfill({
        status: 302,
        headers: { location: postLogout },
        body: '',
      })
    },
  )
}

async function seedOidcUser(
  page: Page,
  opts: { roles?: string[]; tier?: Tier; accessToken?: string } = {},
) {
  const accessToken = opts.accessToken ?? 'e2e-access-token'
  const roles = opts.roles ?? []
  const tier: Tier = opts.tier ?? 'free'

  const roleClaim: Record<string, unknown> = {}
  for (const r of roles) roleClaim[r] = true

  const profile: Record<string, unknown> = {
    sub: 'e2e-user-123',
    email: 'e2e@context8.local',
    name: 'E2E User',
    'urn:zitadel:iam:org:project:roles': roleClaim,
    'ctx8/tier': tier,
  }

  const user = {
    id_token: 'e2e-id-token',
    access_token: accessToken,
    token_type: 'Bearer',
    scope: 'openid profile email offline_access',
    profile,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
  }

  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value)
    },
    [oidcStorageKey(), JSON.stringify(user)],
  )

  return { accessToken }
}

function buildMarketV3Payload() {
  return {
    headline: 'E2E mock report v3',
    conviction_scores: [
      {
        symbol: 'BTCUSDT',
        score: 6,
        bullish_modules: 2,
        bearish_modules: 1,
        neutral_modules: 0,
        modules: [
          { module: 'funding', bias: 'bearish', confidence: 80, summary: 'crowded longs' },
          { module: 'social', bias: 'bullish', confidence: 62, summary: 'narrative rotation' },
          { module: 'macro', bias: 'bullish', confidence: 55, summary: 'macro support' },
        ],
      },
    ],
    crowded_trades: [
      { symbol: 'DOGEUSDT', direction: 'long', z_score: 3.1 },
    ],
    divergences: [
      { symbol: 'ETHUSDT', type: 'social_price', description: 'social diverges from price', signal: 'pending_move', strength: 13 },
    ],
    macro_regime: { bias: 'mixed', feargreed_value: 50, feargreed_label: 'Neutral', dxy_trend: 'flat', summary: 'Macro balanced' },
    generated_at: '2026-02-19T10:00:00Z',
    collectors: {
      derivatives: { status: 'ok', confidence: 80, as_of: '2026-02-19T09:58:00Z', sources: ['binance'] },
      macro: { status: 'partial', confidence: 63, as_of: '2026-02-19T09:57:00Z', sources: ['fred'] },
      social: { status: 'unavailable', confidence: 0, as_of: '2026-02-19T09:56:00Z', sources: ['lunarcrush'] },
      flows: { status: 'ok', confidence: 72, as_of: '2026-02-19T09:55:00Z', sources: ['defillama'] },
    },
    sections: {
      trade_setups: [
        { symbol: 'BTCUSDT', bias: 'bullish', thesis: 'Funding reset + macro support', confidence: 74 },
      ],
      risk_flags: [
        { key: 'event-risk', severity: 'medium', summary: 'macro print in 12h' },
      ],
      narrative_bullets: [
        { topic: 'AI beta rotation', summary: 'high-beta narratives regaining volume', sentiment: 'bullish' },
      ],
      avoid_list: [
        { symbol: 'DOGEUSDT', reason: 'crowded and negative divergence' },
      ],
    },
    quality: { overall: 'amber', coverage_pct: 76.5, warnings: ['social signal degraded'] },
  }
}

test.beforeEach(async ({ page }) => {
  await mockOidcProvider(page)
})

test('redirects unauthenticated users to /auth for protected routes', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/auth$/)
  await expect(
    page.getByRole('button', { name: /sign in/i }),
  ).toBeVisible()
})

test('authenticated (no roles) can load dashboard and performs authorized report fetch', async ({ page }) => {
  const { accessToken } = await seedOidcUser(page, { roles: [], tier: 'free' })

  await page.route('**/api/v1/reports/**', async (route) => {
    const auth = route.request().headers()['authorization']
    expect(auth).toBe(`Bearer ${accessToken}`)

    const nowIso = new Date().toISOString()
    const payload = buildMarketV3Payload()

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
        version: 3,
        created_at: nowIso,
        published_at: nowIso,
      }),
    })
  })

  await page.goto('/dashboard')
  // The "Daily Disagree" wordmark is hidden on small viewports; use a stable
  // accessibility hook that renders across breakpoints.
  await expect(page.getByLabel('Previous day')).toBeVisible()

  // Non-admin should be bounced out of /admin.
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/dashboard/)
})

test('report latest does not refetch endlessly after initial load', async ({ page }) => {
  const { accessToken } = await seedOidcUser(page, { roles: [], tier: 'free' })

  let reqCount = 0
  await page.route('**/api/v1/reports/**', async (route) => {
    reqCount++
    const auth = route.request().headers()['authorization']
    expect(auth).toBe(`Bearer ${accessToken}`)

    const nowIso = new Date().toISOString()
    const payload = buildMarketV3Payload()

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
        version: 3,
        created_at: nowIso,
        published_at: nowIso,
      }),
    })
  })

  await page.goto('/dashboard/report/latest')
  await expect(page.getByLabel('Previous day')).toBeVisible()
  await expect(page.getByRole('heading', { name: /E2E mock report v3/i })).toBeVisible({ timeout: 15000 })
  await expect(page.getByText(/Collector Health/)).toBeVisible({ timeout: 15000 })
  await expect(page.getByText(/Trade Setups/)).toBeVisible()
  await expect(page.getByText(/event-risk/)).toBeVisible()

  // In dev (Vite) + React StrictMode, mount effects intentionally run twice.
  // This should never become an unbounded refetch loop.
  await expect
    .poll(() => reqCount, { timeout: 8000 })
    .toBeGreaterThan(0)
  await page.waitForTimeout(1000)
  expect(reqCount).toBeLessThanOrEqual(2)
})

test('admin role can access /admin and logout triggers signout redirect', async ({ page }) => {
  await seedOidcUser(page, { roles: ['admin'], tier: 'pro' })

  // Admin page polls payments; mock it so UI can render deterministically.
  await page.route('**/api/v1/admin/payments**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  })

  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\b/)
  await expect(page.getByText('Admin Panel')).toBeVisible({ timeout: 15000 })

  await page.getByRole('button', { name: /^logout$/i }).click()
  await expect(page).toHaveURL(/http:\/\/localhost:5173\/?$/)
})
