'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from '@/store/useUIStore'
import { User, UserPlus } from 'lucide-react'

const LINKS = [
  { label: 'Home', link: '/' },
  { label: 'Women', link: '/shop?gender=women', hasChildren: true },
  { label: 'Men', link: '/shop?gender=men', hasChildren: true },
  { label: 'New In', link: '/shop?sort=newest', hasChildren: true },
  { label: 'Sale', link: '/shop?sale=true' },
  { label: 'Wishlist', link: '/account/wishlist' },
]

// Category data for submenus
const CATEGORY_DATA: Record<
  string,
  {
    featureImage: string
    sections: { title: string; items: { name: string; image: string }[] }[]
  }
> = {
  Women: {
    featureImage:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=200&fit=crop',
    sections: [
      {
        title: 'Top Rated',
        items: [
          {
            name: 'Sport Outfit',
            image:
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop',
          },
          {
            name: 'Dress',
            image:
              'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop',
          },
          {
            name: 'Suit',
            image:
              'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop',
          },
        ],
      },
      {
        title: 'Bags & Accessories',
        items: [
          {
            name: 'Blazero',
            image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop',
          },
          {
            name: 'Congue',
            image:
              'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop',
          },
          {
            name: 'Cosmopolis',
            image:
              'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200&h=200&fit=crop',
          },
          {
            name: 'Scarvero',
            image:
              'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=200&h=200&fit=crop',
          },
          {
            name: 'Glamos',
            image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop',
          },
          {
            name: 'Valkyrio',
            image:
              'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop',
          },
        ],
      },
      {
        title: 'Clothing',
        items: [
          {
            name: 'Swimwear',
            image:
              'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=200&h=200&fit=crop',
          },
          {
            name: 'Underwear',
            image:
              'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&h=200&fit=crop',
          },
          {
            name: 'Footwear',
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop',
          },
        ],
      },
    ],
  },
  Men: {
    featureImage:
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=200&fit=crop',
    sections: [
      {
        title: 'Top Rated',
        items: [
          {
            name: 'Shirt',
            image:
              'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop',
          },
          {
            name: 'Jacket',
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop',
          },
          {
            name: 'Trousers',
            image:
              'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=200&fit=crop',
          },
        ],
      },
      {
        title: 'Bags & Accessories',
        items: [
          {
            name: 'Backpack',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
          },
          {
            name: 'Wallet',
            image:
              'https://images.unsplash.com/photo-1627123424574-181ce5171c98?w=200&h=200&fit=crop',
          },
          {
            name: 'Belt',
            image:
              'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=200&h=200&fit=crop',
          },
        ],
      },
    ],
  },
  'New In': {
    featureImage:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=200&fit=crop',
    sections: [
      {
        title: 'New Arrivals',
        items: [
          {
            name: 'Summer Collection',
            image:
              'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=200&fit=crop',
          },
          {
            name: 'Limited Edition',
            image:
              'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop',
          },
          {
            name: 'Trending Now',
            image:
              'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop',
          },
        ],
      },
    ],
  },
}

