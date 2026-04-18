import { notFound } from 'next/navigation'
import { ProductFilters } from '@/components/shop/ProductFilters'
import { ProductSort } from '@/components/shop/ProductSort'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { getProducts, buildProductWhere, mapSort } from '@/lib/payload/queries/products'
import { getCategories, getCategoryBySlug } from '@/lib/payload/queries/categories'

export const revalidate = 120

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ [key: string]: string }>
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const sp = await searchParams

  let cat: any = null
  let products: any = { docs: [], totalDocs: 0 }
  let categories: any = { docs: [] }
  try {
    cat = await getCategoryBySlug(category)
    if (!cat) notFound()
    const where = buildProductWhere({ ...sp, category })
    ;[products, categories] = await Promise.all([
      getProducts({ where, sort: mapSort(sp.sort), limit: 24, page: Number(sp.page || 1) }),
      getCategories(),
    ])
  } catch {}

  return (
    <div className="max-w-container mx-auto px-24 py-48">
      <header className="mb-32">
        <h1 className="font-display text-[48px]">{cat?.name || 'Category'}</h1>
        {cat?.description && <p className="mt-8 text-stone max-w-[640px]">{cat.description}</p>}
      </header>
      <div className="flex flex-col lg:flex-row gap-32">
        <ProductFilters categories={categories.docs} />
        <div className="flex-1">
          <ProductSort total={products.totalDocs} />
          <ProductGrid products={products.docs} />
        </div>
      </div>
    </div>
  )
}
