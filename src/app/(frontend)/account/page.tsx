import { getCurrentUser } from '@/lib/payload/actions/auth'
import { getUserOrders } from '@/lib/payload/queries/orders'
import { OrderCard } from '@/components/account/OrderCard'

export default async function AccountDashboard() {
  const user = await getCurrentUser()
  let orders: any = { docs: [] }
  try { if (user) orders = await getUserOrders(user.id) } catch {}
  const recent = orders.docs.slice(0, 3)

  return (
    <div className="space-y-32">
      <div>
        <h2 className="font-display text-[32px]">Welcome{user?.firstName ? `, ${user.firstName}` : ''}.</h2>
        <p className="text-stone mt-8">Manage your orders, addresses, and profile.</p>
      </div>
      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-widest mb-16">Recent Orders</h3>
        {recent.length === 0 ? (
          <p className="text-stone">No orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {recent.map((o: any) => <OrderCard key={o.id} order={o} />)}
          </div>
        )}
      </div>
    </div>
  )
}
