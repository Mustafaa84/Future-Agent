import { NextRequest, NextResponse } from 'next/server'

/**
 * Simple in-memory rate limiter for API endpoints
 * Tracks requests by IP address with sliding window
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

class RateLimiter {
    private requests: Map<string, RateLimitEntry> = new Map()
    private cleanupInterval: NodeJS.Timeout | null = null

    constructor() {
        // Clean up old entries every minute
        this.cleanupInterval = setInterval(() => {
            const now = Date.now()
            for (const [key, entry] of this.requests.entries()) {
                if (now > entry.resetTime) {
                    this.requests.delete(key)
                }
            }
        }, 60000) // 1 minute
    }

    /**
     * Check if a request should be rate limited
     * @param identifier - Usually IP address or user ID
     * @param maxRequests - Maximum requests allowed in the window
     * @param windowMs - Time window in milliseconds
     * @returns true if request should be blocked, false if allowed
     */
    isRateLimited(
        identifier: string,
        maxRequests: number,
        windowMs: number
    ): boolean {
        const now = Date.now()
        const entry = this.requests.get(identifier)

        if (!entry || now > entry.resetTime) {
            // First request or window expired, create new entry
            this.requests.set(identifier, {
                count: 1,
                resetTime: now + windowMs,
            })
            return false
        }

        if (entry.count >= maxRequests) {
            // Rate limit exceeded
            return true
        }

        // Increment count
        entry.count++
        return false
    }

    /**
     * Get remaining requests and reset time for an identifier
     */
    getStatus(identifier: string, maxRequests: number): {
        remaining: number
        resetTime: number
    } {
        const entry = this.requests.get(identifier)
        if (!entry) {
            return { remaining: maxRequests, resetTime: 0 }
        }

        return {
            remaining: Math.max(0, maxRequests - entry.count),
            resetTime: entry.resetTime,
        }
    }

    /**
     * Reset rate limit for an identifier (useful for testing)
     */
    reset(identifier: string): void {
        this.requests.delete(identifier)
    }

    /**
     * Clean up the interval on shutdown
     */
    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval)
        }
    }
}

// Singleton instance
const rateLimiter = new RateLimiter()

/**
 * Rate limit configuration presets
 */
export const RateLimitPresets = {
    STRICT: { maxRequests: 5, windowMs: 60000 }, // 5 requests per minute
    MODERATE: { maxRequests: 10, windowMs: 60000 }, // 10 requests per minute
    RELAXED: { maxRequests: 30, windowMs: 60000 }, // 30 requests per minute
    CONTACT_FORM: { maxRequests: 3, windowMs: 300000 }, // 3 requests per 5 minutes
    SUBSCRIBE: { maxRequests: 5, windowMs: 3600000 }, // 5 requests per hour
    ANALYTICS: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
} as const

/**
 * Extract identifier from request (IP address)
 */
function getIdentifier(request: NextRequest): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown'
    )
}

/**
 * Middleware to apply rate limiting to an API route
 * Returns a response with 429 status if rate limited
 */
export function applyRateLimit(
    request: NextRequest,
    config: { maxRequests: number; windowMs: number }
): NextResponse | null {
    const identifier = getIdentifier(request)
    const isLimited = rateLimiter.isRateLimited(
        identifier,
        config.maxRequests,
        config.windowMs
    )

    if (isLimited) {
        const status = rateLimiter.getStatus(identifier, config.maxRequests)
        const resetDate = new Date(status.resetTime)

        return NextResponse.json(
            {
                error: 'Too many requests. Please try again later.',
                retryAfter: Math.ceil((status.resetTime - Date.now()) / 1000),
            },
            {
                status: 429,
                headers: {
                    'Retry-After': Math.ceil((status.resetTime - Date.now()) / 1000).toString(),
                    'X-RateLimit-Limit': config.maxRequests.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': resetDate.toISOString(),
                },
            }
        )
    }

    return null // Not rate limited, proceed with request
}

/**
 * Helper to add rate limit headers to successful responses
 */
export function addRateLimitHeaders(
    response: NextResponse,
    request: NextRequest,
    config: { maxRequests: number; windowMs: number }
): NextResponse {
    const identifier = getIdentifier(request)
    const status = rateLimiter.getStatus(identifier, config.maxRequests)

    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', status.remaining.toString())

    if (status.resetTime > 0) {
        response.headers.set('X-RateLimit-Reset', new Date(status.resetTime).toISOString())
    }

    return response
}

export { rateLimiter }
