'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check } from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'

// Promo data - can be fetched from CMS
const PROMO_DATA = {
  image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
  title: 'Special Picks for You',
  description:
    "We've handpicked a few styles we think you'll love. Use code STYLE20 for 20% OFF your order today.",
  code: 'STYLE20',
  discount: '20% OFF',
  featuredProducts: [
    {
      id: '1',
      name: 'Classic Blazer',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop',
      slug: 'classic-blazer',
    },
    {
      id: '2',
      name: 'Silk Blouse',
      image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=300&h=400&fit=crop',
      slug: 'silk-blouse',
    },
  ],
}

export function PromoModal() {
  const { promoOpen, closePromo, pushToast } = useUIStore()
  const [copied, setCopied] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user has seen promo in last 7 days
    const lastSeen = localStorage.getItem('promo_last_seen')
    const now = Date.now()
    const sevenDays = 7 * 24 * 60 * 60 * 1000

    if (!lastSeen || now - parseInt(lastSeen) > sevenDays) {
      // Show promo after 3 seconds
      const timer = setTimeout(() => {
        useUIStore.getState().openPromo()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    closePromo()
    localStorage.setItem('promo_last_seen', Date.now().toString())
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PROMO_DATA.code)
    setCopied(true)
    pushToast({ type: 'success', message: `Code ${PROMO_DATA.code} copied!` })
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isClient) return null

  return (
    <AnimatePresence>
      {promoOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-[110]"
            onClick={handleClose}
          />

          {/* Modal Container - centered */}
          <div className="fixed inset-0 z-[111] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full max-w-[400px] max-h-[90vh] bg-[var(--color-nt-white)] overflow-y-auto shadow-2xl pointer-events-auto"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center text-[var(--color-nt-black)] hover:text-[var(--color-nt-charcoal)] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              {/* Hero Image - smaller on desktop */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] overflow-hidden">
                <Image
                  src={PROMO_DATA.image}
                  alt={PROMO_DATA.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-nt-white)] to-transparent" />
              </div>

              {/* Content */}
              <div className="px-6 pb-6 -mt-8 relative">
                {/* Title */}
                <h2 className="text-[20px] sm:text-[24px] font-bold text-[var(--color-nt-black)] text-center mb-3">
                  {PROMO_DATA.title}
                </h2>

                {/* Description */}
                <p className="text-[14px] text-[var(--color-nt-mid-gray)] text-center leading-relaxed mb-5">
                  {PROMO_DATA.description}
                </p>

                {/* Code Copy Section */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={PROMO_DATA.code}
                      readOnly
                      className="w-full h-[48px] px-4 pr-12 border-2 border-[var(--color-nt-black)] bg-[var(--color-nt-white)] text-[var(--color-nt-black)] text-[16px] font-semibold tracking-wider text-center uppercase focus:outline-none"
                    />
                    <button
                      onClick={handleCopyCode}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-black)] transition-colors cursor-pointer"
                      aria-label="Copy code"
                    >
                      {copied ? (
                        <Check size={20} strokeWidth={1.5} className="text-green-600" />
                      ) : (
                        <Copy size={20} strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Featured Products */}
                <div className="grid grid-cols-2 gap-3">
                  {PROMO_DATA.featuredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={handleClose}
                      className="group"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-nt-off-white)] mb-2">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="150px"
                        />
                      </div>
                      <p className="text-[13px] font-medium text-[var(--color-nt-black)] text-center group-hover:underline">
                        {product.name}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href="/shop"
                  onClick={handleClose}
                  className="block w-full mt-5 py-3 bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[13px] font-semibold uppercase tracking-wider text-center hover:bg-[var(--color-nt-charcoal)] transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
