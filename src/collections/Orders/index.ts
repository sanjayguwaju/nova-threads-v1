import type { CollectionConfig } from 'payload'
import { sendShippingNotificationEmail } from '@/lib/email'

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
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'total', 'createdAt'],
  },
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
            const rand = Math.floor(Math.random() * 100000)
              .toString()
              .padStart(5, '0')
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
        { name: 'quantity', type: 'number', defaultValue: 1 },
        { name: 'price', type: 'number' },
        { name: 'total', type: 'number' },
      ],
    },
    { name: 'subtotal', type: 'number' },
    { name: 'shippingCost', type: 'number' },
    { name: 'tax', type: 'number' },
    { name: 'discount', type: 'number' },
    { name: 'total', type: 'number' },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'paid', 'failed', 'refunded'],
    },
    { name: 'shippingAddress', type: 'group', fields: addressFields },
    { name: 'billingAddress', type: 'group', fields: addressFields },
    { name: 'shippingMethod', type: 'text' },
    { name: 'trackingNumber', type: 'text' },
    { name: 'notes', type: 'textarea' },
    { name: 'couponCode', type: 'text' },
    { name: 'stripePaymentIntentId', type: 'text', admin: { readOnly: true } },
    {
      name: 'invoiceNumber',
      type: 'text',
      unique: true,
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (value) return value
            const yr = new Date().getFullYear()
            const rand = Math.floor(Math.random() * 100000)
              .toString()
              .padStart(5, '0')
            return `INV-${yr}-${rand}`
          },
        ],
      },
    },
    { name: 'invoiceSent', type: 'checkbox', defaultValue: false, admin: { readOnly: true } },
    { name: 'invoiceDate', type: 'date', admin: { readOnly: true } },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => {
        if (doc.status === 'shipped' && previousDoc?.status !== 'shipped') {
          try {
            await sendShippingNotificationEmail(doc)
          } catch (err) {
            console.error('Failed to send shipping notification:', err)
          }
        }
      },
    ],
  },
}
