'use client'

import { useBookingModal } from '@/components/booking/BookingModalContext'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import type { SoqtapataPhase1Hero } from '@/data/soqtapataExperienceLocal'

/**
 * Hero (gallery + identity) — paridad con `ecotone-experience_2.html` (exp-hero #top).
 */
export function ExperienceHeroSoqtapata({
  data,
  bookingSummary,
}: {
  data: SoqtapataPhase1Hero
  bookingSummary: ExperienceBookingSummary | null
}) {
  const { openExperienceBooking } = useBookingModal()
  const bookOpensModal = Boolean(bookingSummary) && Boolean(data.bookLabel.trim())
  return (
    <section className="exp-hero" id="top">
      {data.gallery.length > 0 ? (
      <div className="gallery-grid">
        {data.gallery.map((g, i) => {
          if (g.kind === 'main') {
            return (
              <div
                className="gallery-main"
                key={`main-${i}`}
                data-exp-lb={g.dataExpLb}
                role="button"
                tabIndex={0}
                aria-label={g.ariaLabel}
              >
                <img src={g.imageSrc} alt={g.imageAlt} decoding="async" />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg,rgba(0,0,0,.25) 0%,transparent 25%,transparent 65%,rgba(0,0,0,.55) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            )
          }
          return (
            <div
              className="gallery-thumb"
              key={`thumb-${i}`}
              data-exp-lb={g.dataExpLb}
              role="button"
              tabIndex={0}
              style={g.stylePositionRelative ? { position: 'relative' } : undefined}
              aria-label={g.ariaLabel}
            >
              <img src={g.imageSrc} alt={g.imageAlt} decoding="async" />
              <div className="gallery-thumb-overlay" />
              {g.galleryLabel ? <span className="gallery-label">{g.galleryLabel}</span> : null}
              {g.moreBadge ? (
                <span
                  className="gallery-see-all"
                  data-exp-lb={g.moreBadge.dataExpLb}
                  role="button"
                  tabIndex={0}
                  aria-label={g.moreBadge.ariaLabel}
                >
                  {g.moreBadge.text}
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
      ) : null}

      <div className="exp-identity">
        <div className="exp-identity-inner">
          <div>
            <div className="exp-breadcrumb">
              {data.breadcrumb.map((b, j) => {
                if (b.type === 'link') {
                  return (
                    <a key={j} href={b.href}>
                      {b.text}
                    </a>
                  )
                }
                if (b.type === 'span-muted') {
                  return (
                    <span key={j} style={{ opacity: 0.4 }}>
                      {b.text}
                    </span>
                  )
                }
                return (
                  <span key={j} className="current">
                    {b.text}
                  </span>
                )
              })}
            </div>
            <div className="exp-badges">
              {data.badges.map((t) => (
                <span key={t} className="pill pill-glass">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="exp-h1">{data.h1}</h1>
            <p className="exp-tagline">{data.tagline}</p>
            <div className="exp-rating">
              <div className="stars">
                <div className="star" />
                <div className="star" />
                <div className="star" />
                <div className="star" />
                <div className="star" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cream)' }}>{data.ratingScore}</span>
              <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(236,229,213,.45)' }}>{data.ratingReviews}</span>
              {data.ratingDivider ? (
                <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,.12)' }} />
              ) : null}
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--b200)' }}>{data.lodgeName}</span>
            </div>
          </div>
          <div className="exp-price-block">
            <div className="exp-price-cta">
              <div className={'exp-price-titles' + (data.promoLabel ? ' exp-price-titles--promo' : '')}>
                {data.promoLabel ? (
                  <>
                    <p className="exp-price-promo">{data.promoLabel}</p>
                    {data.promoMicrocopy ? <p className="exp-price-promo-micro">{data.promoMicrocopy}</p> : null}
                    <div className="exp-price exp-price--promo-main">
                      {data.priceFrom ? <span className="exp-price-from">{data.priceFrom} </span> : null}
                      <span className="exp-price-amount">{data.priceAmount}</span>
                    </div>
                    <p className="exp-price-sub exp-price-sub--promo">per person</p>
                    {data.priceOriginalAmount ? (
                      <p className="exp-price-original">{data.priceOriginalAmount}</p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <div className="exp-price">
                      {data.priceFrom ? <span className="exp-price-from">{data.priceFrom} </span> : null}
                      <span className="exp-price-amount">{data.priceAmount}</span>
                    </div>
                    <div className="exp-price-sub">{data.priceSub}</div>
                  </>
                )}
              </div>
              {data.bookLabel.trim() ? (
                bookOpensModal && bookingSummary ? (
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      openExperienceBooking(bookingSummary)
                    }}
                  >
                    {data.bookLabel}
                  </button>
                ) : data.bookUrl.trim() ? (
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      window.location.href = data.bookUrl
                    }}
                  >
                    {data.bookLabel}
                  </button>
                ) : null
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
