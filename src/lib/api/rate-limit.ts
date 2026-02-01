/**
 * Simple in-memory rate limiter for API routes
 * For production, consider using Upstash Redis or similar
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
    /**
     * Maximum number of requests allowed in the time window
     */
    maxRequests: number

    /**
     * Time window in seconds
     */
    windowSeconds: number
}

interface RateLimitResult {
    success: boolean
    limit: number
    remaining: number
    reset: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param options - Rate limit configuration
 * @returns Rate limit result with success status and metadata
 */
export function rateLimit(
    identifier: string,
    options: RateLimitOptions = { maxRequests: 10, windowSeconds: 60 }
): RateLimitResult {
    const now = Date.now()
    const windowMs = options.windowSeconds * 1000

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
        cleanupExpiredEntries(now)
    }

    const entry = rateLimitStore.get(identifier)

    // No existing entry or expired entry
    if (!entry || now > entry.resetTime) {
        const resetTime = now + windowMs
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime
        })

        return {
            success: true,
            limit: options.maxRequests,
            remaining: options.maxRequests - 1,
            reset: resetTime
        }
    }

    // Increment count
    entry.count++

    // Check if limit exceeded
    if (entry.count > options.maxRequests) {
        return {
            success: false,
            limit: options.maxRequests,
            remaining: 0,
            reset: entry.resetTime
        }
    }

    return {
        success: true,
        limit: options.maxRequests,
        remaining: options.maxRequests - entry.count,
        reset: entry.resetTime
    }
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries(now: number) {
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.reset).toISOString(),
    }
}
