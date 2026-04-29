import { Redis } from '@upstash/redis'

let redis: Redis | null = null

export function getRedis(): Redis | null {
  if (redis) return redis

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        'UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set. Falling back to in-memory.',
      )
    }
    return null
  }

  redis = new Redis({ url, token })
  return redis
}

export async function redisSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  const r = getRedis()
  if (r) {
    if (ttlSeconds) {
      await r.set(key, value, { ex: ttlSeconds })
    } else {
      await r.set(key, value)
    }
  }
}

export async function redisGet(key: string): Promise<string | null> {
  const r = getRedis()
  if (r) {
    return r.get(key) as Promise<string | null>
  }
  return null
}

export async function redisDel(key: string): Promise<void> {
  const r = getRedis()
  if (r) {
    await r.del(key)
  }
}

export async function redisExists(key: string): Promise<boolean> {
  const r = getRedis()
  if (r) {
    const result = await r.exists(key)
    return result === 1
  }
  return false
}

export async function redisSetNX(key: string, value: string, ttlSeconds: number): Promise<boolean> {
  const r = getRedis()
  if (r) {
    const result = await r.set(key, value, { nx: true, ex: ttlSeconds })
    return result === 'OK'
  }
  return false
}

export async function redisIncr(key: string): Promise<number> {
  const r = getRedis()
  if (r) {
    return r.incr(key)
  }
  return 0
}

export async function redisExpire(key: string, ttlSeconds: number): Promise<void> {
  const r = getRedis()
  if (r) {
    await r.expire(key, ttlSeconds)
  }
}

export async function redisZAdd(key: string, score: number, member: string): Promise<void> {
  const r = getRedis()
  if (r) {
    await r.zadd(key, { score, member })
  }
}

export async function redisZRemRangeByScore(
  key: string,
  min: number,
  max: number,
): Promise<number> {
  const r = getRedis()
  if (r) {
    return r.zremrangebyscore(key, min, max)
  }
  return 0
}

export async function redisZRangeByScore(key: string, min: number, max: number): Promise<string[]> {
  const r = getRedis()
  if (r) {
    return r.zrange(key, min, max, { byScore: true }) as Promise<string[]>
  }
  return []
}
