'use client'
import { useState } from 'react'
import { StarRating } from './StarRating'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { submitReview } from '@/lib/payload/actions/reviews'
import { useUIStore } from '@/store/useUIStore'
import { Badge } from '@/components/ui/Badge'

export function ReviewSection({ product, reviews }: { product: any; reviews: any[] }) {
  const [showForm, setShowForm] = useState(false)
  const avg = product.averageRating || 0
  const total = product.reviewCount || 0

  return (
    <section id="reviews" className="py-48 border-t border-stone/20">
      <div className="max-w-container mx-auto px-24">
        <div className="flex items-end justify-between mb-32">
          <div>
            <h2 className="font-display text-[40px]">Reviews</h2>
            <div className="flex items-center gap-12 mt-8">
              <StarRating rating={avg} />
              <span className="text-stone">{avg.toFixed(1)} · {total} reviews</span>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Write a Review'}
          </Button>
        </div>

        {showForm && <ReviewForm productId={product.id} onDone={() => setShowForm(false)} />}

        <div className="space-y-24 mt-32">
          {reviews.length === 0 && <div className="text-stone py-32 text-center">No reviews yet.</div>}
          {reviews.map((r) => (
            <article key={r.id} className="border-b border-stone/20 pb-24">
              <div className="flex items-center gap-12 mb-8">
                <StarRating rating={r.rating} />
                {r.verified && <Badge variant="success">Verified</Badge>}
              </div>
              <h3 className="font-display text-[20px]">{r.title}</h3>
              <p className="text-stone mt-8">{r.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReviewForm({ productId, onDone }: { productId: string; onDone: () => void }) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { pushToast } = useUIStore()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const result = await submitReview({ product: productId, rating, title, body })
    setSubmitting(false)
    if (result.ok) {
      pushToast({ type: 'success', message: 'Review submitted, pending approval' })
      onDone()
    } else {
      pushToast({ type: 'error', message: result.error || 'Failed' })
    }
  }

  return (
    <form onSubmit={onSubmit} className="border border-stone/20 p-24 space-y-16 bg-blush/30">
      <div>
        <label className="font-mono text-[11px] uppercase tracking-widest text-stone">Rating</label>
        <div className="flex gap-8 mt-8">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`text-[24px] ${n <= rating ? 'text-ink' : 'text-stone/40'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <div className="flex flex-col gap-4">
        <label className="font-mono text-[11px] uppercase tracking-widest text-stone">Review</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={4}
          className="w-full bg-transparent border border-stone/40 p-12 text-[14px] focus:outline-none focus:border-ink"
        />
      </div>
      <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</Button>
    </form>
  )
}
