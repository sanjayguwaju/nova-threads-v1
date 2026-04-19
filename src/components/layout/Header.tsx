'use client'

import { Search, User, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { AnnouncementBar } from './AnnouncementBar'

interface Props {
  nav?: { mainNav?: Array<{ label?: string; link?: string }> }
}

export function Header({ nav }: Props) {
  const items = useCartStore((s) => s.items)
  const count = items.reduce((n, i) => n + i.quantity, 0)
  const { openCart, openSearch, toggleMobileMenu, openAuth } = useUIStore()

  const mainLinks = nav?.mainNav || [
    { label: 'Women', link: '/shop?gender=women' },
    { label: 'Men', link: '/shop?gender=men' },
    { label: 'New In', link: '/shop?sort=newest' },
    { label: 'Sale', link: '/shop?sale=true' },
  ]

  return (
    <header className="sticky top-0 left-0 right-0 z-40">
      {/* Announcement Bar */}
      <AnnouncementBar text="Free shipping on orders over $150" />

      {/* Main Header */}
      <div className="bg-[var(--color-nt-white)] border-b border-[var(--color-nt-light-gray)]">
        <div className="max-w-container mx-auto px-4 sm:px-8 h-[56px] flex items-center justify-between">
          {/* Left: Mobile icons + Desktop Nav */}
          <div className="flex items-center gap-1 lg:gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden flex flex-col gap-[5px] cursor-pointer p-2 -ml-2"
              aria-label="Menu"
            >
              <span className="block w-[22px] h-[1.5px] bg-[var(--color-nt-black)] rounded-[1px]" />
              <span className="block w-[22px] h-[1.5px] bg-[var(--color-nt-black)] rounded-[1px]" />
              <span className="block w-[22px] h-[1.5px] bg-[var(--color-nt-black)] rounded-[1px]" />
            </button>

            {/* Mobile Search - only visible on mobile, left of logo */}
            <button
              onClick={openSearch}
              aria-label="Search"
              className="lg:hidden cursor-pointer text-[var(--color-nt-black)] opacity-80 hover:opacity-100 transition-opacity duration-150 p-2"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {mainLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.link || '#'}
                  className="text-[13px] font-medium uppercase tracking-[0.04em] text-[var(--color-nt-black)] hover:opacity-60 transition-opacity duration-150 cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Logo */}
          <Link
            href="/"
            className="text-[18px] sm:text-[22px] font-bold tracking-[-0.02em] uppercase text-[var(--color-nt-black)] absolute left-1/2 -translate-x-1/2 hover:opacity-80 transition-opacity duration-150 cursor-pointer"
          >
            NOVA THREADS
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Desktop Search - hidden on mobile */}
            <button
              onClick={openSearch}
              aria-label="Search"
              className="hidden lg:block cursor-pointer text-[var(--color-nt-black)] opacity-80 hover:opacity-100 transition-opacity duration-150 p-2"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Account - visible on all screens */}
            <button
              onClick={openAuth}
              aria-label="Account"
              className="cursor-pointer text-[var(--color-nt-black)] opacity-80 hover:opacity-100 transition-opacity duration-150 p-2"
            >
              <User size={20} strokeWidth={1.5} />
            </button>

            {/* Cart - visible on all screens with count badge */}
            <button
              onClick={openCart}
              aria-label="Cart"
              className="relative cursor-pointer text-[var(--color-nt-black)] hover:opacity-80 transition-opacity duration-150 p-2"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1">
                {count || 0}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
