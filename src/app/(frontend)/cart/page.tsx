'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils/formatCurrency'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, getDiscount, getShipping, getTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-container mx-auto px-24 py-80 text-center">
        <h1 className="font-display text-[48px]">Your bag is empty</h1>
        <Link href="/shop" className="inline-block mt-24">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-container mx-auto px-24 py-48">
      <h1 className="font-display text-[48px] mb-32">Your Bag</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-48">
        <div className="space-y-20">
          {items.map((item) => (
            <article key={item.variantSku} className="flex gap-20 border-b border-stone/20 pb-20">
              <div className="relative w-[120px] h-[150px] bg-blush shrink-0">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between">
                  <div>
                    <Link href={`/products/${item.slug}`} className="text-[16px] font-medium hover:text-stone">
                      {item.name}
                    </Link>
                    <div className="font-mono text-[11px] uppercase text-stone mt-4">{item.variantLabel}</div>
                  </div>
                  <button onClick={() => removeItem(item.variantSku)} aria-label="Remove"><X size={18} /></button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center border border-stone/40">
                    <button className="w-32 h-32 flex items-center justify-center" onClick={() => updateQuantity(item.variantSku, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <span className="w-32 text-center font-mono text-[13px]">{item.quantity}</span>
                    <button className="w-32 h-32 flex items-center justify-center" onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-mono text-[15px]">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="bg-blush/40 p-24 space-y-16 h-fit sticky top-24">
          <h3 className="font-mono text-[11px] uppercase tracking-widest">Order Summary</h3>
          <div className="space-y-6 text-[14px]">
            <div className="flex justify-between"><span className="text-stone">Subtotal</span><span className="font-mono">{formatCurrency(getSubtotal())}</span></div>
            {getDiscount() > 0 && <div className="flex justify-between"><span className="text-stone">Discount</span><span className="font-mono">- {formatCurrency(getDiscount())}</span></div>}
            <div className="flex justify-between"><span className="text-stone">Shipping</span><span className="font-mono">{getShipping() === 0 ? 'Free' : formatCurrency(getShipping())}</span></div>
            <div className="flex justify-between pt-12 border-t border-stone/30 mt-12">
              <span className="font-mono text-[11px] uppercase tracking-widest">Total</span>
              <span className="font-mono text-[16px]">{formatCurrency(getTotal())}</span>
            </div>
          </div>
          <Link href="/checkout"><Button full>Checkout</Button></Link>
        </aside>
      </div>
    </div>
  )
}
