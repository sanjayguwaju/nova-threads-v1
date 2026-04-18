import { ProductCard } from './ProductCard'

export function ProductGrid({ products }: { products: any[] }) {
  if (!products?.length) {
    return <div className="py-48 text-center text-stone">No products found.</div>
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-24">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  )
}
