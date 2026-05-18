'use client'

import type { KeyboardEvent } from 'react'

import { useBookingModal } from '@/components/booking/BookingModalContext'
import type { TailorMadeBandComponentProps, TailorMadeBandResolved } from '@/lib/tailorMadeBand'
import { tailorMadeBandHasCta } from '@/lib/tailorMadeBand'

export type TailorMadeBandProps = TailorMadeBandComponentProps

function BandCopy({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
}: Pick<TailorMadeBandProps, 'eyebrow' | 'title' | 'subtitle' | 'ctaLabel'>) {
  return (
    <>
      <div>
        <div className="lodge-exp-tailor-kicker">{eyebrow}</div>
        <div className="lodge-exp-tailor-title">{title}</div>
        <div className="lodge-exp-tailor-desc">{subtitle}</div>
      </div>
      {ctaLabel?.trim() ? (
        <div style={{ flexShrink: 0 }}>
          <span className="lodge-exp-tailor-cta">{ctaLabel}</span>
        </div>
      ) : null}
    </>
  )
}

export function TailorMadeBand(props: TailorMadeBandProps) {
  const {
    visible,
    className,
    dataType = 'tailor',
    bookingModal,
    bookingSummary,
    eyebrow,
    title,
    subtitle,
    ctaLabel,
    href,
    openInNewTab,
    rel,
  } = props
  if (!visible) return null

  const band: TailorMadeBandResolved = {
    eyebrow,
    title,
    subtitle,
    ctaLabel: ctaLabel ?? '',
    href: href ?? '',
    openInNewTab,
    rel,
    bookingModal,
    bookingSummary,
  }

  const showCta = tailorMadeBandHasCta(band)
  const outerClass = ['lodge-exp-tailor', className].filter(Boolean).join(' ')

  const { openPlanJourney, openExperienceBooking } = useBookingModal()

  const onBooking = () => {
    if (bookingModal === 'plan') {
      openPlanJourney()
      return
    }
    if (bookingModal === 'experience' && bookingSummary) {
      openExperienceBooking(bookingSummary)
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onBooking()
    }
  }

  const inner = (
    <BandCopy
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      ctaLabel={showCta ? ctaLabel : undefined}
    />
  )

  if (bookingModal && showCta) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={outerClass}
        data-type={dataType}
        onClick={onBooking}
        onKeyDown={onKeyDown}
      >
        {inner}
      </div>
    )
  }

  if (showCta && href?.trim()) {
    return (
      <a
        href={href}
        className={outerClass}
        data-type={dataType}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? rel || 'noopener noreferrer' : undefined}
      >
        {inner}
      </a>
    )
  }

  return (
    <div className={outerClass} data-type={dataType}>
      {inner}
    </div>
  )
}

export { tailorMadeBandFromResolved } from '@/lib/tailorMadeBand'
