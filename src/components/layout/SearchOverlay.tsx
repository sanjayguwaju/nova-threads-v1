'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Search } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from '@/store/useUIStore'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { cn } from '@/lib/utils'

// Mock trending searches
const TRENDING_SEARCHES = [
  { term: 'dempus', icon: '🔍' },
  { term: 'sample', icon: '🔍' },
  { term: 'magnis', icon: '🔍' },
  { term: 'loremous saliduar', icon: '🔍' },
  { term: 'naminos', icon: '🔍' },
  { term: 'dinterdum', icon: '🔍' },
]

// Mock popular products - in real app, these would come from API
const POPULAR_PRODUCTS = [
  {
    id: 1,
    name: 'COLLETTE',
    subtitle: '(Product 35) Sample - Clothing And Accessory Boutiques For Sale',
    slug: 'collette',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0bedb?w=400&h=500&fit=crop',
    price: 185,
  },
  {
    id: 2,
    name: 'MABEL',
    subtitle: '(Product 36) Sample - Accessory Collection',
    slug: 'mabel',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
    price: 220,
  },
]

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUIStore()
  const [q, setQ] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (!q) {
      setResults([])
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data)
      } catch {}
      setIsSearching(false)
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  // Handle click on trending search
  const handleTrendingClick = (term: string) => {
    setQ(term)
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-y-0 right-0 w-full sm:w-[420px] z-[300] bg-[var(--color-nt-white)] shadow-2xl"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-nt-light-gray)]">
              <h2 className="text-[18px] font-semibold text-[var(--color-nt-black)]">Search</h2>
              <button
                onClick={closeSearch}
                className="w-10 h-10 flex items-center justify-center text-[var(--color-nt-black)] hover:text-[var(--color-nt-mid-gray)] transition-colors"
                aria-label="Close search"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Search Input */}
            <div className="px-6 py-4">
              <div className="relative">
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-[var(--color-nt-off-white)] text-[14px] text-[var(--color-nt-black)] placeholder:text-[var(--color-nt-mid-gray)] py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-[var(--color-nt-black)]"
                />
                <Search
                  size={18}
                  strokeWidth={1.5}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-nt-mid-gray)]"
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {q && results.length > 0 ? (
                /* Search Results */
                <div className="space-y-4">
                  <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-nt-black)]">
                    Search Results
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {results.slice(0, 6).map((p) => {
                      const img = p.mainImage?.sizes?.card?.url || p.mainImage?.url
                      const price = p.variants?.[0]?.price
                      return (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          onClick={closeSearch}
                          className="group block"
                        >
                          <div className="relative aspect-[3/4] bg-[var(--color-nt-off-white)] overflow-hidden">
                            {img && (
                              <Image
                                src={img}
                                alt={p.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            )}
                          </div>
                          <div className="mt-2">
                            <p className="text-[13px] font-medium text-[var(--color-nt-black)] line-clamp-1">
                              {p.name}
                            </p>
                            {price != null && (
                              <p className="text-[12px] text-[var(--color-nt-mid-gray)]">
                                {formatCurrency(price)}
                              </p>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                  <Link
                    href={`/shop?q=${encodeURIComponent(q)}`}
                    onClick={closeSearch}
                    className="block text-center text-[13px] text-[var(--color-nt-black)] underline py-3 hover:text-[var(--color-nt-mid-gray)] transition-colors"
                  >
                    See all results for "{q}"
                  </Link>
                </div>
              ) : q && isSearching ? (
                /* Loading State */
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[var(--color-nt-light-gray)] border-t-[var(--color-nt-black)] rounded-full animate-spin" />
                </div>
              ) : (
                /* Default Content - Trending & Popular */
                <div className="space-y-8">
                  {/* Trending Now */}
                  <div className="space-y-4">
                    <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-nt-black)] border-b border-[var(--color-nt-light-gray)] pb-2">
                      Trending Now
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map((item) => (
                        <button
                          key={item.term}
                          onClick={() => handleTrendingClick(item.term)}
                          className="flex items-center gap-2 px-3 py-2 bg-[var(--color-nt-off-white)] text-[13px] text-[var(--color-nt-mid-gray)] hover:bg-[var(--color-nt-light-gray)] hover:text-[var(--color-nt-black)] transition-colors"
                        >
                          <Search size={14} strokeWidth={1.5} />
                          {item.term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Products */}
                  <div className="space-y-4">
                    <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-nt-black)] border-b border-[var(--color-nt-light-gray)] pb-2">
                      Popular Products
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {POPULAR_PRODUCTS.map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          onClick={closeSearch}
                          className="group block"
                        >
                          <div className="relative aspect-[3/4] bg-[var(--color-nt-off-white)] overflow-hidden">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="text-[13px] font-medium text-[var(--color-nt-black)] uppercase tracking-wide">
                              {p.name}
                            </p>
                            <p className="text-[12px] text-[var(--color-nt-mid-gray)] line-clamp-2 leading-relaxed">
                              {p.subtitle}
                            </p>
                            <p className="text-[13px] font-medium text-[var(--color-nt-black)]">
                              {formatCurrency(p.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
