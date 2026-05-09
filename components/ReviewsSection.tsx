import type { ReactNode } from 'react'

import type { ReviewDoc } from '@/lib/queries'
import { getReviewExperienceLabel } from '@/lib/reviewsTypes'
import type { ReviewsRatingSummary } from '@/lib/reviewsRatingSummary'
import {
  formatGlobalReviewCountLine,
  formatRatingScoreDisplay,
  starFillsFromRating,
} from '@/lib/reviewsRatingSummary'

import styles from './ReviewsSection.module.css'

const STAR_CLIP = 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'

function FractStarRow({
  fills,
  size,
  variant,
}: {
  fills: number[]
  size: number
  variant: 'summary' | 'card'
}) {
  const rowClass =
    variant === 'card' ? `${styles.starRow} ${styles.starRowCard}` : styles.starRow
  return (
    <div className={rowClass} aria-hidden>
      {fills.map((fill, i) => (
        <div key={i} className={styles.starSlot} style={{ width: size, height: size }}>
          <span
            className={styles.starSlotTrack}
            style={{
              clipPath: STAR_CLIP,
              background: 'var(--n200)',
              opacity: 0.5,
            }}
          />
          <span
            className={styles.starSlotFill}
            style={{
              width: `${fill * 100}%`,
              clipPath: STAR_CLIP,
              background: 'var(--brown)',
            }}
          />
        </div>
      ))}
    </div>
  )
}

function locLabel(r: ReviewDoc) {
  const a = r.authorCity?.trim()
  const c = r.authorCountry?.trim()
  if (a && c) return `${a}, ${c}`
  return a || c || ''
}

export type ReviewsSectionProps = {
  eyebrow: string
  title: string
  body?: string | null
  ratingSummary: ReviewsRatingSummary
  rotatingQuoteItems: { text: string; attr: string }[]
  reviewCards: ReviewDoc[]
  /** When there are no cards, shown in place of the carousel. */
  emptyMessage?: string | null
  sectionClassName?: string
  contentInnerClassName?: string
  reviewCarouselEnd?: ReactNode
  reviewsRegionAriaLabel?: string
  reviewTablistAriaLabel?: string
  quoteDotAriaLabelPrefix?: string
  reviewDotAriaLabelPrefix?: string
  guestFallbackName?: string
}

export function ReviewsSection({
  eyebrow,
  title,
  body = null,
  ratingSummary,
  rotatingQuoteItems,
  reviewCards,
  emptyMessage = null,
  sectionClassName = 'sec bg-cream fade',
  contentInnerClassName = 'sec-inner',
  reviewCarouselEnd = null,
  reviewsRegionAriaLabel = 'Guest reviews',
  reviewTablistAriaLabel = 'Select a review',
  quoteDotAriaLabelPrefix = 'Quote',
  reviewDotAriaLabelPrefix = 'Review',
  guestFallbackName = 'Guest',
}: ReviewsSectionProps) {
  const bodyTrimmed = body != null && String(body).trim() ? String(body).trim() : null
  const quotesForDots = rotatingQuoteItems.length > 0 ? rotatingQuoteItems : []
  const first = quotesForDots[0]
  const list = Array.isArray(reviewCards) ? reviewCards : []
  const hasCards = list.length > 0
  const showEmpty = !hasCards
  const emptyCopy = (emptyMessage && emptyMessage.trim()) || ''

  const scoreDisplay = formatRatingScoreDisplay(ratingSummary.ratingValue)
  const countLine = formatGlobalReviewCountLine(ratingSummary.reviewCount)
  const provider = ratingSummary.reviewProviderName?.trim() || 'Trustpilot'
  const logoUrl = ratingSummary.reviewProviderLogoUrl?.trim() || null
  const logoAlt = ratingSummary.reviewProviderLogoAlt?.trim() || provider
  const profileUrl = ratingSummary.reviewProviderUrl?.trim() || null

  const badgeInner = (
    <>
      <div className="tp-icon">
        {logoUrl ? (
          <img src={logoUrl} alt={logoAlt} width={12} height={12} className="tp-logo-img" />
        ) : (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="white" aria-hidden>
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
        )}
      </div>
      <span className="tp-name">{provider}</span>
    </>
  )

  const summaryFills = starFillsFromRating(ratingSummary.ratingValue)

  return (
    <section className={sectionClassName} id="reviews">
      <div className={contentInnerClassName}>
        <div className="reviews-header">
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h2 className="h2" style={{ marginBottom: 0 }}>
              {title}
            </h2>
          </div>
          <div className="reviews-rating-wrap">
            <div className={`reviews-rating-col ${styles.ratingColTight}`}>
              <div className="big-score">{scoreDisplay}</div>
              <FractStarRow fills={summaryFills} size={13} variant="summary" />
              <div className={`reviews-secondary-line ${styles.countLine}`}>{countLine}</div>
              {profileUrl ? (
                <a
                  href={profileUrl}
                  className="trustpilot-badge trustpilot-badge--link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {badgeInner}
                </a>
              ) : (
                <div className="trustpilot-badge">{badgeInner}</div>
              )}
            </div>
          </div>
        </div>

        {bodyTrimmed ? (
          <p className="body" style={{ maxWidth: 560, marginTop: 12, marginBottom: 0 }}>
            {bodyTrimmed}
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
          {showEmpty && emptyCopy ? (
            <p className="body" style={{ maxWidth: 560 }}>
              {emptyCopy}
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
              const experienceLabel = getReviewExperienceLabel(r)
              const cardRating = typeof r.rating === 'number' && Number.isFinite(r.rating) ? r.rating : 5
              const v = Math.max(1, Math.min(5, Math.round(cardRating)))
              const fills = [0, 1, 2, 3, 4].map((i) => (v > i ? 1 : 0))
              return (
                <div className="rev-card" key={r._id}>
                  <FractStarRow fills={fills} size={11} variant="card" />
                  <p className="rev-q">&quot;{q}&quot;</p>
                  <div className="rev-author">
                    <div className="rev-av">{initial}</div>
                    <div>
                      <div className="rev-name">{r.authorName || guestFallbackName}</div>
                      <div className="rev-loc">{locLabel(r)}</div>
                      {experienceLabel ? <div className="rev-exp">{experienceLabel}</div> : null}
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
