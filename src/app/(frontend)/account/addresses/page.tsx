import { getCurrentUser } from '@/lib/payload/actions/auth'

export default async function AddressesPage() {
  const user = await getCurrentUser()
  const addresses: any[] = user?.addresses || []
  return (
    <div className="space-y-24">
      <h2 className="font-display text-[32px]">Addresses</h2>
      {addresses.length === 0 ? (
        <p className="text-stone">No addresses saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {addresses.map((a, i) => (
            <div key={i} className="border border-stone/20 p-20">
              <div className="font-mono text-[10px] uppercase tracking-widest text-stone">{a.label || 'Address'}</div>
              <div className="mt-4">{a.firstName} {a.lastName}</div>
              <div className="text-[13px] text-stone mt-4">
                {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
                {a.city}, {a.state} {a.zip}<br />
                {a.country}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
