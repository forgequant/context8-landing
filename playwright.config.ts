import { defineConfig, devices } from '@playwright/test'

const E2E_ENV = {
  VITE_ZITADEL_AUTHORITY: process.env.VITE_ZITADEL_AUTHORITY ?? 'http://localhost:8080',
  VITE_ZITADEL_CLIENT_ID: process.env.VITE_ZITADEL_CLIENT_ID ?? 'e2e-client',
  VITE_ZITADEL_PROJECT_ID: process.env.VITE_ZITADEL_PROJECT_ID ?? 'e2e-project',
  VITE_API_URL: process.env.VITE_API_URL ?? 'http://localhost:8081',
} as const

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: (() => {
    const projects = [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    ] as const

    // WebKit on Linux commonly requires extra system libraries (install via
    // `npx playwright install-deps webkit`). Enable explicitly when available.
    if (process.platform === 'darwin' || process.env.PLAYWRIGHT_WEBKIT === '1') {
      return [
        projects[0],
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        projects[1],
      ]
    }

    return projects
  })(),
  webServer: {
    command:
      `VITE_ZITADEL_AUTHORITY=${E2E_ENV.VITE_ZITADEL_AUTHORITY} ` +
      `VITE_ZITADEL_CLIENT_ID=${E2E_ENV.VITE_ZITADEL_CLIENT_ID} ` +
      `VITE_ZITADEL_PROJECT_ID=${E2E_ENV.VITE_ZITADEL_PROJECT_ID} ` +
      `VITE_API_URL=${E2E_ENV.VITE_API_URL} ` +
      'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
})
