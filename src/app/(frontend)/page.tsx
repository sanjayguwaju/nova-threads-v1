import { HeroSlider } from '@/components/home/HeroSlider'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { ProductRail } from '@/components/home/ProductRail'
import { BrandStory } from '@/components/home/BrandStory'
import { Testimonials } from '@/components/home/Testimonials'
import { Newsletter } from '@/components/home/Newsletter'

// Mock Products Data
const mockProducts = [
  {
    id: '1',
    slug: 'cashmere-blend-coat',
    name: 'Cashmere Blend Coat',
    shortDescription: 'Premium wool blend overcoat',
    isNew: true,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
      sizes: {
        card: {
          url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
        },
      },
    },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop' },
    ],
    variants: [
      { price: 425, compareAtPrice: 550, color: 'Camel', colorHex: '#C4A77D' },
      { price: 425, compareAtPrice: 550, color: 'Charcoal', colorHex: '#36454F' },
    ],
  },
  {
    id: '2',
    slug: 'merino-wool-knit',
    name: 'Merino Wool Knit',
    shortDescription: 'Soft merino crew neck sweater',
    isNew: false,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
      sizes: {
        card: {
          url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
        },
      },
    },
    gallery: [],
    variants: [
      { price: 185, compareAtPrice: null, color: 'Ivory', colorHex: '#FFFFF0' },
      { price: 185, compareAtPrice: null, color: 'Navy', colorHex: '#1B3A5F' },
      { price: 185, compareAtPrice: null, color: 'Forest', colorHex: '#2F4F2F' },
    ],
  },
  {
    id: '3',
    slug: 'linen-relaxed-trousers',
    name: 'Linen Relaxed Trousers',
    shortDescription: 'Breathable summer essential',
    isNew: true,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
      sizes: {
        card: {
          url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
        },
      },
    },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop' },
    ],
    variants: [
      { price: 145, compareAtPrice: null, color: 'Sand', colorHex: '#C2B280' },
      { price: 145, compareAtPrice: null, color: 'Black', colorHex: '#1a1a1a' },
    ],
  },
  {
    id: '4',
    slug: 'leather-crossbody-bag',
    name: 'Leather Crossbody Bag',
    shortDescription: 'Italian leather craftsmanship',
    isNew: false,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop',
      sizes: {
        card: {
          url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop',
        },
      },
    },
    gallery: [],
    variants: [
      { price: 295, compareAtPrice: 375, color: 'Brown', colorHex: '#8B4513' },
      { price: 295, compareAtPrice: 375, color: 'Black', colorHex: '#1a1a1a' },
    ],
  },
]

const newArrivals = [
  {
    id: '5',
    slug: 'silk-blouse',
    name: 'Silk Blouse',
    shortDescription: 'Elegant silk button-down',
    isNew: true,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
      sizes: {
        card: {
          url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
        },
      },
    },
    gallery: [],
    variants: [
      { price: 220, compareAtPrice: null, color: 'Blush', colorHex: '#DE5D83' },
      { price: 220, compareAtPrice: null, color: 'White', colorHex: '#FFFFFF' },
    ],
  },
  {
    id: '6',
    slug: 'structured-blazer',
    name: 'Structured Blazer',
    shortDescription: 'Tailored fit office essential',
    isNew: true,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
      sizes: {
        card: {
          url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
        },
      },
    },
    gallery: [],
    variants: [
      { price: 350, compareAtPrice: null, color: 'Navy', colorHex: '#1B3A5F' },
      { price: 350, compareAtPrice: null, color: 'Grey', colorHex: '#808080' },
    ],
  },
  {
    id: '7',
    slug: 'cashmere-scarf',
    name: 'Cashmere Scarf',
    shortDescription: 'Ultra-soft winter accessory',
    isNew: true,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop',
      sizes: {
        card: {
          url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop',
        },
      },
    },
    gallery: [],
    variants: [
      { price: 125, compareAtPrice: null, color: 'Camel', colorHex: '#C4A77D' },
      { price: 125, compareAtPrice: null, color: 'Grey', colorHex: '#808080' },
      { price: 125, compareAtPrice: null, color: 'Navy', colorHex: '#1B3A5F' },
    ],
  },
  {
    id: '8',
    slug: 'wide-leg-trousers',
    name: 'Wide Leg Trousers',
    shortDescription: 'Modern silhouette pants',
    isNew: true,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop',
      sizes: {
        card: {
          url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop',
        },
      },
    },
    gallery: [],
    variants: [
      { price: 165, compareAtPrice: null, color: 'Black', colorHex: '#1a1a1a' },
      { price: 165, compareAtPrice: null, color: 'Cream', colorHex: '#FFFDD0' },
    ],
  },
]

