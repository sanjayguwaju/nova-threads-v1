import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config.js'
import { generateSlug } from './lib/utils/generateSlug.js'

const payload = await getPayload({ config })

// Seed data configuration
const SEED_PASSWORD = 'password123'

// Demo media placeholder - in production, you'd upload actual images
const createMediaPlaceholder = async (filename: string, alt: string) => {
  try {
    const existing = await payload.find({
      collection: 'media',
      where: { alt: { equals: alt } },
      limit: 1,
    })
    if (existing.docs.length > 0) return existing.docs[0].id

    // Note: In a real scenario, you'd create actual media files
    // For demo purposes, we'll skip media creation or use external URLs
    console.log(`  ⚠️  Media placeholder: ${filename} (upload actual images via admin)`)
    return null
  } catch (error) {
    console.error(`Error creating media ${filename}:`, error)
    return null
  }
}

// Categories seed data
const categoriesData = [
  {
    name: 'T-Shirts',
    description: 'Comfortable and stylish t-shirts for every occasion',
    featuredOnHome: true,
    order: 1,
  },
  {
    name: 'Hoodies & Sweatshirts',
    description: 'Cozy hoodies and sweatshirts for all seasons',
    featuredOnHome: true,
    order: 2,
  },
  {
    name: 'Jackets & Coats',
    description: 'Stylish outerwear to keep you warm',
    featuredOnHome: true,
    order: 3,
  },
  {
    name: 'Pants & Shorts',
    description: 'Bottoms for every style and comfort',
    featuredOnHome: false,
    order: 4,
  },
  {
    name: 'Dresses',
    description: 'Elegant dresses for every occasion',
    featuredOnHome: true,
    order: 5,
  },
  {
    name: 'Accessories',
    description: 'Complete your look with our accessories',
    featuredOnHome: false,
    order: 6,
  },
  {
    name: 'Footwear',
    description: 'Shoes for every step of your journey',
    featuredOnHome: false,
    order: 7,
  },
  {
    name: 'Activewear',
    description: 'Performance wear for your active lifestyle',
    featuredOnHome: true,
    order: 8,
  },
]

// Tags seed data
const tagsData = [
  { name: 'New Arrival', color: '#10B981' },
  { name: 'Best Seller', color: '#F59E0B' },
  { name: 'Sale', color: '#EF4444' },
  { name: 'Limited Edition', color: '#8B5CF6' },
  { name: 'Sustainable', color: '#059669' },
  { name: 'Premium', color: '#6366F1' },
  { name: 'Casual', color: '#6B7280' },
  { name: 'Formal', color: '#1F2937' },
]

