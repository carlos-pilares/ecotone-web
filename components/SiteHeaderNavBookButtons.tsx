'use client'

import type { MouseEvent } from 'react'

import { useBookingModal } from '@/components/booking/BookingModalContext'
import { CTA_IDS } from '@/lib/ctaIds'

type Props = {
  label: string
  href: string
  openInNewTab: boolean
}

/** Normalize CMS / Unicode variants so “Book now” still opens the plan modal. */
function isHeaderPlanJourneyBookLabel(raw: string): boolean {
  const n = raw
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[.!…]+$/u, '')
    .trim()
  return n === 'book now'
}

/** Header-only: opens Plan journey modal when label is “Book now”; otherwise preserves link behaviour. */
export function SiteHeaderNavBookButtons({ label, href, openInNewTab }: Props) {
  const { openPlanJourney } = useBookingModal()
  const useModal = isHeaderPlanJourneyBookLabel(label)

  if (!useModal) {
    return (
      <>
        <a
          href={href}
          className="nav-book desk"
          {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
        <a
          href={href}
          className="nav-book nav-book-inline site-header-mobile-only"
          {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
      </>
    )
  }

  const open = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    openPlanJourney({ cta_id: CTA_IDS.HEADER_BOOK_NOW, button_location: 'header' })
  }

  return (
    <>
      <button type="button" className="nav-book desk" onClick={open}>
        {label}
      </button>
      <button type="button" className="nav-book nav-book-inline site-header-mobile-only" onClick={open}>
        {label}
      </button>
    </>
  )
}
