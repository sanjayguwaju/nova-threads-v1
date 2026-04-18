import { useQuery } from '@tanstack/react-query'
import { fetchGlobal } from '../api/client'

export const globalKeys = {
  siteSettings: ['site-settings'] as const,
  navigation: ['navigation'] as const,
}

export interface SiteSettings {
  id: string
  storeName: string
  logo?: { id: string; url: string; alt: string }
  favicon?: { id: string; url: string }
  heroSlides?: Array<{
    headline?: string
    subheadline?: string
    cta?: string
    image?: { id: string; url: string }
    link?: string
  }>
  announcement?: string
  socialLinks?: {
    instagram?: string
    tiktok?: string
    pinterest?: string
    facebook?: string
  }
  shippingPolicy?: Record<string, unknown>
  returnPolicy?: Record<string, unknown>
  trendingSearches?: Array<{ term: string }>
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: { id: string; url: string }
  }
  createdAt: string
  updatedAt: string
}

export interface Navigation {
  id: string
  mainNav?: Array<{
    label?: string
    link?: string
    megaMenu?: Array<{
      label?: string
      link?: string
      image?: { id: string; url: string; alt: string }
    }>
  }>
  footerNav?: Array<{
    heading?: string
    links?: Array<{
      label?: string
      link?: string
    }>
  }>
  createdAt: string
  updatedAt: string
}

// Get site settings
export function useSiteSettings() {
  return useQuery({
    queryKey: globalKeys.siteSettings,
    queryFn: () => fetchGlobal<SiteSettings>('site-settings'),
  })
}

// Get navigation
export function useNavigation() {
  return useQuery({
    queryKey: globalKeys.navigation,
    queryFn: () => fetchGlobal<Navigation>('navigation'),
  })
}
