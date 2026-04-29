'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log to error tracking service (e.g., Sentry) in production
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body className="bg-paper text-ink flex items-center justify-center min-h-screen p-24">
        <div className="text-center max-w-md">
          <h1 className="font-display text-[48px] mb-16">Something went wrong</h1>
          <p className="text-stone mb-24">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
          {error.digest && (
            <p className="font-mono text-[11px] text-stone/60 mb-24">Ref: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="bg-ink text-paper font-mono text-[12px] uppercase tracking-widest py-14 px-24 hover:bg-noir"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
