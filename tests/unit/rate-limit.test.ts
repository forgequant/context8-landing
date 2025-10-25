import { describe, it, expect, beforeEach } from "vitest"
import { RateLimiter } from "@/lib/rate-limit"

describe("RateLimiter", () => {
  let limiter: RateLimiter

  beforeEach(() => {
    // Create a new limiter with 1 second window for testing
    limiter = new RateLimiter({
      interval: 1000, // 1 second
      uniqueTokenPerInterval: 100,
    })
  })

  it("should allow requests under the limit", () => {
    const token = "test-token"
    const limit = 5

    for (let i = 0; i < 5; i++) {
      const result = limiter.check(limit, token)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(limit - (i + 1))
    }
  })

  it("should block requests over the limit", () => {
    const token = "test-token-2"
    const limit = 3

    // Use up the limit
    for (let i = 0; i < 3; i++) {
      limiter.check(limit, token)
    }

    // Next request should be blocked
    const result = limiter.check(limit, token)
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it("should track different tokens independently", () => {
    const limit = 2

    const result1 = limiter.check(limit, "token-1")
    expect(result1.success).toBe(true)

    const result2 = limiter.check(limit, "token-2")
    expect(result2.success).toBe(true)

    const result3 = limiter.check(limit, "token-1")
    expect(result3.success).toBe(true)
    expect(result3.remaining).toBe(0)
  })

  it("should reset after the interval", async () => {
    const token = "test-token-reset"
    const limit = 2

    // Use up the limit
    limiter.check(limit, token)
    limiter.check(limit, token)

    // Should be blocked
    let result = limiter.check(limit, token)
    expect(result.success).toBe(false)

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 1100))

    // Should be allowed again
    result = limiter.check(limit, token)
    expect(result.success).toBe(true)
  })

  it("should return correct reset time", () => {
    const token = "test-token-reset-time"
    const limit = 1

    limiter.check(limit, token)
    const result = limiter.check(limit, token)

    expect(result.success).toBe(false)
    expect(result.reset).toBeGreaterThan(0)
    expect(result.reset).toBeLessThanOrEqual(1)
  })
})
