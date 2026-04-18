import { cn } from '@/lib/utils/cn'

interface Props {
  children: React.ReactNode
  variant?: 'new' | 'sale' | 'stock' | 'neutral' | 'success'
  className?: string
}

export function Badge({ children, variant = 'neutral', className }: Props) {
  const styles: Record<string, string> = {
    new: 'bg-ink text-paper',
    sale: 'bg-signal text-paper',
    stock: 'bg-clay text-ink',
    neutral: 'bg-paper text-ink border border-ink',
    success: 'bg-success text-paper',
  }
  return (
    <span className={cn('font-mono text-[11px] uppercase tracking-widest px-8 py-4', styles[variant], className)}>
      {children}
    </span>
  )
}
