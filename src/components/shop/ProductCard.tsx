'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useWishlistStore } from '@/store/useWishlistStore'
import { cn } from '@/lib/utils/cn'

export function ProductCard({ product, priority = false }: { product: any; priority?: boolean }) {
  const { has, toggle } = useWishlistStore()
  const [hover, setHover] = useState(false)
  const wished = has(product.id)

  const firstVariant = product.variants?.[0] || {}
  const price = firstVariant.price ?? 0
  const compareAt = firstVariant.compareAtPrice
  const onSale = compareAt && compareAt > price

  const primaryImg = product.mainImage?.sizes?.card?.url || product.mainImage?.url
  const secondaryImg = product.gallery?.[0]?.sizes?.card?.url || product.gallery?.[0]?.url
  const lowStock = product.variants?.every((v: any) => (v.stock ?? 0) < 5)
  const colors = product.variants?.slice(0, 5).map((v: any) => ({ color: v.color, hex: v.colorHex })) || []

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-blush overflow-hidden">
          {primaryImg && (
            <Image
              src={primaryImg}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, 25vw"
              className={cn('object-cover transition-opacity duration-400', hover && secondaryImg ? 'opacity-0' : 'opacity-100')}
            />
          )}
          {secondaryImg && (
            <Image
              src={secondaryImg}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={cn('object-cover transition-opacity duration-400', hover ? 'opacity-100' : 'opacity-0')}
            />
          )}
          <div className="absolute top-12 left-12 flex flex-col gap-6">
            {product.isNew && <Badge variant="new">New</Badge>}
            {onSale && <Badge variant="sale">Sale</Badge>}
            {lowStock && !product.isNew && <Badge variant="stock">Low Stock</Badge>}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              toggle({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: primaryImg || '',
                price,
              })
            }}
            aria-label="Wishlist"
            className="absolute top-12 right-12 w-32 h-32 bg-paper/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-paper"
          >
            <Heart size={14} className={wished ? 'fill-signal text-signal' : ''} />
          </button>
        </div>
      </Link>

      <div className="mt-12 space-y-4">
        <Link href={`/products/${product.slug}`} className="block text-[14px] font-medium hover:text-stone">
          {product.name}
        </Link>
        {product.shortDescription && (
          <div className="text-stone text-[12px] line-clamp-1">{product.shortDescription}</div>
        )}
        <div className="flex items-center gap-8">
          {onSale && (
            <span className="font-mono text-[12px] line-through text-stone">{formatCurrency(compareAt)}</span>
          )}
          <span className={cn('font-mono text-[13px]', onSale && 'text-signal')}>{formatCurrency(price)}</span>
        </div>
        {colors.length > 0 && (
          <div className="flex items-center gap-6 pt-4">
            {colors.map((c: any, i: number) => (
              <span
                key={i}
                title={c.color}
                className="w-12 h-12 rounded-full border border-stone/40"
                style={{ background: c.hex || '#ccc' }}
              />
            ))}
            {product.variants?.length > 5 && (
              <span className="text-[11px] text-stone">+{product.variants.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
