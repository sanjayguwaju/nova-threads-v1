'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronDown, X, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLORS = [
  { name: 'Black', hex: '#111110' },
  { name: 'White', hex: '#F5F2ED' },
  { name: 'Stone', hex: '#8C8880' },
  { name: 'Clay', hex: '#C9B9A4' },
  { name: 'Blush', hex: '#E8DDD4' },
]
const GENDERS = ['women', 'men', 'unisex']

interface ProductFiltersProps {
  categories?: any[]
  activeCount?: number
  isMobile?: boolean
  onClose?: () => void
}

export function ProductFilters({ categories, isMobile, onClose }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const set = (key: string, value: string | null) => {
    const p = new URLSearchParams(sp.toString())
    if (value === null || value === '') p.delete(key)
    else p.set(key, value)
    p.delete('page')
    router.push(`${pathname}?${p.toString()}`, { scroll: false })
  }

  const toggleMulti = (key: string, value: string) => {
    const current = sp.get(key)?.split(',').filter(Boolean) || []
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    set(key, next.length ? next.join(',') : null)
  }

  const clearAll = () => {
    router.push(pathname, { scroll: false })
    if (onClose) onClose()
  }

  const genderVals = sp.get('gender')?.split(',') || []
  const sizeVals = sp.get('size')?.split(',') || []
  const colorVals = sp.get('color')?.split(',') || []
  const categoryVal = sp.get('category')
  const minPrice = sp.get('minPrice')
  const maxPrice = sp.get('maxPrice')

  const hasActiveFilters =
    genderVals.length > 0 ||
    sizeVals.length > 0 ||
    colorVals.length > 0 ||
    categoryVal ||
    minPrice ||
    maxPrice

  const activeChips = [
    ...genderVals.map((v) => ({ key: 'gender', value: v })),
    ...sizeVals.map((v) => ({ key: 'size', value: v })),
    ...colorVals.map((v) => ({ key: 'color', value: v })),
    ...(categoryVal ? [{ key: 'category', value: categoryVal }] : []),
    ...(minPrice ? [{ key: 'minPrice', value: `Min: $${minPrice}` }] : []),
    ...(maxPrice ? [{ key: 'maxPrice', value: `Max: $${maxPrice}` }] : []),
  ]

  return (
    <aside className={cn('w-full', !isMobile && 'lg:w-[260px] shrink-0')}>
      {/* Active Filters */}
      {activeChips.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {activeChips.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  if (c.key === 'minPrice' || c.key === 'maxPrice') {
                    set(c.key, null)
                  } else {
                    toggleMulti(c.key, c.value.replace('Min: $', '').replace('Max: $', ''))
                  }
                }}
                className="inline-flex items-center gap-1.5 border border-[var(--color-nt-black)] px-2.5 py-1.5 text-[11px] uppercase tracking-wider bg-[var(--color-nt-white)] text-[var(--color-nt-black)] hover:bg-[var(--color-nt-off-white)] transition-colors"
              >
                {c.value} <X size={12} strokeWidth={1.5} />
              </button>
            ))}
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-[12px] text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-black)] transition-colors"
          >
            <RotateCcw size={12} strokeWidth={1.5} />
            Clear all filters
          </button>
        </div>
      )}

      <div className="space-y-0">
        <Accordion title="Category" defaultOpen>
          <div className="space-y-2 py-2">
            {categories?.map((c: any) => (
              <button
                key={c.id}
                onClick={() => set('category', categoryVal === c.slug ? null : c.slug)}
                className={cn(
                  'block text-left w-full py-1.5 text-[14px] transition-colors',
                  categoryVal === c.slug
                    ? 'text-[var(--color-nt-black)] font-medium'
                    : 'text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-black)]',
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </Accordion>

        <Accordion title="Gender">
          <div className="flex flex-wrap gap-2 py-2">
            {GENDERS.map((g) => (
              <button
                key={g}
                onClick={() => toggleMulti('gender', g)}
                className={cn(
                  'border px-3 py-2 text-[12px] uppercase tracking-wider transition-all',
                  genderVals.includes(g)
                    ? 'border-[var(--color-nt-black)] bg-[var(--color-nt-black)] text-[var(--color-nt-white)]'
                    : 'border-[var(--color-nt-light-gray)] text-[var(--color-nt-mid-gray)] hover:border-[var(--color-nt-black)] hover:text-[var(--color-nt-black)]',
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </Accordion>

        <Accordion title="Size">
          <div className="grid grid-cols-4 gap-2 py-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => toggleMulti('size', s)}
                className={cn(
                  'border py-2.5 text-[12px] font-medium transition-all',
                  sizeVals.includes(s)
                    ? 'border-[var(--color-nt-black)] bg-[var(--color-nt-black)] text-[var(--color-nt-white)]'
                    : 'border-[var(--color-nt-light-gray)] text-[var(--color-nt-mid-gray)] hover:border-[var(--color-nt-black)] hover:text-[var(--color-nt-black)]',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </Accordion>

        <Accordion title="Color">
          <div className="flex flex-wrap gap-3 py-2">
            {COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => toggleMulti('color', c.name)}
                title={c.name}
                className={cn(
                  'w-8 h-8 rounded-full border-2 transition-all',
                  colorVals.includes(c.name)
                    ? 'border-[var(--color-nt-black)] scale-110'
                    : 'border-[var(--color-nt-light-gray)] hover:border-[var(--color-nt-mid-gray)]',
                )}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </Accordion>

        <Accordion title="Price Range">
          <div className="flex items-center gap-2 py-2">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min"
                defaultValue={sp.get('minPrice') || ''}
                onBlur={(e) => set('minPrice', e.target.value || null)}
                className="w-full border border-[var(--color-nt-light-gray)] bg-transparent px-3 py-2 text-[13px] focus:outline-none focus:border-[var(--color-nt-black)] transition-colors"
              />
            </div>
            <span className="text-[var(--color-nt-mid-gray)]">—</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max"
                defaultValue={sp.get('maxPrice') || ''}
                onBlur={(e) => set('maxPrice', e.target.value || null)}
                className="w-full border border-[var(--color-nt-light-gray)] bg-transparent px-3 py-2 text-[13px] focus:outline-none focus:border-[var(--color-nt-black)] transition-colors"
              />
            </div>
          </div>
        </Accordion>
      </div>

      {/* Mobile: Apply/Close Button */}
      {isMobile && (
        <div className="mt-8 pt-4 border-t border-[var(--color-nt-light-gray)]">
          <button
            onClick={() => onClose?.()}
            className="w-full py-3.5 bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[13px] font-semibold uppercase tracking-wider hover:bg-[var(--color-nt-charcoal)] transition-colors"
          >
            Show Results
          </button>
        </div>
      )}
    </aside>
  )
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[var(--color-nt-light-gray)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full py-4"
      >
        <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-nt-black)]">
          {title}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={cn(
            'text-[var(--color-nt-mid-gray)] transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200',
          open ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
