'use client'

import { HeroSlider } from '@/components/home/HeroSlider'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { ProductRail } from '@/components/home/ProductRail'
import { Skeleton } from '@/components/ui/Skeleton'
import { useFeaturedProducts, useNewArrivals, useBestSellers, useCategories, useSiteSettings } from '@/lib/hooks'

function ProductRailSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-24">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-12">
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function HomeContent() {
  const { data: settings } = useSiteSettings()
  const { data: categories } = useCategories({ featured: true })
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts(4)
  const { data: newArrivals, isLoading: arrivalsLoading } = useNewArrivals(4)
  const { data: bestSellers, isLoading: bestSellersLoading } = useBestSellers(4)

  return (
    <div className="home">
      <HeroSlider slides={settings?.heroSlides} />
      
      <FeaturedCategories categories={categories?.docs || []} />
      
      {featuredLoading ? (
        <section className="py-48">
          <div className="max-w-container mx-auto px-24">
            <div className="flex items-center gap-16 mb-32">
              <span className="rule" />
              <h2 className="font-mono text-[11px] uppercase tracking-widest">Featured</h2>
            </div>
            <ProductRailSkeleton />
          </div>
        </section>
      ) : (
        <ProductRail label="Featured" products={featuredProducts?.docs || []} />
      )}
      
      {arrivalsLoading ? (
        <section className="py-48">
          <div className="max-w-container mx-auto px-24">
            <div className="flex items-center gap-16 mb-32">
              <span className="rule" />
              <h2 className="font-mono text-[11px] uppercase tracking-widest">New Arrivals</h2>
            </div>
            <ProductRailSkeleton />
          </div>
        </section>
      ) : (
        <ProductRail label="New Arrivals" products={newArrivals?.docs || []} />
      )}
      
      {bestSellersLoading ? (
        <section className="py-48">
          <div className="max-w-container mx-auto px-24">
            <div className="flex items-center gap-16 mb-32">
              <span className="rule" />
              <h2 className="font-mono text-[11px] uppercase tracking-widest">Best Sellers</h2>
            </div>
            <ProductRailSkeleton />
          </div>
        </section>
      ) : (
        <ProductRail label="Best Sellers" products={bestSellers?.docs || []} />
      )}
    </div>
  )
}
