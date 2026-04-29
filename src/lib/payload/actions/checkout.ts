'use server'

import { stripe } from '@/lib/stripe/client'
import { getPayload } from '../getPayload'
import { getCurrentUser } from './auth'
import { validateStock, decrementStock } from '@/lib/inventory'
import { rateLimitByIp } from '@/lib/rateLimit'
import { acquireCheckoutLock, releaseCheckoutLock } from '@/lib/checkoutLock'
import { headers } from 'next/headers'

interface CartSnapshotItem {
  productId: string
  variantSku: string
  variantLabel: string
  name: string
  price: number
  quantity: number
}

export async function createPaymentIntent(
  items: CartSnapshotItem[],
  shippingCost: number,
  discount = 0,
) {
  const headersList = await headers()
  const forwarded = headersList.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown'
  const limit = rateLimitByIp(ip, '/checkout', {
    maxRequests: 5,
    windowMs: 60_000,
    keyPrefix: 'payment',
  })
  if (!limit.allowed) {
    throw new Error('Too many payment attempts. Please try again later.')
  }

  // Acquire checkout lock to prevent concurrent checkouts creating duplicate orders
  // Lock key based on IP + cart contents hash (simple implementation)
  const cartHash = items
    .map((i) => i.variantSku)
    .sort()
    .join(',')
  const lockKey = `${ip}:${cartHash}`
  const { locked, lockKey: acquiredLockKey } = await acquireCheckoutLock(lockKey)
  if (!locked) {
    throw new Error('Checkout already in progress. Please wait and try again.')
  }

  try {
    // Validate stock before creating payment intent
    const stockCheck = await validateStock(
      items.map((i) => ({
        productId: i.productId,
        variantSku: i.variantSku,
        quantity: i.quantity,
      })),
    )

    if (!stockCheck.valid) {
      const names = stockCheck.invalidItems
        .map((i) => i.item.variantSku || i.item.productId)
        .join(', ')
      throw new Error(`Insufficient stock for: ${names}`)
    }

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const total = Math.max(0, subtotal + shippingCost - discount)
    const amount = Math.round(total * 100)

    const user = await getCurrentUser()

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      receipt_email: user?.email || undefined,
      metadata: {
        cartSnapshot: JSON.stringify(items).slice(0, 400),
        shippingCost: String(shippingCost),
        customerId: user?.id || '',
      },
    })

    return { clientSecret: intent.client_secret, paymentIntentId: intent.id, total }
  } finally {
    // Release the lock after payment intent is created (or fails)
    await releaseCheckoutLock(acquiredLockKey)
  }
}

export async function createOrderFromIntent(
  paymentIntentId: string,
  data: {
    items: CartSnapshotItem[]
    shippingAddress: any
    billingAddress: any
    guestEmail?: string
    shipping: number
    discount: number
    couponCode?: string
  },
) {
  const payload = await getPayload()
  const user = await getCurrentUser()

  const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const total = subtotal + data.shipping - data.discount

  const order = await payload.create({
    collection: 'orders',
    data: {
      customer: user?.id,
      guestEmail: !user ? data.guestEmail : undefined,
      items: data.items.map((i) => ({
        product: i.productId,
        variantSku: i.variantSku,
        quantity: i.quantity,
        price: i.price,
        total: i.price * i.quantity,
      })),
      subtotal,
      discount: data.discount,
      shippingCost: data.shipping,
      tax: 0,
      total,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress,
      stripePaymentIntentId: paymentIntentId,
      status: 'processing',
      paymentStatus: 'paid',
      couponCode: data.couponCode,
    } as any,
  })

  // Decrement stock after successful order creation
  await decrementStock(
    data.items.map((i) => ({
      productId: i.productId,
      variantSku: i.variantSku,
      quantity: i.quantity,
    })),
  )

  return order
}
