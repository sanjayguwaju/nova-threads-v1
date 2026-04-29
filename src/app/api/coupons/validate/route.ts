import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload/getPayload'
import { rateLimit } from '@/lib/rateLimit'
import { z } from 'zod'

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0).optional(),
  categoryIds: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  const limitResult = await rateLimit(request, {
    maxRequests: 10,
    windowMs: 60_000,
    keyPrefix: 'coupon',
  })
  if (limitResult instanceof NextResponse) return limitResult

  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { code, subtotal = 0, categoryIds = [] } = parsed.data
    const payload = await getPayload()

    const result = await payload.find({
      collection: 'coupons',
      where: { code: { equals: code.toUpperCase() } },
      limit: 1,
    })

    const coupon = result.docs[0]
    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Coupon not found' }, { status: 404 })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, message: 'Coupon is inactive' }, { status: 400 })
    }

    if (coupon.validFrom && new Date(coupon.validFrom) > new Date()) {
      return NextResponse.json({ valid: false, message: 'Coupon not yet valid' }, { status: 400 })
    }

    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return NextResponse.json({ valid: false, message: 'Coupon expired' }, { status: 400 })
    }

    if (
      coupon.maxUses !== undefined &&
      coupon.maxUses !== null &&
      (coupon.usedCount ?? 0) >= coupon.maxUses
    ) {
      return NextResponse.json(
        { valid: false, message: 'Coupon usage limit reached' },
        { status: 400 },
      )
    }

    if (
      coupon.minOrderAmount !== undefined &&
      coupon.minOrderAmount !== null &&
      subtotal < coupon.minOrderAmount
    ) {
      return NextResponse.json(
        { valid: false, message: `Minimum order amount is ${coupon.minOrderAmount}` },
        { status: 400 },
      )
    }

    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      const applicableIds = coupon.applicableCategories.map((c: any) =>
        typeof c === 'string' ? c : c.id,
      )
      const hasMatch = categoryIds.some((id) => applicableIds.includes(id))
      if (!hasMatch) {
        return NextResponse.json(
          { valid: false, message: 'Coupon not valid for these items' },
          { status: 400 },
        )
      }
    }

    let discount = 0
    if (coupon.type === 'percentage' && coupon.value) {
      discount = subtotal * (coupon.value / 100)
    } else if (coupon.type === 'fixed' && coupon.value) {
      discount = coupon.value
    } else if (coupon.type === 'free_shipping') {
      discount = 0 // handled by shipping logic
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: Math.min(discount, subtotal),
      },
    })
  } catch (err) {
    console.error('Coupon validation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
