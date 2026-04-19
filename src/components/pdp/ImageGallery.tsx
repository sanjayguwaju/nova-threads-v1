'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImageGallery({ images, alt }: { images: any[]; alt: string }) {
  const [index, setIndex] = useState(0)

  // Filter out any null/undefined images and ensure we have valid image objects
  const validImages =
    images?.filter((img) => img && (img.url || img.sizes?.hero?.url || img.sizes?.card?.url)) || []

  // If no valid images, show placeholder
  if (validImages.length === 0) {
    return (
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="relative aspect-[3/4] bg-[var(--color-nt-off-white)] flex items-center justify-center">
          <div className="text-center">
            <ImageIcon
              size={48}
              strokeWidth={1}
              className="text-[var(--color-nt-light-gray)] mx-auto mb-2"
            />
            <span className="text-[13px] text-[var(--color-nt-mid-gray)]">No image available</span>
          </div>
        </div>
      </div>
    )
  }

  const active = validImages[index]
  const url = active?.sizes?.hero?.url || active?.sizes?.card?.url || active?.url

  const next = () => setIndex((i) => (i + 1) % validImages.length)
  const prev = () => setIndex((i) => (i - 1 + validImages.length) % validImages.length)

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Image with Navigation Arrows */}
      <div className="relative aspect-[3/4] bg-[var(--color-nt-off-white)] overflow-hidden">
        {url && (
          <Image
            src={url}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}

        {/* Navigation Arrows - Like reference */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--color-nt-white)] flex items-center justify-center shadow-md hover:bg-[var(--color-nt-off-white)] transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--color-nt-white)] flex items-center justify-center shadow-md hover:bg-[var(--color-nt-off-white)] transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails - Horizontal scroll like reference */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 px-1">
          {validImages.map((img, i) => {
            const thumbUrl = img?.sizes?.thumbnail?.url || img?.sizes?.card?.url || img?.url
            return (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={cn(
                  'relative shrink-0 w-20 h-24 sm:w-24 sm:h-28 bg-[var(--color-nt-off-white)] overflow-hidden transition-all duration-200 border-2',
                  i === index
                    ? 'border-[var(--color-nt-black)]'
                    : 'border-transparent hover:border-[var(--color-nt-light-gray)]',
                )}
                aria-label={`View image ${i + 1}`}
              >
                {thumbUrl && (
                  <Image src={thumbUrl} alt="" fill className="object-cover" sizes="96px" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
