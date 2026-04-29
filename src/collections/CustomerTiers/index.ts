import type { CollectionConfig } from 'payload'

export const CustomerTiers: CollectionConfig = {
  slug: 'customer-tiers',
  admin: { useAsTitle: 'name' },
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
                { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'slug', type: 'text', required: true, unique: true, admin: { width: '50%' } },
              ],
            },
            { name: 'description', type: 'textarea' },
            {
              type: 'row',
              fields: [
                {
                  name: 'tierLevel',
                  type: 'number',
                  defaultValue: 1,
                  admin: { width: '33%' },
                },
                {
                  name: 'color',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'isActive',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '33%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Requirements',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'minLifetimeSpend',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '33%' },
                },
                {
                  name: 'minOrdersCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '33%' },
                },
                {
                  name: 'minAccountAgeDays',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '34%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Benefits',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'discountPercent',
                  type: 'number',
                  min: 0,
                  max: 100,
                  defaultValue: 0,
                  admin: { width: '33%' },
                },
                {
                  name: 'freeShipping',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '33%' },
                },
                {
                  name: 'earlyAccess',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '34%' },
                },
              ],
            },
            {
              name: 'exclusiveProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
            },
            {
              name: 'birthdayBonus',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'discountPercent',
                      type: 'number',
                      defaultValue: 10,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'validDays',
                      type: 'number',
                      defaultValue: 7,
                      admin: { width: '34%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
