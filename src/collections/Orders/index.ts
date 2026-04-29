import type { CollectionConfig, Field } from 'payload'
import { sendShippingNotificationEmail } from '@/lib/email'

const fulfillmentEventFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'status',
        type: 'select',
        options: ['pending', 'in_transit', 'delivered', 'failed', 'returned'],
        required: true,
        admin: { width: '33%' },
      },
      { name: 'location', type: 'text', admin: { width: '33%' } },
      { name: 'timestamp', type: 'date', admin: { width: '34%' } },
    ],
  },
  { name: 'message', type: 'text' },
  { name: 'trackingNumber', type: 'text' },
]

const returnItemFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'product', type: 'relationship', relationTo: 'products', admin: { width: '50%' } },
      { name: 'variantSku', type: 'text', admin: { width: '50%' } },
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'quantity', type: 'number', defaultValue: 1, admin: { width: '33%' } },
      { name: 'price', type: 'number', admin: { width: '33%' } },
      { name: 'refundAmount', type: 'number', admin: { width: '34%' } },
    ],
  },
  {
    name: 'returnReason',
    type: 'select',
    options: ['defective', 'wrong_item', 'not_as_described', 'changed_mind', 'other'],
  },
  { name: 'customerNotes', type: 'textarea' },
]

const returnFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'returnNumber',
        type: 'text',
        unique: true,
        admin: { width: '50%', readOnly: true },
        hooks: {
          beforeValidate: [
            ({ value }) => {
              if (value) return value
              const yr = new Date().getFullYear()
              const rand = Math.floor(Math.random() * 100000)
                .toString()
                .padStart(5, '0')
              return `RET-${yr}-${rand}`
            },
          ],
        },
      },
      {
        name: 'status',
        type: 'select',
        defaultValue: 'requested',
        options: [
          'requested',
          'approved',
          'received',
          'inspected',
          'refunded',
          'rejected',
          'closed',
        ],
        admin: { width: '50%' },
      },
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'requestedAt', type: 'date', admin: { width: '33%' } },
      { name: 'receivedAt', type: 'date', admin: { width: '33%' } },
      { name: 'refundedAt', type: 'date', admin: { width: '34%' } },
    ],
  },
  { name: 'items', type: 'array', fields: returnItemFields },
  {
    type: 'row',
    fields: [
      { name: 'totalRefundAmount', type: 'number', admin: { width: '50%' } },
      { name: 'restockingFee', type: 'number', defaultValue: 0, admin: { width: '50%' } },
    ],
  },
  { name: 'adminNotes', type: 'textarea' },
]

const addressFields: Field[] = [
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
      { name: 'phone', type: 'text', admin: { width: '50%' } },
    ],
  },
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
      type: 'tabs',
      tabs: [
        {
          label: 'Order Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'orderNumber',
                  type: 'text',
                  unique: true,
                  admin: { width: '50%', readOnly: true },
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
                {
                  name: 'customer',
                  type: 'relationship',
                  relationTo: 'users',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'guestEmail', type: 'email', admin: { width: '50%' } },
                { name: 'currency', type: 'text', defaultValue: 'USD', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Status',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  defaultValue: 'pending',
                  options: [
                    'pending',
                    'processing',
                    'shipped',
                    'delivered',
                    'cancelled',
                    'refunded',
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'paymentStatus',
                  type: 'select',
                  defaultValue: 'pending',
                  options: [
                    'pending',
                    'paid',
                    'failed',
                    'refunded',
                    'cod_pending',
                    'cod_collected',
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'paymentMethod',
                  type: 'select',
                  defaultValue: 'stripe',
                  options: ['stripe', 'cod', 'paypal', 'bank_transfer'],
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Items',
          fields: [
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
                    { name: 'quantity', type: 'number', defaultValue: 1, admin: { width: '33%' } },
                    { name: 'price', type: 'number', admin: { width: '33%' } },
                    { name: 'total', type: 'number', admin: { width: '34%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'subtotal', type: 'number', admin: { width: '33%' } },
                { name: 'shippingCost', type: 'number', admin: { width: '33%' } },
                { name: 'tax', type: 'number', admin: { width: '34%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'discount', type: 'number', admin: { width: '50%' } },
                { name: 'total', type: 'number', admin: { width: '50%' } },
              ],
            },
            { name: 'couponCode', type: 'text' },
          ],
        },
        {
          label: 'Shipping Address',
          fields: [{ name: 'shippingAddress', type: 'group', fields: addressFields }],
        },
        {
          label: 'Billing Address',
          fields: [{ name: 'billingAddress', type: 'group', fields: addressFields }],
        },
        {
          label: 'Shipping',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'shippingMethod', type: 'text', admin: { width: '50%' } },
                { name: 'trackingNumber', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Notes',
          fields: [{ name: 'notes', type: 'textarea' }],
        },
        {
          label: 'Invoice',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'invoiceNumber',
                  type: 'text',
                  unique: true,
                  admin: { width: '50%', readOnly: true },
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
                { name: 'invoiceDate', type: 'date', admin: { width: '25%', readOnly: true } },
                {
                  name: 'invoiceSent',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '25%', readOnly: true },
                },
              ],
            },
          ],
        },
        {
          label: 'Payment',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'stripePaymentIntentId',
                  type: 'text',
                  admin: { width: '50%', readOnly: true },
                },
                { name: 'paypalOrderId', type: 'text', admin: { width: '50%', readOnly: true } },
              ],
            },
            {
              name: 'isCOD',
              type: 'checkbox',
              defaultValue: false,
              admin: { readOnly: true },
            },
          ],
        },
        {
          label: 'Cash on Delivery',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'codStatus',
                  type: 'select',
                  defaultValue: 'pending',
                  options: [
                    'pending',
                    'out_for_delivery',
                    'delivery_attempted',
                    'delivered',
                    'amount_collected',
                    'cod_failed',
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'codAmount',
                  type: 'number',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'codCollectedAt', type: 'date', admin: { width: '33%' } },
                { name: 'codCollectedBy', type: 'text', admin: { width: '33%' } },
                {
                  name: 'codDeliveryAttempts',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '34%' },
                },
              ],
            },
            {
              name: 'codDeliveryNotes',
              type: 'textarea',
            },
            {
              name: 'codVerificationCode',
              type: 'text',
              admin: { readOnly: true },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (value || data?.paymentMethod !== 'cod') return value
                    return Math.random().toString(36).substring(2, 8).toUpperCase()
                  },
                ],
              },
            },
          ],
        },
        {
          label: 'Fulfillment',
          fields: [
            {
              name: 'fulfillmentEvents',
              type: 'array',
              fields: fulfillmentEventFields,
            },
            {
              name: 'shippedFromLocation',
              type: 'text',
            },
            {
              name: 'estimatedDeliveryDate',
              type: 'date',
            },
          ],
        },
        {
          label: 'Returns',
          fields: [
            { name: 'returns', type: 'array', fields: returnFields },
            {
              name: 'returnStatus',
              type: 'select',
              defaultValue: 'none',
              options: ['none', 'requested', 'in_progress', 'completed'],
              admin: { readOnly: true },
            },
          ],
        },
        {
          label: 'Draft Order',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'isDraft',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '33%' },
                },
                {
                  name: 'draftCreatedAt',
                  type: 'date',
                  admin: { width: '33%' },
                },
                {
                  name: 'draftExpiresAt',
                  type: 'date',
                  admin: { width: '34%' },
                },
              ],
            },
            { name: 'draftInvoiceSent', type: 'checkbox', defaultValue: false },
            { name: 'draftInvoiceUrl', type: 'text' },
          ],
        },
      ],
    },
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
