import type { CollectionConfig } from 'payload'
import { generateSlug } from '../lib/utils/generateSlug'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'status', 'publishedAt'] },
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
    { name: 'description', type: 'richText' },
    { name: 'shortDescription', type: 'textarea', maxLength: 160 },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    { name: 'brand', type: 'text' },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    {
      name: 'gender',
      type: 'select',
      options: ['men', 'women', 'unisex', 'kids'],
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        { name: 'sku', type: 'text', required: true },
        {
          name: 'size',
          type: 'select',
          options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
        },
        { name: 'color', type: 'text' },
        { name: 'colorHex', type: 'text' },
        { name: 'stock', type: 'number', defaultValue: 0 },
        { name: 'price', type: 'number', required: true },
        { name: 'compareAtPrice', type: 'number' },
        { name: 'images', type: 'upload', relationTo: 'media', hasMany: true },
      ],
    },
    { name: 'mainImage', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'materials',
      type: 'array',
      fields: [
        { name: 'material', type: 'text' },
        { name: 'percentage', type: 'number' },
      ],
    },
    { name: 'careInstructions', type: 'richText' },
    { name: 'features', type: 'array', fields: [{ name: 'feature', type: 'text' }] },
    { name: 'isNew', type: 'checkbox' },
    { name: 'isFeatured', type: 'checkbox' },
    { name: 'isBestSeller', type: 'checkbox' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: ['draft', 'published', 'archived'],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'averageRating', type: 'number', admin: { readOnly: true } },
    { name: 'reviewCount', type: 'number', admin: { readOnly: true } },
    { name: 'publishedAt', type: 'date' },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (!process.env.NEXT_PUBLIC_SERVER_URL || !process.env.REVALIDATE_SECRET) return
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/revalidate?path=/products/${doc.slug}&secret=${process.env.REVALIDATE_SECRET}`,
          )
        } catch {}
      },
    ],
  },
}
