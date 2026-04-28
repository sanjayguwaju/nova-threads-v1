import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Slider',
    plural: 'Hero Sliders',
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'headline',
          type: 'text',
          label: 'Headline',
          required: true,
        },
        {
          name: 'subheadline',
          type: 'text',
          label: 'Subheadline',
        },
        {
          name: 'cta',
          type: 'text',
          label: 'CTA Text',
          defaultValue: 'Shop Now',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
          defaultValue: '/shop',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
        },
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: true,
    },
    {
      name: 'autoplayDelay',
      type: 'number',
      label: 'Autoplay Delay (ms)',
      defaultValue: 6000,
      min: 1000,
      max: 30000,
    },
  ],
}
