import type { CollectionConfig } from 'payload'
import { generateSlug } from '../../lib/utils/generateSlug'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || (data?.name ? generateSlug(data.name) : undefined),
        ],
      },
    },
    { name: 'color', type: 'text' },
  ],
}
