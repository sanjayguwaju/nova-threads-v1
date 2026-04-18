'use server'

import { getPayload } from '../getPayload'
import { getCurrentUser } from './auth'

export async function submitReview(data: {
  product: string
  rating: number
  title: string
  body: string
}) {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Login required' }

  const payload = await getPayload()
  const orders = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { customer: { equals: user.id } },
        { 'items.product': { equals: data.product } },
        { status: { in: ['delivered', 'shipped'] } },
      ],
    },
    limit: 1,
  })
  const verified = orders.docs.length > 0

  await payload.create({
    collection: 'reviews',
    data: { ...data, author: user.id, verified, status: 'pending' } as any,
  })
  return { ok: true }
}
