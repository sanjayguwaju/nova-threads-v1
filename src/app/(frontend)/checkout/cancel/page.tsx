import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function CancelPage() {
  return (
    <div className="max-w-container mx-auto px-24 py-80 text-center">
      <h1 className="font-display text-[48px]">Payment cancelled</h1>
      <p className="text-stone mt-16">Your payment was not completed. Your bag is still saved.</p>
      <Link href="/cart" className="inline-block mt-24"><Button>Return to Bag</Button></Link>
    </div>
  )
}
