import type { CollectionConfig } from 'payload'

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
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.toUpperCase() : value)],
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['percentage', 'fixed', 'free_shipping', 'buy_x_get_y'],
    },
    { name: 'value', type: 'number' },
    { name: 'minOrderAmount', type: 'number', defaultValue: 0 },
    { name: 'maxUses', type: 'number' },
    { name: 'usedCount', type: 'number', defaultValue: 0 },
    { name: 'validFrom', type: 'date' },
    { name: 'validUntil', type: 'date' },
    { name: 'applicableCategories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
