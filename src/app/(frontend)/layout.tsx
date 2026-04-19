import type { Metadata, Viewport } from 'next'
import React from 'react'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { QueryProvider } from './providers'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { TopBar } from '@/components/layout/TopBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { SearchOverlay } from '@/components/layout/SearchOverlay'
import { AuthModal } from '@/components/layout/AuthModal'
import { CartDrawer } from '@/components/layout/CartDrawer'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  description: 'NOVA THREADS - Premium Fashion for Everyone',
  title: 'NOVA THREADS',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning data-theme="light" className={`${dmSans.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased lg:pb-0 pb-[60px]">
        <QueryProvider>
          <TooltipProvider>
            <TopBar />
            <Header />
            {children}
            <Footer />
            <MobileTabBar />
            <MobileMenu />
            <SearchOverlay />
            <AuthModal />
            <CartDrawer />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
