'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/payload/actions/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(email, password)
      router.push('/account')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[440px] mx-auto px-24 py-80">
      <h1 className="font-display text-[40px] text-center mb-32">Sign In</h1>
      <form onSubmit={onSubmit} className="space-y-20">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="text-signal text-[13px]">{error}</div>}
        <Button type="submit" full disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</Button>
      </form>
      <div className="flex justify-between mt-24 font-mono text-[11px] uppercase tracking-widest">
        <Link href="/auth/forgot-password" className="text-stone hover:text-ink">Forgot password</Link>
        <Link href="/auth/register" className="text-stone hover:text-ink">Create account</Link>
      </div>
    </div>
  )
}
