'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, LayoutGrid, Rows3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductFilters } from '@/components/shop/ProductFilters'
import { ProductSort } from '@/components/shop/ProductSort'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProducts, buildProductFilters, useCategories } from '@/lib/hooks'
import { cn } from '@/lib/utils'

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  )
}

export function ShopContent() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const searchParams = useSearchParams()
  const filters = buildProductFilters(searchParams)

  const { data: productsData, isLoading: productsLoading } = useProducts(filters)
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()

  // Use only real CMS data
  const products = productsData
  const categories = categoriesData

  // Count active filters
  const activeFilterCount = ['gender', 'size', 'color', 'category', 'minPrice', 'maxPrice'].filter(
    (key) => searchParams.get(key),
  ).length

  return (
    <div>
      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[200] lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-[85vw] max-w-[360px] h-full bg-[var(--color-nt-white)] z-[201] overflow-y-auto lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-nt-light-gray)]">
                <h2 className="text-[16px] font-semibold text-[var(--color-nt-black)]">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-[var(--color-nt-black)]"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              {/* Drawer Content */}
              <div className="p-4">
                <ProductFilters
                  categories={categories?.docs || []}
                  activeCount={activeFilterCount}
                  isMobile
                  onClose={() => setMobileFiltersOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toolbar - Like reference: VIEW AS on left, Filter on right */}
      <div className="flex items-center justify-between border-t border-b border-[var(--color-nt-light-gray)] py-3 mb-4">
        {/* View As - Left side */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] uppercase tracking-wider text-[var(--color-nt-mid-gray)] font-medium">
            View As
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 transition-colors',
                viewMode === 'grid'
                  ? 'text-[var(--color-nt-black)]'
                  : 'text-[var(--color-nt-light-gray)] hover:text-[var(--color-nt-mid-gray)]',
              )}
              aria-label="Grid view"
            >
              <LayoutGrid size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 transition-colors',
                viewMode === 'list'
                  ? 'text-[var(--color-nt-black)]'
                  : 'text-[var(--color-nt-light-gray)] hover:text-[var(--color-nt-mid-gray)]',
              )}
              aria-label="List view"
            >
              <Rows3 size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Filter Button - Right side */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 text-[var(--color-nt-black)] text-[13px] font-medium"
        >
          <SlidersHorizontal size={18} strokeWidth={1.5} />
          <span className="uppercase tracking-wider">Filter</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[11px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Products - 2 column grid like reference */}
      {productsLoading ? (
        <ProductSkeleton />
      ) : (
        <ProductGrid products={products?.docs || []} viewMode={viewMode} />
      )}

      {/* Promo Banner - Like reference */}
      <div className="mt-8 sm:mt-12">
        <div className="bg-[var(--color-nt-black)] text-[var(--color-nt-white)] py-4 px-6 text-center">
          <p className="text-[14px] sm:text-[16px] font-semibold uppercase tracking-wider">
            Up to 50% off selected items
          </p>
        </div>
      </div>
    </div>
  )
}
