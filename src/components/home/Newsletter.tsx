'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <section className="py-64">
      <div className="max-w-[640px] mx-auto px-24 text-center">
        <h2 className="font-display text-[40px]">Join the studio</h2>
        <p className="text-stone mt-12">Essays, previews, and 10% off your first order.</p>
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true) }}
          className="mt-24 flex gap-8 items-end"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-transparent border-b border-ink py-12 text-[16px] focus:outline-none"
          />
          <Button type="submit" variant="primary">{sent ? 'Thanks' : 'Subscribe'}</Button>
        </form>
        <p className="mt-12 text-[11px] text-stone">We'll never share your email. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
