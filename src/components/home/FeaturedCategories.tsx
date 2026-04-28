'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Category } from '@/payload-types'

interface FeaturedCategoryItem {
  id: string
  name: string
  slug: string | null | undefined
  image: string
  itemCount?: number
}

interface FeaturedCategoriesProps {
  title?: string
  subtitle?: string
  categories?: FeaturedCategoryItem[]
  showViewAll?: boolean
  viewAllText?: string
  viewAllLink?: string
  fetchFromCMS?: boolean
}

async function fetchCategories(): Promise<FeaturedCategoryItem[]> {
  const res = await fetch('/api/categories?limit=6&where[featuredOnHome][equals]=true')
  if (!res.ok) return []
  const data = await res.json()
  
  return (data.docs as Category[]).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    image: typeof cat.image === 'object' ? cat.image?.url || '' : '',
    itemCount: 0
  })).filter((c) => c.image)
}

export function FeaturedCategories({
  title = 'Shop by Category',
  subtitle = 'Explore our curated collections',
  categories: propCategories,
  fetchFromCMS = false
}: FeaturedCategoriesProps) {
  const [cmsCategories, setCmsCategories] = useState<FeaturedCategoryItem[]>([])
  
  useEffect(() => {
    if (fetchFromCMS) {
      fetchCategories().then(setCmsCategories)
    }
  }, [fetchFromCMS])
  
  const categories = fetchFromCMS ? cmsCategories : propCategories
  
  if (!categories?.length) return null

  const list = categories.slice(0, 6)

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[var(--color-nt-off-white)]">
      <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold tracking-[0.04em] uppercase text-[var(--color-nt-black)]">
            Shop by Category
          </h2>
          <p className="mt-2 text-[13px] text-[var(--color-nt-mid-gray)]">
            Explore our curated collections
          </p>
        </div>

        {/* Mobile: 2-column grid (first 4 categories) */}
        <div className="grid grid-cols-2 gap-[2px] sm:hidden">
          {list.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              href={`/shop/${c.slug}`}
              className="relative block aspect-[3/4] overflow-hidden bg-[var(--color-nt-off-white)] group cursor-pointer"
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover object-top"
                  sizes="50vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-nt-black)]/70 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 px-2 text-center">
                <span className="text-[14px] font-bold text-[var(--color-nt-white)] uppercase tracking-[0.05em]">
                  {c.name}
                </span>
                {c.itemCount && (
                  <span className="text-[11px] text-[var(--color-nt-white)]/70 mt-1">
                    {c.itemCount} items
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Tablet: 3-column grid */}
        <div className="hidden sm:grid md:hidden grid-cols-3 gap-[2px]">
          {list.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/shop/${c.slug}`}
              className="relative block aspect-[3/4] overflow-hidden bg-[var(--color-nt-off-white)] group cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 overflow-hidden"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover object-top"
                  sizes="33vw"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-nt-black)]/70 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-3 text-center">
                <span className="text-[15px] font-bold text-[var(--color-nt-white)] uppercase tracking-[0.05em]">
                  {c.name}
                </span>
                {c.itemCount && (
                  <span className="text-[12px] text-[var(--color-nt-white)]/70 mt-1">
                    {c.itemCount} items
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop: 6-column grid with hover effects */}
        <div className="hidden md:grid grid-cols-6 gap-[2px]">
          {list.map((c) => (
            <Link
              key={c.id}
              href={`/shop/${c.slug}`}
              className="relative block aspect-[3/4] overflow-hidden bg-[var(--color-nt-off-white)] group cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 overflow-hidden"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover object-top"
                  sizes="16vw"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-nt-black)]/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-2 text-center">
                <motion.span className="text-[14px] lg:text-[15px] font-bold text-[var(--color-nt-white)] uppercase tracking-[0.05em] group-hover:translate-y-[-4px] transition-transform duration-300">
                  {c.name}
                </motion.span>
                {c.itemCount && (
                  <span className="text-[11px] lg:text-[12px] text-[var(--color-nt-white)]/70 mt-1 group-hover:translate-y-[-2px] transition-transform duration-300 delay-75">
                    {c.itemCount} items
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-nt-black)] hover:text-[var(--color-nt-mid-gray)] transition-colors duration-200 cursor-pointer"
          >
            View All Categories
            <svg
              className="ml-2 w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
