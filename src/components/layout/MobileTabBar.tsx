'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, User, ShoppingBag, Heart } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'

export function MobileTabBar() {
  const pathname = usePathname()
  const { openCart } = useUIStore()
  const items = useCartStore((s) => s.items)
  const count = items.reduce((n, i) => n + i.quantity, 0)

  const tabs = [
    { href: '/', label: 'Home', icon: Home, badge: 0 },
    { href: '/search', label: 'Search', icon: Search, badge: 0 },
    { href: '/account', label: 'Account', icon: User, badge: 0 },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: count, onClick: openCart },
    { href: '/account/wishlist', label: 'Wishlist', icon: Heart, badge: 0 },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[200] bg-[var(--color-nt-white)] border-t border-[var(--color-nt-light-gray)] h-[60px] flex items-center lg:hidden">
      {tabs.map((tab) => {
        const isActive = tab.href && (pathname === tab.href || pathname.startsWith(tab.href + '/'))
        const Icon = tab.icon
        const key = tab.id || tab.href

        const content = (
          <>
            <div className="relative">
              <Icon
                size={22}
                strokeWidth={1.5}
                className={cn(
                  'transition-colors duration-150',
                  isActive ? 'text-[var(--color-nt-black)]' : 'text-[var(--color-nt-mid-gray)]',
                )}
              />
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[9px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-0.5">
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              className={cn(
                'transition-colors duration-150',
                isActive ? 'text-[var(--color-nt-black)]' : 'text-[var(--color-nt-mid-gray)]',
              )}
            >
              {tab.label}
            </span>
          </>
        )

        if (tab.onClick) {
          return (
            <button
              key={key}
              onClick={tab.onClick}
              className="flex-1 flex flex-col items-center gap-[4px] text-[10px] font-normal py-2 relative text-[var(--color-nt-mid-gray)]"
            >
              {content}
            </button>
          )
        }

        return (
          <Link
            key={key}
            href={tab.href || '#'}
            className={cn(
              'flex-1 flex flex-col items-center gap-[4px] text-[10px] font-normal py-2 relative',
              isActive ? 'text-[var(--color-nt-black)]' : 'text-[var(--color-nt-mid-gray)]',
            )}
          >
            {content}
          </Link>
        )
      })}
    </nav>
  )
}
