'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EsewaCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'failure' | 'pending'>('loading')
  const [message, setMessage] = useState('Verifying your payment...')

  const orderId = searchParams.get('orderId')
  const bookingId = searchParams.get('bookingId')
  const correlationId = searchParams.get('correlationId')

  useEffect(() => {
    if (!orderId) {
      setStatus('failure')
      setMessage('Invalid callback: Order ID missing')
      return
    }

    // If we have all params, check status
    if (bookingId && correlationId) {
      checkPaymentStatus()
    } else {
      // Just show generic processing state - webhook will update
      setStatus('pending')
      setMessage('Payment is being processed. You will receive an email confirmation shortly.')

      // Redirect to order page after a delay
      setTimeout(() => {
        router.push(`/account/orders/${orderId}`)
      }, 5000)
    }
  }, [orderId, bookingId, correlationId, router])

  async function checkPaymentStatus() {
    try {
      const response = await fetch('/api/payments/esewa/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, bookingId, correlationId }),
      })

      const data = await response.json()

      if (data.status === 'SUCCESS') {
        setStatus('success')
        setMessage('Payment successful! Thank you for your order.')

        // Redirect to success page after a delay
        setTimeout(() => {
          router.push(`/checkout/success?orderId=${orderId}`)
        }, 3000)
      } else if (data.status === 'FAILED' || data.status === 'CANCELED') {
        setStatus('failure')
        setMessage('Payment failed or was cancelled. Please try again.')

        setTimeout(() => {
          router.push('/checkout')
        }, 5000)
      } else {
        setStatus('pending')
        setMessage('Payment is still being processed. Please check your order status in your account.')

        setTimeout(() => {
          router.push(`/account/orders/${orderId}`)
        }, 5000)
      }
    } catch (error) {
      setStatus('pending')
      setMessage('Could not verify payment status. Please check your order status in your account.')

      setTimeout(() => {
        router.push(`/account/orders/${orderId}`)
      }, 5000)
    }
  }

  const statusConfig = {
    loading: { icon: '⏳', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    success: { icon: '✅', color: 'text-green-600', bg: 'bg-green-50' },
    failure: { icon: '❌', color: 'text-red-600', bg: 'bg-red-50' },
    pending: { icon: '⏳', color: 'text-blue-600', bg: 'bg-blue-50' },
  }

  const config = statusConfig[status]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`max-w-md w-full ${config.bg} border border-stone/20 p-8 rounded-lg text-center`}>
        <div className="text-6xl mb-4">{config.icon}</div>
        <h1 className={`font-display text-2xl mb-4 ${config.color}`}>
          {status === 'loading' && 'Processing Payment'}
          {status === 'success' && 'Payment Successful!'}
          {status === 'failure' && 'Payment Failed'}
          {status === 'pending' && 'Payment Processing'}
        </h1>
        <p className="text-stone mb-6">{message}</p>

        {orderId && (
          <div className="text-sm text-stone mb-6">
            Order ID: <span className="font-mono">{orderId}</span>
          </div>
        )}

        <div className="space-y-3">
          {status === 'success' && (
            <>
              <Link
                href={`/account/orders/${orderId}`}
                className="block w-full py-3 bg-ink text-cream text-center uppercase font-mono text-[12px] tracking-widest hover:bg-stone transition-colors"
              >
                View Order
              </Link>
              <Link
                href="/products"
                className="block w-full py-3 border border-ink text-ink text-center uppercase font-mono text-[12px] tracking-widest hover:bg-cream transition-colors"
              >
                Continue Shopping
              </Link>
            </>
          )}

          {status === 'failure' && (
            <>
              <Link
                href="/checkout"
                className="block w-full py-3 bg-ink text-cream text-center uppercase font-mono text-[12px] tracking-widest hover:bg-stone transition-colors"
              >
                Try Again
              </Link>
              <Link
                href="/contact"
                className="block w-full py-3 border border-ink text-ink text-center uppercase font-mono text-[12px] tracking-widest hover:bg-cream transition-colors"
              >
                Contact Support
              </Link>
            </>
          )}

          {(status === 'pending' || status === 'loading') && (
            <Link
              href={`/account/orders/${orderId}`}
              className="block w-full py-3 bg-ink text-cream text-center uppercase font-mono text-[12px] tracking-widest hover:bg-stone transition-colors"
            >
              Check Order Status
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
