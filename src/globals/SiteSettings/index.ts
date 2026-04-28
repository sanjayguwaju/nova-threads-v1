import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true },
  fields: [
    { name: 'storeName', type: 'text', defaultValue: 'NOVA THREADS' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    {
      name: 'heroSlides',
      type: 'array',
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'subheadline', type: 'text' },
        { name: 'cta', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'link', type: 'text' },
      ],
    },
    { name: 'announcement', type: 'text' },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'tiktok', type: 'text' },
        { name: 'pinterest', type: 'text' },
        { name: 'facebook', type: 'text' },
      ],
    },
    { name: 'shippingPolicy', type: 'richText' },
    { name: 'returnPolicy', type: 'richText' },
    {
      name: 'trendingSearches',
      type: 'array',
      fields: [{ name: 'term', type: 'text' }],
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
  ],
}
