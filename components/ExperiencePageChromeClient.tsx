'use client'

import { useEffect } from 'react'

const ANCHOR_GAP = 8
const HASH_SCROLL_MAX_RETRIES = 40
const HASH_SCROLL_RETRY_MS = 50
const PAST_HERO_BODY_CLASS = 'ecotone-exp-past-hero'

/**
 * Soqtapata experience page: wildlife strip overflow + centering; hide main header Book CTA when in-page CTA is "competing" (sticky subnav at top).
 * Also sets --anchor-offset for `html` scroll-padding-top so in-page #anchors land below the fixed top nav and sticky #pageNav.
 *
 * `ecotone-exp-past-hero` toggles a slightly stronger subnav shadow once the gallery hero has scrolled away; the global `#topNav` stays
 * visible and fixed (same as Home) — the in-page bar remains `position: sticky` with `top: var(--nav-h)`.
 */
export function ExperiencePageChromeClient() {
  useEffect(() => {
    const effectiveMainNavH = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--nav-h').trim()
      const n = parseInt(v, 10)
      return Number.isFinite(n) && n > 20 ? n : 64
    }

    const setAnchorOffset = () => {
      const pageNav = document.getElementById('pageNav')
      const h = pageNav ? pageNav.getBoundingClientRect().height : 0
      const v = Math.round(effectiveMainNavH() + h + ANCHOR_GAP)
      document.documentElement.style.setProperty('--anchor-offset', `${v}px`)
    }

    const syncPnavScrollShim = () => {
      const shim = document.getElementById('pnavScrollShim') as HTMLElement | null
      shim?.style.removeProperty('height')
    }

    let pnavRo: ResizeObserver | undefined
    const pageNav = document.getElementById('pageNav')
    if (pageNav && typeof ResizeObserver !== 'undefined') {
      pnavRo = new ResizeObserver(() => {
        setAnchorOffset()
        syncPnavScrollShim()
      })
      pnavRo.observe(pageNav)
    }

    const topNav = document.getElementById('topNav')

    const setWildlifeScroll = () => {
      const wrap = document.getElementById('wildlifeHscroll')
      const h = wrap?.querySelector<HTMLElement>('.hscroll')
      if (!wrap || !h) return
      const overflow = h.scrollWidth > h.clientWidth + 1
      wrap.classList.toggle('wildlife-hscroll--overflow', overflow)
    }

    const setPnavStuck = () => {
      const el = document.getElementById('pageNav')
      if (!el) {
        document.body.classList.remove('ecotone-pnav-stuck')
        return
      }
      const t = el.getBoundingClientRect().top
      const h = effectiveMainNavH()
      // Sticky in-page bar is pinned when its top is flush with the main nav bottom edge
      const stuck = t <= h + 0.5
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

    const onHashChange = () => fixHashScroll(0)
    window.addEventListener('hashchange', onHashChange)

    const onLayoutLoad = () => {
      setAnchorOffset()
      syncPnavScrollShim()
      setWildlifeScroll()
      fixHashScroll(0)
      updatePastHero()
    }
    window.addEventListener('load', onLayoutLoad, { once: true })

    let hRo: ResizeObserver | undefined
    const wildlifeH = document.getElementById('wildlifeHscroll')?.querySelector<HTMLElement>('.hscroll')
    if (wildlifeH && typeof ResizeObserver !== 'undefined') {
      hRo = new ResizeObserver(() => setWildlifeScroll())
      hRo.observe(wildlifeH)
    }
    setWildlifeScroll()

    /** Mobile (≤719px): single-height sticky bar; chevron opens section links in a panel (see experience-surface.css / #pageNav). */
    const pnavEls = {
      root: pageNav,
      btn: document.getElementById('pnavMobileToggle') as HTMLButtonElement | null,
      cols: document.getElementById('pageNavCols') as HTMLDivElement | null,
    }
    const mqMobilePnav = window.matchMedia('(max-width: 719px)')

    const setMobilePnavOpen = (open: boolean) => {
      if (!pnavEls.root || !pnavEls.btn || !pnavEls.cols) return
      pnavEls.root.classList.toggle('pnav-mobile-open', open)
      pnavEls.btn.setAttribute('aria-expanded', open ? 'true' : 'false')
      if (mqMobilePnav.matches && !open) {
        pnavEls.cols.setAttribute('aria-hidden', 'true')
      } else {
        pnavEls.cols.removeAttribute('aria-hidden')
      }
      pnavEls.cols.querySelectorAll<HTMLAnchorElement>('a.pnav-top[href^="#"]').forEach((a) => {
        a.tabIndex = !mqMobilePnav.matches || open ? 0 : -1
      })
      pnavEls.btn.tabIndex = mqMobilePnav.matches ? 0 : -1
    }

    const syncMobilePnavA11y = () => {
      if (!pnavEls.btn || !pnavEls.cols) return
      const mobile = mqMobilePnav.matches
      pnavEls.btn.tabIndex = mobile ? 0 : -1
      const open = mobile && pnavEls.root?.classList.contains('pnav-mobile-open')
      if (mobile && !open) {
        pnavEls.cols.setAttribute('aria-hidden', 'true')
      } else {
        pnavEls.cols.removeAttribute('aria-hidden')
      }
      pnavEls.cols.querySelectorAll<HTMLAnchorElement>('a.pnav-top[href^="#"]').forEach((a) => {
        a.tabIndex = !mobile || open ? 0 : -1
      })
    }

    const onPnavMobileToggle = () => {
      if (!pnavEls.root || !mqMobilePnav.matches) return
      const open = !pnavEls.root.classList.contains('pnav-mobile-open')
      setMobilePnavOpen(open)
      setAnchorOffset()
      requestAnimationFrame(() => {
        syncPnavScrollShim()
        setAnchorOffset()
      })
    }
    pnavEls.btn?.addEventListener('click', onPnavMobileToggle)

    const onPnavHashLink = (e: MouseEvent) => {
      if (!mqMobilePnav.matches || !pnavEls.cols) return
      const raw = e.target
      const el =
        raw instanceof Element ? raw : raw instanceof Text ? raw.parentElement : null
      const t = el?.closest('a[href^="#"]')
      if (t && pnavEls.cols.contains(t)) {
        setMobilePnavOpen(false)
        setAnchorOffset()
        requestAnimationFrame(() => {
          const w = window as unknown as { __ecotoneExpSyncPnav?: () => void }
          w.__ecotoneExpSyncPnav?.()
        })
      }
    }
    pnavEls.cols?.addEventListener('click', onPnavHashLink)

    const onDocClickClosePnav = (e: MouseEvent) => {
      if (!mqMobilePnav.matches || !pnavEls.root?.classList.contains('pnav-mobile-open')) return
      const target = e.target
      if (target instanceof Node && pnavEls.root?.contains(target)) return
      setMobilePnavOpen(false)
      setAnchorOffset()
    }
    document.addEventListener('click', onDocClickClosePnav, true)

    const onKeydownClosePnav = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !mqMobilePnav.matches) return
      if (!pnavEls.root?.classList.contains('pnav-mobile-open')) return
      setMobilePnavOpen(false)
      setAnchorOffset()
      pnavEls.btn?.focus()
    }
    document.addEventListener('keydown', onKeydownClosePnav)

    const onMqMobilePnavChange = () => {
      if (!mqMobilePnav.matches) {
        setMobilePnavOpen(false)
      }
      syncMobilePnavA11y()
      setAnchorOffset()
      requestAnimationFrame(() => {
        syncPnavScrollShim()
        setAnchorOffset()
      })
    }
    if (typeof mqMobilePnav.addEventListener === 'function') {
      mqMobilePnav.addEventListener('change', onMqMobilePnavChange)
    } else {
      mqMobilePnav.addListener(onMqMobilePnavChange)
    }
    syncMobilePnavA11y()

    const onScroll = () => {
      updatePastHero()
      if (mqMobilePnav.matches && pnavEls.root?.classList.contains('pnav-mobile-open')) {
        setMobilePnavOpen(false)
        setAnchorOffset()
        requestAnimationFrame(() => {
          syncPnavScrollShim()
          setAnchorOffset()
        })
      }
    }
    const onResize = () => {
      updatePastHero()
      setWildlifeScroll()
      onMqMobilePnavChange()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    onScroll()
    onResize()

    return () => {
      pnavEls.btn?.removeEventListener('click', onPnavMobileToggle)
      pnavEls.cols?.removeEventListener('click', onPnavHashLink)
      document.removeEventListener('click', onDocClickClosePnav, true)
      document.removeEventListener('keydown', onKeydownClosePnav)
      if (typeof mqMobilePnav.addEventListener === 'function') {
        mqMobilePnav.removeEventListener('change', onMqMobilePnavChange)
      } else {
        mqMobilePnav.removeListener?.(onMqMobilePnavChange)
      }
      pnavEls.root?.classList.remove('pnav-mobile-open')
      document.getElementById('pnavScrollShim')?.style.removeProperty('height')
      if (pnavEls.btn) pnavEls.btn.tabIndex = 0
      pnavEls.cols?.querySelectorAll<HTMLAnchorElement>('a.pnav-top[href^="#"]').forEach((a) => {
        a.removeAttribute('tabindex')
      })
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('load', onLayoutLoad)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      hRo?.disconnect()
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
