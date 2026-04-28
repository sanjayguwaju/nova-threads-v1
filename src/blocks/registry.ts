import type { ComponentType } from 'react'
import type { Page } from '@/payload-types'

// All supported block types
type BlockType = 'hero' | 'featuredCategories' | 'productRail' | 'brandStory' | 'newsletter' | 'testimonials'

// Block data type from Page layout
type LayoutBlock = NonNullable<Page['layout']>[number]

// Generic block component that accepts any block data
export type BlockComponent = ComponentType<{ data: LayoutBlock }>

// Block metadata for UI/admin
export interface BlockMetadata {
  name: string
  description?: string
  icon?: string
  previewImage?: string
}

// Block registry entry
export interface BlockRegistryEntry {
  type: BlockType
  component: BlockComponent
  metadata: BlockMetadata
  preload?: () => Promise<void>
}

// Block registry storage
const blockRegistry = new Map<BlockType, BlockRegistryEntry>()

// Register a block in the registry
export function registerBlock(
  type: BlockType,
  component: BlockComponent,
  metadata: BlockMetadata,
  preload?: () => Promise<void>
) {
  blockRegistry.set(type, { type, component, metadata, preload })
}

// Get block component from registry
export function getBlockComponent(type: BlockType): BlockComponent | null {
  return blockRegistry.get(type)?.component ?? null
}

// Get full block entry from registry
export function getBlockEntry(type: BlockType): BlockRegistryEntry | undefined {
  return blockRegistry.get(type)
}

// Check if block type is registered
export function isBlockRegistered(type: string): type is BlockType {
  return blockRegistry.has(type as BlockType)
}

// Get all registered block types
export function getRegisteredBlocks(): BlockRegistryEntry[] {
  return Array.from(blockRegistry.values())
}

// Type guard for block data
export function isBlockType<T extends BlockType>(
  block: LayoutBlock,
  type: T
): block is Extract<LayoutBlock, { blockType: T }> {
  return block.blockType === type
}
