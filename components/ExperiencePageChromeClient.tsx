'use client'

import { useEffect } from 'react'

import { refreshInPageNavAnchorMetrics } from '@/lib/inPageNavAnchorMetrics'

const HASH_SCROLL_MAX_RETRIES = 40
const HASH_SCROLL_RETRY_MS = 50
const PAST_HERO_BODY_CLASS = 'ecotone-exp-past-hero'

/**
 * Soqtapata experience page: hide main header Book CTA when in-page CTA is "competing" (sticky subnav at top).
 * Also sets --anchor-offset for `html` scroll-padding-top so in-page #anchors land below the fixed top nav and sticky #pageNav.
 *
 * Mobile in-page drawer: `InPageNavDrawerClient` (paired with `InPageNav`).
 *
 * `ecotone-exp-past-hero`: cuando el hero (#top) ha salido por arriba — el #topNav se oculta vía CSS y el #pageNav pasa a `position: fixed; top: 0`
 * (ver experience-surface.css). El offset de anclas usa solo la altura del subnav, sin --nav-h del header principal.
 */
export function ExperiencePageChromeClient() {
  useEffect(() => {
    const effectiveMainNavH = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--nav-h').trim()
      const n = parseInt(v, 10)
      return Number.isFinite(n) && n > 20 ? n : 64
    }

    let pnavRo: ResizeObserver | undefined
    const pageNav = document.getElementById('pageNav')
    if (pageNav && typeof ResizeObserver !== 'undefined') {
      pnavRo = new ResizeObserver(() => {
        refreshInPageNavAnchorMetrics()
      })
      pnavRo.observe(pageNav)
    }

    const topNav = document.getElementById('topNav')

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
      refreshInPageNavAnchorMetrics()
      setPnavStuck()
      requestAnimationFrame(() => {
        refreshInPageNavAnchorMetrics()
        setPnavStuck()
        const w = window as unknown as { __ecotoneExpSyncPnav?: () => void }
        w.__ecotoneExpSyncPnav?.()
      })
    }

    /** Re-scroll to hash target after #reviews (React) or layout is ready. */
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
        refreshInPageNavAnchorMetrics()
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

    refreshInPageNavAnchorMetrics()
    fixHashScroll(0)
    updatePastHero()

    const onHashChange = () => fixHashScroll(0)
    window.addEventListener('hashchange', onHashChange)

    const onLayoutLoad = () => {
      refreshInPageNavAnchorMetrics()
      fixHashScroll(0)
      updatePastHero()
    }
    window.addEventListener('load', onLayoutLoad, { once: true })

    const onScroll = () => {
      updatePastHero()
    }
    const onResize = () => {
      updatePastHero()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    onScroll()
    onResize()

    return () => {
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
      if (topNav) topNav.removeAttribute('aria-hidden')
    }
  }, [])

  return null
}
