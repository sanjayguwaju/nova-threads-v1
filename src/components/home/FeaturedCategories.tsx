'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Category {
  id: string
  name: string
  slug: string
  image: string
  itemCount?: number
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Coats',
    slug: 'coats',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=1200&fit=crop',
    itemCount: 12,
  },
  {
    id: '2',
    name: 'Knitwear',
    slug: 'knitwear',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1200&fit=crop',
    itemCount: 18,
  },
  {
    id: '3',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1200&fit=crop',
    itemCount: 24,
  },
  {
    id: '4',
    name: 'Dresses',
    slug: 'dresses',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1200&fit=crop',
    itemCount: 15,
  },
  {
    id: '5',
    name: 'Trousers',
    slug: 'trousers',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1200&fit=crop',
    itemCount: 20,
  },
  {
    id: '6',
    name: 'Shirts',
    slug: 'shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1200&fit=crop',
    itemCount: 22,
  },
]

export function FeaturedCategories({ categories }: { categories?: any[] }) {
  const list = categories?.length
    ? categories.slice(0, 6).map((c, i) => ({
        id: c.id || String(i),
        name: c.name,
        slug: c.slug,
        image: c.image?.url || DEFAULT_CATEGORIES[i]?.image,
        itemCount: c.itemCount || DEFAULT_CATEGORIES[i]?.itemCount,
      }))
    : DEFAULT_CATEGORIES

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
