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
import { redirectToEsewa, detectEnvironment } from '@/lib/esewa/client'
import { redirectToKhalti } from '@/lib/khalti/client'
import type { User } from '@/payload-types'

type Step = 1 | 2 | 2.5 | 3
type PaymentMethod = 'stripe' | 'esewa' | 'khalti'

interface CheckoutFormProps {
  user: User | null
}

export function CheckoutForm({ user }: CheckoutFormProps) {
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe')
  const [esewaLoading, setEsewaLoading] = useState(false)
  const [khaltiLoading, setKhaltiLoading] = useState(false)

  const { items, getSubtotal, getDiscount, coupon, clearCart } = useCartStore()
  const { pushToast } = useUIStore()
  const router = useRouter()
  const subtotal = getSubtotal()
  const rate = SHIPPING_RATES.find((r) => r.id === shippingMethod)!
  const shippingCost =
    'freeOver' in rate && rate.freeOver && subtotal >= rate.freeOver ? 0 : rate.price

  const goToPayment = async () => {
    if (paymentMethod === 'stripe') {
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
    }
    // For eSewa and Khalti, go to step 3 (same UI pattern)
    setStep(3)
  }

  const initiateEsewaPayment = async () => {
    setEsewaLoading(true)
    try {
      const snapshot = items.map((i) => ({
        productId: i.productId,
        variantSku: i.variantSku,
        variantLabel: i.variantLabel,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      }))

      const response = await fetch('/api/payments/esewa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: snapshot,
          shippingCost,
          discount: getDiscount(),
          shippingAddress: shipping,
          billingAddress: billingSame ? shipping : billing,
          guestEmail: !user ? email : undefined,
          couponCode: coupon?.code,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        pushToast({ type: 'error', message: data.error || 'Failed to initiate eSewa payment' })
        return
      }

      // Redirect to eSewa
      const env = detectEnvironment()
      redirectToEsewa(data.bookingId, data.deeplink, { environment: env })
    } catch (err) {
      pushToast({ type: 'error', message: 'Failed to initiate payment' })
    } finally {
      setEsewaLoading(false)
    }
  }

  const initiateKhaltiPayment = async () => {
    setKhaltiLoading(true)
    try {
      const snapshot = items.map((i) => ({
        productId: i.productId,
        variantSku: i.variantSku,
        variantLabel: i.variantLabel,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      }))

      const response = await fetch('/api/payments/khalti/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: snapshot,
          shippingCost,
          discount: getDiscount(),
          shippingAddress: shipping,
          billingAddress: billingSame ? shipping : billing,
          guestEmail: !user ? email : undefined,
          couponCode: coupon?.code,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        pushToast({ type: 'error', message: data.error || 'Failed to initiate Khalti payment' })
        return
      }

      // Redirect to Khalti
      redirectToKhalti(data.paymentUrl)
    } catch (err) {
      pushToast({ type: 'error', message: 'Failed to initiate payment' })
    } finally {
      setKhaltiLoading(false)
    }
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
              defaults={
                user?.addresses?.[0]
                  ? {
                      firstName: user.addresses[0].firstName || '',
                      lastName: user.addresses[0].lastName || '',
                      line1: user.addresses[0].line1 || '',
                      line2: user.addresses[0].line2 || undefined,
                      city: user.addresses[0].city || '',
                      state: user.addresses[0].state || '',
                      zip: user.addresses[0].zip || '',
                      country: user.addresses[0].country || '',
                      phone: user?.phone || '',
                    }
                  : undefined
              }
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

            {/* Payment Method Selector */}
            <div className="space-y-16 pt-16 border-t border-stone/20">
              <h3 className="font-display text-[24px]">Payment Method</h3>
              <div className="space-y-12">
                <label
                  className={cn(
                    'flex items-center gap-16 border p-20 cursor-pointer',
                    paymentMethod === 'stripe' ? 'border-ink' : 'border-stone/30',
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'stripe'}
                    onChange={() => setPaymentMethod('stripe')}
                  />
                  <div className="flex items-center gap-12">
                    <div className="w-40 h-24 bg-[#635BFF] rounded flex items-center justify-center text-white font-bold text-[10px]">
                      Stripe
                    </div>
                    <div>
                      <div className="font-mono text-[12px] uppercase tracking-widest">
                        Credit/Debit Card
                      </div>
                      <div className="text-stone text-[13px]">Visa, Mastercard, etc.</div>
                    </div>
                  </div>
                </label>

                <label
                  className={cn(
                    'flex items-center gap-16 border p-20 cursor-pointer',
                    paymentMethod === 'esewa' ? 'border-ink' : 'border-stone/30',
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'esewa'}
                    onChange={() => setPaymentMethod('esewa')}
                  />
                  <div className="flex items-center gap-12">
                    <div className="w-40 h-24 bg-[#60BB46] rounded flex items-center justify-center text-white font-bold text-[10px]">
                      eSewa
                    </div>
                    <div>
                      <div className="font-mono text-[12px] uppercase tracking-widest">
                        eSewa Wallet
                      </div>
                      <div className="text-stone text-[13px]">
                        Nepal&apos;s leading digital wallet
                      </div>
                    </div>
                  </div>
                </label>

                <label
                  className={cn(
                    'flex items-center gap-16 border p-20 cursor-pointer',
                    paymentMethod === 'khalti' ? 'border-ink' : 'border-stone/30',
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'khalti'}
                    onChange={() => setPaymentMethod('khalti')}
                  />
                  <div className="flex items-center gap-12">
                    <div className="w-40 h-24 bg-[#5C2D91] rounded flex items-center justify-center text-white font-bold text-[10px]">
                      Khalti
                    </div>
                    <div>
                      <div className="font-mono text-[12px] uppercase tracking-widest">
                        Khalti Wallet
                      </div>
                      <div className="text-stone text-[13px]">
                        Nepal&apos;s digital payment solution
                      </div>
                    </div>
                  </div>
                </label>
              </div>
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
        {step === 2.5 && paymentMethod === 'khalti' && (
          <div className="space-y-24">
            <h2 className="font-display text-[32px]">Confirm Payment</h2>
            <KhaltiPaymentStep
              shipping={shipping!}
              billingSame={billingSame}
              setBillingSame={setBillingSame}
              billing={billing}
              setBilling={setBilling}
              initiatePayment={initiateKhaltiPayment}
              loading={khaltiLoading}
              onBack={() => setStep(2)}
            />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-24">
            <h2 className="font-display text-[32px]">Payment</h2>

            {paymentMethod === 'stripe' && clientSecret ? (
              <>
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
              </>
            ) : paymentMethod === 'esewa' ? (
              <EsewaPaymentStep
                shipping={shipping!}
                billingSame={billingSame}
                setBillingSame={setBillingSame}
                billing={billing}
                setBilling={setBilling}
                initiatePayment={initiateEsewaPayment}
                loading={esewaLoading}
                onBack={() => setStep(2)}
              />
            ) : paymentMethod === 'khalti' ? (
              <KhaltiPaymentStep
                shipping={shipping!}
                billingSame={billingSame}
                setBillingSame={setBillingSame}
                billing={billing}
                setBilling={setBilling}
                initiatePayment={initiateKhaltiPayment}
                loading={khaltiLoading}
                onBack={() => setStep(2)}
              />
            ) : (
              <div className="text-signal">Error: Payment method not configured</div>
            )}
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

interface EsewaPaymentStepProps {
  shipping: Address
  billingSame: boolean
  setBillingSame: (value: boolean) => void
  billing: Address | null
  setBilling: (addr: Address) => void
  initiatePayment: () => void
  loading: boolean
  onBack: () => void
}

function EsewaPaymentStep({
  shipping,
  billingSame,
  setBillingSame,
  billing,
  setBilling,
  initiatePayment,
  loading,
  onBack,
}: EsewaPaymentStepProps) {
  return (
    <div className="space-y-24">
      <div className="bg-[#60BB46]/10 border border-[#60BB46] p-20 rounded">
        <div className="flex items-center gap-12 mb-12">
          <div className="w-40 h-24 bg-[#60BB46] rounded flex items-center justify-center text-white font-bold text-[10px]">
            eSewa
          </div>
          <div>
            <div className="font-mono text-[12px] uppercase tracking-widest text-[#60BB46]">
              Pay with eSewa
            </div>
            <div className="text-stone text-[13px]">Nepal&apos;s leading digital wallet</div>
          </div>
        </div>
        <p className="text-[13px] text-stone">
          You will be redirected to the eSewa app or website to complete your payment securely.
          After payment, you&apos;ll return to our site.
        </p>
      </div>

      <label className="flex items-center gap-8 text-[14px]">
        <input
          type="checkbox"
          checked={billingSame}
          onChange={(e) => setBillingSame(e.target.checked)}
        />
        Billing address same as shipping
      </label>

      {!billingSame && <AddressForm onSubmit={setBilling} />}

      <div className="flex gap-12">
        <button
          onClick={onBack}
          className="font-mono text-[11px] uppercase tracking-widest underline"
          disabled={loading}
        >
          Back
        </button>
        <button
          onClick={initiatePayment}
          disabled={loading}
          className="flex-1 bg-[#60BB46] text-white font-mono text-[12px] uppercase tracking-widest py-16 hover:bg-[#4a9a36] disabled:opacity-50 flex items-center justify-center gap-8"
        >
          {loading ? (
            <>
              <span className="animate-spin">⟳</span>
              Processing...
            </>
          ) : (
            <>
              <span>Pay with eSewa</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

interface KhaltiPaymentStepProps {
  shipping: Address
  billingSame: boolean
  setBillingSame: (value: boolean) => void
  billing: Address | null
  setBilling: (addr: Address) => void
  initiatePayment: () => void
  loading: boolean
  onBack: () => void
}

function KhaltiPaymentStep({
  shipping,
  billingSame,
  setBillingSame,
  billing,
  setBilling,
  initiatePayment,
  loading,
  onBack,
}: KhaltiPaymentStepProps) {
  return (
    <div className="space-y-24">
      <div className="bg-[#5C2D91]/10 border border-[#5C2D91] p-20 rounded">
        <div className="flex items-center gap-12 mb-12">
          <div className="w-40 h-24 bg-[#5C2D91] rounded flex items-center justify-center text-white font-bold text-[10px]">
            Khalti
          </div>
          <div>
            <div className="font-mono text-[12px] uppercase tracking-widest text-[#5C2D91]">
              Pay with Khalti
            </div>
            <div className="text-stone text-[13px]">Nepal&apos;s digital payment solution</div>
          </div>
        </div>
        <p className="text-[13px] text-stone">
          You will be redirected to the Khalti payment portal to complete your payment securely.
          After payment, you&apos;ll return to our site.
        </p>
      </div>

      <label className="flex items-center gap-8 text-[14px]">
        <input
          type="checkbox"
          checked={billingSame}
          onChange={(e) => setBillingSame(e.target.checked)}
        />
        Billing address same as shipping
      </label>

      {!billingSame && <AddressForm onSubmit={setBilling} />}

      <div className="flex gap-12">
        <button
          onClick={onBack}
          className="font-mono text-[11px] uppercase tracking-widest underline"
          disabled={loading}
        >
          Back
        </button>
        <button
          onClick={initiatePayment}
          disabled={loading}
          className="flex-1 bg-[#5C2D91] text-white font-mono text-[12px] uppercase tracking-widest py-16 hover:bg-[#4a2175] disabled:opacity-50 flex items-center justify-center gap-8"
        >
          {loading ? (
            <>
              <span className="animate-spin">⟳</span>
              Processing...
            </>
          ) : (
            <>
              <span>Pay with Khalti</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
