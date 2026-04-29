import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getRedis } from './redis'

interface RateLimitOptions {
  windowMs?: number
  maxRequests?: number
  keyPrefix?: string
}

const FALLBACK_STORE = new Map<string, { count: number; resetTime: number }>()

// Periodic cleanup for in-memory fallback
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of FALLBACK_STORE.entries()) {
    if (entry.resetTime < now) FALLBACK_STORE.delete(key)
  }
}, 60_000)

export async function rateLimit(
  request: NextRequest,
  opts: RateLimitOptions = {},
): Promise<{ allowed: boolean; limit: number; remaining: number; reset: number } | NextResponse> {
  const windowMs = opts.windowMs ?? 60_000
  const maxRequests = opts.maxRequests ?? 30
  const keyPrefix = opts.keyPrefix ?? 'rl'

  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown'
  const key = `${keyPrefix}:${ip}:${request.nextUrl.pathname}`

  const redis = getRedis()
  const now = Date.now()
  const reset = now + windowMs

  if (redis) {
    // Redis-based rate limiting using INCR + EXPIRE
    const count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, Math.ceil(windowMs / 1000))
    }

    const remaining = Math.max(0, maxRequests - count)

    if (count > maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(reset / 1000)),
          },
        },
      )
    }

    return { allowed: true, limit: maxRequests, remaining, reset }
  }

  // Fallback: in-memory rate limiting
  return fallbackRateLimit(key, maxRequests, windowMs, reset)
}

export function rateLimitByIp(
  ip: string,
  path: string,
  opts: RateLimitOptions = {},
): { allowed: boolean; limit: number; remaining: number; reset: number } {
  const windowMs = opts.windowMs ?? 60_000
  const maxRequests = opts.maxRequests ?? 30
  const keyPrefix = opts.keyPrefix ?? 'rl'
  const key = `${keyPrefix}:${ip}:${path}`

  const now = Date.now()
  const reset = now + windowMs

  // Note: rateLimitByIp is sync for server actions; uses in-memory fallback
  // For Redis-backed rate limiting in server actions, use rateLimit() with request object
  return fallbackRateLimitSync(key, maxRequests, windowMs, reset)
}

function fallbackRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
  reset: number,
): { allowed: boolean; limit: number; remaining: number; reset: number } | NextResponse {
  const now = Date.now()
  const existing = FALLBACK_STORE.get(key)

  if (!existing || existing.resetTime < now) {
    FALLBACK_STORE.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, limit: maxRequests, remaining: maxRequests - 1, reset }
  }

  if (existing.count >= maxRequests) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(existing.resetTime / 1000)),
        },
      },
    )
  }

  existing.count += 1
  return {
    allowed: true,
    limit: maxRequests,
    remaining: maxRequests - existing.count,
    reset: existing.resetTime,
  }
}

function fallbackRateLimitSync(
  key: string,
  maxRequests: number,
  windowMs: number,
  reset: number,
): { allowed: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now()
  const existing = FALLBACK_STORE.get(key)

  if (!existing || existing.resetTime < now) {
    FALLBACK_STORE.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, limit: maxRequests, remaining: maxRequests - 1, reset }
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, limit: maxRequests, remaining: 0, reset: existing.resetTime }
  }

  existing.count += 1
  return {
    allowed: true,
    limit: maxRequests,
    remaining: maxRequests - existing.count,
    reset: existing.resetTime,
  }
}
