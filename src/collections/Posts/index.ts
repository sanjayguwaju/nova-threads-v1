import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'author'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                { name: 'slug', type: 'text', required: true, unique: true, admin: { width: '50%' } },
                {
                  name: 'status',
                  type: 'select',
                  defaultValue: 'draft',
                  options: ['draft', 'published', 'archived'],
                  admin: { width: '50%' },
                },
              ],
            },
            { name: 'excerpt', type: 'textarea' },
            { name: 'content', type: 'richText', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'author',
                  type: 'relationship',
                  relationTo: 'users',
                  admin: { width: '50%' },
                },
                { name: 'publishedAt', type: 'date', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            { name: 'featuredImage', type: 'upload', relationTo: 'media' },
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
          ],
        },
        {
          label: 'Categorization',
          fields: [
            { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'isFeatured',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '50%' },
                },
                {
                  name: 'allowComments',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', type: 'text' },
            { name: 'metaDescription', type: 'textarea' },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
