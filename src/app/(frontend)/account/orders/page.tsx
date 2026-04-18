import { getCurrentUser } from '@/lib/payload/actions/auth'
import { getUserOrders } from '@/lib/payload/queries/orders'
import { OrderCard } from '@/components/account/OrderCard'

export default async function OrdersPage() {
  const user = await getCurrentUser()
  let orders: any = { docs: [] }
  try { if (user) orders = await getUserOrders(user.id) } catch {}
  return (
    <div>
      <h2 className="font-display text-[32px] mb-24">Orders</h2>
      {orders.docs.length === 0 ? (
        <p className="text-stone">You haven't placed any orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {orders.docs.map((o: any) => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  )
}
