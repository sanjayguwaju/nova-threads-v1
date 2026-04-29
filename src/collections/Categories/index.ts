import type { CollectionConfig } from 'payload'
import { generateSlug } from '../../lib/utils/generateSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
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
                {
                  name: 'slug',
                  type: 'text',
                  unique: true,
                  admin: { width: '50%' },
                  hooks: {
                    beforeValidate: [
                      ({ value, data }) =>
                        value || (data?.name ? generateSlug(data.name) : undefined),
                    ],
                  },
                },
              ],
            },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          label: 'Media',
          fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
        },
        {
          label: 'Settings',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'parent',
                  type: 'relationship',
                  relationTo: 'categories',
                  admin: { width: '50%' },
                },
                { name: 'order', type: 'number', defaultValue: 0, admin: { width: '25%' } },
                {
                  name: 'featuredOnHome',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '25%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
