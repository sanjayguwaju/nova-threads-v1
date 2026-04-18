'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best-reviewed', label: 'Best Reviewed' },
  { value: 'best-selling', label: 'Best Selling' },
]

export function ProductSort({ total }: { total: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const onChange = (value: string) => {
    const p = new URLSearchParams(sp.toString())
    p.set('sort', value)
    router.push(`${pathname}?${p.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center justify-between border-b border-stone/20 pb-16 mb-24">
      <div className="font-mono text-[11px] uppercase tracking-widest text-stone">
        {total} {total === 1 ? 'Product' : 'Products'}
      </div>
      <div className="flex items-center gap-12">
        <label className="font-mono text-[11px] uppercase tracking-widest text-stone">Sort</label>
        <select
          value={sp.get('sort') || 'featured'}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent font-mono text-[12px] focus:outline-none border-b border-transparent hover:border-ink"
        >
          {OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  )
}
