import { getPayload } from '../getPayload'

export async function getCategories() {
  const payload = await getPayload()
  return payload.find({ collection: 'categories', sort: 'order', limit: 100 })
}

export async function getFeaturedCategories() {
  const payload = await getPayload()
  return payload.find({
    collection: 'categories',
    where: { featuredOnHome: { equals: true } },
    sort: 'order',
    limit: 6,
  })
}

export async function getCategoryBySlug(slug: string) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] || null
}
