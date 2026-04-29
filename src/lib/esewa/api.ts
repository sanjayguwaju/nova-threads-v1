import { ESEWA_CONFIG, ESEWA_RESPONSE_CODES, ESEWA_STATUSES, type EsewaStatus } from './config'
import { generateSignature } from './signature'
import { logger } from '../logger'

// Types
export interface EsewaBookRequest {
  amount: number
  transactionUuid: string
  callbackUrl: string
  redirectUrl: string
  properties?: {
    customer_id?: string
    remarks?: string
    [key: string]: string | undefined
  }
}

export interface EsewaBookResponse {
  code: string
  data?: {
    booking_id: string
    deeplink: string
    correlation_id: string
  }
  message: string
  error_message?: string
}

export interface EsewaStatusRequest {
  bookingId: string
  correlationId: string
}

export interface EsewaStatusResponse {
  code: string
  data?: {
    booking_id: string
    product_code: string
    status: EsewaStatus
    correlation_id: string
    transaction_id?: string
    reference_code?: string
    updated_at?: string
  }
  message: string
  error_message?: string
}

export interface EsewaCancelRequest {
  bookingId: string
}

export interface EsewaCancelResponse {
  code: string
  data?: {
    booking_id: string
    status: string
    correlation_id: string
    transaction_id?: string
  }
  message: string
  error_message?: string
}

export interface EsewaCallbackPayload {
  product_code: string
  amount: number
  reference_code: string
  correlation_id: string
  status: EsewaStatus
  signature: string
  signed_field_names: string
}

/**
 * Book/Initialize eSewa Intent Payment
 */
export async function bookPayment(request: EsewaBookRequest): Promise<EsewaBookResponse> {
  const signedFields = {
    product_code: ESEWA_CONFIG.PRODUCT_CODE,
    amount: request.amount,
    transaction_uuid: request.transactionUuid,
  }

  const signedFieldNames = Object.keys(signedFields)
  const signature = generateSignature(signedFields, signedFieldNames)

  const payload = {
    product_code: ESEWA_CONFIG.PRODUCT_CODE,
    amount: request.amount,
    transaction_uuid: request.transactionUuid,
    signed_field_names: signedFieldNames.join(','),
    signature,
    callback_url: request.callbackUrl,
    redirect_url: request.redirectUrl,
    properties: request.properties || {},
  }

  try {
    const response = await fetch(`${ESEWA_CONFIG.BASE_URL}${ESEWA_CONFIG.INTENT_BOOK_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('eSewa book payment failed', { status: response.status, data })
      return {
        code: data.code || 'IP-500',
        message: data.error_message || 'Failed to book payment',
        error_message: data.error_message,
      }
    }

    logger.info('eSewa payment booked', { bookingId: data.data?.booking_id })
    return data as EsewaBookResponse
  } catch (error) {
    logger.error('eSewa book payment error', { error })
    return {
      code: 'IP-500',
      message: 'Network error while booking payment',
    }
  }
}

/**
 * Check eSewa Payment Status
 */
export async function checkPaymentStatus(
  request: EsewaStatusRequest
): Promise<EsewaStatusResponse> {
  const signedFields = {
    booking_id: request.bookingId,
    product_code: ESEWA_CONFIG.PRODUCT_CODE,
    correlation_id: request.correlationId,
  }

  const signedFieldNames = Object.keys(signedFields)
  const signature = generateSignature(signedFields, signedFieldNames)

  const payload = {
    booking_id: request.bookingId,
    product_code: ESEWA_CONFIG.PRODUCT_CODE,
    correlation_id: request.correlationId,
    signed_field_names: signedFieldNames.join(','),
    signature,
  }

  try {
    const response = await fetch(`${ESEWA_CONFIG.BASE_URL}${ESEWA_CONFIG.INTENT_STATUS_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('eSewa status check failed', { status: response.status, data })
      return {
        code: data.code || 'IP-500',
        message: data.error_message || 'Failed to check status',
        error_message: data.error_message,
      }
    }

    return data as EsewaStatusResponse
  } catch (error) {
    logger.error('eSewa status check error', { error })
    return {
      code: 'IP-500',
      message: 'Network error while checking status',
    }
  }
}

/**
 * Cancel eSewa Payment Booking
 */
export async function cancelPayment(request: EsewaCancelRequest): Promise<EsewaCancelResponse> {
  const signedFields = {
    booking_id: request.bookingId,
    product_code: ESEWA_CONFIG.PRODUCT_CODE,
  }

  const signedFieldNames = Object.keys(signedFields)
  const signature = generateSignature(signedFields, signedFieldNames)

  const payload = {
    booking_id: request.bookingId,
    product_code: ESEWA_CONFIG.PRODUCT_CODE,
    signed_field_names: signedFieldNames.join(','),
    signature,
  }

  try {
    const response = await fetch(`${ESEWA_CONFIG.BASE_URL}${ESEWA_CONFIG.INTENT_CANCEL_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('eSewa cancel payment failed', { status: response.status, data })
      return {
        code: data.code || 'IP-500',
        message: data.error_message || 'Failed to cancel payment',
        error_message: data.error_message,
      }
    }

    return data as EsewaCancelResponse
  } catch (error) {
    logger.error('eSewa cancel payment error', { error })
    return {
      code: 'IP-500',
      message: 'Network error while canceling payment',
    }
  }
}

/**
 * Verify callback signature
 */
export function verifyCallbackSignature(payload: EsewaCallbackPayload): boolean {
  const { signature, signed_field_names, ...fields } = payload

  const signedFieldNames = signed_field_names.split(',')
  const signatureFields: Record<string, string | number> = {}

  for (const field of signedFieldNames) {
    const value = fields[field as keyof typeof fields]
    if (value !== undefined) {
      signatureFields[field] = value
    }
  }

  const expectedSignature = generateSignature(signatureFields, signedFieldNames)
  return expectedSignature === signature
}
