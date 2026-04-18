'use client'
import Link from 'next/link'
import { useState } from 'react'
import { forgotPassword } from '@/lib/payload/actions/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="max-w-[440px] mx-auto px-24 py-80">
      <h1 className="font-display text-[40px] text-center mb-16">Reset Password</h1>
      {sent ? (
        <p className="text-center text-stone">If an account exists, a reset link has been sent.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-20">
          <p className="text-stone text-center text-[14px]">
            Enter your email to receive reset instructions.
          </p>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending…' : 'Send Reset Link'}
          </Button>
        </form>
      )}
      <div className="text-center mt-24">
        <Link
          href="/auth/login"
          className="font-mono text-[11px] uppercase tracking-widest underline"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}
