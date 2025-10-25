import { test, expect } from "@playwright/test"

test.describe("Dashboard (requires auth)", () => {
  test("should redirect unauthenticated users to login", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/.*login/)
  })

  // Note: Full dashboard tests would require mock authentication
  // These tests are placeholders for when auth mocking is implemented
})

test.describe("MCP Endpoint", () => {
  test("should return 401 for unauthenticated requests", async ({ request }) => {
    const response = await request.get("/api/mcp/context")
    expect(response.status()).toBe(401)

    const data = await response.json()
    expect(data.error).toBe("Unauthorized")
  })

  // Note: Authenticated endpoint tests require session cookies
  // These would be implemented with proper auth setup
})
