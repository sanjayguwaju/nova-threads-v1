'use client'

import { ESEWA_CONFIG } from './config'

/**
 * Detect user environment for payment routing
 * Returns: 'mobile' | 'web' | 'flutter'
 */
export function detectEnvironment(): 'mobile' | 'web' | 'flutter' {
  if (typeof window === 'undefined') return 'web'

  const userAgent = navigator.userAgent

  // Detect Flutter WebView
  const isFlutterWebView = /wv|Flutter/i.test(userAgent)
  if (isFlutterWebView) return 'flutter'

  // Detect Mobile Browser
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)
  const isTouchDevice = navigator.maxTouchPoints > 0
  const isSmallScreen = window.innerWidth <= 768

  if (isMobileUA && isTouchDevice && isSmallScreen) {
    return 'mobile'
  }

  return 'web'
}

/**
 * Generate deeplink or redirect URL based on environment
 */
export function getPaymentUrl(bookingId: string, deeplink: string, environment?: 'mobile' | 'web' | 'flutter'): string {
  const env = environment || detectEnvironment()

  switch (env) {
    case 'mobile':
      // Return eSewa app deeplink
      return deeplink

    case 'flutter':
      // Handle Flutter separately (return empty or special protocol)
      return ''

    case 'web':
    default:
      // For web, use eSewa ePay web payment
      return `${ESEWA_CONFIG.BASE_URL}/epay/main?tAmt={amount}&amt={amount}&txAmt=0&psc=0&pdc=0&scd=${ESEWA_CONFIG.MERCHANT_ID}&pid={transactionUuid}&su={successUrl}&fu={failureUrl}`
  }
}

/**
 * Redirect or open eSewa payment
 */
export function redirectToEsewa(
  bookingId: string,
  deeplink: string,
  options?: {
    environment?: 'mobile' | 'web' | 'flutter'
    onFlutterCallback?: (bookingId: string) => void
  }
): void {
  const env = options?.environment || detectEnvironment()

  if (env === 'flutter' && options?.onFlutterCallback) {
    // Handle Flutter channel communication
    options.onFlutterCallback(bookingId)
    return
  }

  const url = getPaymentUrl(bookingId, deeplink, env)

  if (env === 'mobile' && url) {
    // For mobile, try to open the eSewa app via deeplink
    // If app is not installed, it will fall back to browser
    window.location.href = url
  } else {
    // For web, redirect to eSewa web payment
    window.location.href = url
  }
}

/**
 * Build ePay web payment URL (fallback for desktop)
 */
export function buildEpayUrl(params: {
  amount: number
  transactionUuid: string
  successUrl: string
  failureUrl: string
}): string {
  const { amount, transactionUuid, successUrl, failureUrl } = params

  const searchParams = new URLSearchParams({
    tAmt: amount.toString(),
    amt: amount.toString(),
    txAmt: '0',
    psc: '0',
    pdc: '0',
    scd: ESEWA_CONFIG.MERCHANT_ID,
    pid: transactionUuid,
    su: successUrl,
    fu: failureUrl,
  })

  return `${ESEWA_CONFIG.BASE_URL}/epay/main?${searchParams.toString()}`
}
