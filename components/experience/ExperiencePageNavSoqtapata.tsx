'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { InPageNav } from '@/components/shared/InPageNav'
import type { SoqtapataPhase1PageNav } from '@/data/soqtapataExperienceLocal'
import {
  activeHrefFromHash,
  computeActiveHrefFromScroll,
} from '@/lib/inPageNavScroll'

const ANCHOR_GAP = 8
const PAST_HERO_BODY_CLASS = 'ecotone-exp-past-hero'
const SCROLL_SPY_PAUSE_MS = 520

export function ExperiencePageNavSoqtapata({ data }: { data: SoqtapataPhase1PageNav }) {
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
    const effectiveMainNavH = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--nav-h').trim()
      const n = parseInt(v, 10)
      return Number.isFinite(n) && n > 20 ? n : 64
    }

    const updateActiveFromScroll = () => {
      if (performance.now() < scrollSpyMutedUntilRef.current) return
      const pn = document.getElementById('pageNav')
      setActiveHref(
        computeActiveHrefFromScroll(scrollLinks, {
          pageNav: pn,
          anchorGap: ANCHOR_GAP,
          effectiveMainNavH,
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

  const ctaSlot =
    data.bookVisible === false ? (
      <div className="pnav-from-price" aria-label={data.fromAriaLabel}>
        <span className="pnav-from-label">{data.fromLabel}</span>
        <span className="pnav-from-num">{data.fromNum}</span>
        <span className="pnav-from-sub">{data.fromSub}</span>
      </div>
    ) : (
      <>
        <div className="pnav-from-price" aria-label={data.fromAriaLabel}>
          <span className="pnav-from-label">{data.fromLabel}</span>
          <span className="pnav-from-num">{data.fromNum}</span>
          <span className="pnav-from-sub">{data.fromSub}</span>
        </div>
        <a href={data.bookHref} className="btn btn-primary" style={{ fontSize: 12, padding: '8px 18px' }}>
          {data.bookLabel}
        </a>
      </>
    )

  return (
    <InPageNav
      mode="experience"
      title={data.leadName}
      subtitle={data.leadDays}
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
