'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, CreditCard, Shield, Truck, RotateCcw, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { Navigation, SiteSetting } from '@/payload-types'

interface FooterColumn {
  heading?: string | null
  links?: { label?: string | null; link?: string | null }[] | null
}

interface FooterProps {
  navigation?: Navigation | null
  siteSettings?: SiteSetting | null
  fetchFromCMS?: boolean
}

async function fetchNavigation(): Promise<Navigation | null> {
  try {
    const res = await fetch('/api/globals/navigation')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function fetchSiteSettings(): Promise<SiteSetting | null> {
  try {
    const res = await fetch('/api/globals/site-settings')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export function Footer({ navigation: propNavigation, siteSettings: propSiteSettings, fetchFromCMS = false }: FooterProps) {
  const [cmsNavigation, setCmsNavigation] = useState<Navigation | null>(null)
  const [cmsSiteSettings, setCmsSiteSettings] = useState<SiteSetting | null>(null)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  useEffect(() => {
    if (fetchFromCMS) {
      fetchNavigation().then(setCmsNavigation)
      fetchSiteSettings().then(setCmsSiteSettings)
    }
  }, [fetchFromCMS])

  const navigation = fetchFromCMS ? cmsNavigation : propNavigation
  const siteSettings = fetchFromCMS ? cmsSiteSettings : propSiteSettings

  const columns: FooterColumn[] = navigation?.footerNav?.length ? navigation.footerNav : []

  // Trust badges - removed, not in SiteSetting type
  const trustBadges: { icon: React.ElementType; label: string }[] = []

  // Newsletter content - use defaults since not in type
  const newsletterTitle = 'Join the studio'
  const newsletterSubtitle = 'Subscribe for updates on new collections and exclusive offers.'
  const newsletterPlaceholder = 'Enter your email'
  const newsletterButtonText = 'Join'

  // Social links from site settings (socialLinks property exists in SiteSetting)
  const socialLinks = siteSettings?.socialLinks
    ? Object.entries(siteSettings.socialLinks)
        .filter(([, url]) => url)
        .map(([platform, url]) => ({ platform, url: url as string }))
    : []

  // Footer text
  const footerText = `${new Date().getFullYear()} NOVA THREADS. All rights reserved.`
  const privacyLink = '/legal/privacy'
  const termsLink = '/legal/terms'

  if (!columns.length && !socialLinks.length) {
    return null
  }

  const toggleAccordion = (heading: string) => {
    setOpenAccordion(openAccordion === heading ? null : heading)
  }

  return (
    <footer className="bg-[var(--color-nt-white)] border-t border-[var(--color-nt-light-gray)]">
      {/* Trust Banner - Mobile Only */}
      <div className="md:hidden border-b border-[var(--color-nt-light-gray)]">
        <div className="max-w-container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex flex-col items-center gap-1.5">
                <badge.icon
                  size={18}
                  strokeWidth={1.5}
                  className="text-[var(--color-nt-mid-gray)]"
                />
                <span className="text-[9px] uppercase tracking-wider text-[var(--color-nt-mid-gray)]">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section - Mobile */}
      <div className="md:hidden border-b border-[var(--color-nt-light-gray)]">
        <div className="max-w-container mx-auto px-4 py-8">
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--color-nt-black)] mb-2">
            Join the studio
          </h3>
          <p className="text-[12px] text-[var(--color-nt-mid-gray)] mb-4">
            Subscribe for 10% off your first order and exclusive previews.
          </p>
          <form
            className="flex border border-[var(--color-nt-black)]"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent py-3 px-3 text-[13px] focus:outline-none text-[var(--color-nt-black)] placeholder:text-[var(--color-nt-mid-gray)]"
            />
            <button
              type="submit"
              className="bg-[var(--color-nt-black)] text-[var(--color-nt-white)] px-4 py-3 text-[12px] font-semibold uppercase tracking-wider hover:bg-[var(--color-nt-charcoal)] transition-colors duration-200"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16">
        <div className="py-10 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-0 md:gap-8">
            {/* Desktop Newsletter */}
            <div className="hidden md:block md:col-span-2 pr-8">
              <h3 className="text-[16px] font-bold text-[var(--color-nt-black)] mb-4 uppercase tracking-wide">
                Join the studio
              </h3>
              <p className="text-[13px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-6">
                Subscribe for updates on new collections and exclusive offers.
              </p>
              <form
                className="flex border-b-[1.5px] border-[var(--color-nt-black)]"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent py-3 text-[14px] focus:outline-none text-[var(--color-nt-black)] placeholder:text-[var(--color-nt-mid-gray)]"
                />
                <button
                  type="submit"
                  className="text-[var(--color-nt-black)] hover:text-[var(--color-nt-mid-gray)] transition-colors duration-200 p-2"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Mobile: Accordion Navigation */}
            <div className="md:hidden col-span-1">
              {columns.map((col, i) => (
                <div key={i} className="border-b border-[var(--color-nt-light-gray)]">
                  <button
                    onClick={() => toggleAccordion(col.heading || '')}
                    className="flex items-center justify-between w-full py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-nt-black)]"
                  >
                    {col.heading}
                    <ChevronDown
                      size={16}
                      strokeWidth={1.5}
                      className={cn(
                        'text-[var(--color-nt-mid-gray)] transition-transform duration-300',
                        openAccordion === col.heading ? 'rotate-180' : '',
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300',
                      openAccordion === col.heading ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="space-y-3">
                        {col.links?.map((l, j) => (
                          <li key={j}>
                            <Link
                              href={l.link || '#'}
                              className="text-[13px] text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-black)] transition-colors duration-150 cursor-pointer block py-1"
                            >
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Footer Navigation Columns */}
            {columns.map((col, i) => (
              <div key={i} className="hidden md:block md:col-span-1">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-nt-black)] mb-5">
                  {col.heading}
                </h3>
                <ul className="space-y-3">
                  {col.links?.map((l, j) => (
                    <li key={j}>
                      <Link
                        href={l.link || '#'}
                        className="text-[13px] text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-black)] transition-colors duration-150 cursor-pointer block"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Brand Section */}
        <div className="md:hidden py-8 border-t border-[var(--color-nt-light-gray)]">
          {/* Giant Wordmark */}
          <div className="overflow-hidden mb-6">
            <div className="text-[clamp(52px,18vw,80px)] font-bold tracking-[-0.03em] uppercase text-[var(--color-nt-black)] leading-[0.85]">
              NOVA
            </div>
            <div className="text-[clamp(52px,18vw,80px)] font-bold tracking-[-0.03em] uppercase text-[var(--color-nt-black)] leading-[0.85]">
              THREADS
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 mb-6">
            {[
              {
                label: 'Instagram',
                href: '#',
                svg: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                ),
              },
              {
                label: 'Facebook',
                href: '#',
                svg: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                ),
              },
              {
                label: 'Twitter',
                href: '#',
                svg: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                ),
              },
              {
                label: 'Youtube',
                href: '#',
                svg: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-11 h-11 border border-[var(--color-nt-light-gray)] flex items-center justify-center text-[var(--color-nt-mid-gray)] hover:border-[var(--color-nt-black)] hover:text-[var(--color-nt-black)] transition-all duration-200"
              >
                {social.svg}
              </a>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-3 mb-6">
            <CreditCard size={20} strokeWidth={1.5} className="text-[var(--color-nt-mid-gray)]" />
            <div className="flex items-center gap-2">
              {['Visa', 'MC', 'Amex', 'PayPal'].map((payment) => (
                <span
                  key={payment}
                  className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-nt-mid-gray)] bg-[var(--color-nt-off-white)] px-2 py-1"
                >
                  {payment}
                </span>
              ))}
            </div>
          </div>

          {/* Currency & Region */}
          <div className="flex items-center gap-4 text-[12px] text-[var(--color-nt-mid-gray)] mb-4">
            <button className="flex items-center gap-2 hover:text-[var(--color-nt-black)] transition-colors">
              <span className="w-5 h-5 rounded-full bg-[var(--color-nt-off-white)] flex items-center justify-center text-[10px]">
                🌐
              </span>
              NPR / English
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[var(--color-nt-light-gray)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[11px] sm:text-[12px] text-[var(--color-nt-mid-gray)] text-center sm:text-left order-2 sm:order-1">
              {new Date().getFullYear()} NOVA THREADS. All rights reserved.
            </p>
            <div className="flex items-center gap-6 order-1 sm:order-2">
              <Link
                href="/legal/privacy"
                className="text-[11px] sm:text-[12px] text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-black)] transition-colors duration-150"
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal/terms"
                className="text-[11px] sm:text-[12px] text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-black)] transition-colors duration-150"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
