import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'Page Not Found | NOVA THREADS',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <div className="max-w-container mx-auto px-24 py-80 text-center">
      <h1 className="font-display text-[64px]">404</h1>
      <p className="text-stone mt-16 text-[18px]">This page does not exist.</p>
      <div className="mt-32 flex gap-16 justify-center">
        <Link href="/shop">
          <Button variant="outline">Shop Collection</Button>
        </Link>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    </div>
  )
}
