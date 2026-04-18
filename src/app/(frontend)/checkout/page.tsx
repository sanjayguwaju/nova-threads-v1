import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { getCurrentUser } from '@/lib/payload/actions/auth'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  let user: any = null
  try { user = await getCurrentUser() } catch {}
  return (
    <div className="max-w-container mx-auto px-24 py-48">
      <h1 className="font-display text-[48px] mb-32">Checkout</h1>
      <CheckoutForm user={user} />
    </div>
  )
}
