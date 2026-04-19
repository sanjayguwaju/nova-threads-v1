'use client'

import { create } from 'zustand'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface UIState {
  cartOpen: boolean
  mobileMenuOpen: boolean
  searchOpen: boolean
  authOpen: boolean
  quickViewProductId: string | null
  toasts: Toast[]
  openCart: () => void
  closeCart: () => void
  toggleMobileMenu: () => void
  openSearch: () => void
  closeSearch: () => void
  openAuth: () => void
  closeAuth: () => void
  openQuickView: (id: string) => void
  closeQuickView: () => void
  pushToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  authOpen: false,
  quickViewProductId: null,
  toasts: [],
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  openAuth: () => set({ authOpen: true }),
  closeAuth: () => set({ authOpen: false }),
  openQuickView: (id) => set({ quickViewProductId: id }),
  closeQuickView: () => set({ quickViewProductId: null }),
  pushToast: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id: Math.random().toString(36).slice(2) }].slice(-3),
    })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
