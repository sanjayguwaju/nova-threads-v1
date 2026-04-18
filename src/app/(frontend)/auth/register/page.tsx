'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register } from '@/lib/payload/actions/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function RegisterPage() {
  const router = useRouter()
  const [data, setData] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, [k]: e.target.value })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (data.password !== data.confirm) { setError('Passwords do not match'); return }
    if (!agreed) { setError('Please accept the terms'); return }
    setLoading(true)
    try {
      await register({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password })
      router.push('/account')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[440px] mx-auto px-24 py-80">
      <h1 className="font-display text-[40px] text-center mb-32">Create Account</h1>
      <form onSubmit={onSubmit} className="space-y-20">
        <div className="grid grid-cols-2 gap-16">
          <Input label="First Name" value={data.firstName} onChange={update('firstName')} required />
          <Input label="Last Name" value={data.lastName} onChange={update('lastName')} required />
        </div>
        <Input label="Email" type="email" value={data.email} onChange={update('email')} required />
        <Input label="Password" type="password" value={data.password} onChange={update('password')} required minLength={8} />
        <Input label="Confirm Password" type="password" value={data.confirm} onChange={update('confirm')} required />
        <label className="flex items-start gap-8 text-[13px]">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-4" />
          <span className="text-stone">I agree to the <Link href="/legal/terms" className="underline">Terms</Link> and <Link href="/legal/privacy" className="underline">Privacy Policy</Link>.</span>
        </label>
        {error && <div className="text-signal text-[13px]">{error}</div>}
        <Button type="submit" full disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</Button>
      </form>
      <div className="text-center mt-24 font-mono text-[11px] uppercase tracking-widest">
        <Link href="/auth/login" className="text-stone hover:text-ink">Already have an account? Sign in</Link>
      </div>
    </div>
  )
}
