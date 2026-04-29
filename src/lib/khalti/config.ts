// Khalti Payment Gateway Configuration
// Docs: https://docs.khalti.com/

export const KHALTI_CONFIG = {
  // API Base URLs
  BASE_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://khalti.com/api/v2'
      : 'https://dev.khalti.com/api/v2',

  // ePayment Endpoints
  EPAYMENT_INITIATE_URL: '/epayment/initiate/',
  EPAYMENT_LOOKUP_URL: '/epayment/lookup/',

  // Secret Key for authorization
  // Format: "Key <LIVE_SECRET_KEY>"
  SECRET_KEY:
    process.env.NODE_ENV === 'production'
      ? (process.env.KHALTI_SECRET_KEY ?? '')
      : (process.env.KHALTI_SECRET_KEY || '05bf95cc57244045b8df5fad06748dab'),
}

// Transaction Statuses from Khalti
export const KHALTI_STATUSES = {
  COMPLETED: 'Completed',
  PENDING: 'Pending',
  INITIATED: 'Initiated',
  REFUNDED: 'Refunded',
  EXPIRED: 'Expired',
  CANCELED: 'User canceled',
  PARTIALLY_REFUNDED: 'Partially Refunded',
} as const

export type KhaltiStatus = (typeof KHALTI_STATUSES)[keyof typeof KHALTI_STATUSES]

// Status codes for API responses
export const KHALTI_RESPONSE_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
} as const
