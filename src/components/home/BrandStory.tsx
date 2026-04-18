import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function BrandStory() {
  return (
    <section className="py-64">
      <div className="max-w-container mx-auto grid grid-cols-1 md:grid-cols-2 gap-32 items-center px-24">
        <div className="relative aspect-[4/5] bg-blush overflow-hidden">
          <Image src="https://picsum.photos/seed/brand/800/1000" alt="" fill className="object-cover" sizes="50vw" />
        </div>
        <div>
          <p className="font-display italic text-[48px] leading-tight">
            "Fewer, finer things — designed to be lived in, loved for years."
          </p>
          <p className="mt-24 text-stone">
            NOVA THREADS is a small studio making considered clothes from natural materials, with transparent pricing and fair production. Every piece is made to last.
          </p>
          <Link href="/legal/terms" className="inline-flex items-center gap-8 mt-24 font-mono text-[11px] uppercase tracking-widest">
            Our Story <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
