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

test.beforeEach(async ({ page }) => {
  await mockOidcProvider(page)
})

test('redirects unauthenticated users to /auth for protected routes', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/auth$/)
  await expect(
    page.getByRole('button', { name: /sign in \/ register/i }),
  ).toBeVisible()
})

test('authenticated (no roles) can load dashboard and performs authorized report fetch', async ({ page }) => {
  const { accessToken } = await seedOidcUser(page, { roles: [], tier: 'free' })

  await page.route('**/api/v1/reports/**', async (route) => {
    const auth = route.request().headers()['authorization']
    expect(auth).toBe(`Bearer ${accessToken}`)

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
  await expect(page.getByText('Daily Disagree')).toBeVisible()

  // Non-admin should be bounced out of /admin.
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/dashboard/)
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
  await expect(page.getByText('Admin Panel')).toBeVisible()

  await page.getByRole('button', { name: /^logout$/i }).click()
  await expect(page).toHaveURL(/http:\/\/localhost:5173\/?$/)
})
