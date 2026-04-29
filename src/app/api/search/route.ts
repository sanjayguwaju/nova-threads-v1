import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload/getPayload'
import { rateLimit } from '@/lib/rateLimit'

export async function GET(request: NextRequest) {
  const limitResult = await rateLimit(request, {
    maxRequests: 20,
    windowMs: 60_000,
    keyPrefix: 'search',
  })
  if (limitResult instanceof NextResponse) return limitResult

  const { searchParams } = request.nextUrl
  const q = searchParams.get('q')?.trim() ?? ''
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '12', 10), 50)

  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 })
  }

  try {
    const payload = await getPayload()

    const [products, categories] = await Promise.all([
      payload.find({
        collection: 'products',
        where: {
          and: [
            { status: { equals: 'published' } },
            {
              or: [
                { name: { contains: q } },
                { shortDescription: { contains: q } },
                { sku: { contains: q } },
              ],
            },
          ],
        },
        limit,
      }),
      payload.find({
        collection: 'categories',
        where: { name: { contains: q } },
        limit: 5,
      }),
    ])

    return NextResponse.json({
      products: products.docs.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.mainImage?.url ?? null,
      })),
      categories: categories.docs.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })),
      total: products.totalDocs,
    })
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
