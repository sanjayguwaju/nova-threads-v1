'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// Khalti callback status types
type PaymentStatus = 'loading' | 'success' | 'failure' | 'pending'

export default function KhaltiCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<PaymentStatus>('loading')
  const [message, setMessage] = useState('Verifying your payment...')

  // Get callback parameters from URL
  const pidx = searchParams.get('pidx')
  const orderId = searchParams.get('orderId')
  const statusParam = searchParams.get('status')
  const transactionId = searchParams.get('transaction_id') || searchParams.get('txnId')
  const mobile = searchParams.get('mobile')
  const totalAmount = searchParams.get('total_amount')

  useEffect(() => {
    if (!orderId || !pidx) {
      setStatus('failure')
      setMessage('Invalid callback: Missing order information')
      return
    }

    // If status is already provided in callback, use it for immediate feedback
    if (statusParam === 'Completed') {
      // Payment was successful, verify with backend
      verifyPayment()
    } else if (statusParam === 'User canceled' || statusParam === 'Canceled') {
      setStatus('failure')
      setMessage('Payment was cancelled. Please try again.')
      // Update order status to failed
      handleFailedPayment()
    } else if (statusParam === 'Expired') {
      setStatus('failure')
      setMessage('Payment link has expired. Please try again.')
      handleFailedPayment()
    } else {
      // Pending or unknown status - check with lookup API
      verifyPayment()
    }
  }, [orderId, pidx, statusParam, router])

  async function verifyPayment() {
    try {
      const response = await fetch('/api/payments/khalti/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pidx, orderId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('failure')
        setMessage(data.error || 'Failed to verify payment')
        return
      }

      // Check the payment status from lookup
      if (data.status === 'Completed') {
        setStatus('success')
        setMessage('Payment successful! Thank you for your order.')

        // Redirect to success page after a delay
        setTimeout(() => {
          router.push(`/checkout/success?order=${orderId}`)
        }, 3000)
      } else if (data.status === 'User canceled' || data.status === 'Expired') {
        setStatus('failure')
        setMessage(
          data.status === 'User canceled'
            ? 'Payment was cancelled. Please try again.'
            : 'Payment link has expired. Please try again.'
        )

        setTimeout(() => {
          router.push('/checkout')
        }, 5000)
      } else {
        // Pending, Initiated, or other status
        setStatus('pending')
        setMessage('Payment is being processed. You will receive an email confirmation shortly.')

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

  async function handleFailedPayment() {
    // Update order status on backend
    try {
      await fetch('/api/payments/khalti/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pidx, orderId }),
      })
    } catch (error) {
      console.error('Failed to update order status', error)
    }

    // Redirect after delay
    setTimeout(() => {
      router.push('/checkout')
    }, 5000)
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

        {transactionId && status === 'success' && (
          <div className="text-sm text-stone mb-6">
            Transaction ID: <span className="font-mono">{transactionId}</span>
          </div>
        )}

        {mobile && status === 'success' && (
          <div className="text-sm text-stone mb-6">
            Paid via: <span className="font-mono">{mobile}</span>
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
