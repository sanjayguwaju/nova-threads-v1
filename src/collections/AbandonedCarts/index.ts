import type { CollectionConfig } from 'payload'

export const AbandonedCarts: CollectionConfig = {
  slug: 'abandoned-carts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['customer', 'total', 'status', 'abandonedAt', 'recoveryStatus'],
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Cart Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'customer',
                  type: 'relationship',
                  relationTo: 'users',
                  admin: { width: '50%' },
                },
                { name: 'guestEmail', type: 'email', admin: { width: '50%' } },
              ],
            },
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'product',
                      type: 'relationship',
                      relationTo: 'products',
                      admin: { width: '50%' },
                    },
                    { name: 'variantSku', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'quantity', type: 'number', defaultValue: 1, admin: { width: '50%' } },
                    { name: 'price', type: 'number', admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'subtotal', type: 'number', admin: { width: '33%' } },
                { name: 'tax', type: 'number', admin: { width: '33%' } },
                { name: 'total', type: 'number', admin: { width: '34%' } },
              ],
            },
            { name: 'currency', type: 'text', defaultValue: 'USD' },
          ],
        },
        {
          label: 'Recovery',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'abandonedAt', type: 'date', admin: { width: '33%' } },
                { name: 'recoveredAt', type: 'date', admin: { width: '33%' } },
                {
                  name: 'recoveryStatus',
                  type: 'select',
                  defaultValue: 'pending',
                  options: ['pending', 'email_sent', 'email_opened', 'link_clicked', 'converted', 'expired'],
                  admin: { width: '34%' },
                },
              ],
            },
            {
              name: 'order',
              type: 'relationship',
              relationTo: 'orders',
            },
            {
              type: 'row',
              fields: [
                { name: 'recoveryEmailSentAt', type: 'date', admin: { width: '50%' } },
                { name: 'discountCode', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              name: 'recoveryLinkToken',
              type: 'text',
              admin: { readOnly: true },
            },
          ],
        },
        {
          label: 'Session',
          fields: [
            { name: 'ipAddress', type: 'text', admin: { readOnly: true } },
            { name: 'userAgent', type: 'text', admin: { readOnly: true } },
            { name: 'referrer', type: 'text' },
            {
              name: 'utmData',
              type: 'group',
              fields: [
                { name: 'source', type: 'text' },
                { name: 'medium', type: 'text' },
                { name: 'campaign', type: 'text' },
                { name: 'content', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
