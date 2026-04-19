'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

const TESTIMONIALS = [
  {
    id: 1,
    author: 'Clara M.',
    location: 'New York, NY',
    body: "The wool coat is extraordinary. Quality feels pre-fast-fashion — like my grandmother's wardrobe. Every detail is considered.",
    rating: 5,
    verified: true,
    date: '2 weeks ago',
  },
  {
    id: 2,
    author: 'Jonas T.',
    location: 'Berlin, Germany',
    body: 'Clean cuts, honest materials. Three years in and still looks new. This is what mindful consumption should look like.',
    rating: 5,
    verified: true,
    date: '1 month ago',
  },
  {
    id: 3,
    author: 'Aya S.',
    location: 'Tokyo, Japan',
    body: 'The newsletter writing made me buy. The clothes made me stay. Every piece tells a story of craftsmanship and care.',
    rating: 5,
    verified: true,
    date: '3 weeks ago',
  },
  {
    id: 4,
    author: 'Marcus L.',
    location: 'London, UK',
    body: "Finally, a brand that respects the customer's intelligence. Transparent pricing, quality materials, timeless design.",
    rating: 5,
    verified: true,
    date: '2 months ago',
  },
  {
    id: 5,
    author: 'Elena R.',
    location: 'Paris, France',
    body: 'The linen collection is perfection. Breathable, elegant, and sustainable. Exactly what my summer wardrobe needed.',
    rating: 5,
    verified: true,
    date: '1 week ago',
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % TESTIMONIALS.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  // Auto-advance
  useEffect(() => {
    if (isPaused) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [isPaused, next])

  const currentTestimonial = TESTIMONIALS[current]

  return (
    <section
      className="py-16 sm:py-20 lg:py-28 bg-[var(--color-nt-black)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 sm:mb-12">
          <div className="flex items-center gap-4">
            <div className="w-8 h-[2px] bg-[var(--color-nt-white)]" />
            <h2 className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-nt-white)]">
              What customers say
            </h2>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 flex items-center justify-center border border-[var(--color-nt-white)]/30 text-[var(--color-nt-white)] hover:bg-[var(--color-nt-white)] hover:text-[var(--color-nt-black)] transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 flex items-center justify-center border border-[var(--color-nt-white)]/30 text-[var(--color-nt-white)] hover:bg-[var(--color-nt-white)] hover:text-[var(--color-nt-black)] transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Main Slider */}
        <div className="relative max-w-[800px] mx-auto">
          {/* Quote Icon */}
          <Quote
            size={48}
            strokeWidth={1}
            className="absolute -top-2 sm:-top-4 left-0 sm:left-4 text-[var(--color-nt-white)]/10 rotate-180"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="text-center px-4 sm:px-12 lg:px-20"
            >
              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-6">
                {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    strokeWidth={0}
                    className="fill-[var(--color-nt-white)] text-[var(--color-nt-white)]"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-[18px] sm:text-[22px] lg:text-[26px] font-medium leading-relaxed text-[var(--color-nt-white)] mb-8">
                "{currentTestimonial.body}"
              </blockquote>

              {/* Author */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] sm:text-[15px] font-semibold text-[var(--color-nt-white)] uppercase tracking-wider">
                    {currentTestimonial.author}
                  </span>
                  {currentTestimonial.verified && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-nt-black)] bg-[var(--color-nt-white)] px-2 py-0.5">
                      Verified
                    </span>
                  )}
                </div>
                <span className="hidden sm:block text-[var(--color-nt-white)]/40">·</span>
                <span className="text-[12px] sm:text-[13px] text-[var(--color-nt-white)]/60">
                  {currentTestimonial.location}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 mt-10 sm:mt-12">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'h-[3px] rounded-[1px] transition-all duration-300 cursor-pointer',
                i === current
                  ? 'w-8 bg-[var(--color-nt-white)]'
                  : 'w-3 bg-[var(--color-nt-white)]/30 hover:bg-[var(--color-nt-white)]/50',
              )}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="flex sm:hidden items-center justify-center gap-3 mt-6">
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center border border-[var(--color-nt-white)]/30 text-[var(--color-nt-white)]"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <span className="text-[12px] text-[var(--color-nt-white)]/60 min-w-[60px] text-center">
            {current + 1} / {TESTIMONIALS.length}
          </span>
          <button
            onClick={next}
            className="w-10 h-10 flex items-center justify-center border border-[var(--color-nt-white)]/30 text-[var(--color-nt-white)]"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  )
}
