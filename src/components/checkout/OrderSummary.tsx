'use client'
import Image from 'next/image'
import { useCartStore } from '@/store/useCartStore'
import { formatCurrency } from '@/lib/utils/formatCurrency'

export function OrderSummary({ shippingCost = 0 }: { shippingCost?: number }) {
  const { items, coupon, getSubtotal, getDiscount, getTotal } = useCartStore()
  const subtotal = getSubtotal()
  const discount = getDiscount()
  const total = Math.max(0, subtotal - discount + shippingCost)

  return (
    <aside className="bg-blush/40 p-24 space-y-16 sticky top-24">
      <h3 className="font-mono text-[11px] uppercase tracking-widest">Order Summary</h3>
      <div className="space-y-12 max-h-[320px] overflow-y-auto">
        {items.map((item) => (
          <div key={item.variantSku} className="flex gap-12">
            <div className="relative w-[60px] h-[75px] bg-paper shrink-0">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[13px]">{item.name}</div>
                <div className="font-mono text-[10px] uppercase text-stone">{item.variantLabel} × {item.quantity}</div>
              </div>
              <div className="font-mono text-[12px]">{formatCurrency(item.price * item.quantity)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-16 border-t border-stone/30 space-y-6 text-[13px]">
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        {discount > 0 && <Row label={`Discount (${coupon?.code})`} value={`- ${formatCurrency(discount)}`} />}
        <Row label="Shipping" value={shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)} />
        <div className="flex justify-between pt-10 border-t border-stone/30 mt-10">
          <span className="font-mono text-[11px] uppercase tracking-widest">Total</span>
          <span className="font-mono text-[16px]">{formatCurrency(total)}</span>
        </div>
      </div>
    </aside>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-stone">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  )
}