// Products seed data
const productsData = [
  {
    name: 'Classic Cotton T-Shirt',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'A timeless essential crafted from 100% organic cotton. Features a classic fit, breathable fabric, and pre-shrunk finish for lasting quality.',
              },
            ],
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    },
    shortDescription: 'Premium organic cotton t-shirt with classic fit and lasting comfort.',
    categoryName: 'T-Shirts',
    brand: 'NOVA THREADS',
    gender: 'unisex' as const,
    isNew: true,
    isFeatured: true,
    status: 'published' as const,
    variants: [
      {
        sku: 'CT-M-BLK',
        size: 'M' as const,
        color: 'Black',
        colorHex: '#000000',
        stock: 50,
        price: 29.99,
      },
      {
        sku: 'CT-L-BLK',
        size: 'L' as const,
        color: 'Black',
        colorHex: '#000000',
        stock: 45,
        price: 29.99,
      },
      {
        sku: 'CT-M-WHT',
        size: 'M' as const,
        color: 'White',
        colorHex: '#FFFFFF',
        stock: 60,
        price: 29.99,
      },
      {
        sku: 'CT-L-WHT',
        size: 'L' as const,
        color: 'White',
        colorHex: '#FFFFFF',
        stock: 55,
        price: 29.99,
      },
      {
        sku: 'CT-M-NVY',
        size: 'M' as const,
        color: 'Navy',
        colorHex: '#1E3A5F',
        stock: 40,
        price: 29.99,
      },
    ],
    materials: [{ material: 'Organic Cotton', percentage: 100 }],
    features: [
      { feature: 'Pre-shrunk' },
      { feature: 'Breathable fabric' },
      { feature: 'Classic fit' },
    ],
    tagNames: ['New Arrival', 'Best Seller'],
  },
  {
    name: 'Premium Hoodie',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Our signature hoodie features ultra-soft fleece lining, a spacious kangaroo pocket, and adjustable drawstring hood. Perfect for layering or lounging.',
              },
            ],
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    },
    shortDescription: 'Ultra-soft fleece hoodie with kangaroo pocket and adjustable hood.',
    categoryName: 'Hoodies & Sweatshirts',
    brand: 'NOVA THREADS',
    gender: 'unisex' as const,
    isBestSeller: true,
    isFeatured: true,
    status: 'published' as const,
    variants: [
      {
        sku: 'HD-M-GRY',
        size: 'M' as const,
        color: 'Heather Grey',
        colorHex: '#9CA3AF',
        stock: 30,
        price: 59.99,
        compareAtPrice: 79.99,
      },
      {
        sku: 'HD-L-GRY',
        size: 'L' as const,
        color: 'Heather Grey',
        colorHex: '#9CA3AF',
        stock: 35,
        price: 59.99,
        compareAtPrice: 79.99,
      },
      {
        sku: 'HD-XL-GRY',
        size: 'XL' as const,
        color: 'Heather Grey',
        colorHex: '#9CA3AF',
        stock: 25,
        price: 59.99,
        compareAtPrice: 79.99,
      },
      {
        sku: 'HD-M-BLK',
        size: 'M' as const,
        color: 'Black',
        colorHex: '#000000',
        stock: 40,
        price: 59.99,
      },
      {
        sku: 'HD-L-BLK',
        size: 'L' as const,
        color: 'Black',
        colorHex: '#000000',
        stock: 38,
        price: 59.99,
      },
    ],
    materials: [
      { material: 'Cotton', percentage: 80 },
      { material: 'Polyester', percentage: 20 },
    ],
    features: [
      { feature: 'Fleece lined' },
      { feature: 'Kangaroo pocket' },
      { feature: 'Adjustable hood' },
    ],
    tagNames: ['Best Seller', 'Sale'],
  },
  {
    name: 'Slim Fit Jeans',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Modern slim fit jeans with just the right amount of stretch. Features premium denim construction, classic five-pocket styling, and a versatile dark wash.',
              },
            ],
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    },
    shortDescription: 'Modern slim fit jeans with stretch denim and classic styling.',
    categoryName: 'Pants & Shorts',
    brand: 'NOVA THREADS',
    gender: 'men' as const,
    status: 'published' as const,
    variants: [
      {
        sku: 'JN-30-DKR',
        size: 'M' as const,
        color: 'Dark Rinse',
        colorHex: '#1F2937',
        stock: 25,
        price: 79.99,
      },
      {
        sku: 'JN-32-DKR',
        size: 'L' as const,
        color: 'Dark Rinse',
        colorHex: '#1F2937',
        stock: 30,
        price: 79.99,
      },
      {
        sku: 'JN-34-DKR',
        size: 'XL' as const,
        color: 'Dark Rinse',
        colorHex: '#1F2937',
        stock: 20,
        price: 79.99,
      },
      {
        sku: 'JN-30-LGT',
        size: 'M' as const,
        color: 'Light Wash',
        colorHex: '#6B7280',
        stock: 22,
        price: 79.99,
      },
    ],
    materials: [
      { material: 'Cotton', percentage: 98 },
      { material: 'Elastane', percentage: 2 },
    ],
    features: [
      { feature: 'Slim fit' },
      { feature: 'Five-pocket styling' },
      { feature: 'Stretch denim' },
    ],
    tagNames: ['Casual', 'Premium'],
  },
  {
    name: 'Floral Summer Dress',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'A breezy summer dress featuring a beautiful floral print, adjustable spaghetti straps, and a flattering A-line silhouette. Perfect for warm days and special occasions.',
              },
            ],
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    },
    shortDescription: 'Breezy floral dress with adjustable straps and A-line silhouette.',
    categoryName: 'Dresses',
    brand: 'NOVA THREADS',
    gender: 'women' as const,
    isNew: true,
    isFeatured: true,
    status: 'published' as const,
    variants: [
      {
        sku: 'DR-S-FLR',
        size: 'S' as const,
        color: 'Floral Print',
        colorHex: '#F472B6',
        stock: 20,
        price: 49.99,
      },
      {
        sku: 'DR-M-FLR',
        size: 'M' as const,
        color: 'Floral Print',
        colorHex: '#F472B6',
        stock: 25,
        price: 49.99,
      },
      {
        sku: 'DR-L-FLR',
        size: 'L' as const,
        color: 'Floral Print',
        colorHex: '#F472B6',
        stock: 18,
        price: 49.99,
      },
    ],
    materials: [{ material: 'Viscose', percentage: 100 }],
    features: [
      { feature: 'Adjustable straps' },
      { feature: 'A-line cut' },
      { feature: 'Lightweight' },
    ],
    tagNames: ['New Arrival', 'Limited Edition'],
  },
  {
    name: 'Puffer Jacket',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Stay warm in style with our lightweight puffer jacket. Features water-resistant shell, insulating fill, and packable design for easy travel.',
              },
            ],
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    },
    shortDescription: 'Lightweight water-resistant puffer jacket with packable design.',
    categoryName: 'Jackets & Coats',
    brand: 'NOVA THREADS',
    gender: 'unisex' as const,
    isBestSeller: true,
    status: 'published' as const,
    variants: [
      {
        sku: 'PJ-M-OLV',
        size: 'M' as const,
        color: 'Olive',
        colorHex: '#65A30D',
        stock: 15,
        price: 99.99,
      },
      {
        sku: 'PJ-L-OLV',
        size: 'L' as const,
        color: 'Olive',
        colorHex: '#65A30D',
        stock: 20,
        price: 99.99,
      },
      {
        sku: 'PJ-M-BLK',
        size: 'M' as const,
        color: 'Black',
        colorHex: '#000000',
        stock: 25,
        price: 99.99,
      },
      {
        sku: 'PJ-L-BLK',
        size: 'L' as const,
        color: 'Black',
        colorHex: '#000000',
        stock: 22,
        price: 99.99,
      },
    ],
    materials: [{ material: 'Nylon', percentage: 100 }],
    features: [
      { feature: 'Water-resistant' },
      { feature: 'Packable' },
      { feature: 'Lightweight insulation' },
    ],
    tagNames: ['Best Seller', 'Sustainable'],
  },
  {
    name: 'Athletic Joggers',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Performance joggers designed for both workouts and casual wear. Features moisture-wicking fabric, zippered pockets, and tapered fit.',
              },
            ],
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    },
    shortDescription: 'Performance joggers with moisture-wicking fabric and zippered pockets.',
    categoryName: 'Activewear',
    brand: 'NOVA THREADS',
    gender: 'unisex' as const,
    status: 'published' as const,
    variants: [
      {
        sku: 'JG-M-BLK',
        size: 'M' as const,
        color: 'Black',
        colorHex: '#000000',
        stock: 35,
        price: 44.99,
      },
      {
        sku: 'JG-L-BLK',
        size: 'L' as const,
        color: 'Black',
        colorHex: '#000000',
        stock: 40,
        price: 44.99,
      },
      {
        sku: 'JG-XL-BLK',
        size: 'XL' as const,
        color: 'Black',
        colorHex: '#000000',
        stock: 30,
        price: 44.99,
      },
      {
        sku: 'JG-M-GRY',
        size: 'M' as const,
        color: 'Charcoal',
        colorHex: '#4B5563',
        stock: 28,
        price: 44.99,
      },
    ],
    materials: [
      { material: 'Polyester', percentage: 88 },
      { material: 'Spandex', percentage: 12 },
    ],
    features: [
      { feature: 'Moisture-wicking' },
      { feature: 'Zippered pockets' },
      { feature: 'Tapered fit' },
    ],
    tagNames: ['Casual'],
  },
  {
    name: 'Classic Sneakers',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Timeless low-top sneakers with premium canvas upper and durable rubber sole. Versatile style that pairs with any outfit.',
              },
            ],
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    },
    shortDescription: 'Classic low-top sneakers with canvas upper and rubber sole.',
    categoryName: 'Footwear',
    brand: 'NOVA THREADS',
    gender: 'unisex' as const,
    isNew: true,
    status: 'published' as const,
    variants: [
      {
        sku: 'SN-8-WHT',
        size: 'One Size' as const,
        color: 'White',
        colorHex: '#FFFFFF',
        stock: 50,
        price: 59.99,
      },
      {
        sku: 'SN-9-WHT',
        size: 'One Size' as const,
        color: 'White',
        colorHex: '#FFFFFF',
        stock: 45,
        price: 59.99,
      },
      {
        sku: 'SN-10-WHT',
        size: 'One Size' as const,
        color: 'White',
        colorHex: '#FFFFFF',
        stock: 40,
        price: 59.99,
      },
      {
        sku: 'SN-8-BLK',
        size: 'One Size' as const,
        color: 'Black',
        colorHex: '#000000',
        stock: 48,
        price: 59.99,
      },
    ],
    materials: [{ material: 'Canvas', percentage: 100 }],
    features: [
      { feature: 'Cushioned insole' },
      { feature: 'Durable rubber sole' },
      { feature: 'Classic design' },
    ],
    tagNames: ['New Arrival', 'Casual'],
  },
  {
    name: 'Leather Crossbody Bag',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Elegant genuine leather crossbody bag with adjustable strap and multiple compartments. Perfect for everyday essentials.',
              },
            ],
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    },
    shortDescription: 'Genuine leather crossbody bag with adjustable strap.',
    categoryName: 'Accessories',
    brand: 'NOVA THREADS',
    gender: 'women' as const,
    isFeatured: true,
    status: 'published' as const,
    variants: [
      {
        sku: 'BG-ONE-BRN',
        size: 'One Size' as const,
        color: 'Brown',
        colorHex: '#92400E',
        stock: 12,
        price: 89.99,
      },
      {
        sku: 'BG-ONE-BLK',
        size: 'One Size' as const,
        color: 'Black',
        colorHex: '#000000',
        stock: 15,
        price: 89.99,
      },
    ],
    materials: [{ material: 'Genuine Leather', percentage: 100 }],
    features: [
      { feature: 'Adjustable strap' },
      { feature: 'Multiple compartments' },
      { feature: 'Premium leather' },
    ],
    tagNames: ['Premium', 'Limited Edition'],
  },
]

