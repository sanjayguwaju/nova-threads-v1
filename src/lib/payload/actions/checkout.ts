'use server'

import { stripe } from '@/lib/stripe/client'
import { getPayload } from '../getPayload'
import { getCurrentUser } from './auth'

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
  discount = 0
) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const total = Math.max(0, subtotal + shippingCost - discount)
  const amount = Math.round(total * 100)

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: {
      cartSnapshot: JSON.stringify(items).slice(0, 450),
    },
  })

  return { clientSecret: intent.client_secret, paymentIntentId: intent.id, total }
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
  }
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
        variantLabel: i.variantLabel,
        quantity: i.quantity,
        unitPrice: i.price,
        totalPrice: i.price * i.quantity,
      })),
      subtotal,
      discount: data.discount,
      shipping: data.shipping,
      total,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress,
      stripePaymentIntentId: paymentIntentId,
      status: 'processing',
      timeline: [{ status: 'processing', timestamp: new Date().toISOString(), note: 'Payment received' }],
    } as any,
  })

  return order
}
