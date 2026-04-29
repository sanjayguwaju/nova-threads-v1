// eSewa Payment Gateway Configuration
// Docs: https://developer.esewa.com.np/

export const ESEWA_CONFIG = {
  // API Base URLs
  BASE_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://checkout.esewa.com.np'
      : 'https://rc-checkout.esewa.com.np',

  // Intent Payment Endpoints
  INTENT_BOOK_URL: '/api/client/intent/payment/book',
  INTENT_STATUS_URL: '/api/client/intent/payment/status',
  INTENT_CANCEL_URL: '/api/client/intent/payment/cancel',

  // Product Code
  PRODUCT_CODE: process.env.ESEWA_PRODUCT_CODE || 'INTENT',

  // Access Key for signature generation
  ACCESS_KEY:
    process.env.NODE_ENV === 'production'
      ? (process.env.ESEWA_ACCESS_KEY ?? '')
      : 'LB0REg8HUSw3MTYrI1s6JTE8Kyc6JyAqJiA3MQ==',

  // Merchant ID / Service Code
  MERCHANT_ID: process.env.ESEWA_MERCHANT_ID || 'EPAYTEST',

  // Deeplink base URL
  DEEPLINK_BASE:
    process.env.NODE_ENV === 'production'
      ? 'https://links.esewa.com.np/pay'
      : 'https://rc-links.esewa.com.np/pay',
}

// Response Codes
export const ESEWA_RESPONSE_CODES = {
  SUCCESS: 'IP-200',
  CANCELLED: 'IP-210',
  BAD_REQUEST: 'IP-400',
  ALREADY_PROCESSED: 'IP-410',
} as const

// Transaction Statuses
export const ESEWA_STATUSES = {
  BOOKED: 'BOOKED',
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED',
  REVERTED: 'REVERTED',
} as const

export type EsewaStatus = (typeof ESEWA_STATUSES)[keyof typeof ESEWA_STATUSES]
