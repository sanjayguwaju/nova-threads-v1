import type { Block } from 'payload'

export const FeaturedCategories: Block = {
  slug: 'featuredCategories',
  labels: {
    singular: 'Featured Categories',
    plural: 'Featured Categories Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Shop by Category',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Explore our curated collections',
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Categories',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
        },
        {
          name: 'overrideImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Override Image (optional)',
        },
      ],
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
      defaultValue: 'View All Categories',
    },
    {
      name: 'viewAllLink',
      type: 'text',
      label: 'View All Link',
      defaultValue: '/shop',
    },
  ],
}
