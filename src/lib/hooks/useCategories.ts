import { useQuery } from '@tanstack/react-query'
import { fetchCollection, fetchDocument } from '../api/client'

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: Record<string, string>) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  slug: (slug: string) => [...categoryKeys.details(), 'slug', slug] as const,
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent?: string | Category | null
  image?: string | { id: string; url: string; alt: string }
  order?: number
  featuredOnHome?: boolean
  createdAt: string
  updatedAt: string
}

// Get all categories
export function useCategories(options?: { featured?: boolean }) {
  const params: Record<string, string> = { depth: '1' }
  if (options?.featured) {
    params['where[featuredOnHome][equals]'] = 'true'
  }

  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => fetchCollection<Category>('categories', params),
  })
}

// Get single category by ID
export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchDocument<Category>('categories', id),
    enabled: !!id,
  })
}

// Get category by slug
export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: categoryKeys.slug(slug),
    queryFn: async () => {
      const result = await fetchCollection<Category>('categories', {
        'where[slug][equals]': slug,
        depth: '1',
      })
      return result.docs[0] || null
    },
    enabled: !!slug,
  })
}

// Get featured categories for homepage
export function useFeaturedCategories(limit = 6) {
  return useQuery({
    queryKey: categoryKeys.list({ featured: 'true', limit: String(limit) }),
    queryFn: () =>
      fetchCollection<Category>('categories', {
        'where[featuredOnHome][equals]': 'true',
        limit: String(limit),
        sort: 'order',
      }),
  })
}
