'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Media } from '@/payload-types'

interface BrandStoryBlockProps {
  sectionLabel?: string
  headline?: string
  description?: string
  image?: string | Media
  stats?: { value: string; label: string; id?: string | null }[]
  ctaText?: string
  ctaLink?: string
  imagePosition?: 'left' | 'right'
}

export function BrandStoryBlock({
  sectionLabel = 'Our Philosophy',
  headline = 'Fewer, finer things — designed to be lived in, loved for years',
  description = 'NOVA THREADS is a studio making considered clothes from natural materials, with transparent pricing and fair production.',
  image,
  stats = [],
  ctaText = 'Our Story',
  ctaLink = '/about',
  imagePosition = 'left',
}: BrandStoryBlockProps) {
  const imageUrl = typeof image === 'string' ? image : image?.url

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-[var(--color-nt-off-white)]">
      <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
          <motion.div
            className={`relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-[var(--color-nt-light-gray)] ${imagePosition === 'right' ? 'lg:order-2' : 'order-1'}`}
            initial={{ opacity: 0, x: imagePosition === 'right' ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={headline}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </motion.div>

          <motion.div
            className={`${imagePosition === 'right' ? 'lg:order-1' : 'order-2'} py-4 lg:py-8 lg:pl-8`}
            initial={{ opacity: 0, x: imagePosition === 'right' ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-nt-mid-gray)] mb-4 sm:mb-6 block">
              {sectionLabel}
            </span>

            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--color-nt-black)] uppercase">
              {headline}
            </h2>

            <p className="mt-6 sm:mt-8 text-[var(--color-nt-mid-gray)] text-[14px] sm:text-[15px] leading-relaxed max-w-[480px]">
              {description}
            </p>

            {stats?.length > 0 && (
            <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-4 sm:gap-6 max-w-[400px]">
              {stats.map((item) => (
                <div key={item.label} className="text-center sm:text-left">
                  <div className="text-[18px] sm:text-[22px] font-bold text-[var(--color-nt-black)]">
                    {item.value}
                  </div>
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[var(--color-nt-mid-gray)] mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            )}

            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 mt-8 sm:mt-10 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-nt-black)] hover:text-[var(--color-nt-mid-gray)] transition-colors duration-200 group cursor-pointer"
            >
              {ctaText}
              <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
