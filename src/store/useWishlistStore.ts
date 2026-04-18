'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  productId: string
  slug: string
  name: string
  image: string
  price: number
}

interface WishlistState {
  items: WishlistItem[]
  toggle: (item: WishlistItem) => void
  remove: (productId: string) => void
  has: (productId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => {
          if (state.items.some((i) => i.productId === item.productId)) {
            return { items: state.items.filter((i) => i.productId !== item.productId) }
          }
          return { items: [...state.items, item] }
        }),
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.productId !== id) })),
      has: (id) => get().items.some((i) => i.productId === id),
      clear: () => set({ items: [] }),
    }),
    { name: 'nova-wishlist' }
  )
)
