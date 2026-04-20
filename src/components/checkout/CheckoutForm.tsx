'use client'
import { useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { AddressForm, Address } from './AddressForm'
import { OrderSummary } from './OrderSummary'
import { getStripe, SHIPPING_RATES } from '@/lib/stripe/helpers'
import { createPaymentIntent, createOrderFromIntent } from '@/lib/payload/actions/checkout'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { cn } from '@/lib/utils/cn'
import { Input } from '@/components/ui/Input'

type Step = 1 | 2 | 3

export function CheckoutForm({ user }: { user: any }) {
  const [step, setStep] = useState<Step>(1)
  const [email, setEmail] = useState(user?.email || '')
  const [shipping, setShipping] = useState<Address | null>(null)
  const [billingSame, setBillingSame] = useState(true)
  const [billing, setBilling] = useState<Address | null>(null)
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>(
    SHIPPING_RATES[0].id,
  )
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  const { items, getSubtotal, getDiscount, coupon } = useCartStore()
  const subtotal = getSubtotal()
  const rate = SHIPPING_RATES.find((r) => r.id === shippingMethod)!
  const shippingCost =
    'freeOver' in rate && rate.freeOver && subtotal >= rate.freeOver ? 0 : rate.price

  const goToPayment = async () => {
    const snapshot = items.map((i) => ({
      productId: i.productId,
      variantSku: i.variantSku,
      variantLabel: i.variantLabel,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    }))
    const result = await createPaymentIntent(snapshot, shippingCost, getDiscount())
    setClientSecret(result.clientSecret)
    setPaymentIntentId(result.paymentIntentId)
    setStep(3)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-48">
      <div>
        <StepIndicator step={step} />
        {step === 1 && (
          <div className="space-y-24">
            <h2 className="font-display text-[32px]">Contact & Address</h2>
            {!user && (
              <div className="space-y-1">
                <label className="block text-[13px] font-medium text-[var(--color-nt-black)]">
                  Email *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}
            <AddressForm
              onSubmit={(addr) => {
                setShipping(addr)
                setStep(2)
              }}
              defaults={user?.addresses?.[0]}
            />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-24">
            <h2 className="font-display text-[32px]">Shipping Method</h2>
            <div className="space-y-12">
              {SHIPPING_RATES.map((r) => {
                const actualPrice =
                  'freeOver' in r && r.freeOver && subtotal >= r.freeOver ? 0 : r.price
                return (
                  <label
                    key={r.id}
                    className={cn(
                      'flex items-center justify-between border p-20 cursor-pointer',
                      shippingMethod === r.id ? 'border-ink' : 'border-stone/30',
                    )}
                  >
                    <div className="flex items-center gap-16">
                      <input
                        type="radio"
                        checked={shippingMethod === r.id}
                        onChange={() => setShippingMethod(r.id)}
                      />
                      <div>
                        <div className="font-mono text-[12px] uppercase tracking-widest">
                          {r.label}
                        </div>
                        <div className="text-stone text-[13px]">{r.eta}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[14px]">
                      {actualPrice === 0 ? 'Free' : formatCurrency(actualPrice)}
                    </span>
                  </label>
                )
              })}
            </div>
            <div className="flex gap-12">
              <button
                onClick={() => setStep(1)}
                className="font-mono text-[11px] uppercase tracking-widest underline"
              >
                Back
              </button>
              <button
                onClick={goToPayment}
                className="flex-1 bg-ink text-paper font-mono text-[12px] uppercase tracking-widest py-14 hover:bg-noir"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}
        {step === 3 && clientSecret && (
          <div className="space-y-24">
            <h2 className="font-display text-[32px]">Payment</h2>
            <label className="flex items-center gap-8 text-[14px]">
              <input
                type="checkbox"
                checked={billingSame}
                onChange={(e) => setBillingSame(e.target.checked)}
              />
              Billing address same as shipping
            </label>
            {!billingSame && <AddressForm onSubmit={setBilling} />}
            <Elements
              stripe={getStripe()}
              options={{ clientSecret, appearance: { theme: 'stripe' } }}
            >
              <PaymentStep
                paymentIntentId={paymentIntentId!}
                email={email}
                shipping={shipping!}
                billing={billingSame ? shipping! : billing!}
                shippingCost={shippingCost}
              />
            </Elements>
          </div>
        )}
      </div>
      <OrderSummary shippingCost={shippingCost} />
    </div>
  )
}

function StepIndicator({ step }: { step: Step }) {
  const labels = ['Address', 'Shipping', 'Payment']
  return (
    <div className="flex gap-16 mb-32 font-mono text-[11px] uppercase tracking-widest">
      {labels.map((l, i) => (
        <div
          key={l}
          className={cn('flex items-center gap-8', i + 1 <= step ? 'text-ink' : 'text-stone/50')}
        >
          <span
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center border',
              i + 1 <= step ? 'bg-ink text-paper border-ink' : 'border-stone/50',
            )}
          >
            {i + 1}
          </span>
          {l}
        </div>
      ))}
    </div>
  )
}

function PaymentStep({ paymentIntentId, email, shipping, billing, shippingCost }: any) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { items, coupon, clearCart } = useCartStore()
  const { pushToast } = useUIStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    setError(null)

    const { error: submitErr } = await elements.submit()
    if (submitErr) {
      setError(submitErr.message || 'Error')
      setSubmitting(false)
      return
    }

    const { error: payErr } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    })

    if (payErr) {
      setError(payErr.message || 'Payment failed')
      setSubmitting(false)
      return
    }

    // Create order
    const snapshot = items.map((i) => ({
      productId: i.productId,
      variantSku: i.variantSku,
      variantLabel: i.variantLabel,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    }))
    const order = await createOrderFromIntent(paymentIntentId, {
      items: snapshot,
      shippingAddress: shipping,
      billingAddress: billing,
      guestEmail: email,
      shipping: shippingCost,
      discount: coupon?.discount || 0,
      couponCode: coupon?.code,
    })

    clearCart()
    pushToast({ type: 'success', message: 'Order placed' })
    router.push(`/checkout/success?order=${order.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-20">
      <PaymentElement />
      {error && <div className="text-signal text-[13px]">{error}</div>}
      <button
        disabled={submitting}
        className="w-full bg-ink text-paper font-mono text-[12px] uppercase tracking-widest py-16 hover:bg-noir disabled:opacity-50"
      >
        {submitting ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  )
}