export function MobileMenu() {
  const { mobileMenuOpen, toggleMobileMenu, openAuth } = useUIStore()
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  const handleClose = () => {
    toggleMobileMenu()
    setTimeout(() => setActiveSubmenu(null), 300)
  }

  const handleSubmenuClick = (label: string) => {
    if (CATEGORY_DATA[label]) {
      setActiveSubmenu(label)
    }
  }

  const handleBack = () => {
    setActiveSubmenu(null)
  }

  const submenuData = activeSubmenu ? CATEGORY_DATA[activeSubmenu] : null

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/35 z-[299] lg:hidden"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 w-[88vw] max-w-[340px] h-screen bg-[var(--color-nt-white)] z-[300] lg:hidden overflow-hidden"
          >
            {/* Main Menu Panel */}
            <motion.div
              className="h-full overflow-y-auto"
              animate={{ x: activeSubmenu ? '-100%' : 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 h-[56px] border-b border-[var(--color-nt-light-gray)]">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[14px] font-bold px-3 py-1">
                    Menu
                  </span>
                  <span className="text-[16px] font-bold text-[var(--color-nt-black)]">
                    Nova Threads
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="text-[22px] text-[var(--color-nt-black)] p-2 -mr-2"
                  aria-label="Close menu"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              {/* Menu List */}
              <nav className="flex flex-col">
                {LINKS.map((link) => (
                  <div
                    key={link.label}
                    onClick={() =>
                      link.hasChildren && CATEGORY_DATA[link.label]
                        ? handleSubmenuClick(link.label)
                        : handleClose()
                    }
                    className="flex items-center gap-[14px] px-4 py-[14px] border-b border-[var(--color-nt-light-gray)] text-[15px] text-[var(--color-nt-black)] cursor-pointer active:bg-[var(--color-nt-off-white)]"
                  >
                    <div className="w-[44px] h-[44px] rounded-full bg-[var(--color-nt-off-white)] flex items-center justify-center flex-shrink-0">
                      <span className="text-[18px] font-bold text-[var(--color-nt-mid-gray)]">
                        {link.label.charAt(0)}
                      </span>
                    </div>
                    <span>{link.label}</span>
                    {link.hasChildren && CATEGORY_DATA[link.label] && (
                      <ChevronRight size={16} className="ml-auto text-[var(--color-nt-mid-gray)]" />
                    )}
                  </div>
                ))}
              </nav>

              {/* Account Section */}
              <div className="px-4 py-4 mt-2 border-t border-[var(--color-nt-light-gray)]">
                <p className="text-[12px] font-bold text-[var(--color-nt-mid-gray)] uppercase tracking-wider mb-3">
                  Account
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleClose()
                      setTimeout(() => openAuth(), 300)
                    }}
                    className="flex items-center gap-3 w-full px-3 py-3 bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[14px] font-medium"
                  >
                    <User size={18} strokeWidth={1.5} />
                    <span>Log In</span>
                  </button>
                  <button
                    onClick={() => {
                      handleClose()
                      setTimeout(() => openAuth(), 300)
                    }}
                    className="flex items-center gap-3 w-full px-3 py-3 border border-[var(--color-nt-black)] text-[var(--color-nt-black)] text-[14px] font-medium"
                  >
                    <UserPlus size={18} strokeWidth={1.5} />
                    <span>Create Account</span>
                  </button>
                </div>
              </div>

              {/* Region Section */}
              <div className="px-4 py-4 mt-2">
                <p className="text-[12px] font-bold text-[var(--color-nt-mid-gray)] uppercase tracking-wider mb-2">
                  Region and Language
                </p>
                <button className="flex items-center gap-2 text-[14px] text-[var(--color-nt-black)] w-full">
                  <span className="w-5 h-5 rounded-full bg-[var(--color-nt-off-white)] flex items-center justify-center text-[10px] font-bold text-[var(--color-nt-mid-gray)]">
                    🌐
                  </span>
                  <span>NPR / EN</span>
                  <ChevronRight size={14} className="ml-auto text-[var(--color-nt-mid-gray)]" />
                </button>
              </div>
            </motion.div>

            {/* Submenu Panel */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-[var(--color-nt-white)] overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: activeSubmenu ? 0 : '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {submenuData && (
                <>
                  {/* Submenu Header with Back */}
                  <div className="flex items-center px-4 h-[56px] border-b border-[var(--color-nt-light-gray)]">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-[14px] text-[var(--color-nt-black)] cursor-pointer p-2 -ml-2"
                    >
                      <ArrowLeft
                        size={18}
                        strokeWidth={1.5}
                        className="text-[var(--color-nt-mid-gray)]"
                      />
                      <span className="font-bold">{activeSubmenu}</span>
                    </button>
                  </div>

                  {/* Feature Image */}
                  <div className="relative w-full aspect-[16/7] overflow-hidden">
                    <Image
                      src={submenuData.featureImage}
                      alt={activeSubmenu}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Category Sections */}
                  <div className="px-4 py-4">
                    {submenuData.sections.map((section) => (
                      <div key={section.title} className="mb-6">
                        <h3 className="text-[14px] font-bold text-[var(--color-nt-black)] mb-3">
                          {section.title}
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {section.items.map((item) => (
                            <Link
                              key={item.name}
                              href={`/shop?category=${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                              onClick={handleClose}
                              className="flex flex-col items-center gap-2 text-center"
                            >
                              <div className="relative w-full aspect-square overflow-hidden bg-[var(--color-nt-off-white)]">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="100px"
                                />
                              </div>
                              <span className="text-[12px] text-[var(--color-nt-black)] leading-tight">
                                {item.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
