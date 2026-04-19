'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

const OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best-reviewed', label: 'Best Reviewed' },
  { value: 'best-selling', label: 'Best Selling' },
]

export function ProductSort() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const onChange = (value: string) => {
    const p = new URLSearchParams(sp.toString())
    p.set('sort', value)
    router.push(`${pathname}?${p.toString()}`, { scroll: false })
  }

  const currentLabel =
    OPTIONS.find((o) => o.value === (sp.get('sort') || 'featured'))?.label || 'Featured'

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-[12px] text-[var(--color-nt-mid-gray)] uppercase tracking-wider">
        Sort by:
      </span>
      <div className="relative">
        <select
          value={sp.get('sort') || 'featured'}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent text-[13px] text-[var(--color-nt-black)] font-medium focus:outline-none pr-6 cursor-pointer"
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-nt-mid-gray)]"
        />
      </div>
    </div>
  )
}
