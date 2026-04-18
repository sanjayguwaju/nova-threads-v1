import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { fetchCollection, fetchDocument, fetchApi } from '../api/client'
import type { Where } from 'payload'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, string>) => [...productKeys.lists(), filters] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  slug: (slug: string) => [...productKeys.details(), 'slug', slug] as const,
  related: (id: string) => [...productKeys.details(), id, 'related'] as const,
  reviews: (productId: string) => [...productKeys.all, 'reviews', productId] as const,
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: Record<string, unknown>
  shortDescription?: string
  category?: string | { id: string; name: string }
  brand?: string
  gender?: 'men' | 'women' | 'unisex' | 'kids'
  variants: Array<{
    sku: string
    size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size'
    color?: string
    colorHex?: string
    stock: number
    price: number
    compareAtPrice?: number
  }>
  materials?: Array<{ material: string; percentage: number }>
  features?: Array<{ feature: string }>
  isNew?: boolean
  isFeatured?: boolean
  isBestSeller?: boolean
  status: 'draft' | 'published' | 'archived'
  averageRating?: number
  reviewCount?: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

// Get all products with optional filtering
export function useProducts(filters?: Record<string, string>) {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => fetchCollection<Product>('products', { ...filters, depth: '2' }),
  })
}

// Get single product by ID
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchDocument<Product>('products', id),
    enabled: !!id,
  })
}

// Get featured products
export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: productKeys.list({ where: 'isFeatured', equals: 'true', limit: String(limit) }),
    queryFn: () =>
      fetchCollection<Product>('products', {
        'where[isFeatured][equals]': 'true',
        'where[status][equals]': 'published',
        limit: String(limit),
        depth: '1',
      }),
  })
}

// Get new arrivals
export function useNewArrivals(limit = 8) {
  return useQuery({
    queryKey: productKeys.list({ sort: '-publishedAt', limit: String(limit) }),
    queryFn: () =>
      fetchCollection<Product>('products', {
        sort: '-publishedAt',
        'where[status][equals]': 'published',
        limit: String(limit),
        depth: '1',
      }),
  })
}

// Get best sellers
export function useBestSellers(limit = 8) {
  return useQuery({
    queryKey: productKeys.list({ where: 'isBestSeller', equals: 'true', limit: String(limit) }),
    queryFn: () =>
      fetchCollection<Product>('products', {
        'where[isBestSeller][equals]': 'true',
        'where[status][equals]': 'published',
        limit: String(limit),
        depth: '1',
      }),
  })
}

// Get product by slug
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: productKeys.slug(slug),
    queryFn: async () => {
      const result = await fetchCollection<Product>('products', {
        'where[slug][equals]': slug,
        'where[status][equals]': 'published',
        depth: '2',
        limit: '1',
      })
      return result.docs[0] || null
    },
    enabled: !!slug,
  })
}

// Search products
export function useProductSearch(query: string) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: async () => {
      if (!query) return { docs: [], totalDocs: 0 }
      // Using the search endpoint with multiple field matching
      const result = await fetchApi<{ docs: Product[]; totalDocs: number }>(
        `/api/products?where[or][0][name][like]=${encodeURIComponent(query)}&where[or][1][shortDescription][like]=${encodeURIComponent(query)}&where[or][2][brand][like]=${encodeURIComponent(query)}&where[status][equals]=published&limit=48`,
      )
      return result
    },
    enabled: !!query,
  })
}

// Get related products
export function useRelatedProducts(productId: string, categoryId?: string) {
  return useQuery({
    queryKey: productKeys.related(productId),
    queryFn: () =>
      fetchCollection<Product>('products', {
        'where[id][not_equals]': productId,
        'where[status][equals]': 'published',
        ...(categoryId ? { 'where[category][equals]': categoryId } : {}),
        limit: '8',
        depth: '1',
      }),
    enabled: !!productId,
  })
}

// Get product reviews
export interface Review {
  id: string
  product: string | { id: string; name: string }
  author: string | { id: string; email: string; firstName: string; lastName: string }
  rating: number
  title?: string
  body?: string
  verified?: boolean
  status: 'pending' | 'approved' | 'rejected'
  helpfulCount: number
  createdAt: string
  updatedAt: string
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: productKeys.reviews(productId),
    queryFn: () =>
      fetchCollection<Review>('reviews', {
        'where[product][equals]': productId,
        'where[status][equals]': 'approved',
        sort: '-createdAt',
        depth: '1',
      }),
    enabled: !!productId,
  })
}

// Build product filters helper (matches server-side logic)
export function buildProductFilters(
  searchParams: URLSearchParams | Record<string, string | undefined>,
): Record<string, string> {
  const get = (k: string) =>
    searchParams instanceof URLSearchParams
      ? searchParams.get(k)
      : (searchParams as Record<string, string | undefined>)[k]

  const filters: Record<string, string> = { 'where[status][equals]': 'published' }

  const category = get('category')
  if (category) filters['where[category.slug][equals]'] = category

  const gender = get('gender')
  if (gender) filters['where[gender][in]'] = gender

  const minPrice = get('minPrice')
  if (minPrice) filters['where[variants.price][greater_than_equal]'] = minPrice

  const maxPrice = get('maxPrice')
  if (maxPrice) filters['where[variants.price][less_than_equal]'] = maxPrice

  const size = get('size')
  if (size) filters['where[variants.size][in]'] = size

  const color = get('color')
  if (color) filters['where[variants.color][in]'] = color

  const sort = get('sort')
  if (sort) {
    const sortMap: Record<string, string> = {
      newest: '-publishedAt',
      'price-asc': 'variants.price',
      'price-desc': '-variants.price',
      'best-reviewed': '-averageRating',
      'best-selling': '-reviewCount',
      featured: '-isFeatured',
    }
    filters.sort = sortMap[sort] || '-publishedAt'
  }

  const page = get('page')
  if (page) filters.page = page

  return filters
}

// Prefetch helpers for SSR
export async function prefetchProducts(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.prefetchQuery({
    queryKey: productKeys.list({}),
    queryFn: () => fetchCollection<Product>('products', { depth: '1' }),
  })
}

export async function prefetchProductBySlug(
  queryClient: ReturnType<typeof useQueryClient>,
  slug: string,
) {
  await queryClient.prefetchQuery({
    queryKey: productKeys.slug(slug),
    queryFn: async () => {
      const result = await fetchCollection<Product>('products', {
        'where[slug][equals]': slug,
        'where[status][equals]': 'published',
        depth: '2',
        limit: '1',
      })
      return result.docs[0] || null
    },
  })
}

export async function prefetchFeaturedProducts(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.prefetchQuery({
    queryKey: productKeys.list({ where: 'isFeatured', equals: 'true', limit: '8' }),
    queryFn: () =>
      fetchCollection<Product>('products', {
        'where[isFeatured][equals]': 'true',
        'where[status][equals]': 'published',
        limit: '8',
        depth: '1',
      }),
  })
}

export async function prefetchNewArrivals(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.prefetchQuery({
    queryKey: productKeys.list({ sort: '-publishedAt', limit: '8' }),
    queryFn: () =>
      fetchCollection<Product>('products', {
        sort: '-publishedAt',
        'where[status][equals]': 'published',
        limit: '8',
        depth: '1',
      }),
  })
}
