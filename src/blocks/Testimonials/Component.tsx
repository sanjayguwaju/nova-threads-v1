'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TestimonialsBlockProps {
  title?: string
  testimonials?: {
    author: string
    location: string
    body: string
    rating?: number | null
    verified?: boolean | null
    date?: string | null
    id?: string | null
  }[]
  autoplay?: boolean | null
  autoplayDelay?: number | null
}

export function TestimonialsBlock({
  title = 'What customers say',
  testimonials,
  autoplay = true,
  autoplayDelay = 6000,
}: TestimonialsBlockProps) {
  if (!testimonials?.length) return null
  const list = testimonials
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % list.length)
  }, [list.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + list.length) % list.length)
  }, [list.length])

  useEffect(() => {
    if (!autoplay || isPaused) return
    const t = setInterval(next, autoplayDelay || 6000)
    return () => clearInterval(t)
  }, [autoplay, autoplayDelay, isPaused, next])

  const currentTestimonial = list[current]

  return (
    <section
      className="py-16 sm:py-20 lg:py-28 bg-[var(--color-nt-black)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 sm:mb-12">
          <div className="flex items-center gap-4">
            <div className="w-8 h-[2px] bg-[var(--color-nt-white)]" />
            <h2 className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-nt-white)]">
              {title}
            </h2>
          </div>

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

        <div className="relative max-w-[800px] mx-auto">
          <Quote size={48} strokeWidth={1} className="absolute -top-2 sm:-top-4 left-0 sm:left-4 text-[var(--color-nt-white)]/10 rotate-180" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="text-center px-4 sm:px-12 lg:px-20"
            >
              <div className="flex items-center justify-center gap-1 mb-6">
                {Array.from({ length: currentTestimonial.rating || 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    strokeWidth={0}
                    className="fill-[var(--color-nt-white)] text-[var(--color-nt-white)]"
                  />
                ))}
              </div>

              <blockquote className="text-[18px] sm:text-[22px] lg:text-[26px] font-medium leading-relaxed text-[var(--color-nt-white)] mb-8">
                &ldquo;{currentTestimonial.body}&rdquo;
              </blockquote>

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

        <div className="flex items-center justify-center gap-2 mt-10 sm:mt-12">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'h-[3px] rounded-[1px] transition-all duration-300 cursor-pointer',
                i === current ? 'w-8 bg-[var(--color-nt-white)]' : 'w-3 bg-[var(--color-nt-white)]/30 hover:bg-[var(--color-nt-white)]/50'
              )}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex sm:hidden items-center justify-center gap-3 mt-6">
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center border border-[var(--color-nt-white)]/30 text-[var(--color-nt-white)]"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <span className="text-[12px] text-[var(--color-nt-white)]/60 min-w-[60px] text-center">
            {current + 1} / {list.length}
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
