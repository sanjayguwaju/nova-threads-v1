import { NextRequest, NextResponse } from 'next/server'
import { bookPayment } from '@/lib/esewa/api'
import { getPayload } from '@/lib/payload/getPayload'
import { getCurrentUser } from '@/lib/payload/actions/auth'
import { validateStock } from '@/lib/inventory'
import { rateLimit } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const initiateSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantSku: z.string(),
      variantLabel: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ),
  shippingCost: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string(),
    country: z.string().default('NP'),
    phone: z.string(),
  }),
  billingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string(),
    country: z.string().default('NP'),
    phone: z.string(),
  }),
  guestEmail: z.string().email().optional(),
  couponCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
  // Rate limiting
  const limitResult = await rateLimit(request, {
    maxRequests: 5,
    windowMs: 60_000,
    keyPrefix: 'esewa_initiate',
  })
  if (limitResult instanceof NextResponse) return limitResult

  try {
    const body = await request.json()
    const parsed = initiateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { items, shippingCost, discount, shippingAddress, billingAddress, guestEmail, couponCode } =
      parsed.data

    // Validate stock
    const stockCheck = await validateStock(
      items.map((i) => ({
        productId: i.productId,
        variantSku: i.variantSku,
        quantity: i.quantity,
      }))
    )

    if (!stockCheck.valid) {
      const names = stockCheck.invalidItems
        .map((i) => i.item.variantSku || i.item.productId)
        .join(', ')
      return NextResponse.json({ error: `Insufficient stock for: ${names}` }, { status: 400 })
    }

    // Get current user
    const user = await getCurrentUser()

    // Calculate totals
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const total = Math.max(0, subtotal + shippingCost - discount)

    // Generate transaction UUID
    const transactionUuid = `NOVA-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    const payload = await getPayload()

    // Create order first (status: pending)
    const order = await payload.create({
      collection: 'orders',
      data: {
        customer: user?.id,
        guestEmail: !user ? guestEmail : undefined,
        items: items.map((i) => ({
          product: i.productId,
          variantSku: i.variantSku,
          quantity: i.quantity,
          price: i.price,
          total: i.price * i.quantity,
        })),
        subtotal,
        discount,
        shippingCost,
        tax: 0,
        total,
        shippingAddress,
        billingAddress,
        stripePaymentIntentId: transactionUuid, // Store as correlation ID for eSewa
        status: 'pending',
        paymentStatus: 'pending',
        couponCode,
      } as any,
    })

    // Build callback and redirect URLs
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const callbackUrl = `${baseUrl}/api/webhooks/esewa`
    const redirectUrl = `${baseUrl}/checkout/esewa/callback?orderId=${order.id}`

    // Book payment with eSewa
    const bookResult = await bookPayment({
      amount: total,
      transactionUuid,
      callbackUrl,
      redirectUrl,
      properties: {
        customer_id: user?.id || guestEmail || 'guest',
        remarks: `Order ${order.orderNumber || order.id}`,
        order_id: order.id,
      },
    })

    if (!bookResult.data) {
      // Booking failed - update order status
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          status: 'failed',
          paymentStatus: 'failed',
        },
      })

      return NextResponse.json(
        { error: bookResult.message || 'Failed to initiate eSewa payment' },
        { status: 400 }
      )
    }

    // Update order with booking ID
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        stripePaymentIntentId: bookResult.data.correlation_id, // Store correlation ID
        notes: `eSewa Booking ID: ${bookResult.data.booking_id}`,
      },
    })

    logger.info('eSewa payment initiated', {
      orderId: order.id,
      bookingId: bookResult.data.booking_id,
      correlationId: bookResult.data.correlation_id,
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      bookingId: bookResult.data.booking_id,
      deeplink: bookResult.data.deeplink,
      correlationId: bookResult.data.correlation_id,
      amount: total,
      transactionUuid,
    })
  } catch (error) {
    logger.error('eSewa initiate error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
