import { ProductCard } from '../shop/ProductCard'

export function ProductRail({ label, products }: { label: string; products: any[] }) {
  if (!products?.length) return null
  return (
    <section className="py-48">
      <div className="max-w-container mx-auto px-24">
        <div className="flex items-center gap-16 mb-32">
          <span className="rule" />
          <h2 className="font-mono text-[11px] uppercase tracking-widest">{label}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-24">
          {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}
