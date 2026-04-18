import { StarRating } from '../pdp/StarRating'
import { Badge } from '../ui/Badge'

const QUOTES = [
  { author: 'Clara M.', body: 'The wool coat is extraordinary. Quality feels pre-fast-fashion — like my grandmother\'s wardrobe.', verified: true },
  { author: 'Jonas T.', body: 'Clean cuts, honest materials. Three years in and still looks new.', verified: true },
  { author: 'Aya S.', body: 'The newsletter writing made me buy. The clothes made me stay.', verified: true },
]

export function Testimonials() {
  return (
    <section className="py-48 bg-blush/40">
      <div className="max-w-container mx-auto px-24">
        <div className="flex items-center gap-16 mb-32">
          <span className="rule" />
          <h2 className="font-mono text-[11px] uppercase tracking-widest">What customers say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
          {QUOTES.map((q, i) => (
            <blockquote key={i} className="bg-paper p-24 space-y-12">
              <StarRating rating={5} />
              <p className="font-display italic text-[20px] leading-snug">"{q.body}"</p>
              <div className="flex items-center gap-10">
                <cite className="font-mono text-[11px] uppercase tracking-widest not-italic">{q.author}</cite>
                {q.verified && <Badge variant="success">Verified</Badge>}
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
