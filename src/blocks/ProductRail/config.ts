import type { Block } from 'payload'

export const ProductRail: Block = {
  slug: 'productRail',
  labels: {
    singular: 'Product Rail',
    plural: 'Product Rails',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Featured Products',
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxRows: 8,
      required: true,
    },
    {
      name: 'showGenderFilter',
      type: 'checkbox',
      label: 'Show Gender Filter',
      defaultValue: true,
    },
    {
      name: 'showViewAll',
      type: 'checkbox',
      label: 'Show View All Link',
      defaultValue: true,
    },
    {
      name: 'viewAllText',
      type: 'text',
      label: 'View All Text',
      defaultValue: 'View All',
    },
    {
      name: 'viewAllLink',
      type: 'text',
      label: 'View All Link',
      defaultValue: '/shop',
    },
  ],
}
