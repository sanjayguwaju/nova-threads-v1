'use client'

import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')
  }
  return stripePromise
}

export const SHIPPING_RATES = [
  { id: 'standard', label: 'Standard', eta: '5–7 business days', price: 7.99, freeOver: 150 },
  { id: 'express', label: 'Express', eta: '2–3 business days', price: 14.99 },
  { id: 'overnight', label: 'Overnight', eta: 'Next business day', price: 24.99 },
] as const
