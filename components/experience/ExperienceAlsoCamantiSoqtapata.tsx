'use client'

import type { KeyboardEvent } from 'react'

import { useBookingModal } from '@/components/booking/BookingModalContext'
import type { SoqtapataAlsoCamanti, SoqtapataRelatedCardTailor } from '@/data/soqtapataExperienceLocal'

const RELATED_FOOT_CTA_STYLE = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--brown)',
} as const

function TailorCardFoot({ card }: { card: SoqtapataRelatedCardTailor }) {
  const { openPlanJourney, openExperienceBooking } = useBookingModal()
  const ctaLabel = card.footRight?.trim() || 'Enquire →'

  const onCta = () => {
    if (card.bookingModal === 'plan') {
      openPlanJourney()
      return
    }
    if (card.bookingModal === 'experience' && card.bookingSummary) {
      openExperienceBooking(card.bookingSummary)
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onCta()
    }
  }

  return (
    <div className="related-foot">
      <span style={{ fontSize: 12, fontWeight: 300, color: 'var(--n400)' }}>{card.footLeft}</span>
      {card.bookingModal ? (
        <span
          role="button"
          tabIndex={0}
          onClick={onCta}
          onKeyDown={onKeyDown}
          style={{ ...RELATED_FOOT_CTA_STYLE, cursor: 'pointer' }}
        >
          {ctaLabel}
        </span>
      ) : card.ctaHref?.trim() ? (
        <a
          href={card.ctaHref}
          {...(card.ctaOpenInNewTab ? { target: '_blank', rel: card.ctaRel || 'noopener noreferrer' } : {})}
          style={RELATED_FOOT_CTA_STYLE}
        >
          {ctaLabel}
        </a>
      ) : (
        <span style={RELATED_FOOT_CTA_STYLE}>{ctaLabel}</span>
      )}
    </div>
  )
}

export function ExperienceAlsoCamantiSoqtapata({ data }: { data: SoqtapataAlsoCamanti }) {
  return (
    <section className="content-section fade" id="also-camanti">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={data.h2Style}>
          {data.h2}
        </h2>
        {data.lead ? (
          <p className="body" style={{ fontSize: 14, maxWidth: 560, marginBottom: 16, color: 'var(--n700)' }}>
            {data.lead}
          </p>
        ) : null}
        <div className="related-grid">
          {data.cards.map((card, i) => {
            if (card.kind === 'image') {
              return (
                <div className="related-card" key={`img-${i}`}>
                  <div
                    className="related-img"
                    style={
                      card.imageSrc?.trim()
                        ? undefined
                        : { background: 'var(--n100)', minHeight: 140 }
                    }
                  >
                    {card.imageSrc?.trim() ? (
                      <img src={card.imageSrc} alt={card.imageAlt} />
                    ) : null}
                    <div className="related-img-overlay" />
                    <span
                      className="pill pill-dark"
                      style={{ position: 'absolute', top: 9, left: 9, fontSize: 11 }}
                    >
                      {card.pillLeft}
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        top: 9,
                        right: 9,
                        fontSize: 11,
                        fontWeight: 700,
                        background: 'var(--brown)',
                        color: '#fff',
                        padding: '3px 9px',
                        borderRadius: 100,
                      }}
                    >
                      {card.pillRight}
                    </span>
                  </div>
                  <div className="related-body">
                    <div className="related-type">{card.typeLabel}</div>
                    <div className="related-name">{card.name}</div>
                    <div className="related-meta">{card.meta}</div>
                    <div className="related-foot">
                      <span className="related-price">{card.price}</span>
                      {card.ctaHref?.trim() ? (
                        <a href={card.ctaHref} style={RELATED_FOOT_CTA_STYLE}>
                          {card.footRight}
                        </a>
                      ) : (
                        <span style={RELATED_FOOT_CTA_STYLE}>{card.footRight}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            }
            const tailorImg = card.imageSrc?.trim()
            return (
              <div
                className="related-card"
                key={`tailor-${i}`}
                style={{ borderColor: 'var(--b200)', background: 'var(--b50)' }}
              >
                <div
                  className="related-img"
                  style={
                    tailorImg
                      ? undefined
                      : {
                          background: 'linear-gradient(145deg,var(--brown-xdk),var(--brown-dk))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }
                  }
                >
                  {tailorImg ? (
                    <img src={tailorImg} alt={card.imageAlt || card.name || 'Tailor Made'} />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <svg width="28" height="27" viewBox="0 0 105 101" fill="none">
                        <path
                          d="M103.703 59.25C102.343 49.75 97.3635 41.34 89.6735 35.59C89.3235 35.33 88.9635 35.07 88.6035 34.82C88.0135 15.52 72.1235 0 52.6835 0C33.6535 0 18.0434 14.86 16.8234 33.58C11.1834 37.11 6.62343 42.15 3.64343 48.28C-0.556567 56.91 -1.14654 66.66 1.98346 75.74C5.11346 84.81 11.5934 92.13 20.2234 96.33C25.2034 98.75 30.5535 99.98 35.9235 99.98C39.8735 99.98 43.8335 99.32 47.6735 98C49.0635 97.52 50.4034 96.96 51.7134 96.33L51.9534 96.46C56.9534 98.99 62.4335 100.31 68.0535 100.31C69.7735 100.31 71.5035 100.19 73.2335 99.94C82.7335 98.58 91.1434 93.6 96.8934 85.91C102.643 78.22 105.063 68.75 103.703 59.25Z"
                          fill="rgba(236,229,213,.5)"
                        />
                      </svg>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: '0.12em',
                          color: 'rgba(236,229,213,.55)',
                          textTransform: 'uppercase',
                          marginTop: 6,
                        }}
                      >
                        {card.typeLabel}
                      </div>
                    </div>
                  )}
                </div>
                <div className="related-body">
                  <div className="related-type">{card.typeLabel}</div>
                  <div className="related-name">{card.name}</div>
                  <div className="related-meta">{card.meta}</div>
                  <TailorCardFoot card={card} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
