'use client'
import Link from 'next/link'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from '@/store/useUIStore'

const LINKS = [
  { label: 'Women', link: '/shop?gender=women' },
  { label: 'Men', link: '/shop?gender=men' },
  { label: 'New In', link: '/shop?sort=newest' },
  { label: 'Sale', link: '/shop?sale=true' },
  { label: 'Account', link: '/account' },
  { label: 'Wishlist', link: '/account/wishlist' },
]

export function MobileMenu() {
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore()
  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 30 }}
          className="fixed inset-0 bg-paper z-50 lg:hidden flex flex-col"
        >
          <div className="flex justify-between items-center px-24 py-16 border-b border-stone/20">
            <Link href="/" onClick={toggleMobileMenu} className="font-display text-[22px]">NOVA THREADS</Link>
            <button onClick={toggleMobileMenu}><X size={22} /></button>
          </div>
          <nav className="flex-1 flex flex-col px-24 py-32 gap-20">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.link}
                onClick={toggleMobileMenu}
                className="font-display text-[32px] hover:text-stone transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
