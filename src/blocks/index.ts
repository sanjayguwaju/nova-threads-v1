// ============================================
// BLOCK SYSTEM EXPORTS
// Central export point for all blocks
// ============================================

// --- Block Configs (for Payload CMS) ---
export { Hero } from './Hero'
export { FeaturedCategories } from './FeaturedCategories'
export { ProductRail } from './ProductRail'
export { BrandStory } from './BrandStory'
export { Newsletter } from './Newsletter'
export { Testimonials } from './Testimonials'

// --- Block Components (for React rendering) ---
export { HeroBlock } from './Hero'
export { FeaturedCategoriesBlock } from './FeaturedCategories'
export { ProductRailBlock } from './ProductRail'
export { BrandStoryBlock } from './BrandStory'
export { NewsletterBlock } from './Newsletter'
export { TestimonialsBlock } from './Testimonials'

// --- Block Utilities ---
export { blocks, blockMetadata, getBlockMeta, getBlocksByCategory } from './blocks'
export type { BlockMeta } from './blocks'

// --- Registry (for dynamic rendering) ---
export {
  getBlockComponent,
  getBlockEntry,
  getRegisteredBlocks,
  isBlockRegistered,
  isBlockType,
  registerBlock,
} from './registry'
export type { BlockComponent, BlockMetadata, BlockRegistryEntry } from './registry'
