import { NextRequest, NextResponse } from 'next/server'
import { lookupPayment, isPaymentSuccessful, isPaymentFailed, KHALTI_STATUSES } from '@/lib/khalti/api'
import { getPayload } from '@/lib/payload/getPayload'
import { decrementStock, restoreStock } from '@/lib/inventory'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const lookupSchema = z.object({
  pidx: z.string(),
  orderId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = lookupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { pidx, orderId } = parsed.data

    // Lookup payment status from Khalti
    const lookupResult = await lookupPayment({ pidx })

    if (!lookupResult.success) {
      return NextResponse.json(
        { error: lookupResult.error || 'Failed to lookup payment' },
        { status: 400 }
      )
    }

    const paymentData = lookupResult.data
    const payload = await getPayload()

    // Find the order
    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Handle different statuses
    let orderStatus = order.status
    let paymentStatus = order.paymentStatus

    if (isPaymentSuccessful(paymentData.status)) {
      orderStatus = 'processing'
      paymentStatus = 'paid'

      // Update order
      await payload.update({
        collection: 'orders',
        id: orderId,
        data: {
          status: orderStatus,
          paymentStatus: paymentStatus,
          notes: `Khalti PIDX: ${pidx}, Transaction: ${paymentData.transaction_id}`,
        },
      })

      // Decrement stock
      try {
        const cartSnapshot =
          order.items?.map((item: any) => ({
            productId: typeof item.product === 'string' ? item.product : item.product?.id,
            variantSku: item.variantSku,
            quantity: item.quantity,
          })) || []

        await decrementStock(cartSnapshot)
      } catch (stockErr) {
        logger.error('Failed to decrement stock after Khalti payment', {
          orderId,
          error: stockErr,
        })
      }

      // Send confirmation email
      try {
        const fullOrder = await payload.findByID({
          collection: 'orders',
          id: orderId,
          depth: 2,
        })
        await sendOrderConfirmationEmail(fullOrder)
      } catch (emailErr) {
        logger.error('Failed to send order confirmation email for Khalti', {
          orderId,
          error: emailErr,
        })
      }

      logger.info('Khalti payment verified and order updated', {
        orderId,
        pidx,
        transactionId: paymentData.transaction_id,
        status: paymentData.status,
      })
    } else if (isPaymentFailed(paymentData.status)) {
      orderStatus = 'failed'
      paymentStatus = 'failed'

      await payload.update({
        collection: 'orders',
        id: orderId,
        data: {
          status: orderStatus,
          paymentStatus: paymentStatus,
        },
      })

      logger.info('Khalti payment failed/cancelled', {
        orderId,
        pidx,
        status: paymentData.status,
      })
    }

    return NextResponse.json({
      success: true,
      status: paymentData.status,
      transactionId: paymentData.transaction_id,
      totalAmount: paymentData.total_amount,
      refunded: paymentData.refunded,
      orderStatus,
      paymentStatus,
    })
  } catch (error) {
    logger.error('Khalti lookup error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
