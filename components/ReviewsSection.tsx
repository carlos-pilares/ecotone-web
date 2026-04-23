import { DEFAULT_FEATURED_QUOTES } from '@/lib/homeQuoteDefaults'
import type { HomePageDoc, ReviewDoc } from '@/lib/queries'

const StarRow = () => (
  <div className="stars" style={{ marginBottom: 11 }} aria-hidden>
    <div className="star" />
    <div className="star" />
    <div className="star" />
    <div className="star" />
    <div className="star" />
  </div>
)

const FALLBACK_CARDS: ReviewDoc[] = [
  {
    _id: 'fr1',
    quote:
      'Breathtaking place with amazing people that changed my way of travelling and understanding nature.',
    authorName: 'Vanessa',
    authorCity: 'London',
    authorCountry: 'UK',
    experienceName: 'Soqtapata 3D/2N',
    rating: 5,
  },
  {
    _id: 'fr2',
    quote: 'Absolutely out of this world experience. Will definitely make the trip back someday.',
    authorName: 'Morgan',
    authorCity: 'New York',
    authorCountry: 'US',
    experienceName: 'Manu Gradient',
    rating: 5,
  },
  {
    _id: 'fr3',
    quote: 'Super comfortable place. There are no words to describe the beauty of this place.',
    authorName: 'Richard',
    authorCity: 'California',
    authorCountry: 'US',
    experienceName: 'Soqtapata 3D/2N',
    rating: 5,
  },
  {
    _id: 'fr4',
    quote: 'The ForestWhisper experience at night — I still get goosebumps thinking about it.',
    authorName: 'Lucas',
    authorCity: 'São Paulo',
    authorCountry: 'BR',
    experienceName: 'Family Quest',
    rating: 5,
  },
  {
    _id: 'fr5',
    quote: 'Birdwatching at 5 AM — over 20 species before breakfast. Life-changing morning.',
    authorName: 'Sofia',
    authorCity: 'Barcelona',
    authorCountry: 'ES',
    experienceName: 'Soqtapata 3D/2N',
    rating: 5,
  },
]

function locLabel(r: ReviewDoc) {
  const a = r.authorCity?.trim()
  const c = r.authorCountry?.trim()
  if (a && c) return `${a}, ${c}`
  return a || c || ''
}

export function ReviewsSection({
  homeData,
  reviews,
  featuredQuoteItems,
}: {
  homeData: HomePageDoc | null
  reviews: ReviewDoc[] | null
  featuredQuoteItems: { text: string; attr: string }[]
}) {
  const h = homeData
  const quotesForDots = featuredQuoteItems.length > 0 ? featuredQuoteItems : DEFAULT_FEATURED_QUOTES
  const first = quotesForDots[0] ?? { text: '""', attr: '—' }
  const list = Array.isArray(reviews) && reviews.length > 0 ? reviews : FALLBACK_CARDS

  return (
    <section className="sec bg-cream fade" id="reviews">
      <div className="sec-inner">
        <div className="reviews-header">
          <div>
            <div className="eyebrow">{h?.reviewsEyebrow ?? 'What guests say'}</div>
            <h2 className="h2" style={{ marginBottom: 0 }}>
              {h?.reviewsHeadline ?? 'Real experiences'}
            </h2>
          </div>
          <div className="reviews-rating-wrap">
            <div className="reviews-rating-col">
              <div className="big-score">{h?.reviewsScore?.trim() || '5.0'}</div>
              <div className="stars" aria-hidden>
                <div className="star" />
                <div className="star" />
                <div className="star" />
                <div className="star" />
                <div className="star" />
              </div>
              <div className="trustpilot-badge">
                <div className="tp-icon">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="white" aria-hidden>
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                </div>
                <span className="tp-name">Trustpilot</span>
              </div>
            </div>
          </div>
        </div>

        <div className="quote-featured">
          <div
            className="quote-text"
            id="quoteText"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: first.text }}
          />
          <div className="quote-attr" id="quoteAttr">
            {first.attr}
          </div>
          <div className="quote-dots">
            {quotesForDots.map((_, i) => (
              <button key={i} type="button" className={'qdot' + (i === 0 ? ' active' : '')} data-q={i} aria-label={`Quote ${i + 1}`} />
            ))}
          </div>
        </div>

        <div className="rev-carousel">
          <div className="rev-scroll" id="revScroll" role="region" aria-label="Guest reviews">
            {list.map((r) => {
              const initial = (r.authorName || 'G').trim().slice(0, 1).toUpperCase()
              const q = r.quote || ''
              return (
                <div className="rev-card" key={r._id}>
                  <StarRow />
                  <p className="rev-q">&quot;{q}&quot;</p>
                  <div className="rev-author">
                    <div className="rev-av">{initial}</div>
                    <div>
                      <div className="rev-name">{r.authorName || 'Guest'}</div>
                      <div className="rev-loc">{locLabel(r)}</div>
                      {r.experienceName ? <div className="rev-exp">{r.experienceName}</div> : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="rev-card-dots" id="revCardDots" role="tablist" aria-label="Select a review">
            {list.map((r, i) => (
              <button
                key={r._id}
                type="button"
                className={'rev-dot' + (i === 0 ? ' active' : '')}
                data-rev={i}
                role="tab"
                aria-selected={i === 0}
                aria-label={`Review ${i + 1} of ${list.length}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
