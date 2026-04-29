import { NextRequest, NextResponse } from 'next/server'
import { checkPaymentStatus } from '@/lib/esewa/api'
import { ESEWA_STATUSES } from '@/lib/esewa/config'
import { getPayload } from '@/lib/payload/getPayload'
import { decrementStock, restoreStock } from '@/lib/inventory'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rateLimit'
import { z } from 'zod'

const statusSchema = z.object({
  orderId: z.string(),
  bookingId: z.string(),
  correlationId: z.string(),
})

/**
 * Check eSewa payment status and update order
 * This can be called:
 * 1. After user returns from eSewa (redirect)
 * 2. By a cron job for pending payments
 * 3. Manually by admin
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const limitResult = await rateLimit(request, {
    maxRequests: 10,
    windowMs: 60_000,
    keyPrefix: 'esewa_status',
  })
  if (limitResult instanceof NextResponse) return limitResult

  try {
    const body = await request.json()
    const parsed = statusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { orderId, bookingId, correlationId } = parsed.data

    // Check status with eSewa
    const statusResult = await checkPaymentStatus({
      bookingId,
      correlationId,
    })

    if (!statusResult.data) {
      return NextResponse.json(
        { error: statusResult.message || 'Failed to check status' },
        { status: 400 }
      )
    }

    const payload = await getPayload()

    // Get current order
    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const status = statusResult.data.status

    // Update order based on status
    switch (status) {
      case ESEWA_STATUSES.SUCCESS:
        if (order.paymentStatus !== 'paid') {
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: {
              status: 'processing',
              paymentStatus: 'paid',
            },
          })

          // Decrement stock
          try {
            const cartSnapshot =
              order.items?.map((item: any) => ({
                productId:
                  typeof item.product === 'string'
                    ? item.product
                    : item.product?.id,
                variantSku: item.variantSku,
                quantity: item.quantity,
              })) || []

            await decrementStock(cartSnapshot)
          } catch (stockErr) {
            logger.error('Failed to decrement stock after eSewa success', {
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
            logger.error('Failed to send order confirmation email', {
              orderId,
              error: emailErr,
            })
          }
        }
        break

      case ESEWA_STATUSES.FAILED:
      case ESEWA_STATUSES.CANCELED:
        if (order.paymentStatus === 'pending') {
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: {
              status: 'failed',
              paymentStatus: 'failed',
            },
          })
        }
        break

      case ESEWA_STATUSES.REVERTED:
        if (order.paymentStatus === 'paid') {
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: {
              status: 'refunded',
              paymentStatus: 'refunded',
            },
          })

          // Restore stock
          try {
            const cartSnapshot =
              order.items?.map((item: any) => ({
                productId:
                  typeof item.product === 'string'
                    ? item.product
                    : item.product?.id,
                variantSku: item.variantSku,
                quantity: item.quantity,
              })) || []

            await restoreStock(cartSnapshot)
          } catch (stockErr) {
            logger.error('Failed to restore stock after eSewa refund', {
              orderId,
              error: stockErr,
            })
          }
        }
        break

      case ESEWA_STATUSES.PENDING:
      case ESEWA_STATUSES.BOOKED:
        // No change needed
        break
    }

    logger.info('eSewa status checked', {
      orderId,
      bookingId,
      status,
    })

    return NextResponse.json({
      success: true,
      status,
      orderId,
      referenceCode: statusResult.data.reference_code,
      transactionId: statusResult.data.transaction_id,
      updatedAt: statusResult.data.updated_at,
    })
  } catch (error) {
    logger.error('eSewa status check error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint for simple status checks (used by redirect flow)
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const orderId = url.searchParams.get('orderId')
  const bookingId = url.searchParams.get('bookingId')
  const correlationId = url.searchParams.get('correlationId')

  if (!orderId || !bookingId || !correlationId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  }

  // Forward to POST handler
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({ orderId, bookingId, correlationId }),
      headers: request.headers,
    })
  )
}
