'use client'

import { motion } from 'framer-motion'
import { ProductCard } from './ProductCard'
import type { Product } from '@/payload-types'

interface ProductGridProps {
  products: Product[]
  viewMode?: 'grid' | 'list'
}

export function ProductGrid({ products, viewMode = 'grid' }: ProductGridProps) {
  if (!products?.length) {
    return (
      <div className="py-16 sm:py-24 text-center">
        <div className="max-w-[280px] mx-auto">
          <h3 className="text-[18px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wider mb-2">
            No products found
          </h3>
          <p className="text-[13px] text-[var(--color-nt-mid-gray)]">
            Try adjusting your filters or browse all products.
          </p>
        </div>
      </div>
    )
  }

  // Always 2 columns on mobile like reference, 3 on tablet, 4 on desktop
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <ProductCard product={p} priority={i < 4} showQuickActions />
        </motion.div>
      ))}
    </div>
  )
}
