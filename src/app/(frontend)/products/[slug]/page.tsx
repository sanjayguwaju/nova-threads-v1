import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ImageGallery } from '@/components/pdp/ImageGallery'
import { ProductInfo } from '@/components/pdp/ProductInfo'
import { ReviewSection } from '@/components/pdp/ReviewSection'
import { RelatedProducts } from '@/components/pdp/RelatedProducts'
import { getProductBySlug, getRelatedProducts } from '@/lib/payload/queries/products'
import { getPayload } from '@/lib/payload/getPayload'

export const revalidate = 300

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload()
    const products = await payload.find({
      collection: 'products',
      where: { status: { equals: 'published' } },
      limit: 1000,
      pagination: false,
      select: { slug: true } as any,
    })
    return products.docs.map((p: any) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const product = await getProductBySlug(slug)
    if (!product) return { title: 'Not Found' }
    return {
      title: product.seo?.metaTitle || `${product.name} | NOVA THREADS`,
      description: product.seo?.metaDescription || product.shortDescription || '',
    }
  } catch {
    return { title: 'Product' }
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  let product: any = null
  let related: any = { docs: [] }
  let reviews: any = { docs: [] }

  try {
    product = await getProductBySlug(slug)
    if (!product) notFound()
    const catId = typeof product.category === 'object' ? product.category?.id : product.category
    const payload = await getPayload()
    ;[related, reviews] = await Promise.all([
      getRelatedProducts(product.id, catId),
      payload.find({
        collection: 'reviews',
        where: { and: [{ product: { equals: product.id } }, { status: { equals: 'approved' } }] },
        sort: '-createdAt',
        limit: 10,
      }),
    ])
  } catch {
    notFound()
  }

  const images = [product.mainImage, ...(product.gallery || [])].filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.mainImage?.url,
    description: product.shortDescription,
    offers: {
      '@type': 'Offer',
      price: product.variants?.[0]?.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: product.reviewCount
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.averageRating,
          reviewCount: product.reviewCount,
        }
      : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-container mx-auto px-24 py-48">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-48">
          <ImageGallery images={images} alt={product.name} />
          <ProductInfo product={product} />
        </div>
      </div>
      <ReviewSection product={product} reviews={reviews.docs} />
      <RelatedProducts products={related.docs} />
    </>
  )
}
