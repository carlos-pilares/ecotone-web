'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { InPageNav } from '@/components/shared/InPageNav'
import type { LodgeInPageNavData } from '@/data/lodgeSoqtapataStatic'
import {
  activeHrefFromHash,
  computeActiveHrefFromScroll,
} from '@/lib/inPageNavScroll'

const ANCHOR_GAP = 8
const HASH_SCROLL_MAX_RETRIES = 40
const HASH_SCROLL_RETRY_MS = 50
const PAST_HERO_BODY_CLASS = 'ecotone-exp-past-hero'
const SCROLL_SPY_PAUSE_MS = 520

type LodgeInPageNavProps = {
  nav: LodgeInPageNavData
}

/**
 * Soqtapata lodge: scroll/past-hero/`--anchor-offset`/shim + shared `InPageNav` chrome.
 */
export function LodgeInPageNav({ nav }: LodgeInPageNavProps) {
  const scrollLinks = useMemo(
    () => nav.items.map((i) => ({ href: `#${i.id}`, label: i.label })),
    [nav.items],
  )
  const [activeHref, setActiveHref] = useState(
    () => scrollLinks[0]?.href ?? `#${nav.items[0]?.id ?? 'overview'}`,
  )
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

    const setAnchorOffset = () => {
      const pageNav = document.getElementById('pageNav')
      const h = pageNav ? pageNav.getBoundingClientRect().height : 0
      const past = document.body.classList.contains(PAST_HERO_BODY_CLASS)
      const mainNav = past ? 0 : effectiveMainNavH()
      const v = Math.round(mainNav + h + ANCHOR_GAP)
      document.documentElement.style.setProperty('--anchor-offset', `${v}px`)
    }

    const syncPnavScrollShim = () => {
      const shim = document.getElementById('pnavScrollShim') as HTMLElement | null
      if (!shim) return
      const past = document.body.classList.contains(PAST_HERO_BODY_CLASS)
      if (!past) {
        shim.style.removeProperty('height')
        return
      }
      const pageNav = document.getElementById('pageNav')
      const ph = pageNav ? Math.round(pageNav.offsetHeight || pageNav.getBoundingClientRect().height) : 0
      if (ph > 0) shim.style.height = `${ph}px`
      else shim.style.removeProperty('height')
    }

    let pnavRo: ResizeObserver | undefined
    const pageNavEl = document.getElementById('pageNav')
    if (pageNavEl && typeof ResizeObserver !== 'undefined') {
      pnavRo = new ResizeObserver(() => {
        setAnchorOffset()
        syncPnavScrollShim()
      })
      pnavRo.observe(pageNavEl)
    }

    const setPnavStuck = () => {
      const el = document.getElementById('pageNav')
      if (!el) {
        document.body.classList.remove('ecotone-pnav-stuck')
        return
      }
      const t = el.getBoundingClientRect().top
      const past = document.body.classList.contains(PAST_HERO_BODY_CLASS)
      const mainOff = past ? 0 : effectiveMainNavH()
      const stuck = t <= mainOff + 0.5
      document.body.classList.toggle('ecotone-pnav-stuck', stuck)
    }

    const updatePastHero = () => {
      const hero = document.getElementById('top')
      const past = !!(hero && hero.getBoundingClientRect().bottom <= 0)
      const wasPast = document.body.classList.contains(PAST_HERO_BODY_CLASS)
      document.body.classList.toggle(PAST_HERO_BODY_CLASS, past)
      if (past && !wasPast) {
        document.getElementById('drawer')?.classList.remove('open')
      }
      setAnchorOffset()
      syncPnavScrollShim()
      setPnavStuck()
      requestAnimationFrame(() => {
        syncPnavScrollShim()
        setAnchorOffset()
        setPnavStuck()
      })
    }

    const fixHashScroll = (retries = 0) => {
      const { hash } = window.location
      if (!hash || hash.length < 2) return
      const id = decodeURIComponent(hash.slice(1))
      const el = document.getElementById(id)
      if (!el) {
        if (retries < HASH_SCROLL_MAX_RETRIES) {
          setTimeout(() => fixHashScroll(retries + 1), HASH_SCROLL_RETRY_MS)
        }
        return
      }
      requestAnimationFrame(() => {
        setAnchorOffset()
        el.scrollIntoView({ block: 'start', behavior: 'auto' })
        requestAnimationFrame(() => {
          updatePastHero()
        })
      })
    }

    let heroRo: ResizeObserver | undefined
    const hero = document.getElementById('top')
    if (hero && typeof ResizeObserver !== 'undefined') {
      heroRo = new ResizeObserver(() => updatePastHero())
      heroRo.observe(hero)
    }

    setAnchorOffset()
    syncPnavScrollShim()
    fixHashScroll(0)
    updatePastHero()

    const onHashChange = () => {
      const next = activeHrefFromHash(window.location.hash, scrollLinks)
      if (next) {
        setActiveHref(next)
        pauseScrollSpy()
      }
      fixHashScroll(0)
    }
    window.addEventListener('hashchange', onHashChange)

    const onLayoutLoad = () => {
      setAnchorOffset()
      syncPnavScrollShim()
      fixHashScroll(0)
      updatePastHero()
    }
    window.addEventListener('load', onLayoutLoad, { once: true })

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
    const onScroll = () => {
      updatePastHero()
      window.cancelAnimationFrame(scrollRaf)
      scrollRaf = window.requestAnimationFrame(() => {
        updateActiveFromScroll()
        const pn = document.getElementById('pageNav')
        if (pn) pn.classList.toggle('scrolled', window.scrollY > 4)
        scrollRaf = 0
      })
    }

    const onResize = () => {
      updatePastHero()
      updateActiveFromScroll()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    onScroll()
    onResize()

    return () => {
      window.cancelAnimationFrame(scrollRaf)
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('load', onLayoutLoad)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.getElementById('pnavScrollShim')?.style.removeProperty('height')
      pnavRo?.disconnect()
      heroRo?.disconnect()
      document.documentElement.style.removeProperty('--anchor-offset')
      document.body.classList.remove('ecotone-pnav-stuck')
      document.body.classList.remove(PAST_HERO_BODY_CLASS)
    }
  }, [nav, scrollLinks])

  return (
    <InPageNav
      mode="lodge"
      title={nav.title}
      subtitle={nav.subtitle}
      links={scrollLinks}
      activeHref={activeHref}
      onLinkClick={(href) => {
        setActiveHref(href)
        pauseScrollSpy()
      }}
      cta={{ href: nav.cta.href, label: nav.cta.label }}
    />
  )
}
