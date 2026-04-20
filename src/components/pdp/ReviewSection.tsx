'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'

interface Review {
  id?: string
  rating?: number
  title?: string
  body?: string
  authorName?: string
  createdAt?: string
  verified?: boolean
}

interface ReviewSectionProps {
  product?: any
  reviews?: Review[]
}

// Mock reviews for demo
const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    rating: 5,
    title: 'Amazing quality!',
    body: 'This product exceeded my expectations. The fabric is soft and the fit is perfect. Will definitely be buying more colors!',
    authorName: 'Sarah M.',
    createdAt: '2024-12-15',
    verified: true,
  },
  {
    id: 'r2',
    rating: 4,
    title: 'Great but runs small',
    body: 'Love the design and material, but I recommend sizing up. I usually wear M but had to exchange for L.',
    authorName: 'James K.',
    createdAt: '2024-11-28',
    verified: true,
  },
  {
    id: 'r3',
    rating: 5,
    title: 'Perfect for everyday wear',
    body: "I've been wearing this for a month now and it still looks brand new. Very durable and comfortable.",
    authorName: 'Emily R.',
    createdAt: '2024-11-10',
    verified: true,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={
            n <= rating
              ? 'fill-[var(--color-nt-black)] text-[var(--color-nt-black)]'
              : 'text-[var(--color-nt-light-gray)]'
          }
        />
      ))}
    </div>
  )
}

export function ReviewSection({ reviews: propReviews }: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const reviews = propReviews && propReviews.length > 0 ? propReviews : MOCK_REVIEWS
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0
  const total = reviews.length

  return (
    <section id="reviews" className="py-10 sm:py-16 border-t border-[var(--color-nt-light-gray)]">
      <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-[18px] sm:text-[20px] font-bold uppercase tracking-wide text-[var(--color-nt-black)]">
            Customer Reviews
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[12px] font-semibold uppercase tracking-wider hover:bg-[var(--color-nt-charcoal)] transition-colors duration-200 cursor-pointer w-full sm:w-auto"
          >
            Write a Review
          </button>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--color-nt-light-gray)]">
          <span className="text-[36px] sm:text-[42px] font-bold text-[var(--color-nt-black)] leading-none">
            {avg.toFixed(1)}
          </span>
          <div className="flex flex-col">
            <StarRating rating={Math.round(avg)} />
            <span className="text-[13px] text-[var(--color-nt-mid-gray)] mt-1">
              Based on {total} reviews
            </span>
          </div>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="mb-8 p-4 sm:p-6 bg-[var(--color-nt-off-white)]">
            <form className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[var(--color-nt-black)] mb-2">
                  Your Rating *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" className="p-1 cursor-pointer">
                      <Star
                        size={24}
                        className="text-[var(--color-nt-light-gray)] hover:text-[var(--color-nt-black)]"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[var(--color-nt-black)] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full h-[44px] px-3 border border-[var(--color-nt-light-gray)] text-[14px] focus:outline-none focus:border-[var(--color-nt-black)]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[var(--color-nt-black)] mb-2">
                  Review *
                </label>
                <textarea
                  rows={3}
                  placeholder="Share your thoughts about this product"
                  className="w-full px-3 py-3 border border-[var(--color-nt-light-gray)] text-[14px] focus:outline-none focus:border-[var(--color-nt-black)] resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 h-[44px] bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[13px] font-semibold uppercase tracking-wider"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-[44px] px-4 border border-[var(--color-nt-light-gray)] text-[var(--color-nt-black)] text-[13px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="border-b border-[var(--color-nt-light-gray)] pb-6 last:border-0"
            >
              {/* Stars & Verified */}
              <div className="flex items-center gap-3 mb-2">
                <StarRating rating={review.rating} />
                {review.verified && (
                  <span className="text-[11px] text-[var(--color-nt-success)] uppercase tracking-wider">
                    Verified
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-[15px] font-semibold text-[var(--color-nt-black)] mb-2">
                {review.title}
              </h3>

              {/* Body */}
              <p className="text-[14px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-3">
                {review.body}
              </p>

              {/* Author & Date */}
              <div className="flex items-center gap-2 text-[12px] text-[var(--color-nt-mid-gray)]">
                <span className="font-medium text-[var(--color-nt-black)]">
                  {review.authorName}
                </span>
                <span>·</span>
                <span>
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
