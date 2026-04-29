'use server'

import { getPayload } from '@/lib/payload/getPayload'
import type { SiteSetting, Navigation, TopBar, CodSetting } from '@/payload-types'

export async function getSiteSettings(): Promise<SiteSetting | null> {
  try {
    const payload = await getPayload()
    return await payload.findGlobal({ slug: 'site-settings' })
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    return null
  }
}

export async function getNavigation(): Promise<Navigation | null> {
  try {
    const payload = await getPayload()
    return await payload.findGlobal({ slug: 'navigation' })
  } catch (error) {
    console.error('Failed to fetch navigation:', error)
    return null
  }
}

export async function getTopBar(): Promise<TopBar | null> {
  try {
    const payload = await getPayload()
    return await payload.findGlobal({ slug: 'top-bar' })
  } catch (error) {
    console.error('Failed to fetch top bar:', error)
    return null
  }
}

export async function getCODSettings(): Promise<CodSetting | null> {
  try {
    const payload = await getPayload()
    return await payload.findGlobal({ slug: 'cod-settings' })
  } catch (error) {
    console.error('Failed to fetch COD settings:', error)
    return null
  }
}

export async function getAllGlobals() {
  const [siteSettings, navigation, topBar, codSettings] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getTopBar(),
    getCODSettings(),
  ])

  return { siteSettings, navigation, topBar, codSettings }
}
