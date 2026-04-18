import type { Metadata } from 'next'
import React from 'react'
import './globals.css'
import { QueryProvider } from './providers'

export const metadata: Metadata = {
  description: 'NOVA THREADS - Premium Fashion for Everyone',
  title: 'NOVA THREADS',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <body suppressHydrationWarning>
        <QueryProvider>
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  )
}
