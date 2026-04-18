import { redirect } from 'next/navigation'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { getCurrentUser } from '@/lib/payload/actions/auth'

export const dynamic = 'force-dynamic'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  let user: any = null
  try { user = await getCurrentUser() } catch {}
  if (!user) redirect('/auth/login')
  return (
    <div className="max-w-container mx-auto px-24 py-48">
      <h1 className="font-display text-[48px] mb-32">Account</h1>
      <div className="flex flex-col md:flex-row gap-32">
        <AccountSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
