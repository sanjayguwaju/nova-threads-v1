import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { id: { equals: user?.id } }
    },
    create: () => true,
    update: ({ req: { user } }) => user?.role === 'admin' || { id: { equals: user?.id } },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'phone', type: 'text' },
    { name: 'dateOfBirth', type: 'date' },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      options: ['customer', 'admin', 'editor'],
      access: { update: ({ req: { user } }) => user?.role === 'admin' },
    },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'firstName', type: 'text' },
        { name: 'lastName', type: 'text' },
        { name: 'line1', type: 'text' },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'zip', type: 'text' },
        { name: 'country', type: 'text' },
        { name: 'isDefault', type: 'checkbox' },
      ],
    },
    {
      name: 'wishlist',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    { name: 'stripeCustomerId', type: 'text', admin: { readOnly: true } },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          // TODO: send welcome email via Resend + create Stripe customer
        }
      },
    ],
  },
}
