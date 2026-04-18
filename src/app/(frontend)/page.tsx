import { Suspense } from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/queryClient'
import { HomeContent } from './HomeContent'
import { fetchCollection, fetchGlobal } from '@/lib/api/client'
import type { Product, Category, SiteSettings } from '@/lib/hooks'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const queryClient = getQueryClient()

  // Prefetch all home page data
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['site-settings'],
      queryFn: () => fetchGlobal<SiteSettings>('site-settings'),
    }),
    queryClient.prefetchQuery({
      queryKey: ['categories', 'list', { featured: 'true' }],
      queryFn: () =>
        fetchCollection<Category>('categories', {
          'where[featuredOnHome][equals]': 'true',
          limit: '6',
          sort: 'order',
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ['products', 'list', { where: 'isFeatured', equals: 'true', limit: '4' }],
      queryFn: () =>
        fetchCollection<Product>('products', {
          'where[isFeatured][equals]': 'true',
          'where[status][equals]': 'published',
          limit: '4',
          depth: '1',
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ['products', 'list', { sort: '-publishedAt', limit: '4' }],
      queryFn: () =>
        fetchCollection<Product>('products', {
          sort: '-publishedAt',
          'where[status][equals]': 'published',
          limit: '4',
          depth: '1',
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ['products', 'list', { where: 'isBestSeller', equals: 'true', limit: '4' }],
      queryFn: () =>
        fetchCollection<Product>('products', {
          'where[isBestSeller][equals]': 'true',
          'where[status][equals]': 'published',
          limit: '4',
          depth: '1',
        }),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </HydrationBoundary>
  )
}

function HomeSkeleton() {
  return (
    <div className="home">
      {/* Hero Skeleton */}
      <section className="relative h-[90vh] overflow-hidden bg-ink animate-pulse" />

      {/* Categories Skeleton */}
      <section className="py-48">
        <div className="max-w-container mx-auto px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="aspect-[3/4] bg-stone/10 animate-pulse" />
            <div className="space-y-16">
              <div className="aspect-[4/3] bg-stone/10 animate-pulse" />
              <div className="aspect-[4/3] bg-stone/10 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Rails Skeleton */}
      {[1, 2, 3].map((i) => (
        <section key={i} className="py-48">
          <div className="max-w-container mx-auto px-24">
            <div className="h-4 w-24 bg-stone/10 animate-pulse mb-32" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-24">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-12">
                  <div className="aspect-[3/4] bg-stone/10 animate-pulse" />
                  <div className="h-16 w-3/4 bg-stone/10 animate-pulse" />
                  <div className="h-12 w-1/2 bg-stone/10 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
