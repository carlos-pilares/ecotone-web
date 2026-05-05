'use client'

import { useEffect, useRef } from 'react'

function isDesktopNav(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(min-width: 721px)').matches
}

function closeAllMega() {
  document.getElementById('navOverlay')?.classList.remove('visible')
  document.getElementById('site-nav-dd-experiences')?.classList.remove('open')
  document.getElementById('site-nav-dd-lodges')?.classList.remove('open')
  document.querySelectorAll('.nav-link-btn.open').forEach((b) => b.classList.remove('open'))
}

function wireSidebar(dd: HTMLElement) {
  const items = dd.querySelectorAll<HTMLElement>('.dd-sb-item[data-panel]')
  const activate = (item: HTMLElement) => {
    dd.querySelectorAll('.dd-sb-item').forEach((i) => i.classList.remove('active'))
    dd.querySelectorAll('.dd-panel').forEach((p) => p.classList.remove('active'))
    item.classList.add('active')
    const pid = item.dataset.panel
    if (pid) document.getElementById(pid)?.classList.add('active')
  }
  items.forEach((item) => {
    const hEnter = () => activate(item)
    const hClick = (e: Event) => {
      e.preventDefault()
      activate(item)
    }
    item.addEventListener('mouseenter', hEnter)
    item.addEventListener('click', hClick)
  })
}

/**
 * Desktop mega hover + overlay/Escape; mobile hamburger + drawer + accordions.
 * Markup lives in `SiteHeader`; this module attaches listeners (DOM ids).
 */
export function SiteHeaderShellClient() {
  const openKeyRef = useRef<'exp' | 'lodges' | null>(null)

  useEffect(() => {
    const overlay = document.getElementById('navOverlay')
    const ddExp = document.getElementById('site-nav-dd-experiences')
    const ddLodges = document.getElementById('site-nav-dd-lodges')
    const ham = document.getElementById('ham')
    const drawer = document.getElementById('drawer')

    if (ddExp) wireSidebar(ddExp)
    if (ddLodges) wireSidebar(ddLodges)

    const openMega = (which: 'exp' | 'lodges', btn: HTMLElement) => {
      if (!isDesktopNav()) return
      closeAllMega()
      openKeyRef.current = which
      if (which === 'exp') ddExp?.classList.add('open')
      else ddLodges?.classList.add('open')
      overlay?.classList.add('visible')
      btn.classList.add('open')
    }

    const toggleMegaClick = (which: 'exp' | 'lodges', btn: HTMLElement) => {
      if (!isDesktopNav()) return
      if (openKeyRef.current === which && (which === 'exp' ? ddExp?.classList.contains('open') : ddLodges?.classList.contains('open'))) {
        closeAllMega()
        openKeyRef.current = null
        return
      }
      openMega(which, btn)
    }

    const onBtnEnter = (which: 'exp' | 'lodges', btn: HTMLElement) => {
      if (!isDesktopNav()) return
      openMega(which, btn)
    }

    const btnExp = document.getElementById('site-nav-btn-experiences')
    const btnLodges = document.getElementById('site-nav-btn-lodges')
    const cleanups: Array<() => void> = []

    if (btnExp) {
      const h = () => onBtnEnter('exp', btnExp)
      const c = () => toggleMegaClick('exp', btnExp)
      btnExp.addEventListener('mouseenter', h)
      btnExp.addEventListener('click', c)
      cleanups.push(() => {
        btnExp.removeEventListener('mouseenter', h)
        btnExp.removeEventListener('click', c)
      })
    }
    if (btnLodges) {
      const h = () => onBtnEnter('lodges', btnLodges)
      const c = () => toggleMegaClick('lodges', btnLodges)
      btnLodges.addEventListener('mouseenter', h)
      btnLodges.addEventListener('click', c)
      cleanups.push(() => {
        btnLodges.removeEventListener('mouseenter', h)
        btnLodges.removeEventListener('click', c)
      })
    }

    const onOverlayClick = () => {
      closeAllMega()
      openKeyRef.current = null
    }
    overlay?.addEventListener('click', onOverlayClick)
    cleanups.push(() => overlay?.removeEventListener('click', onOverlayClick))

    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllMega()
        openKeyRef.current = null
        drawer?.classList.remove('open')
        ham?.classList.remove('open')
        document.body.style.overflow = ''
        document.body.classList.remove('site-header-drawer-open')
        document.querySelectorAll('.mob-acc-content.open').forEach((c) => c.classList.remove('open'))
        document.querySelectorAll('.mob-acc-btn.open').forEach((b) => b.classList.remove('open'))
      }
    }
    document.addEventListener('keydown', onDocKey)
    cleanups.push(() => document.removeEventListener('keydown', onDocKey))

    const onPointerDown = (e: PointerEvent) => {
      if (!isDesktopNav()) return
      const t = e.target as Node | null
      if (!t) return
      const topNav = document.getElementById('topNav')
      const openDd = document.querySelector('.nav-dropdown.open')
      if (topNav?.contains(t) || openDd?.contains(t)) return
      closeAllMega()
      openKeyRef.current = null
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    cleanups.push(() => document.removeEventListener('pointerdown', onPointerDown, true))

    const closeDrawer = () => {
      drawer?.classList.remove('open')
      ham?.classList.remove('open')
      document.body.style.overflow = ''
      document.body.classList.remove('site-header-drawer-open')
    }

    const onHam = () => {
      if (!drawer || !ham) return
      const open = drawer.classList.toggle('open')
      ham.classList.toggle('open', open)
      document.body.style.overflow = open ? 'hidden' : ''
      document.body.classList.toggle('site-header-drawer-open', open)
    }
    ham?.addEventListener('click', onHam)
    cleanups.push(() => ham?.removeEventListener('click', onHam))

    const onDrawerLink = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null
      if (el?.closest('a')) closeDrawer()
    }
    drawer?.addEventListener('click', onDrawerLink)
    cleanups.push(() => drawer?.removeEventListener('click', onDrawerLink))

    const toggleAcc = (btn: HTMLElement) => {
      const panelId = btn.getAttribute('data-mob-acc-panel')
      if (!panelId || !drawer) return
      const panel = document.getElementById(panelId)
      const isOpen = btn.classList.contains('open')
      drawer.querySelectorAll('.mob-acc-content.open').forEach((c) => c.classList.remove('open'))
      drawer.querySelectorAll('.mob-acc-btn.open').forEach((b) => b.classList.remove('open'))
      if (!isOpen && panel) {
        panel.classList.add('open')
        btn.classList.add('open')
      }
    }
    drawer?.querySelectorAll<HTMLElement>('.mob-acc-btn[data-mob-acc-panel]').forEach((btn) => {
      const h = () => toggleAcc(btn)
      btn.addEventListener('click', h)
      cleanups.push(() => btn.removeEventListener('click', h))
    })

    return () => {
      cleanups.forEach((fn) => fn())
      document.body.style.overflow = ''
      document.body.classList.remove('site-header-drawer-open')
    }
  }, [])

  return null
}
