import { KHALTI_CONFIG, KHALTI_STATUSES, KHALTI_RESPONSE_CODES, type KhaltiStatus } from './config'

export { KHALTI_STATUSES, KHALTI_RESPONSE_CODES, type KhaltiStatus }
import { logger } from '../logger'

// Types
export interface KhaltiInitiateRequest {
  return_url: string
  website_url: string
  amount: number // Amount in paisa (1 NPR = 100 paisa)
  purchase_order_id: string
  purchase_order_name: string
  customer_info?: {
    name?: string
    email?: string
    phone?: string
  }
  amount_breakdown?: Array<{
    label: string
    amount: number
  }>
  product_details?: Array<{
    identity: string
    name: string
    total_price: number
    quantity: number
    unit_price: number
  }>
  merchant_username?: string
  merchant_extra?: string
  [key: string]: unknown // For additional merchant_ prefixed fields
}

export interface KhaltiInitiateResponse {
  pidx: string
  payment_url: string
  expires_at: string
  expires_in: number
}

export interface KhaltiLookupRequest {
  pidx: string
}

export interface KhaltiLookupResponse {
  pidx: string
  total_amount: number
  status: KhaltiStatus
  transaction_id: string | null
  fee: number
  refunded: boolean
}

export interface KhaltiErrorResponse {
  error_key?: string
  detail?: string
  status_code?: number
  [key: string]: string[] | string | number | undefined
}

// Callback query parameters received on return_url
export interface KhaltiCallbackParams {
  pidx: string
  txnId?: string
  transaction_id?: string
  amount: string
  total_amount: string
  status: KhaltiStatus
  mobile?: string
  tidx?: string
  purchase_order_id: string
  purchase_order_name: string
}

/**
 * Initiate Khalti ePayment
 * Docs: https://docs.khalti.com/khalti-epayment/#initiating-a-payment-request
 */
export async function initiatePayment(
  request: KhaltiInitiateRequest,
): Promise<{ success: true; data: KhaltiInitiateResponse } | { success: false; error: string }> {
  try {
    const response = await fetch(
      `${KHALTI_CONFIG.BASE_URL}${KHALTI_CONFIG.EPAYMENT_INITIATE_URL}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Key ${KHALTI_CONFIG.SECRET_KEY}`,
        },
        body: JSON.stringify(request),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      const errorData = data as KhaltiErrorResponse
      const errorMessage =
        errorData.detail ||
        Object.values(errorData).flat().join(', ') ||
        'Failed to initiate payment'

      logger.error('Khalti initiate payment failed', {
        status: response.status,
        data: errorData,
      })
      return { success: false, error: errorMessage }
    }

    logger.info('Khalti payment initiated', { pidx: data.pidx })
    return { success: true, data: data as KhaltiInitiateResponse }
  } catch (error) {
    logger.error('Khalti initiate payment error', { error })
    return { success: false, error: 'Network error while initiating payment' }
  }
}

/**
 * Lookup/Verify Khalti Payment Status
 * Docs: https://docs.khalti.com/khalti-epayment/#payment-verification-lookup
 */
export async function lookupPayment(
  request: KhaltiLookupRequest,
): Promise<{ success: true; data: KhaltiLookupResponse } | { success: false; error: string }> {
  try {
    const response = await fetch(`${KHALTI_CONFIG.BASE_URL}${KHALTI_CONFIG.EPAYMENT_LOOKUP_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Key ${KHALTI_CONFIG.SECRET_KEY}`,
      },
      body: JSON.stringify(request),
    })

    const data = await response.json()

    if (!response.ok) {
      const errorData = data as KhaltiErrorResponse
      const errorMessage = errorData.detail || 'Failed to lookup payment'

      logger.error('Khalti lookup failed', { status: response.status, data: errorData })
      return { success: false, error: errorMessage }
    }

    return { success: true, data: data as KhaltiLookupResponse }
  } catch (error) {
    logger.error('Khalti lookup error', { error })
    return { success: false, error: 'Network error while looking up payment' }
  }
}

/**
 * Check if payment status is successful
 * Only 'Completed' status should be treated as success
 */
export function isPaymentSuccessful(status: KhaltiStatus): boolean {
  return status === KHALTI_STATUSES.COMPLETED
}

/**
 * Check if payment status is failed/canceled
 * Canceled, Expired, Failed must be treated as failed
 */
export function isPaymentFailed(status: KhaltiStatus): boolean {
  return (
    status === KHALTI_STATUSES.CANCELED ||
    status === KHALTI_STATUSES.EXPIRED ||
    status === KHALTI_STATUSES.REFUNDED
  )
}

/**
 * Parse callback parameters from URL query string
 */
export function parseCallbackParams(searchParams: URLSearchParams): KhaltiCallbackParams {
  return {
    pidx: searchParams.get('pidx') || '',
    txnId: searchParams.get('txnId') || undefined,
    transaction_id: searchParams.get('transaction_id') || undefined,
    amount: searchParams.get('amount') || '0',
    total_amount: searchParams.get('total_amount') || '0',
    status: (searchParams.get('status') as KhaltiStatus) || KHALTI_STATUSES.CANCELED,
    mobile: searchParams.get('mobile') || undefined,
    tidx: searchParams.get('tidx') || undefined,
    purchase_order_id: searchParams.get('purchase_order_id') || '',
    purchase_order_name: searchParams.get('purchase_order_name') || '',
  }
}
