'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Heart, Minus, Plus, Truck, RotateCcw, Leaf } from 'lucide-react'
import { VariantSelector } from './VariantSelector'
import { StarRating } from './StarRating'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { useUIStore } from '@/store/useUIStore'

export function ProductInfo({ product }: { product: any }) {
  const variants = product.variants || []
  const [color, setColor] = useState<string | null>(variants[0]?.color || null)
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)

  const selectedVariant = useMemo(
    () => variants.find((v: any) => v.color === color && v.size === size),
    [variants, color, size]
  )

  const displayVariant = selectedVariant || variants.find((v: any) => v.color === color) || variants[0]
  const price = displayVariant?.price ?? 0
  const compareAt = displayVariant?.compareAtPrice
  const onSale = compareAt && compareAt > price
  const stock = selectedVariant?.stock ?? 0

  const { addItem } = useCartStore()
  const { has, toggle } = useWishlistStore()
  const { openCart, pushToast } = useUIStore()
  const wished = has(product.id)

  const mainImg = product.mainImage?.sizes?.card?.url || product.mainImage?.url

  const handleAdd = () => {
    if (!selectedVariant) {
      pushToast({ type: 'error', message: 'Select a size' })
      return
    }
    if (stock === 0) {
      pushToast({ type: 'error', message: 'Out of stock' })
      return
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: mainImg || '',
      variantSku: selectedVariant.sku,
      variantLabel: `${selectedVariant.color} / ${selectedVariant.size}`,
      price,
      compareAtPrice: compareAt,
      quantity: qty,
      maxStock: stock,
    })
    openCart()
    pushToast({ type: 'success', message: 'Added to bag' })
  }

  return (
    <div className="space-y-24">
      <nav className="font-mono text-[11px] uppercase tracking-widest text-stone">
        <Link href="/">Home</Link>
        <span className="mx-8">/</span>
        <Link href="/shop">Shop</Link>
        <span className="mx-8">/</span>
        <span>{product.name}</span>
      </nav>

      <h1 className="font-display text-[40px] leading-tight">{product.name}</h1>

      {product.reviewCount > 0 && (
        <a href="#reviews" className="flex items-center gap-10">
          <StarRating rating={product.averageRating || 0} />
          <span className="text-stone text-[13px]">({product.reviewCount} reviews)</span>
        </a>
      )}

      <div className="flex items-center gap-12">
        {onSale && (
          <span className="font-mono text-[16px] line-through text-stone">{formatCurrency(compareAt)}</span>
        )}
        <span className={`font-mono text-[20px] ${onSale ? 'text-signal' : ''}`}>{formatCurrency(price)}</span>
        {onSale && <Badge variant="sale">Sale</Badge>}
      </div>

      {product.shortDescription && <p className="text-stone">{product.shortDescription}</p>}

      <VariantSelector
        variants={variants}
        selectedColor={color}
        selectedSize={size}
        onColorChange={setColor}
        onSizeChange={setSize}
      />

      {selectedVariant && (
        <div className="font-mono text-[11px] uppercase tracking-widest">
          {stock === 0 ? (
            <span className="text-signal">Out of stock</span>
          ) : stock < 5 ? (
            <span className="text-signal">Only {stock} left</span>
          ) : (
            <span className="text-success">In stock</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-16">
        <div className="flex items-center border border-ink">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-40 h-48 flex items-center justify-center">
            <Minus size={14} />
          </button>
          <span className="w-40 text-center font-mono text-[14px]">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-40 h-48 flex items-center justify-center">
            <Plus size={14} />
          </button>
        </div>
        <Button full onClick={handleAdd} size="lg" className="flex-1">
          Add to Bag
        </Button>
      </div>

      <Button
        variant="outline"
        full
        onClick={() => toggle({ productId: product.id, slug: product.slug, name: product.name, image: mainImg || '', price })}
      >
        <Heart size={14} className={`mr-8 ${wished ? 'fill-signal text-signal' : ''}`} />
        {wished ? 'In Wishlist' : 'Add to Wishlist'}
      </Button>

      <div className="grid grid-cols-3 gap-16 pt-16 border-t border-stone/20 text-center">
        <FeatureIcon icon={<Truck size={18} />} label="Free Shipping $150+" />
        <FeatureIcon icon={<RotateCcw size={18} />} label="30-Day Returns" />
        <FeatureIcon icon={<Leaf size={18} />} label="Sustainably Made" />
      </div>
    </div>
  )
}

function FeatureIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {icon}
      <span className="font-mono text-[10px] uppercase tracking-widest text-stone">{label}</span>
    </div>
  )
}
