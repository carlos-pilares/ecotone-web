'use client'

import { useBookingModal } from '@/components/booking/BookingModalContext'
import type { SiteHeaderNavTailor } from '@/lib/resolveSiteHeaderNavData'

function ArrowSeeAll() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="2" y1="6" x2="10" y2="6" />
      <polyline points="7 3 10 6 7 9" />
    </svg>
  )
}

function TailorFallbackIcon() {
  return (
    <div className="dd-tailor-icon" aria-hidden>
      <svg width="18" height="17" viewBox="0 0 105 101" fill="none">
        <path
          d="M103.703 59.25C102.343 49.75 97.3635 41.34 89.6735 35.59C89.3235 35.33 88.9635 35.07 88.6035 34.82C88.0135 15.52 72.1235 0 52.6835 0C33.6535 0 18.0434 14.86 16.8234 33.58C11.1834 37.11 6.62343 42.15 3.64343 48.28C-0.556567 56.91 -1.14654 66.66 1.98346 75.74C5.11346 84.81 11.5934 92.13 20.2234 96.33C25.2034 98.75 30.5535 99.98 35.9235 99.98C39.8735 99.98 43.8335 99.32 47.6735 98C49.0635 97.52 50.4034 96.96 51.7134 96.33L51.9534 96.46C56.9534 98.99 62.4335 100.31 68.0535 100.31C69.7735 100.31 71.5035 100.19 73.2335 99.94C82.7335 98.58 91.1434 93.6 96.8934 85.91C102.643 78.22 105.063 68.75 103.703 59.25Z"
          fill="#ECE5D5"
        />
      </svg>
    </div>
  )
}

function TailorCta({ cta }: { cta: NonNullable<SiteHeaderNavTailor['cta']> }) {
  const { openPlanJourney, openExperienceBooking } = useBookingModal()
  const inner = (
    <>
      {cta.label}
      <ArrowSeeAll />
    </>
  )

  if (cta.bookingModal === 'plan') {
    return (
      <button type="button" className="dd-tailor-cta" onClick={() => openPlanJourney()}>
        {inner}
      </button>
    )
  }
  if (cta.bookingModal === 'experience' && cta.bookingSummary) {
    return (
      <button type="button" className="dd-tailor-cta" onClick={() => openExperienceBooking(cta.bookingSummary!)}>
        {inner}
      </button>
    )
  }

  return (
    <a
      href={cta.href}
      className="dd-tailor-cta"
      {...(cta.openInNewTab ? { target: '_blank', rel: cta.rel } : {})}
    >
      {inner}
    </a>
  )
}

function TailorCard({ tailor }: { tailor: SiteHeaderNavTailor }) {
  const cta = tailor.cta
  const card = (
    <div className="dd-tailor">
      {tailor.imageUrl ? (
        <div className="dd-tailor-thumb">
          <img src={tailor.imageUrl} alt={tailor.imageAlt || ''} width={160} height={112} decoding="async" />
        </div>
      ) : (
        <TailorFallbackIcon />
      )}
      <div className="dd-tailor-copy">
        {tailor.eyebrow ? <div className="dd-tailor-type">{tailor.eyebrow}</div> : null}
        {tailor.title ? <div className="dd-tailor-name">{tailor.title}</div> : null}
        {tailor.subtitle ? <div className="dd-tailor-sub">{tailor.subtitle}</div> : null}
      </div>
    </div>
  )

  const body = tailor.body ? <p className="dd-tailor-body">{tailor.body}</p> : null
  const ctaEl = cta ? <TailorCta cta={cta} /> : null

  if (cta && !cta.bookingModal && cta.href && cta.href !== '#') {
    return (
      <a
        href={cta.href}
        className="dd-tailor-stack-link"
        {...(cta.openInNewTab ? { target: '_blank', rel: cta.rel } : {})}
      >
        {card}
        {body}
        {ctaEl}
      </a>
    )
  }

  return (
    <div className="dd-tailor-stack-link">
      {card}
      {body}
      {ctaEl}
    </div>
  )
}

export function SiteHeaderTailorPanel({ tailor }: { tailor: SiteHeaderNavTailor }) {
  return (
    <div className="dd-tailor-stack">
      <TailorCard tailor={tailor} />
    </div>
  )
}

export function SiteHeaderTailorMobileRow({ tailor }: { tailor: SiteHeaderNavTailor }) {
  const cta = tailor.cta
  const { openPlanJourney, openExperienceBooking } = useBookingModal()

  const thumb = tailor.imageUrl ? (
    <div className="mob-item-thumb mob-tailor-thumb">
      <img src={tailor.imageUrl} alt={tailor.imageAlt || ''} width={80} height={60} decoding="async" />
    </div>
  ) : (
    <div className="mob-item-thumb mob-item-thumb--icon mob-tailor-row__icon" aria-hidden>
      <svg width="16" height="15" viewBox="0 0 105 101" fill="none">
        <path
          d="M103.703 59.25C102.343 49.75 97.3635 41.34 89.6735 35.59C89.3235 35.33 88.9635 35.07 88.6035 34.82C88.0135 15.52 72.1235 0 52.6835 0C33.6535 0 18.0434 14.86 16.8234 33.58C11.1834 37.11 6.62343 42.15 3.64343 48.28C-0.556567 56.91 -1.14654 66.66 1.98346 75.74C5.11346 84.81 11.5934 92.13 20.2234 96.33C25.2034 98.75 30.5535 99.98 35.9235 99.98C39.8735 99.98 43.8335 99.32 47.6735 98C49.0635 97.52 50.4034 96.96 51.7134 96.33L51.9534 96.46C56.9534 98.99 62.4335 100.31 68.0535 100.31C69.7735 100.31 71.5035 100.19 73.2335 99.94C82.7335 98.58 91.1434 93.6 96.8934 85.91C102.643 78.22 105.063 68.75 103.703 59.25Z"
          fill="#ECE5D5"
        />
      </svg>
    </div>
  )

  const text = (
    <div className="mob-item-text">
      {tailor.eyebrow ? <div className="mob-item-route">{tailor.eyebrow}</div> : null}
      {tailor.title ? <div className="mob-item-name">{tailor.title}</div> : null}
      {tailor.subtitle ? <div className="mob-item-meta">{tailor.subtitle}</div> : null}
    </div>
  )

  const arrow = cta ? (
    <span className="mob-item-arrow" aria-hidden>
      →
    </span>
  ) : null

  const inner = (
    <>
      {thumb}
      {text}
      {arrow}
    </>
  )

  if (cta?.bookingModal === 'plan') {
    return (
      <button type="button" className="mob-item mob-item--tailor mob-tailor-row" onClick={() => openPlanJourney()}>
        {inner}
      </button>
    )
  }
  if (cta?.bookingModal === 'experience' && cta.bookingSummary) {
    return (
      <button
        type="button"
        className="mob-item mob-item--tailor mob-tailor-row"
        onClick={() => openExperienceBooking(cta.bookingSummary!)}
      >
        {inner}
      </button>
    )
  }
  if (cta) {
    return (
      <a
        href={cta.href}
        className="mob-item mob-item--tailor mob-tailor-row"
        {...(cta.openInNewTab ? { target: '_blank', rel: cta.rel } : {})}
      >
        {inner}
      </a>
    )
  }

  return <div className="mob-item mob-item--tailor mob-tailor-row">{inner}</div>
}
