import { NextRequest, NextResponse } from 'next/server'
import { initiatePayment } from '@/lib/khalti/api'
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
    keyPrefix: 'khalti_initiate',
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

    // Calculate totals - Khalti expects amount in PAISA (1 NPR = 100 paisa)
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const total = Math.max(0, subtotal + shippingCost - discount)
    const amountInPaisa = Math.round(total * 100)

    // Generate unique purchase order ID
    const purchaseOrderId = `NOVA-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    const purchaseOrderName = `Order for ${items.length} item(s) - ${purchaseOrderId}`

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
        stripePaymentIntentId: purchaseOrderId, // Store as correlation ID
        status: 'pending',
        paymentStatus: 'pending',
        couponCode,
      } as any,
    })

    // Build return and website URLs
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const returnUrl = `${baseUrl}/checkout/khalti/callback?orderId=${order.id}`
    const websiteUrl = baseUrl

    // Build product details for Khalti
    const productDetails = items.map((item) => ({
      identity: item.productId,
      name: item.name,
      total_price: Math.round(item.price * item.quantity * 100), // in paisa
      quantity: item.quantity,
      unit_price: Math.round(item.price * 100), // in paisa
    }))

    // Build amount breakdown
    const amountBreakdown = [
      {
        label: 'Subtotal',
        amount: Math.round(subtotal * 100),
      },
      ...(shippingCost > 0
        ? [
            {
              label: 'Shipping',
              amount: Math.round(shippingCost * 100),
            },
          ]
        : []),
      ...(discount > 0
        ? [
            {
              label: 'Discount',
              amount: -Math.round(discount * 100), // negative for discount
            },
          ]
        : []),
    ]

    // Initiate payment with Khalti
    const initiateResult = await initiatePayment({
      return_url: returnUrl,
      website_url: websiteUrl,
      amount: amountInPaisa,
      purchase_order_id: purchaseOrderId,
      purchase_order_name: purchaseOrderName,
      customer_info: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        email: user?.email || guestEmail || '',
        phone: shippingAddress.phone,
      },
      amount_breakdown: amountBreakdown,
      product_details: productDetails,
      merchant_username: 'nova_threads',
      merchant_extra: `order_id:${order.id}`,
    })

    if (!initiateResult.success) {
      // Initiation failed - update order status
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          status: 'failed',
          paymentStatus: 'failed',
        },
      })

      return NextResponse.json(
        { error: initiateResult.error || 'Failed to initiate Khalti payment' },
        { status: 400 }
      )
    }

    // Update order with pidx (Khalti's payment identifier)
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        stripePaymentIntentId: initiateResult.data.pidx, // Store pidx for reference
        notes: `Khalti PIDX: ${initiateResult.data.pidx}`,
      },
    })

    logger.info('Khalti payment initiated', {
      orderId: order.id,
      pidx: initiateResult.data.pidx,
      purchaseOrderId,
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      pidx: initiateResult.data.pidx,
      paymentUrl: initiateResult.data.payment_url,
      expiresAt: initiateResult.data.expires_at,
      expiresIn: initiateResult.data.expires_in,
      amount: total,
      amountInPaisa,
      purchaseOrderId,
    })
  } catch (error) {
    logger.error('Khalti initiate error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
