'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { validateCoupon } from '@/lib/payload/actions/cart'
import { cn } from '@/lib/utils'

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

  const itemCount = items.reduce((n, i) => n + i.quantity, 0)

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
            className="fixed inset-0 bg-[var(--color-nt-black)]/50 z-50"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[var(--color-nt-white)] z-50 flex flex-col shadow-2xl"
          >
            {/* Header - Clean with just close button */}
            <div className="flex items-center justify-end px-4 py-3">
              <button
                onClick={closeCart}
                aria-label="Close"
                className="cursor-pointer text-[var(--color-nt-black)] hover:opacity-60 transition-opacity duration-150 p-2"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Item Count - Only show when items exist */}
            {itemCount > 0 && (
              <div className="px-6 py-3 border-b border-[var(--color-nt-light-gray)]">
                <p className="text-[14px] text-[var(--color-nt-mid-gray)]">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            )}

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col px-6 py-12">
                {/* Empty State - Like reference */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <h3 className="text-[22px] font-bold text-[var(--color-nt-black)] mb-6">
                    Your cart is empty
                  </h3>

                  <Link href="/shop" onClick={closeCart} className="w-full max-w-[280px]">
                    <button className="w-full py-3.5 border border-[var(--color-nt-black)] text-[var(--color-nt-black)] text-[13px] font-semibold uppercase tracking-wider hover:bg-[var(--color-nt-black)] hover:text-[var(--color-nt-white)] transition-colors duration-200 cursor-pointer">
                      Continue Shopping
                    </button>
                  </Link>

                  {/* Have an account section */}
                  <div className="mt-12 text-center">
                    <h4 className="text-[18px] font-bold text-[var(--color-nt-black)] mb-2">
                      Have an account?
                    </h4>
                    <p className="text-[14px] text-[var(--color-nt-mid-gray)]">
                      <button
                        onClick={() => {
                          closeCart()
                          setTimeout(() => {
                            const { openAuth } = useUIStore.getState()
                            openAuth()
                          }, 300)
                        }}
                        className="underline hover:no-underline text-[var(--color-nt-black)] cursor-pointer"
                      >
                        Log in
                      </button>{' '}
                      to check out faster.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Free Shipping Message */}
                <div className="px-6 py-3 bg-[var(--color-nt-off-white)]">
                  <p className="text-[13px] text-[var(--color-nt-mid-gray)]">
                    {getSubtotal() >= 800
                      ? 'You qualify for free shipping!'
                      : `Add ${formatCurrency(800 - getSubtotal())} more for free shipping`}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.variantSku} className="flex gap-12 sm:gap-16">
                      <div className="relative w-[100px] h-[120px] sm:w-[80px] sm:h-[100px] bg-[var(--color-nt-off-white)] shrink-0 overflow-hidden">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="100px"
                          />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex justify-between gap-8">
                          <div className="min-w-0 flex-1">
                            <div className="text-[14px] font-medium truncate text-[var(--color-nt-black)]">
                              {item.name}
                            </div>
                            <div className="type-label text-[var(--color-nt-mid-gray)] mt-4">
                              {item.variantLabel}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantSku)}
                            aria-label="Remove"
                            className="cursor-pointer p-3 hover:bg-[var(--color-nt-off-white)] transition-colors duration-200 shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                          >
                            <Trash2
                              size={18}
                              className="text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-sale-red)] transition-colors duration-200"
                            />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-[var(--color-nt-light-gray)]">
                            <button
                              className="w-36 h-36 sm:w-28 sm:h-28 flex items-center justify-center cursor-pointer hover:bg-[var(--color-nt-off-white)] transition-colors duration-200 min-w-[44px] min-h-[44px]"
                              onClick={() => updateQuantity(item.variantSku, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} strokeWidth={1.5} />
                            </button>
                            <span className="w-32 sm:w-28 text-center text-[14px] font-medium text-[var(--color-nt-black)]">
                              {item.quantity}
                            </span>
                            <button
                              className="w-36 h-36 sm:w-28 sm:h-28 flex items-center justify-center cursor-pointer hover:bg-[var(--color-nt-off-white)] transition-colors duration-200 min-w-[44px] min-h-[44px]"
                              onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} strokeWidth={1.5} />
                            </button>
                          </div>
                          <div className="text-[14px] font-medium text-[var(--color-nt-black)]">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[var(--color-nt-light-gray)] px-6 py-6 space-y-4">
                  {!coupon ? (
                    <div className="flex gap-2 items-center border-b border-[var(--color-nt-light-gray)] pb-3">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Promo code"
                        className="flex-1 bg-transparent py-2 text-[14px] focus:outline-none text-[var(--color-nt-black)] placeholder:text-[var(--color-nt-mid-gray)]"
                      />
                      <button
                        onClick={handleApply}
                        className="text-[13px] text-[var(--color-nt-black)] hover:opacity-60 transition-opacity duration-150 cursor-pointer py-2 px-3"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[13px] text-[var(--color-nt-black)]">
                        {coupon.code}
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-[13px] text-[var(--color-nt-sale-red)] hover:opacity-80 transition-opacity duration-150 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-[14px]">
                      <span className="text-[var(--color-nt-mid-gray)]">Subtotal</span>
                      <span className="text-[var(--color-nt-black)]">
                        {formatCurrency(getSubtotal())}
                      </span>
                    </div>
                    {getDiscount() > 0 && (
                      <div className="flex justify-between text-[14px]">
                        <span className="text-[var(--color-nt-mid-gray)]">Discount</span>
                        <span className="text-[var(--color-nt-black)]">
                          - {formatCurrency(getDiscount())}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-[14px]">
                      <span className="text-[var(--color-nt-mid-gray)]">Shipping</span>
                      {getShipping() === 0 ? (
                        <span className="text-[var(--color-nt-black)] font-medium">Free</span>
                      ) : (
                        <span className="text-[var(--color-nt-black)]">
                          {formatCurrency(getShipping())}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between pt-3 border-t border-[var(--color-nt-light-gray)]">
                      <span className="text-[16px] font-semibold text-[var(--color-nt-black)]">
                        Total
                      </span>
                      <span className="text-[16px] font-bold text-[var(--color-nt-black)]">
                        {formatCurrency(getTotal())}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Link href="/checkout" onClick={closeCart} className="block">
                      <button className="w-full bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[13px] font-semibold uppercase tracking-wider py-3.5 hover:bg-[var(--color-nt-charcoal)] transition-colors duration-200 cursor-pointer">
                        Checkout
                      </button>
                    </Link>
                    <Link href="/cart" onClick={closeCart} className="block">
                      <button className="w-full bg-transparent text-[var(--color-nt-black)] border border-[var(--color-nt-black)] text-[13px] font-semibold uppercase tracking-wider py-3.5 hover:bg-[var(--color-nt-black)] hover:text-[var(--color-nt-white)] transition-colors duration-200 cursor-pointer">
                        View Cart
                      </button>
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
