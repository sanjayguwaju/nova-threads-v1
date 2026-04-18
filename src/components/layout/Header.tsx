'use client'
import Link from 'next/link'
import { Search, User, Heart, ShoppingBag, Menu } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { cn } from '@/lib/utils/cn'

interface Props {
  nav?: { mainNav?: Array<{ label?: string; link?: string }> }
}

export function Header({ nav }: Props) {
  const items = useCartStore((s) => s.items)
  const count = items.reduce((n, i) => n + i.quantity, 0)
  const { openCart, openSearch, toggleMobileMenu } = useUIStore()
  const { atTop } = useScrollDirection()

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        atTop ? 'bg-transparent' : 'bg-paper/90 backdrop-blur-md border-b border-stone/20'
      )}
    >
      <div className="max-w-container mx-auto px-24 py-16 flex items-center justify-between">
        <button onClick={toggleMobileMenu} className="lg:hidden" aria-label="Menu">
          <Menu size={22} />
        </button>

        <nav className="hidden lg:flex items-center gap-32">
          {(nav?.mainNav || [
            { label: 'Women', link: '/shop?gender=women' },
            { label: 'Men', link: '/shop?gender=men' },
            { label: 'New In', link: '/shop?sort=newest' },
            { label: 'Sale', link: '/shop?sale=true' },
          ]).map((item, i) => (
            <Link
              key={i}
              href={item.link || '#'}
              className="font-mono text-[11px] uppercase tracking-widest hover:text-stone transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="font-display text-[24px] tracking-wider absolute left-1/2 -translate-x-1/2">
          NOVA THREADS
        </Link>

        <div className="flex items-center gap-20">
          <button onClick={openSearch} aria-label="Search" className="hover:text-stone transition-colors">
            <Search size={20} />
          </button>
          <Link href="/account" aria-label="Account" className="hidden sm:block hover:text-stone transition-colors">
            <User size={20} />
          </Link>
          <Link href="/account/wishlist" aria-label="Wishlist" className="hidden sm:block hover:text-stone transition-colors">
            <Heart size={20} />
          </Link>
          <button onClick={openCart} aria-label="Cart" className="relative hover:text-stone transition-colors">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-4 -right-8 bg-signal text-paper text-[10px] font-mono rounded-full w-16 h-16 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