const bestSellers = [
  {
    id: '9',
    slug: 'classic-white-shirt',
    name: 'Classic White Shirt',
    shortDescription: 'Timeless cotton button-up',
    isNew: false,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
      sizes: {
        card: {
          url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
        },
      },
    },
    gallery: [],
    variants: [
      { price: 95, compareAtPrice: null, color: 'White', colorHex: '#FFFFFF' },
      { price: 95, compareAtPrice: null, color: 'Light Blue', colorHex: '#ADD8E6' },
    ],
  },
  {
    id: '10',
    slug: 'wool-trench-coat',
    name: 'Wool Trench Coat',
    shortDescription: 'Iconic belted trench',
    isNew: false,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop',
      sizes: {
        card: {
          url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop',
        },
      },
    },
    gallery: [],
    variants: [
      { price: 485, compareAtPrice: null, color: 'Camel', colorHex: '#C4A77D' },
      { price: 485, compareAtPrice: null, color: 'Navy', colorHex: '#1B3A5F' },
    ],
  },
  {
    id: '11',
    slug: 'knit-cardigan',
    name: 'Knit Cardigan',
    shortDescription: 'Relaxed fit layering piece',
    isNew: false,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop',
      sizes: {
        card: {
          url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop',
        },
      },
    },
    gallery: [],
    variants: [
      { price: 165, compareAtPrice: null, color: 'Oatmeal', colorHex: '#E6DCC4' },
      { price: 165, compareAtPrice: null, color: 'Sage', colorHex: '#9DC183' },
    ],
  },
  {
    id: '12',
    slug: 'leather-loafers',
    name: 'Leather Loafers',
    shortDescription: 'Handmade Italian leather',
    isNew: false,
    mainImage: {
      url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop',
      sizes: {
        card: {
          url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop',
        },
      },
    },
    gallery: [],
    variants: [
      { price: 275, compareAtPrice: 350, color: 'Black', colorHex: '#1a1a1a' },
      { price: 275, compareAtPrice: 350, color: 'Brown', colorHex: '#8B4513' },
    ],
  },
]

// Mock Hero Slides
const mockHeroSlides = [
  {
    headline: 'Quiet luxury for everyday wear',
    subheadline: 'Autumn/Winter collection now available',
    cta: 'Shop New In',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop',
    link: '/shop?sort=newest',
  },
  {
    headline: 'Made to last',
    subheadline: 'Sustainably crafted essentials',
    cta: 'Explore',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop',
    link: '/shop',
  },
]

// Mock Categories
const mockCategories = [
  {
    id: '1',
    name: 'Outerwear',
    slug: 'outerwear',
    image: {
      url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=1200&fit=crop',
    },
  },
  {
    id: '2',
    name: 'Knitwear',
    slug: 'knitwear',
    image: {
      url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=600&fit=crop',
    },
  },
  {
    id: '3',
    name: 'Accessories',
    slug: 'accessories',
    image: {
      url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop',
    },
  },
]

export default function HomePage() {
  return (
    <div className="home">
      <HeroSlider slides={mockHeroSlides} />
      <FeaturedCategories categories={mockCategories} />
      <ProductRail label="Featured" products={mockProducts} />
      <ProductRail label="New Arrivals" products={newArrivals} />
      <BrandStory />
      <ProductRail label="Best Sellers" products={bestSellers} />
      <Testimonials />
      <Newsletter />
    </div>
  )
}
