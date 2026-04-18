import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function StarRating({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(rating) ? 'fill-ink text-ink' : 'text-stone/40'}
        />
      ))}
    </div>
  )
}
