import Link from 'next/link'
import { Badge } from '../ui/Badge'
import { formatCurrency } from '@/lib/utils/formatCurrency'

export function OrderCard({ order }: { order: any }) {
  const statusVariant =
    order.status === 'delivered' || order.status === 'shipped' ? 'success' :
    order.status === 'cancelled' || order.status === 'refunded' || order.status === 'payment_failed' ? 'sale' :
    'neutral'

  return (
    <Link href={`/account/orders/${order.id}`} className="block border border-stone/20 p-20 hover:border-ink transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-stone">{order.orderNumber}</div>
          <div className="text-[13px] mt-4">{new Date(order.createdAt).toLocaleDateString()}</div>
        </div>
        <Badge variant={statusVariant as any}>{order.status}</Badge>
      </div>
      <div className="mt-12 flex items-center justify-between">
        <span className="text-stone text-[13px]">{order.items?.length || 0} item(s)</span>
        <span className="font-mono text-[14px]">{formatCurrency(order.total || 0)}</span>
      </div>
    </Link>
  )
}
