import { LRUCache } from "lru-cache"

type RateLimitOptions = {
  interval: number
  uniqueTokenPerInterval: number
}

export class RateLimiter {
  private tokenCache: LRUCache<string, number[]>

  constructor(options: RateLimitOptions) {
    this.tokenCache = new LRUCache({
      max: options.uniqueTokenPerInterval || 500,
      ttl: options.interval || 60000,
    })
  }

  check(limit: number, token: string): {
    success: boolean
    remaining: number
    reset: number
  } {
    const now = Date.now()
    const tokenCount = this.tokenCache.get(token) || []
    const windowStart = now - (this.tokenCache.ttl || 60000)

    // Filter out timestamps outside the current window
    const validTokens = tokenCount.filter((timestamp) => timestamp > windowStart)

    if (validTokens.length >= limit) {
      const oldestToken = validTokens[0]
      const reset = oldestToken + (this.tokenCache.ttl || 60000)

      return {
        success: false,
        remaining: 0,
        reset: Math.ceil((reset - now) / 1000),
      }
    }

    validTokens.push(now)
    this.tokenCache.set(token, validTokens)

    return {
      success: true,
      remaining: limit - validTokens.length,
      reset: Math.ceil((this.tokenCache.ttl || 60000) / 1000),
    }
  }
}

// IP-based rate limiter: 30 requests per hour
export const ipRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
})

// User-based rate limiter: 15 requests per hour
export const userRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
})
