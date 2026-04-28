import type { Block } from 'payload'

export const BrandStory: Block = {
  slug: 'brandStory',
  labels: {
    singular: 'Brand Story',
    plural: 'Brand Stories',
  },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: 'Section Label',
      defaultValue: 'Our Philosophy',
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline',
      required: true,
      defaultValue: 'Fewer, finer things — designed to be lived in, loved for years',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue: 'NOVA THREADS is a studio making considered clothes from natural materials, with transparent pricing and fair production. Every piece is made to last, designed to transcend seasons and trends.',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Story Image',
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics/Values',
      minRows: 1,
      maxRows: 3,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Value',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
      ],
      defaultValue: [
        { value: '100%', label: 'Natural materials' },
        { value: 'Fair', label: 'Production' },
        { value: 'Timeless', label: 'Design' },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Text',
      defaultValue: 'Our Story',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'CTA Link',
      defaultValue: '/about',
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Image Position',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}
