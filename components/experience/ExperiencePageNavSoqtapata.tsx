'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { useBookingModal } from '@/components/booking/BookingModalContext'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import { CTA_IDS } from '@/lib/ctaIds'
import { trackBookNowClick } from '@/lib/trackBookNowClick'
import { InPageNav } from '@/components/shared/InPageNav'
import type { SoqtapataPhase1PageNav } from '@/data/soqtapataExperienceLocal'
import {
  activeHrefFromHash,
  computeActiveHrefFromScroll,
} from '@/lib/inPageNavScroll'
import { effectiveHeaderStackH } from '@/lib/headerStackMetrics'

const ANCHOR_GAP = 8
const PAST_HERO_BODY_CLASS = 'ecotone-exp-past-hero'
const SCROLL_SPY_PAUSE_MS = 520

export function ExperiencePageNavSoqtapata({
  data,
  bookingSummary,
}: {
  data: SoqtapataPhase1PageNav
  bookingSummary: ExperienceBookingSummary | null
}) {
  const { openExperienceBooking } = useBookingModal()
  const scrollLinks = useMemo(
    () =>
      data.links.map((l) => ({
        href: l.href,
        label: l.label,
        dataActiveWhen: l.dataActiveWhen,
      })),
    [data.links],
  )

  const [activeHref, setActiveHref] = useState(() => scrollLinks[0]?.href ?? '#')
  const scrollSpyMutedUntilRef = useRef(0)

  const pauseScrollSpy = () => {
    scrollSpyMutedUntilRef.current = performance.now() + SCROLL_SPY_PAUSE_MS
  }

  useLayoutEffect(() => {
    const next = activeHrefFromHash(window.location.hash, scrollLinks)
    if (next) {
      setActiveHref(next)
      scrollSpyMutedUntilRef.current = performance.now() + SCROLL_SPY_PAUSE_MS
    }
  }, [scrollLinks])

  useEffect(() => {
    const effectiveHeaderStack = () => effectiveHeaderStackH()

    const updateActiveFromScroll = () => {
      if (performance.now() < scrollSpyMutedUntilRef.current) return
      const pn = document.getElementById('pageNav')
      setActiveHref(
        computeActiveHrefFromScroll(scrollLinks, {
          pageNav: pn,
          anchorGap: ANCHOR_GAP,
          effectiveMainNavH: effectiveHeaderStack,
          pastHeroBodyClass: PAST_HERO_BODY_CLASS,
        }),
      )
    }

    let scrollRaf = 0
    const onScrollOrResize = () => {
      window.cancelAnimationFrame(scrollRaf)
      scrollRaf = window.requestAnimationFrame(() => {
        updateActiveFromScroll()
        scrollRaf = 0
      })
    }

    const onHashChange = () => {
      const next = activeHrefFromHash(window.location.hash, scrollLinks)
      if (next) {
        setActiveHref(next)
        pauseScrollSpy()
      } else {
        updateActiveFromScroll()
      }
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })
    window.addEventListener('hashchange', onHashChange)
    updateActiveFromScroll()

    return () => {
      window.cancelAnimationFrame(scrollRaf)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [scrollLinks])

  const hideBookCta = data.bookVisible === false || !data.bookLabel?.trim()
  const canBookLink = Boolean(data.bookHref?.trim())
  const bookOpensModal = Boolean(bookingSummary) && !hideBookCta
  const bookTracking = {
    cta_id: CTA_IDS.EXPERIENCE_STICKY_BOOK,
    button_location: 'sticky_nav' as const,
    price: data.fromNum?.trim() || undefined,
    promo_label: data.promoLabel?.trim() || undefined,
  }
  const bookOptionalContext = bookingSummary
    ? {
        experience_name: bookingSummary.experienceName,
        route: bookingSummary.route,
        program_type: bookingSummary.programType,
      }
    : {}

  const pnavPrice = data.promoLabel?.trim() ? (
    <div
      className="pnav-from-price pnav-from-price--promo"
      aria-label={`${data.promoLabel}, from ${data.fromNum} per person`}
    >
      <span className="pnav-from-promo">{data.promoLabel}</span>
      <span className="pnav-from-promo-row">
        <span className="pnav-from-label">from </span>
        <span className="pnav-from-num">{data.fromNum}</span>
      </span>
      <span className="pnav-from-sub">{data.fromSub}</span>
    </div>
  ) : (
    <div className="pnav-from-price" aria-label={data.fromAriaLabel}>
      <span className="pnav-from-label">{data.fromLabel}</span>
      <span className="pnav-from-num">{data.fromNum}</span>
      <span className="pnav-from-sub">{data.fromSub}</span>
    </div>
  )

  const ctaSlot =
    hideBookCta ? (
      pnavPrice
    ) : (
      <>
        {pnavPrice}
        {bookOpensModal && bookingSummary ? (
          <button
            type="button"
            className="btn btn-primary"
            style={{ fontSize: 12, padding: '8px 18px' }}
            onClick={(e) => {
              e.preventDefault()
              openExperienceBooking(bookingSummary!, bookTracking)
            }}
          >
            {data.bookLabel}
          </button>
        ) : canBookLink ? (
          <a
            href={data.bookHref}
            className="btn btn-primary"
            style={{ fontSize: 12, padding: '8px 18px' }}
            onClick={() => trackBookNowClick({ ...bookTracking, ...bookOptionalContext })}
          >
            {data.bookLabel}
          </a>
        ) : null}
      </>
    )

  return (
    <InPageNav
      mode="experience"
      title={data.leadName}
      subtitle={data.leadDays}
      mobileMetaSlot={data.fromNum}
      links={scrollLinks}
      activeHref={activeHref}
      onLinkClick={(href) => {
        setActiveHref(href)
        pauseScrollSpy()
      }}
      ctaSlot={ctaSlot}
    />
  )
}
