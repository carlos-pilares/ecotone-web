'use client'

import Link from 'next/link'
import type { KeyboardEvent, ReactNode } from 'react'

import { useBookingModal } from '@/components/booking/BookingModalContext'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import { isExternalHref } from '@/lib/resolveSmartLink'

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
}: SmartLinkCtaActionProps) {
  const { openPlanJourney, openExperienceBooking } = useBookingModal()
  const trimmedHref = href?.trim() ?? ''
  const trimmedLabel = label?.trim() ?? ''

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
