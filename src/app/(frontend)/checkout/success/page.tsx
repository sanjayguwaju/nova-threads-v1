import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { getOrderById } from '@/lib/payload/queries/orders'

export const dynamic = 'force-dynamic'

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId } = await searchParams
  let order: any = null
  try { if (orderId) order = await getOrderById(orderId) } catch {}

  return (
    <div className="max-w-container mx-auto px-24 py-80 text-center">
      <h1 className="font-display text-[64px]">Thank you.</h1>
      <p className="text-stone mt-16 text-[18px]">Your order has been placed successfully.</p>
      {order && (
        <div className="mt-32 inline-block border border-ink p-32 text-left">
          <div className="font-mono text-[11px] uppercase tracking-widest text-stone">Order Number</div>
          <div className="font-display text-[32px]">{order.orderNumber}</div>
          <div className="mt-16 text-stone text-[13px]">A confirmation email is on its way.</div>
        </div>
      )}
      <div className="mt-32 flex gap-16 justify-center">
        <Link href="/shop"><Button variant="outline">Continue Shopping</Button></Link>
        {order && <Link href={`/account/orders/${order.id}`}><Button>Track Order</Button></Link>}
      </div>
    </div>
  )
}
