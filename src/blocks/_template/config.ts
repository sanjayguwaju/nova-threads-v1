import type { Block } from 'payload'

export const {{BlockName}}: Block = {
  slug: '{{blockSlug}}',
  labels: {
    singular: '{{BlockName}}',
    plural: '{{BlockName}} Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: '{{BlockName}} Title',
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Content',
    },
    // Add more fields as needed
  ],
}
