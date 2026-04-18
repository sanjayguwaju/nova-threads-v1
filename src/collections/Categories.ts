import type { CollectionConfig } from 'payload'
import { generateSlug } from '../lib/utils/generateSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || (data?.name ? generateSlug(data.name) : undefined),
        ],
      },
    },
    { name: 'description', type: 'textarea' },
    { name: 'parent', type: 'relationship', relationTo: 'categories' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'featuredOnHome', type: 'checkbox' },
  ],
}
