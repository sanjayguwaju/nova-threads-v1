import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
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
    <>
      {/* Breadcrumbs - Style from reference */}
      <div className="bg-[var(--color-nt-white)]">
        <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-1 text-[12px] sm:text-[13px] text-[var(--color-nt-mid-gray)]">
            <Link href="/" className="hover:text-[var(--color-nt-black)] transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-[var(--color-nt-mid-gray)]" />
            <Link href="/shop" className="hover:text-[var(--color-nt-black)] transition-colors">
              Collections
            </Link>
            <ChevronRight size={14} className="text-[var(--color-nt-mid-gray)]" />
            <span className="text-[var(--color-nt-black)] font-medium">All Products</span>
          </nav>
        </div>
      </div>

      {/* Collection Banner - Like reference */}
      <div className="bg-[var(--color-nt-off-white)]">
        <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[320px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=500&fit=crop"
              alt="Shop Collection"
              fill
              className="object-cover"
              priority
            />
            {/* LookBook Badge */}
            <div className="absolute top-1/2 right-4 sm:right-12 -translate-y-1/2 bg-[var(--color-nt-white)] p-4 sm:p-6 shadow-lg">
              <p className="text-[14px] sm:text-[18px] font-bold italic text-[var(--color-nt-black)]">
                LookBook
              </p>
              <div className="w-8 h-[1px] bg-[var(--color-nt-black)] my-2" />
              <p className="text-[9px] sm:text-[10px] text-[var(--color-nt-mid-gray)] max-w-[120px] leading-relaxed">
                Discover the art of minimal style through timeless pieces
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Title & Description */}
      <div className="bg-[var(--color-nt-white)]">
        <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16 py-6 sm:py-10">
          <h1 className="text-[22px] sm:text-[28px] font-bold uppercase tracking-wide text-[var(--color-nt-black)] mb-4">
            All Products
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[var(--color-nt-mid-gray)] leading-relaxed max-w-[600px]">
            Discover timeless outerwear crafted for modern living. Our collection combines clean
            lines, premium fabrics, and versatile silhouettes — designed to elevate your everyday
            wardrobe with effortless sophistication and warmth.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[var(--color-nt-white)] min-h-screen">
        <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16 pb-12 sm:pb-20">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ShopSkeleton />}>
              <ShopContent />
            </Suspense>
          </HydrationBoundary>
        </div>
      </div>
    </>
  )
}

function ShopSkeleton() {
  return (
    <div>
      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between border-t border-b border-[var(--color-nt-light-gray)] py-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-16 bg-[var(--color-nt-off-white)] animate-pulse" />
          <div className="h-8 w-16 bg-[var(--color-nt-off-white)] animate-pulse" />
        </div>
        <div className="h-8 w-24 bg-[var(--color-nt-off-white)] animate-pulse" />
      </div>

      {/* Grid Skeleton - 2 columns like reference */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[3/4] bg-[var(--color-nt-off-white)] animate-pulse" />
            <div className="h-3 w-3/4 bg-[var(--color-nt-off-white)] animate-pulse" />
            <div className="h-3 w-1/3 bg-[var(--color-nt-off-white)] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
