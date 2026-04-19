'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductCard } from '../shop/ProductCard'

type FilterType = 'all' | 'men' | 'women'

interface ProductRailProps {
  label: string
  products: any[]
  showGenderFilter?: boolean
  link?: string
}

export function ProductRail({
  label,
  products,
  showGenderFilter = true,
  link = '/shop',
}: ProductRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  if (!products?.length) return null

  // Filter products by gender
  const filteredProducts =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.gender === activeFilter || p.category?.gender === activeFilter)

  const displayProducts = filteredProducts.slice(0, 8)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const maxScroll = scrollWidth - clientWidth
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
      setScrollProgress(Math.min(progress, 100))
    }
  }

  useEffect(() => {
    const scrollEl = scrollRef.current
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Initial calculation
      return () => scrollEl.removeEventListener('scroll', handleScroll)
    }
  }, [displayProducts.length])

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'men', label: 'Men' },
    { key: 'women', label: 'Women' },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[var(--color-nt-white)]">
      <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
          {/* Title */}
          <h2 className="text-[22px] sm:text-[26px] lg:text-[32px] font-bold tracking-[0.04em] uppercase text-[var(--color-nt-black)]">
            {label}
          </h2>

          {/* Gender Filter - Desktop */}
          {showGenderFilter && (
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-[13px] text-[var(--color-nt-mid-gray)] mr-2">Shop for:</span>
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-3 py-1 text-[13px] font-medium uppercase tracking-[0.06em] transition-all duration-200 cursor-pointer border-b-[1.5px] ${
                    activeFilter === filter.key
                      ? 'text-[var(--color-nt-black)] border-[var(--color-nt-black)]'
                      : 'text-[var(--color-nt-mid-gray)] border-transparent hover:text-[var(--color-nt-black)]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}

          {/* View All Link - Desktop */}
          <Link
            href={link}
            className="hidden sm:inline-flex items-center text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-nt-black)] hover:text-[var(--color-nt-mid-gray)] transition-colors duration-200"
          >
            View All
            <svg
              className="ml-1.5 w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Gender Filter - Mobile */}
        {showGenderFilter && (
          <div className="flex sm:hidden items-center gap-4 mb-6 overflow-x-auto scrollbar-hide">
            <span className="text-[12px] text-[var(--color-nt-mid-gray)] flex-shrink-0">
              Shop for:
            </span>
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex-shrink-0 px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.06em] transition-all duration-200 cursor-pointer border-b-[1.5px] ${
                  activeFilter === filter.key
                    ? 'text-[var(--color-nt-black)] border-[var(--color-nt-black)]'
                    : 'text-[var(--color-nt-mid-gray)] border-transparent'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-4 gap-4 lg:gap-6">
          {displayProducts.slice(0, 4).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>

        {/* Tablet Grid */}
        <div className="hidden sm:grid md:hidden grid-cols-3 gap-3">
          {displayProducts.slice(0, 6).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="sm:hidden">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayProducts.map((p) => (
              <div key={p.id} className="min-w-[44vw] max-w-[180px] snap-start flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 px-4">
            <div className="h-[2px] bg-[var(--color-nt-light-gray)] rounded-[1px] overflow-hidden max-w-[200px] mx-auto">
              <div
                className="h-full bg-[var(--color-nt-black)] rounded-[1px] transition-all duration-150 ease-out"
                style={{ width: `${Math.max(scrollProgress, 15)}%` }}
              />
            </div>
          </div>
        </div>

        {/* View All Button - Mobile */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href={link}
            className="inline-flex items-center justify-center w-full max-w-[280px] py-3.5 px-6 border border-[var(--color-nt-black)] text-[var(--color-nt-black)] text-[13px] font-semibold uppercase tracking-[0.08em] hover:bg-[var(--color-nt-black)] hover:text-[var(--color-nt-white)] transition-colors duration-200 cursor-pointer"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
