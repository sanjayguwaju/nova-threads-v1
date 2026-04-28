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
import { PromoModal } from '@/components/layout/PromoModal'
import { getPayload } from '@/lib/payload/getPayload'
import type { Navigation as NavigationType, SiteSetting as SiteSettingsType, TopBar as TopBarType } from '@/payload-types'

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

async function getGlobalData() {
  try {
    const payload = await getPayload()
    
    const [navigation, siteSettings, topBar] = await Promise.all([
      payload.findGlobal({ slug: 'navigation' }).catch(() => null),
      payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
      payload.findGlobal({ slug: 'top-bar' }).catch(() => null),
    ])
    
    return { navigation, siteSettings, topBar }
  } catch (error) {
    console.error('Failed to fetch global data:', error)
    return { navigation: null, siteSettings: null, topBar: null }
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const { navigation, siteSettings, topBar } = await getGlobalData()

  return (
    <html lang="en" suppressHydrationWarning data-theme="light" className={`${dmSans.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased lg:pb-0 pb-[60px]">
        <QueryProvider>
          <TooltipProvider>
            <TopBar data={topBar} />
            <Header navigation={navigation} siteSettings={siteSettings} />
            {children}
            <Footer navigation={navigation} siteSettings={siteSettings} />
            <MobileTabBar />
            <MobileMenu navigation={navigation} />
            <SearchOverlay />
            <AuthModal />
            <CartDrawer />
            <PromoModal />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
