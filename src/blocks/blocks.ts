// Central block configuration and metadata
// This file provides block metadata for UI/admin use

import type { Block } from 'payload'

// Import block configs
import { Hero } from './Hero'
import { FeaturedCategories } from './FeaturedCategories'
import { ProductRail } from './ProductRail'
import { BrandStory } from './BrandStory'
import { Newsletter } from './Newsletter'
import { Testimonials } from './Testimonials'

// Export all block configs as array for Payload
export const blocks: Block[] = [
  Hero,
  FeaturedCategories,
  ProductRail,
  BrandStory,
  Newsletter,
  Testimonials,
]

// Block metadata for UI/admin
export interface BlockMeta {
  slug: string
  name: string
  description?: string
  icon?: string
  previewImage?: string
  category?: 'content' | 'media' | 'commerce' | 'marketing'
}

export const blockMetadata: BlockMeta[] = [
  {
    slug: 'hero',
    name: 'Hero Slider',
    description: 'Full-width hero section with image carousel',
    icon: 'Image',
    category: 'media',
  },
  {
    slug: 'featuredCategories',
    name: 'Featured Categories',
    description: 'Grid of featured product categories',
    icon: 'Grid3x3',
    category: 'commerce',
  },
  {
    slug: 'productRail',
    name: 'Product Rail',
    description: 'Horizontal scrolling product showcase',
    icon: 'ShoppingBag',
    category: 'commerce',
  },
  {
    slug: 'brandStory',
    name: 'Brand Story',
    description: 'Brand philosophy with image and stats',
    icon: 'BookOpen',
    category: 'content',
  },
  {
    slug: 'newsletter',
    name: 'Newsletter',
    description: 'Email subscription section',
    icon: 'Mail',
    category: 'marketing',
  },
  {
    slug: 'testimonials',
    name: 'Testimonials',
    description: 'Customer review carousel',
    icon: 'MessageSquare',
    category: 'marketing',
  },
]

// Helper to get metadata by slug
export function getBlockMeta(slug: string): BlockMeta | undefined {
  return blockMetadata.find((b) => b.slug === slug)
}

// Group blocks by category
export function getBlocksByCategory() {
  return blockMetadata.reduce((acc, block) => {
    const cat = block.category || 'content'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(block)
    return acc
  }, {} as Record<string, BlockMeta[]>)
}
