'use client'

import { useSearchParams } from 'next/navigation'
import { ProductFilters } from '@/components/shop/ProductFilters'
import { ProductSort } from '@/components/shop/ProductSort'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProducts, buildProductFilters, useCategories } from '@/lib/hooks'

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-24">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-12">
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function ShopContent() {
  const searchParams = useSearchParams()
  const filters = buildProductFilters(searchParams)

  const { data: products, isLoading: productsLoading } = useProducts(filters)
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  return (
    <div className="flex flex-col lg:flex-row gap-32">
      {categoriesLoading ? (
        <div className="w-full lg:w-[240px] shrink-0 space-y-16">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <ProductFilters categories={categories?.docs || []} />
      )}

      <div className="flex-1">
        <ProductSort total={products?.totalDocs || 0} />
        {productsLoading ? <ProductSkeleton /> : <ProductGrid products={products?.docs || []} />}
      </div>
    </div>
  )
}
