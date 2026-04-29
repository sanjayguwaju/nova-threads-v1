import { NextResponse } from 'next/server'
import { findAbandonedCarts, markCartProcessed } from '@/lib/cartAbandonment'
import { sendAbandonedCartEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

// This endpoint should be called by a cron service (e.g., Vercel Cron, GitHub Actions, etc.)
// Configure your cron provider to hit this endpoint with a secret header.

const CRON_SECRET = process.env.CRON_SECRET || ''

export async function POST(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const abandoned = await findAbandonedCarts()
    const results = { sent: 0, failed: 0, total: abandoned.length }

    for (const { email, snapshot } of abandoned) {
      try {
        await sendAbandonedCartEmail({
          email,
          firstName: snapshot.firstName,
          items: snapshot.items,
          cartUrl: snapshot.cartUrl,
        })
        await markCartProcessed(email)
        results.sent++
      } catch (err) {
        console.error(`Failed to send abandoned cart email to ${email}:`, err)
        results.failed++
      }
    }

    return NextResponse.json(results)
  } catch (err) {
    console.error('Abandoned cart processing error:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}

// Also support GET for simple cron ping (with secret)
export async function GET(request: Request) {
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')

  if (!CRON_SECRET || secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return POST(request)
}