// Users seed data
const usersData = [
  {
    email: 'admin@novathreads.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as const,
    phone: '+1 (555) 123-4567',
  },
  {
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'Customer',
    role: 'customer' as const,
    phone: '+1 (555) 987-6543',
    addresses: [
      {
        label: 'Home',
        firstName: 'Demo',
        lastName: 'Customer',
        line1: '123 Fashion Street',
        line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
        isDefault: true,
      },
    ],
  },
  {
    email: 'sarah.johnson@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'customer' as const,
    phone: '+1 (555) 234-5678',
  },
  {
    email: 'mike.chen@example.com',
    firstName: 'Mike',
    lastName: 'Chen',
    role: 'customer' as const,
    phone: '+1 (555) 345-6789',
  },
  {
    email: 'emma.wilson@example.com',
    firstName: 'Emma',
    lastName: 'Wilson',
    role: 'customer' as const,
    phone: '+1 (555) 456-7890',
  },
]

// Coupons seed data
const couponsData = [
  {
    code: 'WELCOME20',
    type: 'percentage' as const,
    value: 20,
    minOrderAmount: 50,
    maxUses: 100,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    code: 'SUMMER25',
    type: 'percentage' as const,
    value: 25,
    minOrderAmount: 75,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    code: 'FREESHIP',
    type: 'free_shipping' as const,
    minOrderAmount: 100,
    isActive: true,
  },
  {
    code: 'FLASH50',
    type: 'fixed' as const,
    value: 50,
    minOrderAmount: 200,
    maxUses: 20,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    code: 'VIP10',
    type: 'percentage' as const,
    value: 10,
    minOrderAmount: 0,
    isActive: true,
  },
]

