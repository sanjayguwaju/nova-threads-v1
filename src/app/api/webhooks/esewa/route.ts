import { NextRequest, NextResponse } from 'next/server'
import { verifyCallbackSignature, type EsewaCallbackPayload } from '@/lib/esewa/api'
import { ESEWA_STATUSES } from '@/lib/esewa/config'
import { getPayload } from '@/lib/payload/getPayload'
import { decrementStock, restoreStock } from '@/lib/inventory'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { logger } from '@/lib/logger'

/**
 * eSewa Payment Callback Handler
 * This endpoint receives payment status updates from eSewa
 * Docs: https://developer.esewa.com.np/
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const callbackData = payload as EsewaCallbackPayload

    logger.info('eSewa callback received', {
      correlation_id: callbackData.correlation_id,
      status: callbackData.status,
      reference_code: callbackData.reference_code,
    })

    // Verify signature
    const isValid = verifyCallbackSignature(callbackData)
    if (!isValid) {
      logger.error('eSewa callback signature verification failed', { payload })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Find order by correlation_id (stored as stripePaymentIntentId for compatibility)
    const payloadCMS = await getPayload()
    const orders = await payloadCMS.find({
      collection: 'orders',
      where: {
        stripePaymentIntentId: { equals: callbackData.correlation_id },
      },
      limit: 1,
    })

    if (!orders.docs || orders.docs.length === 0) {
      logger.error('Order not found for eSewa callback', {
        correlation_id: callbackData.correlation_id,
      })
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orders.docs[0]

    // Handle different statuses
    switch (callbackData.status) {
      case ESEWA_STATUSES.SUCCESS:
        await handleSuccess(payloadCMS, order, callbackData)
        break

      case ESEWA_STATUSES.FAILED:
      case ESEWA_STATUSES.CANCELED:
        await handleFailure(payloadCMS, order, callbackData)
        break

      case ESEWA_STATUSES.PENDING:
        // Payment still processing - don't change status
        logger.info('eSewa payment still pending', {
          orderId: order.id,
          correlation_id: callbackData.correlation_id,
        })
        break

      case ESEWA_STATUSES.REVERTED:
        await handleRefund(payloadCMS, order, callbackData)
        break

      default:
        logger.warn('Unknown eSewa status', { status: callbackData.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('eSewa callback error', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleSuccess(
  payload: any,
  order: any,
  callbackData: EsewaCallbackPayload
) {
  // Update order status
  await payload.update({
    collection: 'orders',
    id: order.id,
    data: {
      status: 'processing',
      paymentStatus: 'paid',
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
    logger.error('Failed to decrement stock after eSewa payment', {
      orderId: order.id,
      error: stockErr,
    })
  }

  // Send confirmation email
  try {
    const fullOrder = await payload.findByID({
      collection: 'orders',
      id: order.id,
      depth: 2,
    })
    await sendOrderConfirmationEmail(fullOrder)
  } catch (emailErr) {
    logger.error('Failed to send order confirmation email for eSewa', {
      orderId: order.id,
      error: emailErr,
    })
  }

  logger.info('eSewa payment successful', {
    orderId: order.id,
    reference_code: callbackData.reference_code,
  })
}

async function handleFailure(
  payload: any,
  order: any,
  callbackData: EsewaCallbackPayload
) {
  // Update order status
  await payload.update({
    collection: 'orders',
    id: order.id,
    data: {
      status: 'failed',
      paymentStatus: 'failed',
    },
  })

  logger.info('eSewa payment failed/cancelled', {
    orderId: order.id,
    status: callbackData.status,
  })
}

async function handleRefund(
  payload: any,
  order: any,
  callbackData: EsewaCallbackPayload
) {
  // Update order status
  await payload.update({
    collection: 'orders',
    id: order.id,
    data: {
      status: 'refunded',
      paymentStatus: 'refunded',
    },
  })

  // Restore stock
  try {
    const cartSnapshot =
      order.items?.map((item: any) => ({
        productId: typeof item.product === 'string' ? item.product : item.product?.id,
        variantSku: item.variantSku,
        quantity: item.quantity,
      })) || []

    await restoreStock(cartSnapshot)
  } catch (stockErr) {
    logger.error('Failed to restore stock after eSewa refund', {
      orderId: order.id,
      error: stockErr,
    })
  }

  logger.info('eSewa payment refunded', {
    orderId: order.id,
    reference_code: callbackData.reference_code,
  })
}
