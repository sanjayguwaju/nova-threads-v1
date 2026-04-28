import type { GlobalConfig } from 'payload'

export const TopBar: GlobalConfig = {
  slug: 'top-bar',
  access: { read: () => true },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Show Top Bar',
      defaultValue: true,
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        { name: 'url', type: 'text', label: 'URL', required: true },
        { name: 'label', type: 'text', label: 'Label' },
      ],
    },
    {
      name: 'offers',
      type: 'array',
      label: 'Promotional Offers',
      fields: [
        { name: 'text', type: 'text', label: 'Offer Text', required: true },
        { name: 'link', type: 'text', label: 'Link URL (optional)' },
      ],
    },
    {
      name: 'showContactLink',
      type: 'checkbox',
      label: 'Show Contact Link',
      defaultValue: true,
    },
    {
      name: 'contactLinkText',
      type: 'text',
      label: 'Contact Link Text',
      defaultValue: 'Contact Us',
    },
    {
      name: 'contactLinkUrl',
      type: 'text',
      label: 'Contact Link URL',
      defaultValue: '/contact',
    },
    {
      name: 'followUsText',
      type: 'text',
      label: 'Follow Us Text',
      defaultValue: 'Follow Us',
    },
  ],
}
