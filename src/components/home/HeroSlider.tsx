'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface Slide {
  headline?: string
  subheadline?: string
  cta?: string
  image?: { url?: string; sizes?: { hero?: { url?: string } } } | string
  link?: string
}

const DEFAULTS: Slide[] = [
  {
    headline: 'Quiet luxury for everyday wear',
    subheadline: 'Autumn/Winter collection now available',
    cta: 'Shop New In',
    image: 'https://picsum.photos/seed/nova1/1920/1080',
    link: '/shop?sort=newest',
  },
  {
    headline: 'Made to last',
    subheadline: 'Sustainably crafted essentials',
    cta: 'Explore',
    image: 'https://picsum.photos/seed/nova2/1920/1080',
    link: '/shop',
  },
]

export function HeroSlider({ slides }: { slides?: Slide[] }) {
  const list = (slides?.length ? slides : DEFAULTS) as Slide[]
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % list.length), 6000)
    return () => clearInterval(t)
  }, [list.length])

  const current = list[i]
  const img =
    typeof current.image === 'string'
      ? current.image
      : current.image?.sizes?.hero?.url || current.image?.url

  return (
    <section className="relative h-[90vh] overflow-hidden bg-ink">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {img && (
            <Image
              src={img}
              alt={current.headline || ''}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full max-w-container mx-auto px-24 flex items-end pb-80">
        <div className="max-w-[600px] text-paper">
          <motion.h1
            key={`h-${i}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="fluid-display font-display italic"
          >
            {current.headline}
          </motion.h1>
          {current.subheadline && (
            <p className="mt-16 text-stone text-[18px]">{current.subheadline}</p>
          )}
          {current.cta && current.link && (
            <div className="mt-8">
              <Link href={current.link}>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black uppercase tracking-widest text-xs"
                >
                  {current.cta}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-32 right-32 flex gap-12">
        {list.map((_, n) => (
          <button
            key={n}
            onClick={() => setI(n)}
            className={cn('h-[1px] transition-all', n === i ? 'bg-paper w-40' : 'bg-paper/40 w-20')}
          />
        ))}
      </div>
    </section>
  )
}
