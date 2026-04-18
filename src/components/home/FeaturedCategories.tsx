import Link from 'next/link'
import Image from 'next/image'

export function FeaturedCategories({ categories }: { categories: any[] }) {
  const list = categories?.length ? categories.slice(0, 3) : [
    { id: '1', name: 'Outerwear', slug: 'outerwear', image: { url: 'https://picsum.photos/seed/cat1/800/1200' } },
    { id: '2', name: 'Knitwear', slug: 'knitwear', image: { url: 'https://picsum.photos/seed/cat2/800/600' } },
    { id: '3', name: 'Accessories', slug: 'accessories', image: { url: 'https://picsum.photos/seed/cat3/800/600' } },
  ]
  return (
    <section className="py-48">
      <div className="max-w-container mx-auto px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16" style={{ gridTemplateRows: '1fr 1fr' }}>
          {list[0] && (
            <Link href={`/shop/${list[0].slug}`} className="relative block md:row-span-2 aspect-[3/4] overflow-hidden group bg-blush">
              {list[0].image?.url && (
                <Image src={list[0].image.url} alt={list[0].name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="50vw" />
              )}
              <div className="absolute inset-0 flex items-end p-32">
                <span className="font-display italic text-paper text-[48px]">{list[0].name}</span>
              </div>
            </Link>
          )}
          {list.slice(1, 3).map((c) => (
            <Link key={c.id} href={`/shop/${c.slug}`} className="relative block aspect-[4/3] md:aspect-auto overflow-hidden group bg-blush">
              {c.image?.url && (
                <Image src={c.image.url} alt={c.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="50vw" />
              )}
              <div className="absolute inset-0 flex items-end p-24">
                <span className="font-display italic text-paper text-[32px]">{c.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
