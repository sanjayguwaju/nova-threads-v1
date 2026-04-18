import type { CollectionConfig } from 'payload'

const addressFields = [
  { name: 'firstName', type: 'text' as const },
  { name: 'lastName', type: 'text' as const },
  { name: 'line1', type: 'text' as const },
  { name: 'line2', type: 'text' as const },
  { name: 'city', type: 'text' as const },
  { name: 'state', type: 'text' as const },
  { name: 'zip', type: 'text' as const },
  { name: 'country', type: 'text' as const },
  { name: 'phone', type: 'text' as const },
]

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: { useAsTitle: 'orderNumber', defaultColumns: ['orderNumber', 'status', 'total', 'createdAt'] },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { customer: { equals: user?.id } }
    },
    create: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (value) return value
            const yr = new Date().getFullYear()
            const rand = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
            return `NT-${yr}-${rand}`
          },
        ],
      },
    },
    { name: 'customer', type: 'relationship', relationTo: 'users' },
    { name: 'guestEmail', type: 'email' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'variantSku', type: 'text' },
        { name: 'variantLabel', type: 'text' },
        { name: 'quantity', type: 'number' },
        { name: 'unitPrice', type: 'number' },
        { name: 'totalPrice', type: 'number' },
      ],
    },
    { name: 'subtotal', type: 'number' },
    { name: 'discount', type: 'number', defaultValue: 0 },
    { name: 'shipping', type: 'number', defaultValue: 0 },
    { name: 'tax', type: 'number', defaultValue: 0 },
    { name: 'total', type: 'number' },
    { name: 'coupon', type: 'relationship', relationTo: 'coupons' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'payment_failed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    },
    { name: 'shippingAddress', type: 'group', fields: addressFields },
    { name: 'billingAddress', type: 'group', fields: addressFields },
    { name: 'stripePaymentIntentId', type: 'text' },
    { name: 'stripeSessionId', type: 'text' },
    { name: 'trackingNumber', type: 'text' },
    { name: 'notes', type: 'textarea' },
    {
      name: 'timeline',
      type: 'array',
      fields: [
        { name: 'status', type: 'text' },
        { name: 'timestamp', type: 'date' },
        { name: 'note', type: 'text' },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        if (operation === 'update' && previousDoc?.status !== doc.status) {
          // TODO: send status-change email via Resend
        }
      },
    ],
  },
}
