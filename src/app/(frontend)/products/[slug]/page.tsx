import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ImageGallery } from '@/components/pdp/ImageGallery'
import { ProductInfo } from '@/components/pdp/ProductInfo'
import { ReviewSection } from '@/components/pdp/ReviewSection'
import { RelatedProducts } from '@/components/pdp/RelatedProducts'
import Link from 'next/link'
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
      openGraph: {
        images: product.mainImage?.url ? [{ url: product.mainImage.url }] : [],
      },
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
  const categoryName = typeof product.category === 'object' ? product.category?.name : 'Shop'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.mainImage?.url,
    description: product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: 'NOVA THREADS',
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-[var(--color-nt-white)] border-b border-[var(--color-nt-light-gray)]">
        <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16 py-3 sm:py-4">
          <nav className="flex items-center gap-2 text-[11px] sm:text-[12px] text-[var(--color-nt-mid-gray)]">
            <Link href="/" className="hover:text-[var(--color-nt-black)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[var(--color-nt-black)] transition-colors">
              Shop
            </Link>
            <span>/</span>
            <Link
              href={`/shop?category=${product.category?.slug || ''}`}
              className="hover:text-[var(--color-nt-black)] transition-colors hidden sm:inline"
            >
              {categoryName}
            </Link>
            <span className="hidden sm:inline">/</span>
            <span className="text-[var(--color-nt-black)] font-medium truncate max-w-[120px] sm:max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="bg-[var(--color-nt-white)]">
        <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 py-6 sm:py-10 lg:py-16">
            {/* Image Gallery - Full width on mobile */}
            <div className="order-1">
              <ImageGallery images={images} alt={product.name} />
            </div>

            {/* Product Info */}
            <div className="order-2 lg:pl-8">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewSection product={product} reviews={reviews.docs} />

      {/* Related Products */}
      {related.docs?.length > 0 && <RelatedProducts products={related.docs} />}
    </>
  )
}
