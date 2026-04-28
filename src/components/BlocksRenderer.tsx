import {
  HeroBlock,
  FeaturedCategoriesBlock,
  ProductRailBlock,
  BrandStoryBlock,
  NewsletterBlock,
  TestimonialsBlock,
} from '@/blocks'
import type { Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]

interface BlocksRendererProps {
  layout?: LayoutBlock[] | null
}

// Block render function type
type BlockRenderFn = (block: LayoutBlock, index: number) => React.ReactNode

// Block map - easy to extend with new blocks
const blockRenderers: Record<string, BlockRenderFn> = {
  hero: (block, index) => {
    const b = block as Extract<LayoutBlock, { blockType: 'hero' }>
    return (
      <HeroBlock
        key={`hero-${index}`}
        slides={b.slides?.map((s) => ({
          headline: s.headline,
          subheadline: s.subheadline ?? undefined,
          cta: s.cta ?? undefined,
          link: s.link ?? undefined,
          image: s.image,
        }))}
        autoplay={b.autoplay ?? true}
        autoplayDelay={b.autoplayDelay ?? 6000}
      />
    )
  },

  featuredCategories: (block, index) => {
    const b = block as Extract<LayoutBlock, { blockType: 'featuredCategories' }>
    return (
      <FeaturedCategoriesBlock
        key={`featuredCategories-${index}`}
        title={b.title ?? undefined}
        subtitle={b.subtitle ?? undefined}
        categories={b.categories?.map((c) => ({
          category: c.category,
          overrideImage: c.overrideImage ?? undefined,
          id: c.id,
        }))}
        showViewAll={b.showViewAll ?? true}
        viewAllText={b.viewAllText ?? undefined}
        viewAllLink={b.viewAllLink ?? undefined}
      />
    )
  },

  productRail: (block, index) => {
    const b = block as Extract<LayoutBlock, { blockType: 'productRail' }>
    return (
      <ProductRailBlock
        key={`productRail-${index}`}
        title={b.title ?? undefined}
        products={b.products ?? undefined}
        showGenderFilter={b.showGenderFilter ?? true}
        showViewAll={b.showViewAll ?? true}
        viewAllText={b.viewAllText ?? undefined}
        viewAllLink={b.viewAllLink ?? undefined}
      />
    )
  },

  brandStory: (block, index) => {
    const b = block as Extract<LayoutBlock, { blockType: 'brandStory' }>
    return (
      <BrandStoryBlock
        key={`brandStory-${index}`}
        sectionLabel={b.sectionLabel ?? undefined}
        headline={b.headline ?? undefined}
        description={b.description ?? undefined}
        image={b.image ?? undefined}
        stats={b.stats ?? undefined}
        ctaText={b.ctaText ?? undefined}
        ctaLink={b.ctaLink ?? undefined}
        imagePosition={b.imagePosition ?? undefined}
      />
    )
  },

  newsletter: (block, index) => {
    const b = block as Extract<LayoutBlock, { blockType: 'newsletter' }>
    return (
      <NewsletterBlock
        key={`newsletter-${index}`}
        sectionLabel={b.sectionLabel ?? undefined}
        headline={b.headline ?? undefined}
        subheadline={b.subheadline ?? undefined}
        placeholder={b.placeholder ?? undefined}
        buttonText={b.buttonText ?? undefined}
        mobileButtonText={b.mobileButtonText ?? undefined}
        privacyText={b.privacyText ?? undefined}
        successHeadline={b.successHeadline ?? undefined}
        successMessage={b.successMessage ?? undefined}
        trustBadges={b.trustBadges ?? undefined}
      />
    )
  },

  testimonials: (block, index) => {
    const b = block as Extract<LayoutBlock, { blockType: 'testimonials' }>
    return (
      <TestimonialsBlock
        key={`testimonials-${index}`}
        title={b.title ?? undefined}
        testimonials={b.testimonials ?? undefined}
        autoplay={b.autoplay ?? true}
        autoplayDelay={b.autoplayDelay ?? undefined}
      />
    )
  },
}

// Register a new block renderer dynamically
export function registerBlockRenderer(blockType: string, renderer: BlockRenderFn) {
  blockRenderers[blockType] = renderer
}

// Check if block type is supported
export function isBlockSupported(blockType: string): boolean {
  return blockType in blockRenderers
}

// Get list of supported block types
export function getSupportedBlocks(): string[] {
  return Object.keys(blockRenderers)
}

export function BlocksRenderer({ layout }: BlocksRendererProps) {
  if (!layout || layout.length === 0) return null

  return (
    <>
      {layout.map((block, index) => {
        const renderer = blockRenderers[block.blockType]
        if (!renderer) {
          console.warn(`Unknown block type: ${block.blockType}`)
          return null
        }
        return renderer(block, index)
      })}
    </>
  )
}
