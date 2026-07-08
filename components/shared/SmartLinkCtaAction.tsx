'use client'

import Link from 'next/link'
import type { KeyboardEvent, ReactNode } from 'react'

import { useBookingModal } from '@/components/booking/BookingModalContext'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import type { CtaId } from '@/lib/ctaIds'
import { isExternalHref } from '@/lib/resolveSmartLink'
import type { BookNowClickButtonLocation } from '@/lib/trackBookNowClick'

export type SmartLinkCtaActionProps = {
  label: string
  href: string
  openInNewTab?: boolean
  rel?: string
  bookingModal?: 'plan' | 'experience'
  bookingSummary?: ExperienceBookingSummary
  className?: string
  children: ReactNode
  /** When set, used for `role="button"` blocks (booking modal). */
  dataType?: string
  /** Analytics source when this CTA opens a booking modal. */
  bookNowButtonLocation?: BookNowClickButtonLocation
  /** Stable CTA identifier for conversion attribution (required when `bookingModal` is set). */
  ctaId?: CtaId
}

function isInternalAppHref(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//')
}

/**
 * Wraps children in the correct interactive element for a resolved CMS smart link
 * (same behavior as ReserveCtaLink / header tailor CTAs).
 */
export function SmartLinkCtaAction({
  label,
  href,
  openInNewTab,
  rel,
  bookingModal,
  bookingSummary,
  className,
  children,
  dataType,
  bookNowButtonLocation = 'reserve_section',
  ctaId,
}: SmartLinkCtaActionProps) {
  const { openPlanJourney, openExperienceBooking } = useBookingModal()
  const trimmedHref = href?.trim() ?? ''
  const trimmedLabel = label?.trim() ?? ''
  const onBooking = () => {
    if (!ctaId) return
    const bookSource = {
      cta_id: ctaId,
      button_location: bookNowButtonLocation,
    }
    if (bookingModal === 'plan') {
      openPlanJourney(bookSource)
      return
    }
    if (bookingModal === 'experience' && bookingSummary) {
      openExperienceBooking(bookingSummary, bookSource)
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onBooking()
    }
  }

  if (bookingModal && trimmedLabel) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={className}
        data-type={dataType}
        onClick={onBooking}
        onKeyDown={onKeyDown}
        aria-label={trimmedLabel}
      >
        {children}
      </div>
    )
  }

  if (!trimmedLabel || !trimmedHref || trimmedHref === '#') {
    return (
      <div className={className} data-type={dataType}>
        {children}
      </div>
    )
  }

  if (!openInNewTab && isInternalAppHref(trimmedHref)) {
    return (
      <Link href={trimmedHref} className={className} data-type={dataType}>
        {children}
      </Link>
    )
  }

  const external = openInNewTab || isExternalHref(trimmedHref)
  return (
    <a
      href={trimmedHref}
      className={className}
      data-type={dataType}
      {...(external ? { target: '_blank', rel: rel || 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
