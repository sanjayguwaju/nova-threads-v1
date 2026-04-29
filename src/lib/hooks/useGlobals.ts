import { useQuery } from '@tanstack/react-query'
import { getSiteSettings, getNavigation } from '@/lib/actions/globals'
import type { SiteSetting, Navigation } from '@/payload-types'

export const globalKeys = {
  siteSettings: ['site-settings'] as const,
  navigation: ['navigation'] as const,
}

// Get site settings - uses server action, data is pre-hydrated from layout
export function useSiteSettings() {
  return useQuery<SiteSetting | null>({
    queryKey: globalKeys.siteSettings,
    queryFn: () => getSiteSettings(),
  })
}

// Get navigation - uses server action, data is pre-hydrated from layout
export function useNavigation() {
  return useQuery<Navigation | null>({
    queryKey: globalKeys.navigation,
    queryFn: () => getNavigation(),
    staleTime: 0, // Always fetch for testing
    refetchOnMount: 'always',
  })
}
