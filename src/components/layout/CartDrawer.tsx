'use client'
import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { validateCoupon } from '@/lib/payload/actions/cart'

export function CartDrawer() {
  const { cartOpen, closeCart, pushToast } = useUIStore()
  const {
    items,
    coupon,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getShipping,
    getTotal,
  } = useCartStore()
  const [code, setCode] = useState('')

  const handleApply = async () => {
    if (!code.trim()) return
    const result = await validateCoupon(code.trim(), getSubtotal())
    if (result.ok) {
      applyCoupon({ code: result.code!, discount: result.discount! })
      pushToast({ type: 'success', message: 'Coupon applied' })
      setCode('')
    } else {
      pushToast({ type: 'error', message: result.error || 'Invalid code' })
    }
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-ink/50 z-50"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-paper z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-24 py-20 border-b border-stone/20">
              <div className="font-mono text-[12px] uppercase tracking-widest">
                Your Bag ({items.reduce((n, i) => n + i.quantity, 0)})
              </div>
              <button onClick={closeCart} aria-label="Close"><X size={20} /></button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-16 px-24">
                <div className="font-display text-[32px]">Your bag is empty</div>
                <Button onClick={closeCart} variant="outline">
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-24 py-16 space-y-20">
                  {items.map((item) => (
                    <div key={item.variantSku} className="flex gap-16">
                      <div className="relative w-[80px] h-[100px] bg-blush shrink-0">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between gap-8">
                          <div>
                            <div className="text-[14px] font-medium">{item.name}</div>
                            <div className="font-mono text-[11px] uppercase text-stone mt-4">
                              {item.variantLabel}
                            </div>
                          </div>
                          <button onClick={() => removeItem(item.variantSku)} aria-label="Remove">
                            <Trash2 size={14} className="text-stone hover:text-signal" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-stone/40">
                            <button
                              className="w-28 h-28 flex items-center justify-center"
                              onClick={() => updateQuantity(item.variantSku, item.quantity - 1)}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-28 text-center text-[13px]">{item.quantity}</span>
                            <button
                              className="w-28 h-28 flex items-center justify-center"
                              onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="font-mono text-[13px]">{formatCurrency(item.price * item.quantity)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone/20 px-24 py-16 space-y-12">
                  {!coupon ? (
                    <div className="flex gap-8">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Promo code"
                        className="flex-1 border-b border-stone/50 bg-transparent py-8 text-[14px] focus:outline-none focus:border-ink"
                      />
                      <button onClick={handleApply} className="font-mono text-[11px] uppercase tracking-widest">
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-mono">{coupon.code}</span>
                      <button onClick={removeCoupon} className="text-signal text-[12px]">Remove</button>
                    </div>
                  )}

                  <div className="space-y-4 text-[14px]">
                    <Row label="Subtotal" value={formatCurrency(getSubtotal())} />
                    {getDiscount() > 0 && <Row label="Discount" value={`- ${formatCurrency(getDiscount())}`} />}
                    <Row label="Shipping" value={getShipping() === 0 ? 'Free' : formatCurrency(getShipping())} />
                    <div className="flex justify-between pt-8 border-t border-stone/20 mt-8">
                      <span className="font-mono text-[11px] uppercase tracking-widest">Total</span>
                      <span className="font-mono text-[15px]">{formatCurrency(getTotal())}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8 pt-12">
                    <Link href="/checkout" onClick={closeCart}>
                      <Button full>Checkout</Button>
                    </Link>
                    <Link href="/cart" onClick={closeCart}>
                      <Button full variant="outline">View Bag</Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
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
