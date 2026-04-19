'use client'

import Link from 'next/link'
import { ChevronRight, Heart } from 'lucide-react'
import { WishlistGrid } from '@/components/account/WishlistGrid'

export default function WishlistPage() {
  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-[12px] text-[var(--color-nt-mid-gray)] mb-6">
        <Link href="/" className="hover:text-[var(--color-nt-black)] transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/account" className="hover:text-[var(--color-nt-black)] transition-colors">
          Account
        </Link>
        <ChevronRight size={14} />
        <span className="text-[var(--color-nt-black)]">Wishlist</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Heart size={24} strokeWidth={1.5} className="text-[var(--color-nt-black)]" />
        <h2 className="text-[20px] sm:text-[24px] font-bold uppercase tracking-wide text-[var(--color-nt-black)]">
          My Wishlist
        </h2>
      </div>

      <p className="text-[14px] text-[var(--color-nt-mid-gray)] mb-8">
        Save your favorite items and shop them later. Items in your wishlist are reserved for 30
        days.
      </p>

      <WishlistGrid />
    </div>
  )
}
