'use client'

import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { globalKeys } from '@/lib/hooks/useGlobals'
import type { SiteSetting, Navigation, TopBar, CodSetting } from '@/payload-types'

interface QueryProviderProps {
  children: React.ReactNode
  initialData?: {
    siteSettings?: SiteSetting | null
    navigation?: Navigation | null
    topBar?: TopBar | null
    codSettings?: CodSetting | null
  }
}

export function QueryProvider({ children, initialData }: QueryProviderProps) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })

    // Pre-populate cache with server-fetched data
    if (initialData?.siteSettings) {
      client.setQueryData(globalKeys.siteSettings, initialData.siteSettings)
    }
    if (initialData?.navigation) {
      client.setQueryData(globalKeys.navigation, initialData.navigation)
    }

    return client
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
