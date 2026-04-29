import type { CollectionConfig, Field } from 'payload'

const buyXGetYFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'buyQuantity', type: 'number', defaultValue: 1, admin: { width: '25%' } },
      { name: 'buyProduct', type: 'relationship', relationTo: 'products', admin: { width: '25%' } },
      { name: 'getQuantity', type: 'number', defaultValue: 1, admin: { width: '25%' } },
      { name: 'getProduct', type: 'relationship', relationTo: 'products', admin: { width: '25%' } },
    ],
  },
  { name: 'getDiscountPercent', type: 'number', defaultValue: 100, min: 0, max: 100 },
]

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: { useAsTitle: 'code' },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'code',
                  type: 'text',
                  required: true,
                  unique: true,
                  admin: { width: '50%' },
                  hooks: {
                    beforeValidate: [
                      ({ value }) => (typeof value === 'string' ? value.toUpperCase() : value),
                    ],
                  },
                },
                {
                  name: 'triggerType',
                  type: 'select',
                  defaultValue: 'manual',
                  options: ['manual', 'automatic'],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: ['percentage', 'fixed', 'free_shipping', 'buy_x_get_y'],
                  admin: { width: '50%' },
                },
                { name: 'value', type: 'number', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'minOrderAmount',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '33%' },
                },
                { name: 'minQuantity', type: 'number', defaultValue: 1, admin: { width: '33%' } },
                { name: 'isActive', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
              ],
            },
          ],
        },
        {
          label: 'Usage Limits',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'maxUses', type: 'number', admin: { width: '33%' } },
                {
                  name: 'maxUsesPerCustomer',
                  type: 'number',
                  defaultValue: 1,
                  admin: { width: '33%' },
                },
                {
                  name: 'usedCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '33%', readOnly: true },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'validFrom', type: 'date', admin: { width: '50%' } },
                { name: 'validUntil', type: 'date', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Buy X Get Y',
          fields: [{ name: 'buyXGetYRules', type: 'array', fields: buyXGetYFields }],
        },
        {
          label: 'Products',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'applicableProducts',
                  type: 'relationship',
                  relationTo: 'products',
                  hasMany: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'excludedProducts',
                  type: 'relationship',
                  relationTo: 'products',
                  hasMany: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'applicableCategories',
                  type: 'relationship',
                  relationTo: 'categories',
                  hasMany: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'excludedCategories',
                  type: 'relationship',
                  relationTo: 'categories',
                  hasMany: true,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Customers',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'customerSegments',
                  type: 'select',
                  hasMany: true,
                  options: [
                    'new_customers',
                    'returning_customers',
                    'vip',
                    'wholesale',
                    'newsletter_subscribers',
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'applicableCustomerTiers',
                  type: 'relationship',
                  relationTo: 'customer-tiers',
                  hasMany: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'specificCustomers',
              type: 'relationship',
              relationTo: 'users',
              hasMany: true,
            },
          ],
        },
      ],
    },
  ],
}
