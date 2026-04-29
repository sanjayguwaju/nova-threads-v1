import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { getPayload } from '@/lib/payload/getPayload'
import { decrementStock, restoreStock } from '@/lib/inventory'
import { sendOrderConfirmationEmail, sendInvoiceEmail } from '@/lib/email'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const signature = request.headers.get('stripe-signature') || ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payloadCMS = await getPayload()

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(payloadCMS, paymentIntent)
        break
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailure(payloadCMS, paymentIntent)
        break
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await handleRefund(payloadCMS, charge)
        break
      }
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    // Return 500 so Stripe retries
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handlePaymentSuccess(payload: any, paymentIntent: Stripe.PaymentIntent) {
  const existing = await payload.find({
    collection: 'orders',
    where: { stripePaymentIntentId: { equals: paymentIntent.id } },
    limit: 1,
  })

  let order = existing.docs[0]

  if (order) {
    // Order already created (likely by client). Update authoritative status.
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        paymentStatus: 'paid',
        status: 'processing',
      },
    })
  } else {
    // Client failed to create order (browser crash, network issue). Create it now.
    const cartSnapshot = parseCartSnapshot(paymentIntent.metadata?.cartSnapshot)
    const amount = paymentIntent.amount / 100
    const shippingCost = parseShippingFromMetadata(paymentIntent.metadata)

    order = await payload.create({
      collection: 'orders',
      data: {
        customer: paymentIntent.metadata?.customerId || undefined,
        guestEmail: paymentIntent.receipt_email || undefined,
        items: cartSnapshot.map((item: any) => ({
          product: item.productId,
          variantSku: item.variantSku,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        subtotal: cartSnapshot.reduce((s: number, i: any) => s + i.price * i.quantity, 0),
        shippingCost,
        total: amount,
        currency: paymentIntent.currency.toUpperCase(),
        status: 'processing',
        paymentStatus: 'paid',
        stripePaymentIntentId: paymentIntent.id,
      } as any,
    })

    // Decrement stock for newly created order
    await decrementStock(
      cartSnapshot.map((item: any) => ({
        productId: item.productId,
        variantSku: item.variantSku,
        quantity: item.quantity,
      })),
    )
  }

  // Send confirmation and invoice emails
  try {
    const fullOrder = await payload.findByID({ collection: 'orders', id: order.id, depth: 2 })
    await Promise.all([sendOrderConfirmationEmail(fullOrder), sendInvoiceEmail(fullOrder)])
  } catch (emailErr) {
    console.error('Failed to send order emails:', emailErr)
  }
}

async function handlePaymentFailure(payload: any, paymentIntent: Stripe.PaymentIntent) {
  const existing = await payload.find({
    collection: 'orders',
    where: { stripePaymentIntentId: { equals: paymentIntent.id } },
    limit: 1,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'orders',
      id: existing.docs[0].id,
      data: { paymentStatus: 'failed', status: 'cancelled' },
    })

    // Restore stock since payment failed
    const cartSnapshot = parseCartSnapshot(paymentIntent.metadata?.cartSnapshot)
    await restoreStock(
      cartSnapshot.map((item: any) => ({
        productId: item.productId,
        variantSku: item.variantSku,
        quantity: item.quantity,
      })),
    )
  }
}

async function handleRefund(payload: any, charge: Stripe.Charge) {
  if (!charge.payment_intent) return
  const existing = await payload.find({
    collection: 'orders',
    where: { stripePaymentIntentId: { equals: charge.payment_intent } },
    limit: 1,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'orders',
      id: existing.docs[0].id,
      data: { paymentStatus: 'refunded', status: 'refunded' },
    })

    // Restore stock on refund
    const order = existing.docs[0]
    if (order.items?.length) {
      await restoreStock(
        order.items.map((item: any) => ({
          productId: typeof item.product === 'object' ? item.product.id : item.product,
          variantSku: item.variantSku,
          quantity: item.quantity || 1,
        })),
      )
    }
  }
}

function parseCartSnapshot(raw: string | undefined): any[] {
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function parseShippingFromMetadata(metadata: Stripe.PaymentIntent['metadata']): number {
  if (!metadata) return 0
  const shipping = metadata.shippingCost
  if (shipping) {
    const parsed = parseFloat(shipping)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}
