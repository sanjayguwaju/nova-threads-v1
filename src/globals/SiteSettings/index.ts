import type { GlobalConfig, Field } from 'payload'

const heroSlideFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'headline', type: 'text', admin: { width: '50%' } },
      { name: 'subheadline', type: 'text', admin: { width: '50%' } },
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'cta', type: 'text', admin: { width: '50%' } },
      { name: 'link', type: 'text', admin: { width: '50%' } },
    ],
  },
  { name: 'image', type: 'upload', relationTo: 'media' },
]

const seoFields: Field[] = [
  { name: 'metaTitle', type: 'text' },
  { name: 'metaDescription', type: 'textarea' },
  { name: 'ogImage', type: 'upload', relationTo: 'media' },
]

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branding',
          fields: [
            { name: 'storeName', type: 'text', defaultValue: 'NOVA THREADS' },
            {
              type: 'row',
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
                { name: 'favicon', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Homepage',
          fields: [
            { name: 'announcement', type: 'text' },
            { name: 'heroSlides', type: 'array', fields: heroSlideFields },
          ],
        },
        {
          label: 'Search',
          fields: [
            { name: 'trendingSearches', type: 'array', fields: [{ name: 'term', type: 'text' }] },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'socialLinks',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'instagram', type: 'text', admin: { width: '50%' } },
                    { name: 'tiktok', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'pinterest', type: 'text', admin: { width: '50%' } },
                    { name: 'facebook', type: 'text', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Policies',
          fields: [
            { name: 'shippingPolicy', type: 'richText' },
            { name: 'returnPolicy', type: 'richText' },
          ],
        },
        {
          label: 'SEO',
          fields: [{ name: 'seo', type: 'group', fields: seoFields }],
        },
        {
          label: 'Currency',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'defaultCurrency',
                  type: 'select',
                  defaultValue: 'USD',
                  options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR'],
                  admin: { width: '50%' },
                },
                {
                  name: 'enableMultiCurrency',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'supportedCurrencies',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'code',
                      type: 'select',
                      options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR'],
                      required: true,
                      admin: { width: '33%' },
                    },
                    { name: 'symbol', type: 'text', required: true, admin: { width: '33%' } },
                    {
                      name: 'exchangeRate',
                      type: 'number',
                      defaultValue: 1,
                      admin: { width: '34%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'isDefault',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'isActive',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
