'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'

type AuthView = 'login' | 'signup' | 'forgot'

export function AuthModal() {
  const { authOpen, closeAuth } = useUIStore()
  const [view, setView] = useState<AuthView>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    // For demo, just close the modal
    closeAuth()
  }

  const switchView = (newView: AuthView) => {
    setView(newView)
    setShowPassword(false)
    setPassword('')
  }

  return (
    <AnimatePresence>
      {authOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={closeAuth}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[var(--color-nt-white)] z-[101] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-nt-light-gray)]">
              <h2 className="text-[18px] font-semibold text-[var(--color-nt-black)]">
                {view === 'login' && 'Login'}
                {view === 'signup' && 'Create Account'}
                {view === 'forgot' && 'Reset Password'}
              </h2>
              <button
                onClick={closeAuth}
                aria-label="Close"
                className="cursor-pointer text-[var(--color-nt-black)] hover:opacity-60 transition-opacity duration-150 p-2"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <AnimatePresence mode="wait">
                {view === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-[13px] font-medium text-[var(--color-nt-black)] mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                          required
                          className="w-full h-[48px] px-4 border border-[var(--color-nt-light-gray)] text-[14px] text-[var(--color-nt-black)] placeholder:text-[var(--color-nt-mid-gray)] focus:outline-none focus:border-[var(--color-nt-black)] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-[var(--color-nt-black)] mb-2">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full h-[48px] px-4 pr-12 border border-[var(--color-nt-light-gray)] text-[14px] text-[var(--color-nt-black)] placeholder:text-[var(--color-nt-mid-gray)] focus:outline-none focus:border-[var(--color-nt-black)] transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-black)] transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                          'w-full h-[48px] bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[13px] font-semibold uppercase tracking-wider hover:bg-[var(--color-nt-charcoal)] transition-colors duration-200 cursor-pointer flex items-center justify-center',
                          loading && 'opacity-70 cursor-not-allowed'
                        )}
                      >
                        {loading ? (
                          <Loader2 size={20} strokeWidth={1.5} className="animate-spin" />
                        ) : (
                          'Log In'
                        )}
                      </button>
                    </form>

                    <div className="mt-6 text-center">
                      <button
                        onClick={() => switchView('forgot')}
                        className="text-[14px] text-[var(--color-nt-black)] underline hover:no-underline transition-all cursor-pointer"
                      >
                        Forgot your password?
                      </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[var(--color-nt-light-gray)]">
                      <button
                        onClick={() => switchView('signup')}
                        className="w-full h-[48px] border border-[var(--color-nt-black)] text-[var(--color-nt-black)] text-[13px] font-semibold uppercase tracking-wider hover:bg-[var(--color-nt-black)] hover:text-[var(--color-nt-white)] transition-colors duration-200 cursor-pointer"
                      >
                        Create Account
                      </button>
                    </div>
                  </motion.div>
                )}

                {view === 'signup' && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-[var(--color-nt-black)] mb-2">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                            required
                            className="w-full h-[48px] px-4 border border-[var(--color-nt-light-gray)] text-[14px] text-[var(--color-nt-black)] placeholder:text-[var(--color-nt-mid-gray)] focus:outline-none focus:border-[var(--color-nt-black)] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-[var(--color-nt-black)] mb-2">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                            required
                            className="w-full h-[48px] px-4 border border-[var(--color-nt-light-gray)] text-[14px] text-[var(--color-nt-black)] placeholder:text-[var(--color-nt-mid-gray)] focus:outline-none focus:border-[var(--color-nt-black)] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-[var(--color-nt-black)] mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                          required
                          className="w-full h-[48px] px-4 border border-[var(--color-nt-light-gray)] text-[14px] text-[var(--color-nt-black)] placeholder:text-[var(--color-nt-mid-gray)] focus:outline-none focus:border-[var(--color-nt-black)] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-[var(--color-nt-black)] mb-2">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full h-[48px] px-4 pr-12 border border-[var(--color-nt-light-gray)] text-[14px] text-[var(--color-nt-black)] placeholder:text-[var(--color-nt-mid-gray)] focus:outline-none focus:border-[var(--color-nt-black)] transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-black)] transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                          </button>
                        </div>
                        <p className="mt-1.5 text-[11px] text-[var(--color-nt-mid-gray)]">
                          Must be at least 8 characters with 1 uppercase, 1 number, and 1 special character.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                          'w-full h-[48px] bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[13px] font-semibold uppercase tracking-wider hover:bg-[var(--color-nt-charcoal)] transition-colors duration-200 cursor-pointer flex items-center justify-center',
                          loading && 'opacity-70 cursor-not-allowed'
                        )}
                      >
                        {loading ? (
                          <Loader2 size={20} strokeWidth={1.5} className="animate-spin" />
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[var(--color-nt-light-gray)] text-center">
                      <p className="text-[13px] text-[var(--color-nt-mid-gray)] mb-4">
                        Already have an account?
                      </p>
                      <button
                        onClick={() => switchView('login')}
                        className="w-full h-[48px] border border-[var(--color-nt-black)] text-[var(--color-nt-black)] text-[13px] font-semibold uppercase tracking-wider hover:bg-[var(--color-nt-black)] hover:text-[var(--color-nt-white)] transition-colors duration-200 cursor-pointer"
                      >
                        Log In
                      </button>
                    </div>
                  </motion.div>
                )}

                {view === 'forgot' && (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[14px] text-[var(--color-nt-mid-gray)] mb-5">
                      Enter your email address and we&apos;ll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-[13px] font-medium text-[var(--color-nt-black)] mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                          required
                          className="w-full h-[48px] px-4 border border-[var(--color-nt-light-gray)] text-[14px] text-[var(--color-nt-black)] placeholder:text-[var(--color-nt-mid-gray)] focus:outline-none focus:border-[var(--color-nt-black)] transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                          'w-full h-[48px] bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[13px] font-semibold uppercase tracking-wider hover:bg-[var(--color-nt-charcoal)] transition-colors duration-200 cursor-pointer flex items-center justify-center',
                          loading && 'opacity-70 cursor-not-allowed'
                        )}
                      >
                        {loading ? (
                          <Loader2 size={20} strokeWidth={1.5} className="animate-spin" />
                        ) : (
                          'Send Reset Link'
                        )}
                      </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[var(--color-nt-light-gray)] text-center">
                      <button
                        onClick={() => switchView('login')}
                        className="text-[14px] text-[var(--color-nt-black)] underline hover:no-underline transition-all cursor-pointer"
                      >
                        Back to Login
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
