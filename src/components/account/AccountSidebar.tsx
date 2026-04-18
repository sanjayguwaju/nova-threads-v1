'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/payload/actions/auth'
import { cn } from '@/lib/utils/cn'

const LINKS = [
  { href: '/account', label: 'Overview' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/account/profile', label: 'Profile' },
  { href: '/account/wishlist', label: 'Wishlist' },
]

export function AccountSidebar() {
  const pathname = usePathname()
  return (
    <aside className="md:w-[220px] shrink-0">
      <nav className="space-y-8">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'block font-mono text-[11px] uppercase tracking-widest py-6',
              pathname === l.href ? 'text-ink' : 'text-stone hover:text-ink'
            )}
          >
            {l.label}
          </Link>
        ))}
        <form action={logout}>
          <button
            type="submit"
            className="block font-mono text-[11px] uppercase tracking-widest py-6 text-stone hover:text-signal"
          >
            Sign Out
          </button>
        </form>
      </nav>
    </aside>
  )
}
