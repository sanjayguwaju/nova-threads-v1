import type { CollectionConfig, Field } from 'payload'

const variantFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'sku', type: 'text', required: true, admin: { width: '33%' } },
      { name: 'stock', type: 'number', defaultValue: 0, admin: { width: '33%' } },
      {
        name: 'trackInventory',
        type: 'checkbox',
        defaultValue: true,
        admin: { width: '33%' },
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'size',
        type: 'select',
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
        admin: { width: '33%' },
      },
      { name: 'color', type: 'text', admin: { width: '33%' } },
      { name: 'colorHex', type: 'text', admin: { width: '33%' } },
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'price', type: 'number', required: true, admin: { width: '33%' } },
      { name: 'compareAtPrice', type: 'number', admin: { width: '33%' } },
      { name: 'costPerItem', type: 'number', admin: { width: '33%' } },
    ],
  },
  {
    name: 'inventoryLocations',
    type: 'array',
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'locationName', type: 'text', admin: { width: '50%' } },
          { name: 'quantity', type: 'number', defaultValue: 0, admin: { width: '50%' } },
        ],
      },
    ],
  },
  { name: 'images', type: 'upload', relationTo: 'media', hasMany: true },
]

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'price', 'status', 'featured'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                {
                  name: 'slug',
                  type: 'text',
                  unique: true,
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'sku', type: 'text', unique: true, admin: { width: '33%' } },
                {
                  name: 'status',
                  type: 'select',
                  options: ['draft', 'published', 'archived'],
                  defaultValue: 'draft',
                  admin: { width: '33%' },
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '33%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Description',
          fields: [
            { name: 'shortDescription', type: 'textarea' },
            { name: 'longDescription', type: 'richText' },
          ],
        },
        {
          label: 'Categorization',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'category',
                  type: 'relationship',
                  relationTo: 'categories',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'tags',
                  type: 'relationship',
                  relationTo: 'tags',
                  hasMany: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'gender',
                  type: 'select',
                  options: ['unisex', 'men', 'women', 'kids'],
                  defaultValue: 'unisex',
                  admin: { width: '50%' },
                },
                { name: 'brand', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Pricing & Inventory',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'price', type: 'number', required: true, admin: { width: '33%' } },
                { name: 'compareAtPrice', type: 'number', admin: { width: '33%' } },
                { name: 'costPerItem', type: 'number', admin: { width: '33%', readOnly: true } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'weight', type: 'number', admin: { width: '50%' } },
                {
                  name: 'dimensions',
                  type: 'group',
                  admin: { width: '50%' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'length', type: 'number', admin: { width: '33%' } },
                        { name: 'width', type: 'number', admin: { width: '33%' } },
                        { name: 'height', type: 'number', admin: { width: '33%' } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [{ name: 'images', type: 'upload', relationTo: 'media', hasMany: true }],
        },
        {
          label: 'Variants',
          fields: [{ name: 'variants', type: 'array', fields: variantFields }],
        },
        {
          label: 'Inventory Locations',
          fields: [
            {
              name: 'inventoryLocations',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'locationName', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'quantity', type: 'number', defaultValue: 0, admin: { width: '25%' } },
                    {
                      name: 'lowStockThreshold',
                      type: 'number',
                      defaultValue: 5,
                      admin: { width: '25%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Multi-Currency',
          fields: [
            {
              name: 'currencyPrices',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'currency',
                      type: 'select',
                      options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR'],
                      required: true,
                      admin: { width: '33%' },
                    },
                    { name: 'price', type: 'number', required: true, admin: { width: '33%' } },
                    { name: 'compareAtPrice', type: 'number', admin: { width: '34%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Metafields',
          fields: [
            {
              name: 'metafields',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'namespace', type: 'text', required: true, admin: { width: '25%' } },
                    { name: 'key', type: 'text', required: true, admin: { width: '25%' } },
                    {
                      name: 'type',
                      type: 'select',
                      options: ['string', 'integer', 'decimal', 'boolean', 'json'],
                      defaultValue: 'string',
                      admin: { width: '25%' },
                    },
                    { name: 'value', type: 'text', required: true, admin: { width: '25%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            { name: 'material', type: 'text' },
            { name: 'careInstructions', type: 'textarea' },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', type: 'text' },
            { name: 'metaDescription', type: 'textarea' },
          ],
        },
        {
          label: 'Stats',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'averageRating', type: 'number', admin: { width: '50%', readOnly: true } },
                {
                  name: 'reviewCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '50%', readOnly: true },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
