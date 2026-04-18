import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 150, height: 150, position: 'centre' },
      { name: 'card', width: 400, height: 500, position: 'centre' },
      { name: 'hero', width: 1440, height: 900, position: 'centre' },
    ],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  },
  fields: [
    { name: 'alt', type: 'text' },
    { name: 'caption', type: 'text' },
  ],
}
