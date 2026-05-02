'use client'

import { useEffect } from 'react'

import { refreshInPageNavAnchorMetrics } from '@/lib/inPageNavAnchorMetrics'

const MQ_MOBILE_PNAV = '(max-width: 719px)'
/** Synced with `experience-surface.css` (mobile drawer blur / a11y). */
const PNAV_MOBILE_DRAWER_OPEN_BODY_CLASS = 'pnav-mobile-drawer-open'

/**
 * Mobile in-page nav: compact bar, chevron, link panel, scrim, a11y — Lodge + Experience.
 * Pair with `InPageNav` (`ipnav--mobile-drawer`, `#pnavMobileToggle`, `#pageNavCols`).
 */
export function InPageNavDrawerClient() {
  useEffect(() => {
    const pageNav = document.getElementById('pageNav')
    const pnavEls = {
      root: pageNav,
      btn: document.getElementById('pnavMobileToggle') as HTMLButtonElement | null,
      cols: document.getElementById('pageNavCols') as HTMLDivElement | null,
    }
    const mqMobilePnav = window.matchMedia(MQ_MOBILE_PNAV)

    const setMobilePnavOpen = (open: boolean) => {
      if (!pnavEls.root || !pnavEls.btn || !pnavEls.cols) return
      pnavEls.root.classList.toggle('pnav-mobile-open', open)
      document.body.classList.toggle(
        PNAV_MOBILE_DRAWER_OPEN_BODY_CLASS,
        open && mqMobilePnav.matches,
      )
      pnavEls.btn.setAttribute('aria-expanded', open ? 'true' : 'false')
      if (mqMobilePnav.matches && !open) {
        pnavEls.cols.setAttribute('aria-hidden', 'true')
      } else {
        pnavEls.cols.removeAttribute('aria-hidden')
      }
      pnavEls.cols.querySelectorAll<HTMLAnchorElement>('a.ipnav-link[href^="#"]').forEach((a) => {
        a.tabIndex = !mqMobilePnav.matches || open ? 0 : -1
      })
      pnavEls.btn.tabIndex = mqMobilePnav.matches ? 0 : -1
      refreshInPageNavAnchorMetrics()
      requestAnimationFrame(() => refreshInPageNavAnchorMetrics())
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
      pnavEls.cols.querySelectorAll<HTMLAnchorElement>('a.ipnav-link[href^="#"]').forEach((a) => {
        a.tabIndex = !mobile || open ? 0 : -1
      })
    }

    const onPnavMobileToggle = () => {
      if (!pnavEls.root || !mqMobilePnav.matches) return
      const open = !pnavEls.root.classList.contains('pnav-mobile-open')
      setMobilePnavOpen(open)
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
        refreshInPageNavAnchorMetrics()
        requestAnimationFrame(() => refreshInPageNavAnchorMetrics())
      }
    }
    pnavEls.cols?.addEventListener('click', onPnavHashLink)

    const onDocClickClosePnav = (e: MouseEvent) => {
      if (!mqMobilePnav.matches || !pnavEls.root?.classList.contains('pnav-mobile-open')) return
      const target = e.target
      if (target instanceof Node && pnavEls.root?.contains(target)) return
      setMobilePnavOpen(false)
    }
    document.addEventListener('click', onDocClickClosePnav, true)

    const onKeydownClosePnav = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !mqMobilePnav.matches) return
      if (!pnavEls.root?.classList.contains('pnav-mobile-open')) return
      setMobilePnavOpen(false)
      pnavEls.btn?.focus()
    }
    document.addEventListener('keydown', onKeydownClosePnav)

    const onMqMobilePnavChange = () => {
      if (!mqMobilePnav.matches) {
        pnavEls.root?.classList.remove('pnav-mobile-open')
        document.body.classList.remove(PNAV_MOBILE_DRAWER_OPEN_BODY_CLASS)
      }
      syncMobilePnavA11y()
      refreshInPageNavAnchorMetrics()
      requestAnimationFrame(() => refreshInPageNavAnchorMetrics())
    }
    if (typeof mqMobilePnav.addEventListener === 'function') {
      mqMobilePnav.addEventListener('change', onMqMobilePnavChange)
    } else {
      mqMobilePnav.addListener(onMqMobilePnavChange)
    }
    syncMobilePnavA11y()

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
      document.body.classList.remove(PNAV_MOBILE_DRAWER_OPEN_BODY_CLASS)
      if (pnavEls.btn) pnavEls.btn.tabIndex = 0
      pnavEls.cols?.querySelectorAll<HTMLAnchorElement>('a.ipnav-link[href^="#"]').forEach((a) => {
        a.removeAttribute('tabindex')
      })
    }
  }, [])

  return null
}
