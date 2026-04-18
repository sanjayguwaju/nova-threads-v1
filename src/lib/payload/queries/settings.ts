import { getPayload } from '../getPayload'

export async function getSiteSettings() {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'site-settings' })
}

export async function getNavigation() {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'navigation' })
}
