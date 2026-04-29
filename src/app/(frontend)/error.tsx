'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Route error:', error)
  }, [error])

  return (
    <div className="max-w-container mx-auto px-24 py-80 text-center">
      <h1 className="font-display text-[48px]">Something went wrong</h1>
      <p className="text-stone mt-16 text-[16px]">
        We encountered an error loading this page.
      </p>
      {error.digest && (
        <p className="font-mono text-[11px] text-stone/60 mt-8">Ref: {error.digest}</p>
      )}
      <div className="mt-32 flex gap-16 justify-center">
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    </div>
  )
}
