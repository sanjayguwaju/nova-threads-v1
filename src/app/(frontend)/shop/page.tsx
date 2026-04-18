import { Suspense } from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/queryClient'
import { ShopContent } from './ShopContent'
import { fetchCollection } from '@/lib/api/client'
import type { Product, Category } from '@/lib/hooks'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ [key: string]: string }>
}

export default async function ShopPage({ searchParams }: Props) {
  const sp = await searchParams
  const queryClient = getQueryClient()

  // Prefetch initial data on server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['products', 'list', { 'where[status][equals]': 'published' }],
      queryFn: () =>
        fetchCollection<Product>('products', { 'where[status][equals]': 'published', depth: '2' }),
    }),
    queryClient.prefetchQuery({
      queryKey: ['categories', 'list', {}],
      queryFn: () => fetchCollection<Category>('categories', {}),
    }),
  ])

  return (
    <div className="max-w-container mx-auto px-24 py-48">
      <header className="mb-32">
        <h1 className="font-display text-[48px]">Shop</h1>
      </header>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ShopSkeleton />}>
          <ShopContent />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

function ShopSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-32">
      <div className="w-full lg:w-[240px] shrink-0 space-y-16">
        <div className="h-40 bg-stone/10 animate-pulse" />
        <div className="h-40 bg-stone/10 animate-pulse" />
        <div className="h-40 bg-stone/10 animate-pulse" />
      </div>
      <div className="flex-1 space-y-24">
        <div className="h-20 bg-stone/10 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-24">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-12">
              <div className="aspect-[3/4] bg-stone/10 animate-pulse" />
              <div className="h-16 bg-stone/10 animate-pulse" />
              <div className="h-12 w-1/2 bg-stone/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
