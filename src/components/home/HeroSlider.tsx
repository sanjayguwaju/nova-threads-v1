'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Slide {
  headline?: string | null
  subheadline?: string | null
  cta?: string | null
  image?: { url?: string; sizes?: { hero?: { url?: string } } } | string | null
  link?: string | null
}

export function HeroSlider({ slides }: { slides?: Slide[] }) {
  if (!slides?.length) return null
  const list = slides as Slide[]
  const [i, setI] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setI((n) => (n + 1) % list.length)
  }, [list.length])

  const prevSlide = useCallback(() => {
    setI((n) => (n - 1 + list.length) % list.length)
  }, [list.length])

  useEffect(() => {
    if (isPaused) return
    const t = setInterval(nextSlide, 6000)
    return () => clearInterval(t)
  }, [isPaused, nextSlide])

  const current = list[i]
  const img =
    typeof current.image === 'string'
      ? current.image
      : current.image?.sizes?.hero?.url || current.image?.url

  return (
    <section
      className="relative w-full overflow-hidden bg-[var(--color-nt-off-black)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Mobile: 90vh aspect ratio container */}
      <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]">
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            {img && (
              <Image
                src={img}
                alt={current.headline || ''}
                fill
                priority
                className="object-cover object-top"
                sizes="100vw"
              />
            )}
            {/* Gradient overlay - stronger at bottom for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-nt-black)]/80 via-[var(--color-nt-black)]/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-container mx-auto px-4 sm:px-8 lg:px-16 pb-8 sm:pb-12 lg:pb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-[400px] lg:max-w-[500px]"
              >
                <h1 className="text-[28px] sm:text-[40px] lg:text-[56px] font-bold leading-[1.0] tracking-[-0.02em] uppercase text-[var(--color-nt-white)]">
                  {current.headline}
                </h1>

                {current.subheadline && (
                  <p className="mt-3 sm:mt-4 text-[var(--color-nt-white)]/70 text-[13px] sm:text-[14px] font-normal leading-relaxed">
                    {current.subheadline}
                  </p>
                )}

                {current.cta && current.link && (
                  <div className="mt-4 sm:mt-6">
                    <Link
                      href={current.link}
                      className="inline-flex items-center justify-center bg-[var(--color-nt-white)] text-[var(--color-nt-black)] text-[13px] font-semibold uppercase tracking-[0.08em] px-8 py-4 min-h-[48px] hover:bg-[var(--color-nt-off-white)] transition-colors duration-200 cursor-pointer"
                    >
                      {current.cta}
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation arrows - desktop only */}
        <div className="hidden sm:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-4 lg:px-8 pointer-events-none">
          <button
            onClick={prevSlide}
            className="w-12 h-12 flex items-center justify-center bg-[var(--color-nt-white)]/10 backdrop-blur-sm text-[var(--color-nt-white)] hover:bg-[var(--color-nt-white)]/20 transition-colors duration-200 pointer-events-auto"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 flex items-center justify-center bg-[var(--color-nt-white)]/10 backdrop-blur-sm text-[var(--color-nt-white)] hover:bg-[var(--color-nt-white)]/20 transition-colors duration-200 pointer-events-auto"
            aria-label="Next slide"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Slide indicators - bottom center */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {list.map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              className={cn(
                'transition-all duration-300 cursor-pointer',
                n === i
                  ? 'w-8 h-[3px] bg-[var(--color-nt-white)]'
                  : 'w-8 h-[3px] bg-[var(--color-nt-white)]/40 hover:bg-[var(--color-nt-white)]/60',
              )}
              aria-label={`Go to slide ${n + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
