'use server'

import { getRedis, redisSetNX, redisDel, redisExists } from './redis'

const LOCK_PREFIX = 'checkout_lock:'
const LOCK_TTL_SECONDS = 300 // 5 minutes

export async function acquireCheckoutLock(
  identifier: string
): Promise<{ locked: boolean; lockKey: string }> {
  const lockKey = `${LOCK_PREFIX}${identifier}`
  const redis = getRedis()

  if (redis) {
    const acquired = await redisSetNX(lockKey, '1', LOCK_TTL_SECONDS)
    return { locked: acquired, lockKey }
  }

  // Fallback: simple in-memory lock (single node only)
  if (checkoutMemoryLocks.has(lockKey)) {
    return { locked: false, lockKey }
  }
  checkoutMemoryLocks.set(lockKey, Date.now())
  // Auto-expire after TTL
  setTimeout(() => checkoutMemoryLocks.delete(lockKey), LOCK_TTL_SECONDS * 1000)

  return { locked: true, lockKey }
}

export async function releaseCheckoutLock(lockKey: string): Promise<void> {
  const redis = getRedis()

  if (redis) {
    await redisDel(lockKey)
    return
  }

  checkoutMemoryLocks.delete(lockKey)
}

export async function isCheckoutLocked(identifier: string): Promise<boolean> {
  const lockKey = `${LOCK_PREFIX}${identifier}`
  const redis = getRedis()

  if (redis) {
    return redisExists(lockKey)
  }

  const lockTime = checkoutMemoryLocks.get(lockKey)
  if (!lockTime) return false

  const expired = Date.now() - lockTime > LOCK_TTL_SECONDS * 1000
  if (expired) {
    checkoutMemoryLocks.delete(lockKey)
    return false
  }

  return true
}

const checkoutMemoryLocks = new Map<string, number>()