// Site settings seed data
const siteSettingsData = {
  storeName: 'NOVA THREADS',
  announcement: 'Free shipping on orders over $100 | Use code WELCOME20 for 20% off',
  heroSlides: [
    {
      headline: 'New Collection',
      subheadline: 'Discover the latest trends in sustainable fashion',
      cta: 'Shop Now',
      link: '/products',
    },
    {
      headline: 'Summer Essentials',
      subheadline: 'Light, breezy styles for the warmer days ahead',
      cta: 'Explore',
      link: '/categories/t-shirts',
    },
    {
      headline: 'Premium Quality',
      subheadline: 'Crafted with care from sustainable materials',
      cta: 'Learn More',
      link: '/about',
    },
  ],
  socialLinks: {
    instagram: 'https://instagram.com/novathreads',
    tiktok: 'https://tiktok.com/@novathreads',
    pinterest: 'https://pinterest.com/novathreads',
    facebook: 'https://facebook.com/novathreads',
  },
  shippingPolicy: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'We offer free standard shipping on all orders over $100. Standard delivery takes 5-7 business days. Express shipping available for an additional fee.',
            },
          ],
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  },
  returnPolicy: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Not completely satisfied? Return any item within 30 days of purchase for a full refund. Items must be unworn with original tags attached.',
            },
          ],
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  },
  trendingSearches: [
    { term: 't-shirts' },
    { term: 'hoodies' },
    { term: 'dresses' },
    { term: 'joggers' },
    { term: 'sale' },
  ],
  seo: {
    metaTitle: 'NOVA THREADS - Premium Fashion for Everyone',
    metaDescription:
      'Discover the latest trends in sustainable fashion. Shop our collection of premium clothing, accessories, and footwear.',
  },
}

