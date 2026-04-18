import type { Where } from 'payload'
import { getPayload } from '../getPayload'

export async function getProducts(
  params: {
    where?: Where
    sort?: string
    limit?: number
    page?: number
  } = {},
) {
  const payload = await getPayload()
  return payload.find({
    collection: 'products',
    where: { status: { equals: 'published' }, ...(params.where || {}) },
    sort: params.sort || '-publishedAt',
    limit: params.limit ?? 24,
    page: params.page ?? 1,
    depth: 2,
  })
}

export async function getProductBySlug(slug: string) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
}

export async function getRelatedProducts(productId: string, categoryId?: string) {
  const payload = await getPayload()
  return payload.find({
    collection: 'products',
    where: {
      and: [
        { id: { not_equals: productId } },
        { status: { equals: 'published' } },
        ...(categoryId ? [{ category: { equals: categoryId } }] : []),
      ],
    },
    limit: 8,
    depth: 1,
  })
}

export function buildProductWhere(
  searchParams: URLSearchParams | Record<string, string | undefined>,
): Where {
  const get = (k: string) =>
    searchParams instanceof URLSearchParams ? searchParams.get(k) : (searchParams as any)[k]

  const where: Where = { status: { equals: 'published' } }
  const and: Where[] = []

  const category = get('category')
  if (category) and.push({ 'category.slug': { equals: category } })

  const gender = get('gender')
  if (gender) and.push({ gender: { in: gender.split(',') } })

  const minPrice = get('minPrice')
  if (minPrice) and.push({ 'variants.price': { greater_than_equal: Number(minPrice) } as any })

  const maxPrice = get('maxPrice')
  if (maxPrice) and.push({ 'variants.price': { less_than_equal: Number(maxPrice) } as any })

  const size = get('size')
  if (size) and.push({ 'variants.size': { in: size.split(',') } })

  const color = get('color')
  if (color) and.push({ 'variants.color': { in: color.split(',') } })

  if (and.length) where.and = and
  return where
}

export function mapSort(sort?: string): string {
  switch (sort) {
    case 'newest':
      return '-publishedAt'
    case 'price-asc':
      return 'variants.price'
    case 'price-desc':
      return '-variants.price'
    case 'best-reviewed':
      return '-averageRating'
    case 'best-selling':
      return '-reviewCount'
    default:
      return '-isFeatured'
  }
}
