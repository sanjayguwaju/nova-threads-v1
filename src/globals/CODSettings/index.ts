import type { GlobalConfig } from 'payload'

export const CODSettings: GlobalConfig = {
  slug: 'cod-settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
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
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '33%' },
                },
                {
                  name: 'codFee',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '33%' },
                },
                {
                  name: 'maxCodAmount',
                  type: 'number',
                  defaultValue: 5000,
                  admin: { width: '34%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'minOrderAmount',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '50%' },
                },
                {
                  name: 'requireVerificationCode',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Restrictions',
          fields: [
            {
              name: 'allowedPincodes',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'pincode', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'areaName', type: 'text', admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              name: 'excludedPincodes',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'pincode', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'reason', type: 'text', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Risk Management',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'maxDeliveryAttempts',
                  type: 'number',
                  defaultValue: 3,
                  admin: { width: '33%' },
                },
                {
                  name: 'autoCancelAfterAttempts',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '33%' },
                },
                {
                  name: 'chargeForReturnShipping',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '34%' },
                },
              ],
            },
            {
              name: 'codRestrictedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
            },
            {
              name: 'codRestrictedCategories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
            },
          ],
        },
      ],
    },
  ],
}