// Navigation seed data
const navigationData = {
  mainNav: [
    { label: 'Shop', link: '/products' },
    {
      label: 'Categories',
      link: '/categories',
      megaMenu: [
        { label: 'T-Shirts', link: '/categories/t-shirts' },
        { label: 'Hoodies', link: '/categories/hoodies-sweatshirts' },
        { label: 'Jackets', link: '/categories/jackets-coats' },
        { label: 'Dresses', link: '/categories/dresses' },
        { label: 'Pants', link: '/categories/pants-shorts' },
        { label: 'Activewear', link: '/categories/activewear' },
      ],
    },
    { label: 'New Arrivals', link: '/products?sort=newest' },
    { label: 'Sale', link: '/products?filter=sale' },
  ],
  footerNav: [
    {
      heading: 'Shop',
      links: [
        { label: 'All Products', link: '/products' },
        { label: 'New Arrivals', link: '/products?sort=newest' },
        { label: 'Best Sellers', link: '/products?filter=bestseller' },
        { label: 'Sale', link: '/products?filter=sale' },
      ],
    },
    {
      heading: 'Help',
      links: [
        { label: 'FAQ', link: '/faq' },
        { label: 'Shipping', link: '/shipping' },
        { label: 'Returns', link: '/returns' },
        { label: 'Contact Us', link: '/contact' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About Us', link: '/about' },
        { label: 'Sustainability', link: '/sustainability' },
        { label: 'Careers', link: '/careers' },
        { label: 'Press', link: '/press' },
      ],
    },
  ],
}

async function seedCategories(): Promise<Record<string, string>> {
  console.log('🗂️  Seeding categories...')
  const categoryMap: Record<string, string> = {}

  for (const cat of categoriesData) {
    const existing = await payload.find({
      collection: 'categories',
      where: { name: { equals: cat.name } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      categoryMap[cat.name] = existing.docs[0].id
      console.log(`  ✓ Category "${cat.name}" already exists`)
    } else {
      const result = await payload.create({
        collection: 'categories',
        data: {
          name: cat.name,
          slug: generateSlug(cat.name),
          description: cat.description,
          featuredOnHome: cat.featuredOnHome,
          order: cat.order,
        },
      })
      categoryMap[cat.name] = result.id
      console.log(`  ✓ Created category "${cat.name}"`)
    }
  }

  return categoryMap
}

async function seedTags(): Promise<Record<string, string>> {
  console.log('🏷️  Seeding tags...')
  const tagMap: Record<string, string> = {}

  for (const tag of tagsData) {
    const existing = await payload.find({
      collection: 'tags',
      where: { name: { equals: tag.name } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      tagMap[tag.name] = existing.docs[0].id
      console.log(`  ✓ Tag "${tag.name}" already exists`)
    } else {
      const result = await payload.create({
        collection: 'tags',
        data: {
          name: tag.name,
          slug: generateSlug(tag.name),
          color: tag.color,
        },
      })
      tagMap[tag.name] = result.id
      console.log(`  ✓ Created tag "${tag.name}"`)
    }
  }

  return tagMap
}

async function seedProducts(
  categoryMap: Record<string, string>,
  tagMap: Record<string, string>,
): Promise<Record<string, string>> {
  console.log('👕 Seeding products...')
  const productMap: Record<string, string> = {}

  for (const prod of productsData) {
    const existing = await payload.find({
      collection: 'products',
      where: { name: { equals: prod.name } },
      limit: 1,
    })

    const tagIds = prod.tagNames.map((name) => tagMap[name]).filter(Boolean)

    if (existing.docs.length > 0) {
      productMap[prod.name] = existing.docs[0].id
      console.log(`  ✓ Product "${prod.name}" already exists`)
    } else {
      const result = await payload.create({
        collection: 'products',
        data: {
          name: prod.name,
          slug: generateSlug(prod.name),
          description: prod.description,
          shortDescription: prod.shortDescription,
          category: categoryMap[prod.categoryName],
          brand: prod.brand,
          tags: tagIds,
          gender: prod.gender,
          variants: prod.variants,
          materials: prod.materials,
          features: prod.features,
          isNew: prod.isNew || false,
          isFeatured: prod.isFeatured || false,
          isBestSeller: prod.isBestSeller || false,
          status: prod.status,
          publishedAt: new Date().toISOString(),
        } as any,
      })
      productMap[prod.name] = result.id
      console.log(`  ✓ Created product "${prod.name}" (${prod.variants.length} variants)`)
    }
  }

  return productMap
}

async function seedUsers(): Promise<Record<string, string>> {
  console.log('👤 Seeding users...')
  const userMap: Record<string, string> = {}

  for (const user of usersData) {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: user.email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      userMap[user.email] = existing.docs[0].id
      console.log(`  ✓ User "${user.email}" already exists`)
    } else {
      const result = await payload.create({
        collection: 'users',
        data: {
          email: user.email,
          password: SEED_PASSWORD,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses || [],
        },
      })
      userMap[user.email] = result.id
      console.log(`  ✓ Created user "${user.email}" (${user.role})`)
    }
  }

  return userMap
}

async function seedCoupons(categoryMap: Record<string, string>): Promise<Record<string, string>> {
  console.log('🎟️  Seeding coupons...')
  const couponMap: Record<string, string> = {}

  for (const coupon of couponsData) {
    const existing = await payload.find({
      collection: 'coupons',
      where: { code: { equals: coupon.code } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      couponMap[coupon.code] = existing.docs[0].id
      console.log(`  ✓ Coupon "${coupon.code}" already exists`)
    } else {
      const result = await payload.create({
        collection: 'coupons',
        data: {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          minOrderAmount: coupon.minOrderAmount || 0,
          maxUses: coupon.maxUses,
          usedCount: 0,
          validFrom: coupon.validFrom,
          validUntil: coupon.validUntil,
          isActive: coupon.isActive,
        },
      })
      couponMap[coupon.code] = result.id
      console.log(`  ✓ Created coupon "${coupon.code}" (${coupon.type})`)
    }
  }

  return couponMap
}

async function seedReviews(productMap: Record<string, string>, userMap: Record<string, string>) {
  console.log('⭐ Seeding reviews...')

  const reviewsData = [
    {
      productName: 'Classic Cotton T-Shirt',
      authorEmail: 'sarah.johnson@example.com',
      rating: 5,
      title: 'Perfect everyday tee!',
      body: 'So soft and comfortable. The fit is exactly as described. Will definitely be buying more colors!',
      verified: true,
    },
    {
      productName: 'Classic Cotton T-Shirt',
      authorEmail: 'mike.chen@example.com',
      rating: 4,
      title: 'Great quality',
      body: 'Really nice fabric quality. Runs a bit large so consider sizing down.',
      verified: true,
    },
    {
      productName: 'Premium Hoodie',
      authorEmail: 'demo@example.com',
      rating: 5,
      title: 'Best hoodie ever',
      body: 'This is my new favorite hoodie. So warm and cozy!',
      verified: true,
    },
    {
      productName: 'Premium Hoodie',
      authorEmail: 'emma.wilson@example.com',
      rating: 5,
      title: 'Amazing quality',
      body: 'The fleece lining is so soft. Worth every penny!',
      verified: true,
    },
    {
      productName: 'Slim Fit Jeans',
      authorEmail: 'sarah.johnson@example.com',
      rating: 4,
      title: 'Great fit',
      body: 'Love the stretch in these jeans. Very comfortable for all day wear.',
      verified: true,
    },
    {
      productName: 'Floral Summer Dress',
      authorEmail: 'emma.wilson@example.com',
      rating: 5,
      title: 'Gorgeous!',
      body: 'Beautiful print and so comfortable. Perfect for summer!',
      verified: true,
    },
    {
      productName: 'Puffer Jacket',
      authorEmail: 'mike.chen@example.com',
      rating: 5,
      title: 'Warm and lightweight',
      body: "Can't believe how warm this is while being so light. Great for travel!",
      verified: true,
    },
    {
      productName: 'Athletic Joggers',
      authorEmail: 'demo@example.com',
      rating: 4,
      title: 'Great for workouts',
      body: 'Love the zippered pockets. Fabric is breathable and comfortable.',
      verified: true,
    },
  ]

  for (const review of reviewsData) {
    const existing = await payload.find({
      collection: 'reviews',
      where: {
        and: [
          { product: { equals: productMap[review.productName] } },
          { author: { equals: userMap[review.authorEmail] } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ✓ Review for "${review.productName}" by ${review.authorEmail} already exists`)
    } else {
      await payload.create({
        collection: 'reviews',
        data: {
          product: productMap[review.productName],
          author: userMap[review.authorEmail],
          rating: review.rating,
          title: review.title,
          body: review.body,
          verified: review.verified,
          status: 'approved',
          helpfulCount: Math.floor(Math.random() * 20),
        },
      })
      console.log(`  ✓ Created review for "${review.productName}" (${review.rating} stars)`)
    }
  }
}

async function seedOrders(
  productMap: Record<string, string>,
  userMap: Record<string, string>,
  couponMap: Record<string, string>,
) {
  console.log('📦 Seeding orders...')

  const ordersData = [
    {
      customerEmail: 'demo@example.com',
      status: 'delivered' as const,
      items: [
        {
          productName: 'Classic Cotton T-Shirt',
          variantSku: 'CT-M-BLK',
          quantity: 2,
          unitPrice: 29.99,
        },
        { productName: 'Premium Hoodie', variantSku: 'HD-M-GRY', quantity: 1, unitPrice: 59.99 },
      ],
      couponCode: 'WELCOME20',
    },
    {
      customerEmail: 'sarah.johnson@example.com',
      status: 'shipped' as const,
      items: [
        {
          productName: 'Floral Summer Dress',
          variantSku: 'DR-M-FLR',
          quantity: 1,
          unitPrice: 49.99,
        },
        {
          productName: 'Leather Crossbody Bag',
          variantSku: 'BG-ONE-BRN',
          quantity: 1,
          unitPrice: 89.99,
        },
      ],
    },
    {
      customerEmail: 'mike.chen@example.com',
      status: 'processing' as const,
      items: [
        { productName: 'Slim Fit Jeans', variantSku: 'JN-32-DKR', quantity: 2, unitPrice: 79.99 },
        { productName: 'Classic Sneakers', variantSku: 'SN-9-WHT', quantity: 1, unitPrice: 59.99 },
      ],
      couponCode: 'SUMMER25',
    },
    {
      customerEmail: 'emma.wilson@example.com',
      status: 'pending' as const,
      items: [
        { productName: 'Puffer Jacket', variantSku: 'PJ-M-OLV', quantity: 1, unitPrice: 99.99 },
        { productName: 'Athletic Joggers', variantSku: 'JG-M-BLK', quantity: 2, unitPrice: 44.99 },
      ],
    },
    {
      customerEmail: 'demo@example.com',
      status: 'delivered' as const,
      items: [
        { productName: 'Athletic Joggers', variantSku: 'JG-M-GRY', quantity: 1, unitPrice: 44.99 },
      ],
      couponCode: 'VIP10',
    },
  ]

  for (const order of ordersData) {
    // Calculate totals
    const itemsWithTotals = order.items.map((item) => ({
      product: productMap[item.productName],
      variantSku: item.variantSku,
      variantLabel: item.variantSku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.quantity * item.unitPrice,
    }))

    const subtotal = itemsWithTotals.reduce((sum, item) => sum + item.totalPrice, 0)
    const shipping = subtotal > 100 ? 0 : 9.99
    let discount = 0

    if (order.couponCode === 'WELCOME20') discount = subtotal * 0.2
    else if (order.couponCode === 'SUMMER25') discount = subtotal * 0.25
    else if (order.couponCode === 'VIP10') discount = subtotal * 0.1
    else if (order.couponCode === 'FLASH50') discount = 50

    const total = subtotal + shipping - discount

    const existing = await payload.find({
      collection: 'orders',
      where: { customer: { equals: userMap[order.customerEmail] } },
      limit: 100,
    })

    // Check if similar order exists (simple check)
    const similarExists = existing.docs.some(
      (o) =>
        o.items &&
        o.items.length === itemsWithTotals.length &&
        o.items[0]?.variantSku === itemsWithTotals[0]?.variantSku,
    )

    if (similarExists) {
      console.log(`  ✓ Order for "${order.customerEmail}" already exists`)
    } else {
      await payload.create({
        collection: 'orders',
        data: {
          customer: userMap[order.customerEmail],
          items: itemsWithTotals,
          subtotal,
          discount,
          shipping,
          tax: 0,
          total,
          status: order.status,
          coupon: order.couponCode ? couponMap[order.couponCode] : undefined,
          shippingAddress: {
            firstName: 'Demo',
            lastName: 'Customer',
            line1: '123 Fashion Street',
            line2: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'USA',
            phone: '+1 (555) 987-6543',
          },
          billingAddress: {
            firstName: 'Demo',
            lastName: 'Customer',
            line1: '123 Fashion Street',
            line2: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'USA',
            phone: '+1 (555) 987-6543',
          },
          timeline: [
            {
              status: 'Order Placed',
              timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              note: 'Order received',
            },
            {
              status: 'Payment Confirmed',
              timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
              note: 'Payment processed',
            },
            ...(order.status !== 'pending'
              ? [
                  {
                    status: 'Processing',
                    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    note: 'Order being prepared',
                  },
                ]
              : []),
            ...(order.status === 'shipped' || order.status === 'delivered'
              ? [
                  {
                    status: 'Shipped',
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    note: 'Out for delivery',
                  },
                ]
              : []),
            ...(order.status === 'delivered'
              ? [
                  {
                    status: 'Delivered',
                    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    note: 'Package delivered',
                  },
                ]
              : []),
          ],
        },
      })
      console.log(`  ✓ Created order for "${order.customerEmail}" ($${total.toFixed(2)})`)
    }
  }
}

async function seedSiteSettings() {
  console.log('⚙️  Seeding site settings...')

  try {
    const existing = await payload.findGlobal({
      slug: 'site-settings',
    })

    if (existing && existing.storeName) {
      console.log('  ✓ Site settings already exist')
    } else {
      await payload.updateGlobal({
        slug: 'site-settings',
        data: siteSettingsData as any,
      })
      console.log('  ✓ Created site settings')
    }
  } catch (error) {
    // Global might not exist yet, try creating
    try {
      await payload.updateGlobal({
        slug: 'site-settings',
        data: siteSettingsData as any,
      })
      console.log('  ✓ Created site settings')
    } catch (e) {
      console.log('  ⚠️  Could not seed site settings:', (e as Error).message)
    }
  }
}

async function seedNavigation() {
  console.log('🧭 Seeding navigation...')

  try {
    const existing = await payload.findGlobal({
      slug: 'navigation',
    })

    if (existing && existing.mainNav && existing.mainNav.length > 0) {
      console.log('  ✓ Navigation already exists')
    } else {
      await payload.updateGlobal({
        slug: 'navigation',
        data: navigationData as any,
      })
      console.log('  ✓ Created navigation')
    }
  } catch (error) {
    try {
      await payload.updateGlobal({
        slug: 'navigation',
        data: navigationData as any,
      })
      console.log('  ✓ Created navigation')
    } catch (e) {
      console.log('  ⚠️  Could not seed navigation:', (e as Error).message)
    }
  }
}

async function seed() {
  console.log('\n🌱 Starting Nova Threads database seed...\n')

  try {
    // Seed in order of dependencies
    const categoryMap = await seedCategories()
    const tagMap = await seedTags()
    const productMap = await seedProducts(categoryMap, tagMap)
    const userMap = await seedUsers()
    const couponMap = await seedCoupons(categoryMap)
    await seedReviews(productMap, userMap)
    await seedOrders(productMap, userMap, couponMap)
    await seedSiteSettings()
    await seedNavigation()

    console.log('\n✅ Database seed completed successfully!')
    console.log('\n📋 Demo Credentials:')
    console.log('  Admin: admin@novathreads.com / password123')
    console.log('  Customer: demo@example.com / password123')
    console.log('\n🎟️  Active Coupons:')
    console.log('  WELCOME20 - 20% off orders $50+')
    console.log('  SUMMER25 - 25% off orders $75+')
    console.log('  FREESHIP - Free shipping on $100+')
    console.log('  FLASH50 - $50 off orders $200+')
    console.log('  VIP10 - 10% off any order')
    console.log('')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()
