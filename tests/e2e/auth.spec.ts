import { test, expect } from "@playwright/test"

test.describe("Authentication Flow", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /continue with github/i })).toBeVisible()
  })

  test("should redirect to login when accessing dashboard without auth", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/.*login/)
  })

  test("should show error page on auth error", async ({ page }) => {
    await page.goto("/auth/error?error=AccessDenied")
    await expect(page.getByRole("heading", { name: /authentication error/i })).toBeVisible()
    await expect(page.getByText(/access denied/i)).toBeVisible()
  })

  test("should have terms and privacy links on login page", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByText(/terms of service/i)).toBeVisible()
    await expect(page.getByText(/privacy policy/i)).toBeVisible()
  })
})

test.describe("Landing Page", () => {
  test("should display hero section", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: /ai-ready crypto context/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /connect with google/i })).toBeVisible()
  })

  test("should display value props section", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText(/oauth-gated access/i)).toBeVisible()
    await expect(page.getByText(/four data sources/i)).toBeVisible()
    await expect(page.getByText(/ai-optimized format/i)).toBeVisible()
  })

  test("should display features grid", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText(/live market data/i)).toBeVisible()
    await expect(page.getByText(/news aggregation/i)).toBeVisible()
    await expect(page.getByText(/on-chain insights/i)).toBeVisible()
    await expect(page.getByText(/social sentiment/i)).toBeVisible()
  })

  test("should display FAQ section", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText(/can i access this without oauth/i)).toBeVisible()
    await expect(page.getByText(/which sources are included/i)).toBeVisible()
  })

  test("should have footer with links", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("link", { name: /privacy policy/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /terms of service/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /status/i })).toBeVisible()
  })
})

test.describe("Static Pages", () => {
  test("should display privacy policy page", async ({ page }) => {
    await page.goto("/privacy")
    await expect(page.getByRole("heading", { name: /privacy policy/i })).toBeVisible()
    await expect(page.getByText(/data collection/i)).toBeVisible()
  })

  test("should display terms of service page", async ({ page }) => {
    await page.goto("/terms")
    await expect(page.getByRole("heading", { name: /terms of service/i })).toBeVisible()
    await expect(page.getByText(/rate limits/i)).toBeVisible()
  })

  test("should display status page", async ({ page }) => {
    await page.goto("/status")
    await expect(page.getByRole("heading", { name: /system status/i })).toBeVisible()
  })
})
