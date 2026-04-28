import type { Block } from 'payload'

export const Newsletter: Block = {
  slug: 'newsletter',
  labels: {
    singular: 'Newsletter',
    plural: 'Newsletter Blocks',
  },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: 'Section Label',
      defaultValue: 'Newsletter',
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline',
      defaultValue: 'Join The Studio',
    },
    {
      name: 'subheadline',
      type: 'textarea',
      label: 'Subheadline',
      defaultValue: 'Subscribe for exclusive previews, essays on mindful style, and 10% off your first order.',
    },
    {
      name: 'placeholder',
      type: 'text',
      label: 'Email Placeholder',
      defaultValue: 'Enter your email address',
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      defaultValue: 'Join Now',
    },
    {
      name: 'mobileButtonText',
      type: 'text',
      label: 'Mobile Button Text',
      defaultValue: 'Subscribe',
    },
    {
      name: 'privacyText',
      type: 'textarea',
      label: 'Privacy Text',
      defaultValue: 'By subscribing, you agree to receive marketing emails. Unsubscribe anytime.',
    },
    {
      name: 'successHeadline',
      type: 'text',
      label: 'Success Headline',
      defaultValue: 'Welcome to the Studio',
    },
    {
      name: 'successMessage',
      type: 'text',
      label: 'Success Message',
      defaultValue: 'Check your inbox for 10% off your first order.',
    },
    {
      name: 'trustBadges',
      type: 'array',
      label: 'Trust Badges',
      fields: [
        { name: 'text', type: 'text', required: true },
      ],
      defaultValue: [
        { text: 'No spam, ever' },
        { text: 'Unsubscribe anytime' },
        { text: '10% off first order' },
      ],
    },
  ],
}
