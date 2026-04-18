import { getPayload as _getPayload } from 'payload'
import config from '@payload-config'

let cached: any = null

export async function getPayload() {
  if (cached) return cached
  cached = await _getPayload({ config })
  return cached
}
