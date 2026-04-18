import { notFound } from 'next/navigation'
import { getOrderById } from '@/lib/payload/queries/orders'
import { getCurrentUser } from '@/lib/payload/actions/auth'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils/formatCurrency'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  let order: any = null
  try { order = await getOrderById(id) } catch {}
  if (!order) notFound()
  const ownerId = typeof order.customer === 'object' ? order.customer?.id : order.customer
  if (ownerId !== user?.id && user?.role !== 'admin') notFound()

  return (
    <div className="space-y-32">
      <header className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-stone">Order</div>
          <h2 className="font-display text-[32px]">{order.orderNumber}</h2>
          <div className="text-stone text-[13px] mt-4">{new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <Badge>{order.status}</Badge>
      </header>

      {order.trackingNumber && (
        <div className="border border-stone/20 p-16">
          <div className="font-mono text-[11px] uppercase tracking-widest text-stone">Tracking</div>
          <div className="text-[14px]">{order.trackingNumber}</div>
        </div>
      )}

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-widest mb-16">Items</h3>
        <div className="space-y-12">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between border-b border-stone/20 pb-12">
              <div>
                <div className="text-[14px]">{typeof item.product === 'object' ? item.product?.name : 'Product'}</div>
                <div className="font-mono text-[11px] uppercase text-stone">{item.variantLabel} × {item.quantity}</div>
              </div>
              <span className="font-mono text-[13px]">{formatCurrency(item.totalPrice)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 max-w-[320px] ml-auto">
        <Row label="Subtotal" value={formatCurrency(order.subtotal || 0)} />
        {order.discount > 0 && <Row label="Discount" value={`- ${formatCurrency(order.discount)}`} />}
        <Row label="Shipping" value={order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)} />
        <div className="flex justify-between pt-8 border-t border-stone/30 mt-8">
          <span className="font-mono text-[11px] uppercase tracking-widest">Total</span>
          <span className="font-mono text-[15px]">{formatCurrency(order.total)}</span>
        </div>
      </div>

      {order.timeline?.length > 0 && (
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-widest mb-16">Timeline</h3>
          <ol className="space-y-8 text-[13px]">
            {order.timeline.map((e: any, i: number) => (
              <li key={i} className="flex gap-12">
                <span className="font-mono text-stone w-[140px]">{new Date(e.timestamp).toLocaleString()}</span>
                <span>{e.status}{e.note ? ` — ${e.note}` : ''}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px]"><span className="text-stone">{label}</span><span className="font-mono">{value}</span></div>
  )
}
