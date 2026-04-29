'use client'

/**
 * Client-side utilities for Khalti payment
 */

/**
 * Redirect user to Khalti payment page
 * @param paymentUrl - The payment_url received from initiate API
 */
export function redirectToKhalti(paymentUrl: string): void {
  if (!paymentUrl) {
    console.error('Khalti payment URL is empty')
    return
  }

  // Redirect to Khalti payment page
  window.location.href = paymentUrl
}

/**
 * Open Khalti payment in a popup window
 * Useful for iframe or modal-based checkout experiences
 * @param paymentUrl - The payment_url received from initiate API
 * @param onClose - Callback when popup is closed
 */
export function openKhaltiPopup(
  paymentUrl: string,
  onClose?: () => void
): Window | null {
  if (!paymentUrl) {
    console.error('Khalti payment URL is empty')
    return null
  }

  const width = 500
  const height = 700
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2

  const popup = window.open(
    paymentUrl,
    'KhaltiPayment',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
  )

  if (onClose && popup) {
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        onClose()
      }
    }, 500)
  }

  return popup
}

/**
 * Detect if user is on mobile device
 * This helps decide between redirect vs popup
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = navigator.userAgent
  return /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(userAgent)
}

/**
 * Get the appropriate payment method for the device
 * - Mobile: Use redirect (better UX for mobile apps)
 * - Desktop: Can use redirect or popup
 */
export function getPaymentMethod(): 'redirect' | 'popup' {
  return isMobileDevice() ? 'redirect' : 'redirect'
}
