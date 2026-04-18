'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Search } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from '@/store/useUIStore'
import { formatCurrency } from '@/lib/utils/formatCurrency'

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUIStore()
  const [q, setQ] = useState('')
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    if (!q) { setResults([]); return }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data)
      } catch {}
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-paper"
        >
          <div className="max-w-container mx-auto px-24 py-24">
            <div className="flex items-center gap-16 border-b border-ink pb-12">
              <Search size={20} />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent font-display text-[32px] focus:outline-none"
              />
              <button onClick={closeSearch}><X size={24} /></button>
            </div>

            {results.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-24 mt-32">
                {results.slice(0, 8).map((p) => {
                  const img = p.mainImage?.sizes?.card?.url || p.mainImage?.url
                  const price = p.variants?.[0]?.price
                  return (
                    <Link key={p.id} href={`/products/${p.slug}`} onClick={closeSearch} className="block">
                      <div className="relative aspect-[3/4] bg-blush overflow-hidden">
                        {img && <Image src={img} alt={p.name} fill className="object-cover" />}
                      </div>
                      <div className="mt-8 text-[14px]">{p.name}</div>
                      {price != null && <div className="font-mono text-[12px]">{formatCurrency(price)}</div>}
                    </Link>
                  )
                })}
              </div>
            )}

            {q && results.length > 0 && (
              <Link
                href={`/search?q=${encodeURIComponent(q)}`}
                onClick={closeSearch}
                className="inline-block mt-32 font-mono text-[12px] uppercase tracking-widest underline"
              >
                See all results for "{q}" →
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
