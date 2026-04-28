'use client'

import { ProductCard } from '../shop/ProductCard'
import { motion } from 'framer-motion'
import type { Product } from '@/payload-types'

export function RelatedProducts({ products }: { products: Product[] }) {
  if (!products?.length) return null

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[var(--color-nt-off-white)]">
      <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-[2px] bg-[var(--color-nt-black)]" />
          <h2 className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.1em] text-[var(--color-nt-black)]">
            You May Also Like
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.slice(0, 4).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
