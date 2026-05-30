'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { AnnouncementBarDoc } from '@/lib/promotionTypes'
import { refreshInPageNavAnchorMetrics } from '@/lib/inPageNavAnchorMetrics'
import { resolveAnnouncementBar } from '@/lib/resolveAnnouncementBar'

type AnnouncementBarProps = {
  settings: AnnouncementBarDoc | null
}

function syncAnnouncementHeight(el: HTMLElement | null, active: boolean) {
  const root = document.documentElement
  if (!active || !el) {
    root.style.setProperty('--announcement-h', '0px')
    document.body.classList.remove('has-announcement-bar')
    refreshInPageNavAnchorMetrics()
    return
  }
  const h = Math.round(el.getBoundingClientRect().height)
  root.style.setProperty('--announcement-h', `${h}px`)
  document.body.classList.add('has-announcement-bar')
  refreshInPageNavAnchorMetrics()
}

/** Compact site-wide announcement row — fixed below the main nav, offset via `--header-stack-h`. */
export function AnnouncementBar({ settings }: AnnouncementBarProps) {
  const pathname = usePathname() ?? '/'
  const barRef = useRef<HTMLElement>(null)
  const [dismissed, setDismissed] = useState(true)

  const resolved = settings ? resolveAnnouncementBar(settings, pathname) : null
  const visible = Boolean(resolved?.visible && !dismissed)

  useEffect(() => {
    if (!resolved?.visible) {
      setDismissed(true)
      return
    }
    if (!resolved.dismissible) {
      setDismissed(false)
      return
    }
    try {
      const stored = window.localStorage.getItem(resolved.storageKey)
      setDismissed(stored === '1')
    } catch {
      setDismissed(false)
    }
  }, [resolved?.visible, resolved?.dismissible, resolved?.storageKey, pathname])

  useEffect(() => {
    if (!visible) {
      syncAnnouncementHeight(null, false)
      return
    }
    const el = barRef.current
    if (!el) return

    syncAnnouncementHeight(el, true)

    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => syncAnnouncementHeight(el, true))
    ro.observe(el)
    return () => {
      ro.disconnect()
      syncAnnouncementHeight(null, false)
    }
  }, [visible, resolved?.message, resolved?.secondaryText, resolved?.cta?.label])

  const onDismiss = useCallback(() => {
    if (!resolved?.dismissible) return
    try {
      window.localStorage.setItem(resolved.storageKey, '1')
    } catch {
      /* ignore */
    }
    setDismissed(true)
  }, [resolved?.dismissible, resolved?.storageKey])

  if (!resolved?.visible || dismissed) return null

  const cta = resolved.cta

  return (
    <aside ref={barRef} className="announcement-bar" role="region" aria-label="Site announcement">
      <div className="announcement-bar__inner">
        <div className="announcement-bar__copy">
          <p className="announcement-bar__message">{resolved.message}</p>
          {resolved.secondaryText ? (
            <p className="announcement-bar__secondary">{resolved.secondaryText}</p>
          ) : null}
        </div>
        {cta ? (
          cta.href.startsWith('/') ? (
            <Link
              href={cta.href}
              className="announcement-bar__cta"
              target={cta.openInNewTab ? '_blank' : undefined}
              rel={cta.rel || undefined}
            >
              {cta.label}
            </Link>
          ) : (
            <a
              href={cta.href}
              className="announcement-bar__cta"
              target={cta.openInNewTab ? '_blank' : undefined}
              rel={cta.rel || undefined}
            >
              {cta.label}
            </a>
          )
        ) : null}
        {resolved.dismissible ? (
          <button type="button" className="announcement-bar__dismiss" onClick={onDismiss} aria-label="Dismiss announcement">
            ×
          </button>
        ) : null}
      </div>
    </aside>
  )
}
