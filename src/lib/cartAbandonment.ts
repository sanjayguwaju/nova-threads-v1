'use server'

import {
  getRedis,
  redisSet,
  redisDel,
  redisZAdd,
  redisZRangeByScore,
  redisZRemRangeByScore,
} from './redis'

const CART_KEY_PREFIX = 'cart_active:'
const ABANDONED_SET_KEY = 'abandoned_carts'
const CART_TTL_SECONDS = 30 * 60 // 30 minutes
const ABANDONMENT_THRESHOLD_MS = 30 * 60 * 1000 // 30 minutes

interface CartSnapshot {
  email: string
  firstName?: string | null
  items: Array<{
    name: string
    image?: string
    price: number
    quantity: number
  }>
  cartUrl: string
}

export async function trackCartActivity(email: string, snapshot: CartSnapshot): Promise<void> {
  const redis = getRedis()
  const now = Date.now()

  if (redis) {
    // Store active cart with TTL
    await redisSet(`${CART_KEY_PREFIX}${email}`, JSON.stringify(snapshot), CART_TTL_SECONDS)

    // Add to abandoned cart tracking sorted set (score = timestamp)
    await redisZAdd(ABANDONED_SET_KEY, now, email)
    return
  }

  // Fallback: in-memory tracking
  cartMemoryStore.set(email, { snapshot, timestamp: now })
}

export async function clearCartTracking(email: string): Promise<void> {
  const redis = getRedis()

  if (redis) {
    await redisDel(`${CART_KEY_PREFIX}${email}`)
    return
  }

  cartMemoryStore.delete(email)
}

export async function findAbandonedCarts(): Promise<
  Array<{ email: string; snapshot: CartSnapshot }>
> {
  const redis = getRedis()
  const cutoff = Date.now() - ABANDONMENT_THRESHOLD_MS

  if (redis) {
    // Get emails from sorted set with scores older than threshold
    const emails = await redisZRangeByScore(ABANDONED_SET_KEY, 0, cutoff)
    const results: Array<{ email: string; snapshot: CartSnapshot }> = []

    for (const email of emails) {
      const data = await redis.get(`${CART_KEY_PREFIX}${email}`)
      if (data) {
        try {
          const snapshot = JSON.parse(data as string) as CartSnapshot
          results.push({ email, snapshot })
        } catch {
          // Invalid JSON, skip
        }
      }
    }

    return results
  }

  // Fallback: in-memory
  const results: Array<{ email: string; snapshot: CartSnapshot }> = []
  for (const [email, entry] of cartMemoryStore.entries()) {
    if (entry.timestamp < cutoff) {
      results.push({ email, snapshot: entry.snapshot })
    }
  }
  return results
}

export async function markCartProcessed(email: string): Promise<void> {
  const redis = getRedis()

  if (redis) {
    await redisDel(`${CART_KEY_PREFIX}${email}`)
    // Note: We don't remove from sorted set here to avoid race conditions.
    // The processing endpoint should handle cleanup.
    return
  }

  cartMemoryStore.delete(email)
}

// In-memory fallback
const cartMemoryStore = new Map<string, { snapshot: CartSnapshot; timestamp: number }>()

// Periodic cleanup for in-memory fallback (every 10 minutes)
setInterval(
  () => {
    const cutoff = Date.now() - ABANDONMENT_THRESHOLD_MS
    for (const [email, entry] of cartMemoryStore.entries()) {
      if (entry.timestamp < cutoff) {
        cartMemoryStore.delete(email)
      }
    }
  },
  10 * 60 * 1000,
)
