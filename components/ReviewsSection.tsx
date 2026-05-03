import type { ReactNode } from 'react'

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

function locLabel(r: ReviewDoc) {
  const a = r.authorCity?.trim()
  const c = r.authorCountry?.trim()
  if (a && c) return `${a}, ${c}`
  return a || c || ''
}

export type ReviewsSectionProps = {
  /** Review cards (already filtered for experience context when needed). */
  reviews: ReviewDoc[] | null
  /** Featured quote rotation; same source as `EcotoneV2Client` `featuredQuoteItems`. */
  featuredQuoteItems: { text: string; attr: string }[]
  /** CMS home field overrides. */
  homeData?: HomePageDoc | null
  /** Explicit copy overrides; take precedence over `homeData` when provided. */
  eyebrow?: string
  headline?: string
  /** e.g. `"5.0"` */
  averageRating?: string
  /** Label under the source icon (e.g. Trustpilot). */
  sourceLabel?: string
  /** Optional line under stars (e.g. “12 verified reviews”) — experience context. */
  secondaryRatingLine?: string | null
  /** Optional intro under eyebrow/H2 (CMS landing module). */
  sectionLead?: string | null
  /** @deprecated No longer used; demo review cards were removed. */
  useHomepageSampleReviewsIfEmpty?: boolean
  sectionClassName?: string
  contentInnerClassName?: string
  /** CTA card at the end of the carousel (e.g. link to all Trustpilot reviews). */
  emptyMessage?: string
  /** Optional node after review cards inside the horizontal scroller (e.g. “All reviews” link card). */
  reviewCarouselEnd?: ReactNode
  /** Experience `reviewsLayout`; Home/Lodge omiten y usan los mismos valores por defecto. */
  reviewsRegionAriaLabel?: string
  reviewTablistAriaLabel?: string
  quoteDotAriaLabelPrefix?: string
  reviewDotAriaLabelPrefix?: string
  guestFallbackName?: string
}

export function ReviewsSection({
  homeData: h,
  reviews,
  featuredQuoteItems,
  eyebrow: eyebrowProp,
  headline: headlineProp,
  averageRating: averageRatingProp,
  sourceLabel: sourceLabelProp,
  secondaryRatingLine = null,
  sectionLead = null,
  useHomepageSampleReviewsIfEmpty: _legacyUseHomepageSampleReviews = true,
  sectionClassName = 'sec bg-cream fade',
  contentInnerClassName = 'sec-inner',
  emptyMessage: emptyMessageProp,
  reviewCarouselEnd = null,
  reviewsRegionAriaLabel = 'Guest reviews',
  reviewTablistAriaLabel = 'Select a review',
  quoteDotAriaLabelPrefix = 'Quote',
  reviewDotAriaLabelPrefix = 'Review',
  guestFallbackName = 'Guest',
}: ReviewsSectionProps) {
  void _legacyUseHomepageSampleReviews

  const resolvedSectionLead = (() => {
    if (sectionLead != null && String(sectionLead).trim()) return String(sectionLead).trim()
    const fromHome = h?.reviewsBody?.trim()
    return fromHome || null
  })()

  const quotesForDots = featuredQuoteItems.length > 0 ? featuredQuoteItems : []
  const first = quotesForDots[0]
  const hasReviews = Array.isArray(reviews) && reviews.length > 0
  const list = hasReviews ? reviews! : []

  const eyebrow = eyebrowProp ?? h?.reviewsEyebrow ?? 'What guests say'
  const headline = headlineProp ?? h?.reviewsHeadline ?? 'Real experiences'
  const averageRating = (averageRatingProp ?? h?.reviewsScore)?.trim() || '5.0'
  const sourceLabel = (sourceLabelProp ?? h?.reviewsSourceLabel?.trim()) || 'Trustpilot'
  const emptyMessage =
    emptyMessageProp ??
    (h?.reviewsEmptyMessage?.trim() ||
      'No guest reviews for this program yet. Be the first to share your experience.')

  const showEmpty = list.length === 0

  return (
    <section className={sectionClassName} id="reviews">
      <div className={contentInnerClassName}>
        <div className="reviews-header">
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h2 className="h2" style={{ marginBottom: 0 }}>
              {headline}
            </h2>
          </div>
          <div className="reviews-rating-wrap">
            <div className="reviews-rating-col">
              <div className="big-score">{averageRating}</div>
              <div className="stars" aria-hidden>
                <div className="star" />
                <div className="star" />
                <div className="star" />
                <div className="star" />
                <div className="star" />
              </div>
              {secondaryRatingLine ? (
                <div
                  className="reviews-secondary-line"
                  style={{
                    fontSize: 12,
                    fontWeight: 300,
                    color: 'var(--n400)',
                    marginBottom: 4,
                    textAlign: 'center',
                  }}
                >
                  {secondaryRatingLine}
                </div>
              ) : null}
              <div className="trustpilot-badge">
                <div className="tp-icon">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="white" aria-hidden>
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                </div>
                <span className="tp-name">{sourceLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {resolvedSectionLead ? (
          <p className="body" style={{ maxWidth: 560, marginTop: 12, marginBottom: 0 }}>
            {resolvedSectionLead}
          </p>
        ) : null}

        {first ? (
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
                <button
                  key={i}
                  type="button"
                  className={'qdot' + (i === 0 ? ' active' : '')}
                  data-q={i}
                  aria-label={`${quoteDotAriaLabelPrefix} ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className="rev-carousel">
          {showEmpty ? (
            <p className="body" style={{ maxWidth: 560 }}>
              {emptyMessage}
            </p>
          ) : null}
          <div
            className="rev-scroll"
            id="revScroll"
            role="region"
            aria-label={reviewsRegionAriaLabel}
            style={showEmpty ? { display: 'none' } : undefined}
          >
            {list.map((r) => {
              const initial = (r.authorName || guestFallbackName || 'G').trim().slice(0, 1).toUpperCase()
              const q = r.quote || ''
              return (
                <div className="rev-card" key={r._id}>
                  <StarRow />
                  <p className="rev-q">&quot;{q}&quot;</p>
                  <div className="rev-author">
                    <div className="rev-av">{initial}</div>
                    <div>
                      <div className="rev-name">{r.authorName || guestFallbackName}</div>
                      <div className="rev-loc">{locLabel(r)}</div>
                      {r.experienceName ? <div className="rev-exp">{r.experienceName}</div> : null}
                    </div>
                  </div>
                </div>
              )
            })}
            {reviewCarouselEnd}
          </div>
          {list.length > 0 && !showEmpty ? (
            <div className="rev-card-dots" id="revCardDots" role="tablist" aria-label={reviewTablistAriaLabel}>
              {list.map((r, i) => (
                <button
                  key={r._id}
                  type="button"
                  className={'rev-dot' + (i === 0 ? ' active' : '')}
                  data-rev={i}
                  role="tab"
                  aria-selected={i === 0}
                  aria-label={`${reviewDotAriaLabelPrefix} ${i + 1} of ${list.length}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
