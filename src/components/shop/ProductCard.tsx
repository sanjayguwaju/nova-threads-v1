'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Heart, Eye } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useWishlistStore } from '@/store/useWishlistStore'
import { cn } from '@/lib/utils'
import type { Product } from '@/payload-types'

interface ProductCardProps {
  product: Product
  priority?: boolean
  showQuickActions?: boolean
}

export function ProductCard({
  product,
  priority = false,
  showQuickActions = false,
}: ProductCardProps) {
  const { has, toggle } = useWishlistStore()
  const [hover, setHover] = useState(false)
  const wished = has(product.id)

  const firstVariant = product.variants?.[0]
  const price = firstVariant?.price ?? product.price ?? 0
  const compareAt = firstVariant?.compareAtPrice ?? product.compareAtPrice
  const onSale = compareAt && compareAt > price

  const firstImage = product.images?.[0]
  const primaryImg = typeof firstImage === 'object' ? firstImage?.url : firstImage
  const secondImage = product.images?.[1]
  const secondaryImg = typeof secondImage === 'object' ? secondImage?.url : secondImage
  const lowStock = product.variants?.every((v) => (v.stock ?? 0) < 5)
  const colors =
    product.variants?.slice(0, 5).map((v) => ({ color: v.color, hex: v.colorHex })) || []

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link href={`/products/${product.slug}`} className="block cursor-pointer">
        <div className="relative aspect-[3/4] bg-[var(--color-nt-off-white)] overflow-hidden">
          {primaryImg && (
            <Image
              src={primaryImg}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, 25vw"
              className={cn(
                'object-cover transition-all duration-500 ease-out',
                hover && secondaryImg ? 'opacity-0' : 'opacity-100',
                'group-hover:scale-[1.03]',
              )}
            />
          )}
          {secondaryImg && (
            <Image
              src={secondaryImg}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={cn(
                'object-cover transition-all duration-500 ease-out',
                hover ? 'opacity-100' : 'opacity-0',
                'group-hover:scale-[1.03]',
              )}
            />
          )}

          {/* Badges - Top Left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.featured && (
              <span className="border border-[var(--color-nt-black)] bg-[var(--color-nt-white)] text-[var(--color-nt-black)] text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                Featured
              </span>
            )}
            {onSale && (
              <span className="bg-[var(--color-nt-sale-red)] text-[var(--color-nt-white)] text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                Sale
              </span>
            )}
            {lowStock && !product.featured && !onSale && (
              <span className="bg-[var(--color-nt-mid-gray)] text-[var(--color-nt-white)] text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                Low Stock
              </span>
            )}
          </div>

          {/* Quick Actions - Top Right (like reference) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggle({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: primaryImg || '',
                  price,
                })
              }}
              aria-label="Add to wishlist"
              className={cn(
                'w-9 h-9 flex items-center justify-center transition-all duration-200 cursor-pointer rounded-full shadow-sm',
                wished
                  ? 'bg-[var(--color-nt-black)] text-[var(--color-nt-white)]'
                  : 'bg-[var(--color-nt-white)] text-[var(--color-nt-black)] hover:bg-[var(--color-nt-black)] hover:text-[var(--color-nt-white)]',
              )}
            >
              <Heart
                size={16}
                strokeWidth={1.5}
                className={cn('transition-all duration-200', wished ? 'fill-current' : '')}
              />
            </button>

            {/* Quick View Button - Like reference */}
            {showQuickActions && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Quick view logic would go here
                }}
                aria-label="Quick view"
                className="w-9 h-9 flex items-center justify-center bg-[var(--color-nt-white)] text-[var(--color-nt-black)] hover:bg-[var(--color-nt-black)] hover:text-[var(--color-nt-white)] transition-all duration-200 cursor-pointer rounded-full shadow-sm"
              >
                <Eye size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-3 space-y-1.5">
        {/* Brand/Name */}
        <Link
          href={`/products/${product.slug}`}
          className="block text-[13px] font-medium text-[var(--color-nt-black)] hover:text-[var(--color-nt-mid-gray)] transition-colors duration-150 cursor-pointer line-clamp-1 uppercase tracking-wide"
        >
          {product.name}
        </Link>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-[var(--color-nt-mid-gray)] text-[12px] line-clamp-1 leading-relaxed">
            {product.shortDescription}
          </p>
        )}

        {/* Price Row */}
        <div className="flex items-center gap-2 pt-0.5">
          {onSale ? (
            <>
              <span className="text-[14px] font-semibold text-[var(--color-nt-sale-red)]">
                {formatCurrency(price)}
              </span>
              <span className="text-[12px] line-through text-[var(--color-nt-mid-gray)]">
                {formatCurrency(compareAt)}
              </span>
            </>
          ) : (
            <span className="text-[14px] font-medium text-[var(--color-nt-black)]">
              {formatCurrency(price)}
            </span>
          )}
        </div>

        {/* Color Swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {colors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                title={c.color || ''}
                className="w-4 h-4 border border-[var(--color-nt-light-gray)] flex-shrink-0"
                style={{ background: c.hex || '#ccc' }}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-[10px] text-[var(--color-nt-mid-gray)] ml-0.5">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
