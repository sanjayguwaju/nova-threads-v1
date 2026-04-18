import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: { read: () => true },
  fields: [
    {
      name: 'mainNav',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'link', type: 'text' },
        {
          name: 'megaMenu',
          type: 'array',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'link', type: 'text' },
            { name: 'image', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
    {
      name: 'footerNav',
      type: 'array',
      fields: [
        { name: 'heading', type: 'text' },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'link', type: 'text' },
          ],
        },
      ],
    },
  ],
}
