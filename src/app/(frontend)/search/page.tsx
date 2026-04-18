import { ProductGrid } from '@/components/shop/ProductGrid'
import { getPayload } from '@/lib/payload/getPayload'

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  let results: any = { docs: [], totalDocs: 0 }
  if (q) {
    try {
      const payload = await getPayload()
      results = await payload.find({
        collection: 'products',
        where: {
          and: [
            { status: { equals: 'published' } },
            { or: [{ name: { like: q } }, { shortDescription: { like: q } }, { brand: { like: q } }] },
          ],
        },
        limit: 48,
      })
    } catch {}
  }

  return (
    <div className="max-w-container mx-auto px-24 py-48">
      <h1 className="font-display text-[48px]">Search</h1>
      <p className="text-stone mt-8">
        {q ? `${results.totalDocs} results for "${q}"` : 'Enter a search term from the header.'}
      </p>
      <div className="mt-32">
        <ProductGrid products={results.docs} />
      </div>
    </div>
  )
}
