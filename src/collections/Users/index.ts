import type { CollectionConfig, Field } from 'payload'

const addressFields: Field[] = [
  { name: 'label', type: 'text' },
  {
    type: 'row',
    fields: [
      { name: 'firstName', type: 'text', admin: { width: '50%' } },
      { name: 'lastName', type: 'text', admin: { width: '50%' } },
    ],
  },
  { name: 'line1', type: 'text' },
  { name: 'line2', type: 'text' },
  {
    type: 'row',
    fields: [
      { name: 'city', type: 'text', admin: { width: '33%' } },
      { name: 'state', type: 'text', admin: { width: '33%' } },
      { name: 'zip', type: 'text', admin: { width: '34%' } },
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'country', type: 'text', admin: { width: '50%' } },
      { name: 'isDefault', type: 'checkbox', admin: { width: '50%' } },
    ],
  },
]

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
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'firstName', type: 'text', admin: { width: '50%' } },
                { name: 'lastName', type: 'text', admin: { width: '50%' } },
              ],
            },
            { name: 'avatar', type: 'upload', relationTo: 'media' },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', admin: { width: '50%' } },
                { name: 'dateOfBirth', type: 'date', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Role & Tier',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'role',
                  type: 'select',
                  defaultValue: 'customer',
                  options: ['customer', 'admin', 'editor'],
                  access: { update: ({ req: { user } }) => user?.role === 'admin' },
                  admin: { width: '50%' },
                },
                {
                  name: 'customerTier',
                  type: 'relationship',
                  relationTo: 'customer-tiers',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'lifetimeValue',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '33%', readOnly: true },
                },
                {
                  name: 'totalOrders',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '33%', readOnly: true },
                },
                {
                  name: 'tierUpdatedAt',
                  type: 'date',
                  admin: { width: '34%', readOnly: true },
                },
              ],
            },
            {
              name: 'isNewsletterSubscriber',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          label: 'Addresses',
          fields: [{ name: 'addresses', type: 'array', fields: addressFields }],
        },
        {
          label: 'Wishlist',
          fields: [
            { name: 'wishlist', type: 'relationship', relationTo: 'products', hasMany: true },
          ],
        },
        {
          label: 'Payment',
          fields: [{ name: 'stripeCustomerId', type: 'text', admin: { readOnly: true } }],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          try {
            const { sendWelcomeEmail } = await import('@/lib/email')
            await sendWelcomeEmail({ email: doc.email, firstName: doc.firstName })
          } catch (err) {
            console.error('Failed to send welcome email:', err)
          }

          try {
            const { stripe } = await import('@/lib/stripe/client')
            const customer = await stripe.customers.create({
              email: doc.email,
              name: [doc.firstName, doc.lastName].filter(Boolean).join(' ') || undefined,
            })
            await req.payload.update({
              collection: 'users',
              id: doc.id,
              data: { stripeCustomerId: customer.id },
            })
          } catch (stripeErr) {
            console.error('Failed to create Stripe customer:', stripeErr)
          }
        }
      },
    ],
  },
}
