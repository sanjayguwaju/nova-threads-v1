'use server'

import { getPayload } from '../getPayload'

export async function validateCoupon(code: string, subtotal: number) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'coupons',
    where: { code: { equals: code.toUpperCase() }, isActive: { equals: true } },
    limit: 1,
  })
  const coupon = result.docs[0] as any
  if (!coupon) return { ok: false, error: 'Invalid code' }

  const now = new Date()
  if (coupon.validFrom && new Date(coupon.validFrom) > now) return { ok: false, error: 'Not yet active' }
  if (coupon.validUntil && new Date(coupon.validUntil) < now) return { ok: false, error: 'Expired' }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { ok: false, error: 'Limit reached' }
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount)
    return { ok: false, error: `Minimum order $${coupon.minOrderAmount}` }

  let discount = 0
  if (coupon.type === 'percentage') discount = subtotal * (coupon.value / 100)
  else if (coupon.type === 'fixed') discount = coupon.value

  return { ok: true, code: coupon.code, discount, type: coupon.type }
}
