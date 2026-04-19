// Mock products with real Unsplash images for development/demo purposes
export const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    slug: 'leather-crossbody-bag',
    name: 'Leather Crossbody Bag',
    shortDescription: 'Premium Italian leather with gold-tone hardware',
    isNew: false,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop',
      sizes: {
        card: { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop' },
        hero: { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=1600&fit=crop' },
      }
    },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop', sizes: { card: { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop' } } },
    ],
    variants: [
      { sku: 'LCB-001-BRN', color: 'Brown', colorHex: '#8B4513', size: 'One Size', price: 89.99, stock: 15 },
      { sku: 'LCB-001-BLK', color: 'Black', colorHex: '#000000', size: 'One Size', price: 89.99, stock: 20 },
    ],
    category: { id: 'cat-1', name: 'Accessories', slug: 'accessories' },
  },
  {
    id: 'prod-2',
    slug: 'floral-summer-dress',
    name: 'Floral Summer Dress',
    shortDescription: 'Lightweight cotton with delicate floral print',
    isNew: true,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop',
      sizes: {
        card: { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop' },
        hero: { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&h=1600&fit=crop' },
      }
    },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop', sizes: { card: { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop' } } },
    ],
    variants: [
      { sku: 'FSD-001-S', color: 'Floral', colorHex: '#FFB6C1', size: 'S', price: 129.99, stock: 10 },
      { sku: 'FSD-001-M', color: 'Floral', colorHex: '#FFB6C1', size: 'M', price: 129.99, stock: 15 },
      { sku: 'FSD-001-L', color: 'Floral', colorHex: '#FFB6C1', size: 'L', price: 129.99, stock: 8 },
    ],
    category: { id: 'cat-2', name: 'Women', slug: 'women' },
  },
  {
    id: 'prod-3',
    slug: 'merino-wool-knit',
    name: 'Merino Wool Knit Sweater',
    shortDescription: 'Soft merino wool with ribbed cuffs and hem',
    isNew: false,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
      sizes: {
        card: { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop' },
        hero: { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=1600&fit=crop' },
      }
    },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=800&fit=crop', sizes: { card: { url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=800&fit=crop' } } },
    ],
    variants: [
      { sku: 'MWK-001-CRM-S', color: 'Cream', colorHex: '#F5F5DC', size: 'S', price: 149.99, stock: 12 },
      { sku: 'MWK-001-CRM-M', color: 'Cream', colorHex: '#F5F5DC', size: 'M', price: 149.99, stock: 18, compareAtPrice: 179.99 },
      { sku: 'MWK-001-CRM-L', color: 'Cream', colorHex: '#F5F5DC', size: 'L', price: 149.99, stock: 5 },
    ],
    category: { id: 'cat-2', name: 'Women', slug: 'women' },
  },
  {
    id: 'prod-4',
    slug: 'classic-trench-coat',
    name: 'Classic Trench Coat',
    shortDescription: 'Water-resistant cotton gabardine with belt',
    isNew: true,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
      sizes: {
        card: { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop' },
        hero: { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=1600&fit=crop' },
      }
    },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop', sizes: { card: { url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop' } } },
    ],
    variants: [
      { sku: 'CTC-001-BEG-XS', color: 'Beige', colorHex: '#F5F5DC', size: 'XS', price: 249.99, stock: 8 },
      { sku: 'CTC-001-BEG-S', color: 'Beige', colorHex: '#F5F5DC', size: 'S', price: 249.99, stock: 12 },
      { sku: 'CTC-001-BEG-M', color: 'Beige', colorHex: '#F5F5DC', size: 'M', price: 249.99, stock: 15 },
      { sku: 'CTC-001-BEG-L', color: 'Beige', colorHex: '#F5F5DC', size: 'L', price: 249.99, stock: 10 },
    ],
    category: { id: 'cat-2', name: 'Women', slug: 'women' },
  },
  {
    id: 'prod-5',
    slug: 'slim-fit-jeans',
    name: 'Slim Fit Jeans',
    shortDescription: 'Stretch denim with classic five-pocket styling',
    isNew: false,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1541099649107-f6acef9c94c0?w=600&h=800&fit=crop',
      sizes: {
        card: { url: 'https://images.unsplash.com/photo-1541099649107-f6acef9c94c0?w=600&h=800&fit=crop' },
        hero: { url: 'https://images.unsplash.com/photo-1541099649107-f6acef9c94c0?w=1200&h=1600&fit=crop' },
      }
    },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&h=800&fit=crop', sizes: { card: { url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&h=800&fit=crop' } } },
    ],
    variants: [
      { sku: 'SFJ-001-BLU-28', color: 'Blue', colorHex: '#4169E1', size: '28', price: 79.99, stock: 20 },
      { sku: 'SFJ-001-BLU-30', color: 'Blue', colorHex: '#4169E1', size: '30', price: 79.99, stock: 25 },
      { sku: 'SFJ-001-BLU-32', color: 'Blue', colorHex: '#4169E1', size: '32', price: 79.99, stock: 18 },
      { sku: 'SFJ-001-BLU-34', color: 'Blue', colorHex: '#4169E1', size: '34', price: 79.99, stock: 15 },
    ],
    category: { id: 'cat-3', name: 'Men', slug: 'men' },
  },
  {
    id: 'prod-6',
    slug: 'cashmere-scarf',
    name: 'Cashmere Scarf',
    shortDescription: 'Luxurious cashmere with fringed edges',
    isNew: true,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop',
      sizes: {
        card: { url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop' },
        hero: { url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=1200&h=1600&fit=crop' },
      }
    },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=800&fit=crop', sizes: { card: { url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=800&fit=crop' } } },
    ],
    variants: [
      { sku: 'CS-001-GRY', color: 'Grey', colorHex: '#808080', size: 'One Size', price: 59.99, stock: 30 },
      { sku: 'CS-001-NVY', color: 'Navy', colorHex: '#000080', size: 'One Size', price: 59.99, stock: 25 },
      { sku: 'CS-001-CAM', color: 'Camel', colorHex: '#C19A6B', size: 'One Size', price: 59.99, stock: 20 },
    ],
    category: { id: 'cat-1', name: 'Accessories', slug: 'accessories' },
  },
  {
    id: 'prod-7',
    slug: 'white-linen-shirt',
    name: 'White Linen Shirt',
    shortDescription: 'Breathable linen with relaxed fit',
    isNew: false,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
      sizes: {
        card: { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop' },
        hero: { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=1600&fit=crop' },
      }
    },
    gallery: [],
    variants: [
      { sku: 'WLS-001-WHT-S', color: 'White', colorHex: '#FFFFFF', size: 'S', price: 89.99, stock: 15 },
      { sku: 'WLS-001-WHT-M', color: 'White', colorHex: '#FFFFFF', size: 'M', price: 89.99, stock: 20 },
      { sku: 'WLS-001-WHT-L', color: 'White', colorHex: '#FFFFFF', size: 'L', price: 89.99, stock: 18 },
    ],
    category: { id: 'cat-3', name: 'Men', slug: 'men' },
  },
  {
    id: 'prod-8',
    slug: 'pleated-midi-skirt',
    name: 'Pleated Midi Skirt',
    shortDescription: 'Elegant pleats with elastic waistband',
    isNew: true,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0bedb?w=600&h=800&fit=crop',
      sizes: {
        card: { url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0bedb?w=600&h=800&fit=crop' },
        hero: { url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0bedb?w=1200&h=1600&fit=crop' },
      }
    },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?w=600&h=800&fit=crop', sizes: { card: { url: 'https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?w=600&h=800&fit=crop' } } },
    ],
    variants: [
      { sku: 'PMS-001-BLK-XS', color: 'Black', colorHex: '#000000', size: 'XS', price: 119.99, stock: 10 },
      { sku: 'PMS-001-BLK-S', color: 'Black', colorHex: '#000000', size: 'S', price: 119.99, stock: 15 },
      { sku: 'PMS-001-BLK-M', color: 'Black', colorHex: '#000000', size: 'M', price: 119.99, stock: 12 },
    ],
    category: { id: 'cat-2', name: 'Women', slug: 'women' },
  },
]

// Mock categories
export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Accessories', slug: 'accessories' },
  { id: 'cat-2', name: 'Women', slug: 'women' },
  { id: 'cat-3', name: 'Men', slug: 'men' },
  { id: 'cat-4', name: 'Sale', slug: 'sale' },
]

// Helper to get products with fallback to mock data
export function getMockProducts() {
  return { docs: MOCK_PRODUCTS, totalDocs: MOCK_PRODUCTS.length }
}

export function getMockCategories() {
  return { docs: MOCK_CATEGORIES, totalDocs: MOCK_CATEGORIES.length }
}

export function getMockProductBySlug(slug: string) {
  return MOCK_PRODUCTS.find(p => p.slug === slug) || null
}

export function getRelatedMockProducts(productId: string, categoryId?: string) {
  const product = MOCK_PRODUCTS.find(p => p.id === productId)
  if (!product) return { docs: [] }
  
  // Get products in same category, excluding current product
  const related = MOCK_PRODUCTS.filter(
    p => p.id !== productId && p.category?.id === categoryId
  ).slice(0, 4)
  
  return { docs: related }
}
