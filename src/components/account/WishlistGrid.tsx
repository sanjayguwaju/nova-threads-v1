'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingBag, Heart } from 'lucide-react'
import { useWishlistStore } from '@/store/useWishlistStore'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { cn } from '@/lib/utils'

export function WishlistGrid() {
  const { items, remove, clear } = useWishlistStore()
  const { addItem } = useCartStore()
  const { pushToast } = useUIStore()

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      variantSku: item.productId,
      variantLabel: 'Default',
      price: item.price,
      image: item.image,
      quantity: 1,
      maxStock: 100,
    })
    pushToast({ type: 'success', message: `${item.name} added to cart` })
  }

  const handleRemove = (productId: string, name: string) => {
    remove(productId)
    pushToast({ type: 'info', message: `${name} removed from wishlist` })
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-nt-off-white)] flex items-center justify-center mb-6">
          <Heart size={28} strokeWidth={1.5} className="text-[var(--color-nt-mid-gray)]" />
        </div>
        <h3 className="text-[18px] font-semibold text-[var(--color-nt-black)] mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-[14px] text-[var(--color-nt-mid-gray)] mb-6 max-w-[300px]">
          Start adding items you love and they will appear here
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-8 py-3 bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[13px] font-semibold uppercase tracking-wider hover:bg-[var(--color-nt-charcoal)] transition-colors duration-200"
        >
          Discover Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-nt-light-gray)]">
        <span className="text-[14px] text-[var(--color-nt-mid-gray)]">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
        <button
          onClick={() => {
            clear()
            pushToast({ type: 'info', message: 'Wishlist cleared' })
          }}
          className="text-[13px] text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-black)] underline transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item) => (
          <div key={item.productId} className="group">
            {/* Image Container */}
            <div className="relative aspect-[3/4] bg-[var(--color-nt-off-white)] overflow-hidden mb-3">
              <Link href={`/products/${item.slug}`}>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart
                      size={32}
                      strokeWidth={1}
                      className="text-[var(--color-nt-light-gray)]"
                    />
                  </div>
                )}
              </Link>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(item.productId, item.name)}
                className="absolute top-3 right-3 w-8 h-8 bg-[var(--color-nt-white)]/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:bg-[var(--color-nt-black)] hover:text-[var(--color-nt-white)]"
                aria-label={`Remove ${item.name}`}
              >
                <X size={16} strokeWidth={1.5} />
              </button>

              {/* Quick Add Button - Mobile always visible, desktop on hover */}
              <button
                onClick={() => handleAddToCart(item)}
                className={cn(
                  'absolute bottom-0 left-0 right-0 h-[44px] bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[12px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-transform duration-200 cursor-pointer',
                  'translate-y-full group-hover:translate-y-0 sm:translate-y-full',
                )}
              >
                <ShoppingBag size={16} strokeWidth={1.5} />
                Add to Cart
              </button>
            </div>

            {/* Product Info */}
            <div className="space-y-1">
              <Link href={`/products/${item.slug}`}>
                <h3 className="text-[14px] font-medium text-[var(--color-nt-black)] line-clamp-1 hover:underline">
                  {item.name}
                </h3>
              </Link>
              <p className="text-[14px] text-[var(--color-nt-black)] font-semibold">
                {formatCurrency(item.price)}
              </p>
            </div>

            {/* Mobile Add Button */}
            <button
              onClick={() => handleAddToCart(item)}
              className="sm:hidden w-full mt-3 h-[40px] border border-[var(--color-nt-black)] text-[var(--color-nt-black)] text-[12px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:bg-[var(--color-nt-black)] hover:text-[var(--color-nt-white)] transition-colors duration-200"
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
