import { getPayload } from '@/lib/payload/getPayload'
import { BlocksRenderer } from '@/components/BlocksRenderer'
import type { Page } from '@/payload-types'

async function getHomePage(): Promise<Page | null> {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' },
      },
      limit: 1,
    })
    return result.docs[0] || null
  } catch (error) {
    console.error('Failed to fetch home page:', error)
    return null
  }
}

export default async function HomePage() {
  const page = await getHomePage()

  return (
    <div className="home">
      <BlocksRenderer layout={page?.layout} />
    </div>
  )
}
