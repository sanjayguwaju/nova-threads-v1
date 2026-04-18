'use client'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useWishlistStore } from '@/store/useWishlistStore'
import { formatCurrency } from '@/lib/utils/formatCurrency'

export function WishlistGrid() {
  const { items, remove } = useWishlistStore()
  if (items.length === 0) {
    return (
      <div className="py-48 text-center">
        <p className="text-stone">Your wishlist is empty.</p>
        <Link href="/shop" className="inline-block mt-16 font-mono text-[11px] uppercase tracking-widest underline">
          Discover Products
        </Link>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-24">
      {items.map((item) => (
        <div key={item.productId} className="group relative">
          <Link href={`/products/${item.slug}`}>
            <div className="relative aspect-[3/4] bg-blush overflow-hidden">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
            </div>
          </Link>
          <button
            onClick={() => remove(item.productId)}
            className="absolute top-8 right-8 w-28 h-28 rounded-full bg-paper/90 flex items-center justify-center"
          >
            <X size={14} />
          </button>
          <div className="mt-8 text-[14px]">{item.name}</div>
          <div className="font-mono text-[12px]">{formatCurrency(item.price)}</div>
        </div>
      ))}
    </div>
  )
}
