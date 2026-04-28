import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: { useAsTitle: 'title' },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { status: { equals: 'approved' } }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'product', type: 'relationship', relationTo: 'products', required: true },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
    { name: 'title', type: 'text' },
    { name: 'body', type: 'textarea' },
    { name: 'verified', type: 'checkbox' },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'approved', 'rejected'],
    },
    { name: 'helpfulCount', type: 'number', defaultValue: 0 },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (doc.status !== 'approved') return
        const productId = typeof doc.product === 'object' ? doc.product.id : doc.product
        const result = await req.payload.find({
          collection: 'reviews',
          where: { and: [{ product: { equals: productId } }, { status: { equals: 'approved' } }] },
          limit: 1000,
        })
        const count = result.docs.length
        const avg = count ? result.docs.reduce((s: number, r: any) => s + (r.rating || 0), 0) / count : 0
        await req.payload.update({
          collection: 'products',
          id: productId,
          data: { averageRating: Math.round(avg * 10) / 10, reviewCount: count },
        })
      },
    ],
  },
}
