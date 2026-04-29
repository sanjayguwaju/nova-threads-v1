import type { CollectionConfig } from 'payload'

export const GiftCards: CollectionConfig = {
  slug: 'gift-cards',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'balance', 'initialValue', 'status'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { recipientEmail: { equals: user?.email } }
    },
    create: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Card Details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'code',
                  type: 'text',
                  required: true,
                  unique: true,
                  admin: { width: '50%', readOnly: true },
                  hooks: {
                    beforeValidate: [
                      ({ value }) => {
                        if (value) return value
                        return `GC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
                      },
                    ],
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  defaultValue: 'active',
                  options: ['active', 'redeemed', 'expired', 'disabled'],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'initialValue', type: 'number', required: true, admin: { width: '33%' } },
                { name: 'balance', type: 'number', required: true, admin: { width: '33%' } },
                { name: 'currency', type: 'text', defaultValue: 'USD', admin: { width: '34%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'expiresAt', type: 'date', admin: { width: '50%' } },
                { name: 'createdAt', type: 'date', admin: { width: '50%', readOnly: true } },
              ],
            },
          ],
        },
        {
          label: 'Recipient',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'recipientName', type: 'text', admin: { width: '50%' } },
                { name: 'recipientEmail', type: 'email', admin: { width: '50%' } },
              ],
            },
            { name: 'personalMessage', type: 'textarea' },
            {
              name: 'sender',
              type: 'relationship',
              relationTo: 'users',
              admin: { readOnly: true },
            },
          ],
        },
        {
          label: 'Transactions',
          fields: [
            {
              name: 'transactions',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      options: ['purchase', 'redemption', 'refund', 'adjustment'],
                      required: true,
                      admin: { width: '33%' },
                    },
                    { name: 'amount', type: 'number', required: true, admin: { width: '33%' } },
                    { name: 'date', type: 'date', required: true, admin: { width: '34%' } },
                  ],
                },
                {
                  name: 'order',
                  type: 'relationship',
                  relationTo: 'orders',
                },
                { name: 'note', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
