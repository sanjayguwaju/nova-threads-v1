'use client'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

export function ImageGallery({ images, alt }: { images: any[]; alt: string }) {
  const [index, setIndex] = useState(0)
  if (!images?.length) return null
  const active = images[index]
  const url = active?.sizes?.hero?.url || active?.url

  return (
    <div className="flex flex-col-reverse md:flex-row gap-16">
      <div className="flex md:flex-col gap-8 md:w-[80px] overflow-auto">
        {images.map((img, i) => {
          const t = img?.sizes?.thumbnail?.url || img?.url
          return (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn('relative shrink-0 w-[60px] h-[75px] md:w-full md:h-[100px] bg-blush overflow-hidden',
                i === index && 'ring-1 ring-ink')}
            >
              {t && <Image src={t} alt="" fill className="object-cover" />}
            </button>
          )
        })}
      </div>
      <div className="relative flex-1 aspect-square bg-blush overflow-hidden group">
        {url && (
          <Image
            src={url}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
    </div>
  )
}
