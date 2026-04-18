'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronDown, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLORS = [
  { name: 'Black', hex: '#111110' },
  { name: 'White', hex: '#F5F2ED' },
  { name: 'Stone', hex: '#8C8880' },
  { name: 'Clay', hex: '#C9B9A4' },
  { name: 'Blush', hex: '#E8DDD4' },
]
const GENDERS = ['women', 'men', 'unisex', 'kids']

export function ProductFilters({ categories }: { categories?: any[] }) {
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

  const genderVals = sp.get('gender')?.split(',') || []
  const sizeVals = sp.get('size')?.split(',') || []
  const colorVals = sp.get('color')?.split(',') || []

  const activeChips = [
    ...genderVals.map((v) => ({ key: 'gender', value: v })),
    ...sizeVals.map((v) => ({ key: 'size', value: v })),
    ...colorVals.map((v) => ({ key: 'color', value: v })),
  ]

  return (
    <aside className="w-full lg:w-[240px] shrink-0">
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-6 mb-20">
          {activeChips.map((c, i) => (
            <button
              key={i}
              onClick={() => toggleMulti(c.key, c.value)}
              className="inline-flex items-center gap-6 border border-ink px-8 py-4 font-mono text-[10px] uppercase"
            >
              {c.value} <X size={10} />
            </button>
          ))}
        </div>
      )}

      <Accordion title="Category" defaultOpen>
        <div className="space-y-8 text-[14px]">
          {categories?.map((c: any) => (
            <button
              key={c.id}
              onClick={() => set('category', c.slug)}
              className={cn('block text-left w-full hover:text-ink', sp.get('category') === c.slug ? 'text-ink font-medium' : 'text-stone')}
            >
              {c.name}
            </button>
          ))}
        </div>
      </Accordion>

      <Accordion title="Gender">
        <div className="flex flex-wrap gap-6">
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => toggleMulti('gender', g)}
              className={cn(
                'border px-10 py-6 font-mono text-[11px] uppercase',
                genderVals.includes(g) ? 'border-ink bg-ink text-paper' : 'border-stone/40 text-stone'
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </Accordion>

      <Accordion title="Size">
        <div className="grid grid-cols-4 gap-6">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleMulti('size', s)}
              className={cn(
                'border py-8 font-mono text-[11px]',
                sizeVals.includes(s) ? 'border-ink bg-ink text-paper' : 'border-stone/40'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Accordion>

      <Accordion title="Color">
        <div className="flex flex-wrap gap-10">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => toggleMulti('color', c.name)}
              title={c.name}
              className={cn(
                'w-24 h-24 rounded-full border-2',
                colorVals.includes(c.name) ? 'border-ink' : 'border-stone/40'
              )}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </Accordion>

      <Accordion title="Price">
        <div className="flex gap-8">
          <input
            type="number"
            placeholder="Min"
            defaultValue={sp.get('minPrice') || ''}
            onBlur={(e) => set('minPrice', e.target.value || null)}
            className="w-full border-b border-stone/40 bg-transparent py-6 text-[13px] focus:outline-none focus:border-ink"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={sp.get('maxPrice') || ''}
            onBlur={(e) => set('maxPrice', e.target.value || null)}
            className="w-full border-b border-stone/40 bg-transparent py-6 text-[13px] focus:outline-none focus:border-ink"
          />
        </div>
      </Accordion>
    </aside>
  )
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-stone/20 py-16">
      <button onClick={() => setOpen(!open)} className="flex justify-between items-center w-full">
        <span className="font-mono text-[11px] uppercase tracking-widest">{title}</span>
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="mt-12">{children}</div>}
    </div>
  )
}
