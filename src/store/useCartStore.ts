'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { trackCartActivity, clearCartTracking } from '@/lib/cartAbandonment'

export interface CartItem {
  productId: string
  slug: string
  name: string
  image: string
  variantSku: string
  variantLabel: string
  price: number
  compareAtPrice?: number
  quantity: number
  maxStock: number
}

interface CartState {
  items: CartItem[]
  coupon: { code: string; discount: number } | null
  addItem: (item: CartItem) => void
  removeItem: (sku: string) => void
  updateQuantity: (sku: string, qty: number) => void
  clearCart: () => void
  applyCoupon: (coupon: { code: string; discount: number }) => void
  removeCoupon: () => void
  getSubtotal: () => number
  getDiscount: () => number
  getShipping: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantSku === item.variantSku)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantSku === item.variantSku
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxStock) }
                  : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (sku) =>
        set((state) => ({ items: state.items.filter((i) => i.variantSku !== sku) })),
      updateQuantity: (sku, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.variantSku === sku ? { ...i, quantity: Math.max(1, Math.min(qty, i.maxStock)) } : i,
          ),
        })),
      clearCart: () => {
        // Clear abandonment tracking on successful checkout
        clearCartTrackingFromStore()
        return set({ items: [], coupon: null })
      },
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
      getSubtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      getDiscount: () => get().coupon?.discount || 0,
      getShipping: () => {
        const sub = get().getSubtotal()
        return sub >= 150 ? 0 : sub > 0 ? 7.99 : 0
      },
      getTotal: () => {
        const g = get()
        return Math.max(0, g.getSubtotal() - g.getDiscount() + g.getShipping())
      },
    }),
    { name: 'nova-cart' },
  ),
)

// Helper functions to call server actions for cart abandonment tracking
// These are fire-and-forget; errors are logged but don't block UX

function trackCartForAbandonment(items: CartItem[]) {
  // We don't have the user's email in the store, so we can't track here
  // The tracking should be done when we have user context (in checkout or account)
  // For now, this is a placeholder for future implementation
}

function clearCartTrackingFromStore() {
  // This will be called when we have user context
  // For now, it's a no-op since we need the user's email to track
}
