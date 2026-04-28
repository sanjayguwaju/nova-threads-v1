import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonials Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'What customers say',
    },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'author',
          type: 'text',
          label: 'Author Name',
          required: true,
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
          required: true,
        },
        {
          name: 'body',
          type: 'textarea',
          label: 'Testimonial Text',
          required: true,
        },
        {
          name: 'rating',
          type: 'number',
          label: 'Rating',
          min: 1,
          max: 5,
          defaultValue: 5,
        },
        {
          name: 'verified',
          type: 'checkbox',
          label: 'Verified Purchase',
          defaultValue: true,
        },
        {
          name: 'date',
          type: 'text',
          label: 'Date Text',
          defaultValue: '2 weeks ago',
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
