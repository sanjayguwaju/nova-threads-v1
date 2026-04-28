# Block System

Dynamic, block-based architecture for Nova Threads.

## Structure

```
src/blocks/
├── _template/           # Template for new blocks
│   ├── config.ts      # Payload CMS block config
│   ├── Component.tsx  # React component
│   └── index.ts       # Barrel exports
├── Hero/              # Hero slider block
├── FeaturedCategories/# Category grid block
├── ProductRail/       # Product showcase block
├── BrandStory/        # Brand philosophy block
├── Newsletter/        # Email subscription block
├── Testimonials/      # Customer reviews block
├── blocks.ts          # Block registry & metadata
├── registry.ts        # Dynamic rendering registry
├── index.ts           # Central exports
└── README.md          # This file
```

## Creating a New Block

1. **Copy the template:**
   ```bash
   cp -r src/blocks/_template src/blocks/YourBlockName
   ```

2. **Replace placeholders** in all files:
   - `{{BlockName}}` → Your actual block name (PascalCase)
   - `{{blockSlug}}` → URL-friendly slug (camelCase)

3. **Customize the config** (`config.ts`):
   - Define fields in Payload CMS format
   - Set labels, defaults, validation

4. **Build the component** (`Component.tsx`):
   - Create your React component
   - Match props to config fields
   - Use design system tokens

5. **Register the block** in `blocks.ts`:
   ```ts
   import { YourBlock } from './YourBlockName'
   
   export const blocks: Block[] = [
     // ...existing blocks
     YourBlock,
   ]
   
   export const blockMetadata: BlockMeta[] = [
     // ...existing metadata
     {
       slug: 'yourBlock',
       name: 'Your Block',
       description: 'What it does',
       icon: 'IconName',
       category: 'content',
     },
   ]
   ```

6. **Add to renderer** in `BlocksRenderer.tsx`:
   ```ts
   import { YourBlockBlock } from '@/blocks'
   
   const blockRenderers: Record<string, BlockRenderFn> = {
     // ...existing renderers
     yourBlock: (block, index) => {
       const b = block as Extract<LayoutBlock, { blockType: 'yourBlock' }>
       return <YourBlockBlock key={`yourBlock-${index}`} ... />
     },
   }
   ```

## Architecture

### Config (`config.ts`)
- Payload CMS block configuration
- Defines fields, validation, defaults
- Used in Pages collection layout field

### Component (`Component.tsx`)
- React functional component
- Props match config fields
- Self-contained with defaults

### Registry (`blocks.ts`, `registry.ts`)
- Central block metadata
- Dynamic registration system
- Category grouping helpers

### Renderer (`BlocksRenderer.tsx`)
- Block map pattern for scalability
- Dynamic renderer lookup
- Warning for unknown blocks

## Design System Tokens

Always use design tokens:

```tsx
// Colors
bg-[var(--color-nt-black)]
text-[var(--color-nt-white)]
text-[var(--color-nt-mid-gray)]
bg-[var(--color-nt-off-white)]

// Typography
text-[24px] sm:text-[32px]
font-bold tracking-[0.04em]
uppercase

// Spacing
py-16
max-w-container mx-auto
px-4 sm:px-8 lg:px-16
```
