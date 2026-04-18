import { getCurrentUser } from '@/lib/payload/actions/auth'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  return (
    <div className="space-y-24 max-w-[560px]">
      <h2 className="font-display text-[32px]">Profile</h2>
      <div className="space-y-12 text-[14px]">
        <Field label="Email" value={user?.email} />
        <Field label="First Name" value={user?.firstName} />
        <Field label="Last Name" value={user?.lastName} />
        <Field label="Phone" value={user?.phone} />
      </div>
      <p className="text-stone text-[13px]">
        Profile editing UI: use Payload REST at <code>/api/users/{user?.id}</code> PATCH, or admin panel.
      </p>
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-stone">{label}</div>
      <div>{value || '—'}</div>
    </div>
  )
}
