import type { ReactNode } from 'react'

import { normalizeHashHref } from '@/lib/inPageNavScroll'

export type InPageNavLink = {
  href: string
  label: string
  dataActiveWhen?: string
}

export type InPageNavProps = {
  title: string
  subtitle: string
  links: InPageNavLink[]
  activeHref: string
  onLinkClick?: (href: string) => void
  cta?: { href: string; label: string }
  /** When set, replaces the default single CTA anchor (e.g. Experience: price + Book). */
  ctaSlot?: ReactNode
  /** Optional mobile-only text appended to the subtitle, e.g. Experience price. */
  mobileMetaSlot?: ReactNode
  mode: 'lodge' | 'experience'
  /** Extra classes on `<nav>` (e.g. scrolled toggled by parent). */
  navClassName?: string
}

/**
 * Shared sticky sub-page nav. Mobile (≤719px): Apple-style compact bar + chevron + panel + scrim (`InPageNavDrawerClient`).
 * Experience adds `exp-soqtapata-pnav` for price+Book CTA spacing.
 */
export function InPageNav({
  title,
  subtitle,
  links,
  activeHref,
  onLinkClick,
  cta,
  ctaSlot,
  mobileMetaSlot,
  mode,
  navClassName,
}: InPageNavProps) {
  const isExperience = mode === 'experience'
  const navActive = normalizeHashHref(activeHref)

  return (
    <>
      <nav
        className={[
          'ipnav',
          'page-nav',
          'lodge-page-nav',
          'ipnav--mobile-drawer',
          isExperience ? 'exp-soqtapata-pnav' : '',
          navClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        id="pageNav"
        aria-label="On this page"
      >
        <div className="page-nav-inner">
          <div className="page-nav-left">
            <div className="page-nav-title">{title}</div>
            <div className="page-nav-sub">
              <span className="page-nav-sub-text">{subtitle}</span>
              {mobileMetaSlot ? (
                <>
                  <span className="page-nav-mobile-meta-sep" aria-hidden="true">
                    |
                  </span>
                  <span className="page-nav-mobile-meta">{mobileMetaSlot}</span>
                </>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            className="pnav-mobile-toggle"
            id="pnavMobileToggle"
            aria-label="Page sections"
            aria-expanded="false"
            aria-controls="pageNavCols"
          >
            <svg
              className="pnav-mobile-chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div className="page-nav-links page-nav-cols" id="pageNavCols">
            {links.map((l) => {
              const active = normalizeHashHref(l.href) === navActive
              return (
                <a
                  key={l.href + l.label}
                  href={l.href}
                  className={['ipnav-link', 'pnav-top', active ? 'ipnav-link--active' : ''].filter(Boolean).join(' ')}
                  {...(l.dataActiveWhen != null && l.dataActiveWhen !== ''
                    ? { 'data-active-when': l.dataActiveWhen }
                    : {})}
                  aria-current={active ? 'location' : undefined}
                  onClick={() => onLinkClick?.(l.href)}
                >
                  {l.label}
                </a>
              )
            })}
          </div>
          <div className="pnav-cta">
            {ctaSlot ??
              (cta && cta.href.trim() && cta.label.trim() ? (
                <a href={cta.href} className="btn btn-primary" style={{ fontSize: 12, padding: '8px 18px' }}>
                  {cta.label}
                </a>
              ) : null)}
          </div>
        </div>
      </nav>
      <div id="pnavScrollShim" className="pnav-scroll-shim" aria-hidden="true" />
      <div className="pnav-mobile-scrim" id="pnavMobileScrim" aria-hidden="true" />
    </>
  )
}
