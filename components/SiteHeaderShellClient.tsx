'use client'

import { useEffect, useRef } from 'react'

function isDesktopNav(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(min-width: 721px)').matches
}

function closeAllMega() {
  document.getElementById('navOverlay')?.classList.remove('visible')
  document.querySelectorAll('.site-header-desktop-dd.nav-dropdown.open').forEach((dd) => dd.classList.remove('open'))
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
  const openDdIdRef = useRef<string | null>(null)

  useEffect(() => {
    const overlay = document.getElementById('navOverlay')
    const ham = document.getElementById('ham')
    const drawer = document.getElementById('drawer')

    const ddButtons = document.querySelectorAll<HTMLElement>('.nav-link-btn[aria-controls]')
    const cleanups: Array<() => void> = []

    ddButtons.forEach((btn) => {
      const ddId = btn.getAttribute('aria-controls')
      if (!ddId) return
      const dd = document.getElementById(ddId)
      if (!dd) return

      wireSidebar(dd)

      const openMega = () => {
        if (!isDesktopNav()) return
        closeAllMega()
        openDdIdRef.current = ddId
        dd.classList.add('open')
        overlay?.classList.add('visible')
        btn.classList.add('open')
      }

      const toggleMegaClick = () => {
        if (!isDesktopNav()) return
        if (openDdIdRef.current === ddId && dd.classList.contains('open')) {
          closeAllMega()
          openDdIdRef.current = null
          return
        }
        openMega()
      }

      const onEnter = () => openMega()
      btn.addEventListener('mouseenter', onEnter)
      btn.addEventListener('click', toggleMegaClick)
      cleanups.push(() => {
        btn.removeEventListener('mouseenter', onEnter)
        btn.removeEventListener('click', toggleMegaClick)
      })
    })

    const onOverlayClick = () => {
      closeAllMega()
      openDdIdRef.current = null
    }
    overlay?.addEventListener('click', onOverlayClick)
    cleanups.push(() => overlay?.removeEventListener('click', onOverlayClick))

    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllMega()
        openDdIdRef.current = null
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
      openDdIdRef.current = null
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
