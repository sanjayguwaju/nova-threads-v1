'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsletterBlockProps {
  sectionLabel?: string
  headline?: string
  subheadline?: string
  placeholder?: string
  buttonText?: string
  mobileButtonText?: string
  privacyText?: string
  successHeadline?: string
  successMessage?: string
  trustBadges?: { text: string; id?: string | null }[]
}

export function NewsletterBlock({
  sectionLabel = 'Newsletter',
  headline = 'Join The Studio',
  subheadline = 'Subscribe for exclusive previews, essays on mindful style, and 10% off your first order.',
  placeholder = 'Enter your email address',
  buttonText = 'Join Now',
  mobileButtonText = 'Subscribe',
  privacyText = 'By subscribing, you agree to receive marketing emails. Unsubscribe anytime.',
  successHeadline = 'Welcome to the Studio',
  successMessage = 'Check your inbox for 10% off your first order.',
  trustBadges = [],
}: NewsletterBlockProps) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && !sent) {
      setSent(true)
    }
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-nt-off-white)] border-t border-[var(--color-nt-light-gray)]">
      <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16">
        <div className="max-w-[720px] mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 border border-[var(--color-nt-black)] mb-4 sm:mb-6">
              <Mail size={20} strokeWidth={1.5} className="text-[var(--color-nt-black)]" />
            </div>

            <span className="block text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-nt-mid-gray)] mb-3 sm:mb-4">
              {sectionLabel}
            </span>

            <h2 className="text-[24px] sm:text-[32px] lg:text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--color-nt-black)] uppercase">
              {headline}
            </h2>

            <p className="mt-3 sm:mt-4 text-[var(--color-nt-mid-gray)] text-[14px] sm:text-[15px] max-w-[420px] mx-auto leading-relaxed">
              {subheadline}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="max-w-[480px] mx-auto"
              >
                <div
                  className={cn(
                    'flex flex-col sm:flex-row gap-3 sm:gap-0 border-b-[1.5px] transition-colors duration-200',
                    focused ? 'border-[var(--color-nt-black)]' : 'border-[var(--color-nt-light-gray)]'
                  )}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent py-3.5 px-0 text-[15px] sm:text-[16px] focus:outline-none text-[var(--color-nt-black)] placeholder:text-[var(--color-nt-mid-gray)]"
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    disabled={!email}
                    className={cn(
                      'flex items-center justify-center gap-2 px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer min-h-[48px]',
                      email
                        ? 'bg-[var(--color-nt-black)] text-[var(--color-nt-white)] hover:bg-[var(--color-nt-charcoal)]'
                        : 'bg-[var(--color-nt-light-gray)] text-[var(--color-nt-mid-gray)] cursor-not-allowed'
                    )}
                  >
                    <span className="sm:hidden">{mobileButtonText}</span>
                    <span className="hidden sm:inline">{buttonText}</span>
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </button>
                </div>

                <p className="text-center sm:text-left mt-4 text-[11px] sm:text-[12px] text-[var(--color-nt-mid-gray)]">
                  {privacyText}
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-8 sm:py-10"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[var(--color-nt-black)] mb-4">
                  <Check size={28} strokeWidth={1.5} className="text-[var(--color-nt-white)]" />
                </div>
                <h3 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-2">
                  {successHeadline}
                </h3>
                <p className="text-[var(--color-nt-mid-gray)] text-[14px]">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {trustBadges?.length > 0 && (
            <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[var(--color-nt-light-gray)]">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] sm:text-[12px] text-[var(--color-nt-mid-gray)] uppercase tracking-wider">
                {trustBadges.map((badge, i) => (
                  <span key={i}>
                    {badge.text}
                    {i < trustBadges.length - 1 && <span className="hidden sm:inline mx-4">·</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
