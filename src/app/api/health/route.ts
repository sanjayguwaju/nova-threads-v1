import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload/getPayload'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, 'ok' | 'fail'> = {}
  let status = 200

  try {
    const payload = await getPayload()
    await payload.find({ collection: 'products', limit: 1 })
    checks.database = 'ok'
  } catch {
    checks.database = 'fail'
    status = 503
  }

  checks.api = 'ok'

  return NextResponse.json(
    {
      status: status === 200 ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status }
  )
}
