import { getPayload } from '../getPayload'

export async function getUserOrders(userId: string) {
  const payload = await getPayload()
  return payload.find({
    collection: 'orders',
    where: { customer: { equals: userId } },
    sort: '-createdAt',
    limit: 50,
  })
}

export async function getOrderById(id: string) {
  const payload = await getPayload()
  return payload.findByID({ collection: 'orders', id, depth: 2 })
}
