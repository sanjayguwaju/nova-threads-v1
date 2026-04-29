import { createHmac } from 'crypto'
import { ESEWA_CONFIG } from './config'

/**
 * Generate HMAC SHA256 signature for eSewa API requests
 * Format: HMACSHA256(message, access_key)
 * Message format: field1=value1,field2=value2,... (alphabetically sorted)
 */
export function generateSignature(
  fields: Record<string, string | number>,
  signedFieldNames: string[]
): string {
  const accessKey = ESEWA_CONFIG.ACCESS_KEY

  // Build message string: "field1=value1,field2=value2"
  const message = signedFieldNames
    .sort()
    .map((field) => `${field}=${fields[field]}`)
    .join(',')

  // Generate HMAC SHA256
  const hmac = createHmac('sha256', accessKey)
  hmac.update(message)
  const hash = hmac.digest('base64')

  return hash
}

/**
 * Verify webhook callback signature
 */
export function verifySignature(
  fields: Record<string, string | number>,
  signedFieldNames: string[],
  signature: string
): boolean {
  const expectedSignature = generateSignature(fields, signedFieldNames)
  return expectedSignature === signature
}

/**
 * Build signed field names array from fields object
 */
export function buildSignedFieldNames(fields: Record<string, string | number>): string[] {
  return Object.keys(fields).filter((key) => key !== 'signature' && key !== 'signed_field_names')
}
