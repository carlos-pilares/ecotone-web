import '@/app/site-header-mega.css'

import { getSiteHeaderNav } from '@/lib/getSiteHeaderNav'
import { getSiteSettingsShell } from '@/lib/getSiteSettingsShell'
import { resolveHeaderLogoDarkUrl } from '@/lib/headerLogoPublic'
import type { ResolvedSiteHeaderNav } from '@/lib/resolveSiteHeaderNavData'

import { SiteHeaderLogoCms } from '@/components/SiteHeaderLogoCms'
import { SiteHeaderNavBookButtons } from '@/components/SiteHeaderNavBookButtons'
import { SiteHeaderShellClient } from '@/components/SiteHeaderShellClient'

function InlineHeaderLogo() {
  return (
    <>
      <svg
        className="nav-logo-isotipo"
        viewBox="0 0 105 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="navIsotipo"
      >
        <use href="#isotipo" style={{ color: 'var(--cream)' }} />
      </svg>
      <svg
        className="nav-logo-wordmark"
        id="navWordmark"
        viewBox="0 0 176 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: 20 }}
      >
        <path
          d="M8.08002 33.61L20.73 28.67V35.43H0V1.40997H18.01V7.16998L8.08002 3.21997V15.15H15.93V17.78H8.08002V33.61Z"
          fill="#ECE5D5"
        />
        <path
          d="M44.7401 16.55L36.6201 10.2C32.9001 11.38 30.5401 15.51 30.5401 20.4C30.5401 26.48 34.5801 30.29 39.1101 30.29C42.1001 30.29 44.6001 29.29 46.4601 27.02L46.9101 27.34C45.2801 32.15 41.3801 35.87 35.3901 35.87C28.5001 35.87 22.8301 30.29 22.8301 22.63C22.8301 14.97 28.6801 8.62 37.4801 8.62C40.6101 8.62 43.1901 9.52999 44.7401 10.43V16.55Z"
          fill="#ECE5D5"
        />
        <path
          d="M76.8098 22.04C76.8098 29.75 71.1398 35.87 63.2498 35.87C55.3598 35.87 49.0098 30.06 49.0098 22.54C49.0098 14.87 54.5398 8.62 62.6198 8.62C70.6398 8.62 76.8098 14.56 76.8098 22.04ZM69.4198 25.4C69.4198 22.59 68.5998 19.73 67.1498 17.28C65.2898 14.15 62.5198 11.7 59.1698 10.79C57.2198 12.6 56.3998 15.82 56.3998 19.04C56.3998 21.94 57.3098 24.94 58.8498 27.48C60.7098 30.43 63.4298 32.74 66.6998 33.65C68.6498 31.84 69.4198 28.62 69.4198 25.4Z"
          fill="#ECE5D5"
        />
        <path d="M87.3998 0V9.07001H92.6198V12.93H87.3998V35.43H79.7798V6.17999L87.3998 0Z" fill="#ECE5D5" />
        <path
          d="M120.89 22.04C120.89 29.75 115.22 35.87 107.33 35.87C99.4398 35.87 93.0898 30.06 93.0898 22.54C93.0898 14.87 98.6198 8.62 106.7 8.62C114.73 8.62 120.89 14.56 120.89 22.04ZM113.5 25.4C113.5 22.59 112.68 19.73 111.23 17.28C109.37 14.15 106.6 11.7 103.25 10.79C101.3 12.6 100.48 15.82 100.48 19.04C100.48 21.94 101.39 24.94 102.93 27.48C104.79 30.43 107.51 32.74 110.78 33.65C112.73 31.84 113.5 28.62 113.5 25.4Z"
          fill="#ECE5D5"
        />
        <path
          d="M124.27 35.42V9.07001H131.89V12.11C135.7 10.02 138.74 8.62 141.46 8.62C145.41 8.62 147.45 11.02 147.45 15.11V35.43H139.83V15.97C139.83 13.61 138.88 12.34 136.79 12.34C135.7 12.34 134.3 12.52 131.89 13.7V35.43H124.27V35.42Z"
          fill="#ECE5D5"
        />
        <path
          d="M163.88 35.88C156.31 35.88 150.55 30.3 150.55 22.41C150.55 13.93 156.85 8.62 163.11 8.62C170.55 8.62 174.31 13.9299 175.08 19.0099H158.16C158.16 19.2399 158.16 19.51 158.16 19.78C158.16 26.67 162.24 30.3 167.32 30.3C170.45 30.3 172.85 29.08 174.71 26.81L175.16 27.17C173.77 31.43 169.91 35.88 163.88 35.88ZM158.39 16.69H167.69C166.83 14.01 164.47 11.11 161.2 10.52C159.93 11.66 158.85 13.7 158.39 16.69Z"
          fill="#ECE5D5"
        />
      </svg>
    </>
  )
}

function ChevSm() {
  return (
    <svg className="nav-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ChevSb() {
  return (
    <svg className="dd-sb-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function ArrowSeeAll() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="2" y1="6" x2="10" y2="6" />
      <polyline points="7 3 10 6 7 9" />
    </svg>
  )
}

function defaultActivePanel(groups: { panelId: string; items: readonly unknown[] }[]): string {
  return groups.find((g) => g.items.length > 0)?.panelId ?? groups[0]!.panelId
}

function defaultActiveLodgeRoute(routes: { panelId: string; lodges: readonly unknown[] }[]): string {
  return routes.find((r) => r.lodges.length > 0)?.panelId ?? routes[0]!.panelId
}

/** Route label only (server `routeLine` may append duration after " · "). */
function navExpRouteLineOnly(routeLine: string): string {
  const first = routeLine.split(' · ')[0]?.trim()
  return first || routeLine.trim()
}

/** Desktop mega: duration + price (and similar), never repeating the route pill. */
function navExpDurationPriceMeta(metaLine: string, routeOnly: string): string {
  const r = routeOnly.trim().toLowerCase()
  const parts = metaLine
    .split(' · ')
    .map((s) => s.trim())
    .filter((s) => s && s.toLowerCase() !== r)
  let out = parts.join(' · ')
  out = out.replace(/\bfrom\s+usd\b/gi, 'USD')
  out = out.replace(/\$(\d[\d,]*)\b/g, 'USD $1')
  return out.trim()
}

/** Mobile drawer: hide route/price/duration echo that duplicates title or booking (no $ in global menu). */
function navExpMetaSansBooking(metaLine: string, routeOnly: string): string {
  const r = routeOnly.trim().toLowerCase()
  return metaLine
    .split(' · ')
    .map((s) => s.trim())
    .filter((s) => {
      if (!s) return false
      if (s.toLowerCase() === r) return false
      if (/^\d+[DdNn](\s*[·•]\s*\d+[DdNn])?$/.test(s)) return false
      if (/^\d+[Dd]\s*[·•]\s*\d+[Nn]$/i.test(s)) return false
      if (/^from\s+usd/i.test(s)) return false
      if (/^\$\d/.test(s)) return false
      if (/^usd\s*\d/i.test(s)) return false
      if (/^\d{2,5}$/.test(s)) return false
      return true
    })
    .join(' · ')
}

function ExperiencesMega({ nav }: { nav: ResolvedSiteHeaderNav['experiences'] }) {
  const groupActive = defaultActivePanel(nav.groups)
  const allGroupsEmpty = nav.groups.every((g) => g.items.length === 0)
  const active = allGroupsEmpty ? nav.tailor.panelId : groupActive
  return (
    <div className="nav-dropdown site-header-desktop-dd" id="site-nav-dd-experiences" role="navigation" aria-label="Experiences menu">
      <div className="nav-dd-inner">
        <div className="dd-sidebar">
          <div className="dd-sb-head">Programs</div>
          {nav.groups.map((g) => (
            <button
              key={g.panelId}
              type="button"
              className={'dd-sb-item' + (g.panelId === active ? ' active' : '')}
              data-panel={g.panelId}
            >
              <div>
                <span className="dd-sb-name">{g.sidebarLabel}</span>
                <span className="dd-sb-meta">{g.sidebarMeta}</span>
              </div>
              <ChevSb />
            </button>
          ))}
          <button
            type="button"
            className={'dd-sb-item' + (nav.tailor.panelId === active ? ' active' : '')}
            data-panel={nav.tailor.panelId}
          >
            <div>
              <span className="dd-sb-name">Tailor Made</span>
              <span className="dd-sb-meta">Custom program</span>
            </div>
            <ChevSb />
          </button>
          {nav.seeAll ? (
            <div className="dd-sb-footer">
              <a href={nav.seeAll.href} className="dd-see-all" {...(nav.seeAll.openInNewTab ? { target: '_blank', rel: nav.seeAll.rel } : {})}>
                {nav.seeAll.label}
                <ArrowSeeAll />
              </a>
            </div>
          ) : null}
        </div>
        {nav.groups.map((g) => (
          <div
            key={g.panelId}
            id={g.panelId}
            className={'dd-panel' + (g.panelId === active ? ' active' : '')}
            role="region"
            aria-label={g.eyebrow}
          >
            <div className="dd-panel-eyebrow">{g.eyebrow}</div>
            <div className={'dd-exp-grid' + (g.items.length <= 2 ? ' dd-exp-grid--single' : '')}>
              {g.items.length === 0 ? (
                <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--n700)' }}>Programs in this category will appear here.</p>
              ) : (
                g.items.map((it) => {
                  const routeOnly = navExpRouteLineOnly(it.routeLine)
                  const durationPrice = navExpDurationPriceMeta(it.metaLine, routeOnly)
                  return (
                    <a key={it.id} href={it.href} className="dd-exp-card">
                      <div className="dd-exp-thumb">{it.thumbUrl ? <img src={it.thumbUrl} alt="" width={160} height={112} /> : null}</div>
                      <div className="dd-exp-body">
                        <div className="dd-mega-pills">
                          <span className="dd-mega-pill dd-mega-pill--route">{routeOnly}</span>
                        </div>
                        <div className="dd-exp-title">{it.name}</div>
                        {durationPrice ? <div className="dd-exp-meta">{durationPrice}</div> : null}
                        <div className="dd-exp-view">
                          View experience
                          <ArrowSeeAll />
                        </div>
                      </div>
                    </a>
                  )
                })
              )}
            </div>
          </div>
        ))}
        <div
          id={nav.tailor.panelId}
          className={'dd-panel' + (nav.tailor.panelId === active ? ' active' : '')}
          role="region"
          aria-label={nav.tailor.eyebrow}
        >
          <div className="dd-panel-eyebrow">{nav.tailor.eyebrow}</div>
          <div className="dd-tailor-stack">
            {(() => {
              const cta = nav.tailor.cta
              const inner = (
                <>
                  <div className="dd-tailor">
                    <div className="dd-tailor-icon" aria-hidden>
                      <svg width="18" height="17" viewBox="0 0 105 101" fill="none">
                        <path
                          d="M103.703 59.25C102.343 49.75 97.3635 41.34 89.6735 35.59C89.3235 35.33 88.9635 35.07 88.6035 34.82C88.0135 15.52 72.1235 0 52.6835 0C33.6535 0 18.0434 14.86 16.8234 33.58C11.1834 37.11 6.62343 42.15 3.64343 48.28C-0.556567 56.91 -1.14654 66.66 1.98346 75.74C5.11346 84.81 11.5934 92.13 20.2234 96.33C25.2034 98.75 30.5535 99.98 35.9235 99.98C39.8735 99.98 43.8335 99.32 47.6735 98C49.0635 97.52 50.4034 96.96 51.7134 96.33L51.9534 96.46C56.9534 98.99 62.4335 100.31 68.0535 100.31C69.7735 100.31 71.5035 100.19 73.2335 99.94C82.7335 98.58 91.1434 93.6 96.8934 85.91C102.643 78.22 105.063 68.75 103.703 59.25Z"
                          fill="#ECE5D5"
                        />
                      </svg>
                    </div>
                    <div className="dd-tailor-copy">
                      <div className="dd-tailor-type">Tailor Made</div>
                      <div className="dd-tailor-name">{nav.tailor.title}</div>
                      <div className="dd-tailor-sub">{nav.tailor.subtitle}</div>
                    </div>
                  </div>
                  {nav.tailor.body ? <p className="dd-tailor-body">{nav.tailor.body}</p> : null}
                  {cta ? (
                    <span className="dd-tailor-cta">
                      {cta.label}
                      <ArrowSeeAll />
                    </span>
                  ) : null}
                </>
              )
              if (cta) {
                return (
                  <a
                    href={cta.href}
                    className="dd-tailor-stack-link"
                    {...(cta.openInNewTab ? { target: '_blank', rel: cta.rel } : {})}
                  >
                    {inner}
                  </a>
                )
              }
              return <div className="dd-tailor-stack-link">{inner}</div>
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

function LodgesMega({ nav }: { nav: ResolvedSiteHeaderNav['lodges'] }) {
  const active = defaultActiveLodgeRoute(nav.routes)
  return (
    <div className="nav-dropdown site-header-desktop-dd" id="site-nav-dd-lodges" role="navigation" aria-label="Lodges menu">
      <div className="nav-dd-inner">
        <div className="dd-sidebar">
          <div className="dd-sb-head">By route</div>
          {nav.routes.map((r) => (
            <button
              key={r.panelId}
              type="button"
              className={'dd-sb-item' + (r.panelId === active ? ' active' : '')}
              data-panel={r.panelId}
            >
              <div>
                <span className="dd-sb-name">{r.sidebarLabel}</span>
                <span className="dd-sb-meta">{r.sidebarMeta}</span>
              </div>
              <ChevSb />
            </button>
          ))}
          {nav.seeAll ? (
            <div className="dd-sb-footer">
              <a href={nav.seeAll.href} className="dd-see-all" {...(nav.seeAll.openInNewTab ? { target: '_blank', rel: nav.seeAll.rel } : {})}>
                {nav.seeAll.label}
                <ArrowSeeAll />
              </a>
            </div>
          ) : null}
        </div>
        {nav.routes.map((r) => (
          <div key={r.panelId} id={r.panelId} className={'dd-panel' + (r.panelId === active ? ' active' : '')} role="region" aria-label={r.eyebrow}>
            <div className="dd-panel-eyebrow">{r.eyebrow}</div>
            {r.lodges.length === 0 ? (
              <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--n700)' }}>Lodges on this route will appear here.</p>
            ) : (
              <div className="dd-mega-list">
                {r.lodges.map((L) => (
                  <a key={L.id} href={L.href} className="dd-mega-card dd-mega-card--lodge">
                    <div className="dd-mega-img">{L.imageUrl ? <img src={L.imageUrl} alt="" width={260} height={180} /> : null}</div>
                    <div className="dd-mega-body">
                      {L.badges.length ? (
                        <div className="dd-mega-pills">
                          {L.badges.map((b, i) => (
                            <span
                              key={i}
                              className={
                                'dd-mega-pill ' +
                                (b.tone === 'own'
                                  ? 'dd-mega-pill--own'
                                  : b.tone === 'alliance'
                                    ? 'dd-mega-pill--alliance'
                                    : 'dd-mega-pill--neutral')
                              }
                            >
                              {b.label}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="dd-mega-title">{L.name}</div>
                      <div className="dd-mega-desc">{L.description}</div>
                      <div className="dd-mega-view">
                        View lodge
                        <ArrowSeeAll />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function MobileDrawer({ nav }: { nav: ResolvedSiteHeaderNav }) {
  return (
    <div className="mobile-drawer site-header-mobile-drawer site-header-mobile-only" id="drawer" data-header-drawer="managed">
      <button type="button" className="mob-acc-btn" data-mob-acc-panel="mob-acc-exp">
        <div>
          Experiences
          <span className="mob-acc-sub">Classic Nature · Signature · Learning · Tailor Made</span>
        </div>
        <svg className="mob-acc-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="mob-acc-content" id="mob-acc-exp">
        {nav.experiences.groups.map((g) => (
          <div key={g.panelId}>
            <div className="mob-cat">{g.eyebrow}</div>
            {g.items.map((it) => {
              const routeOnly = navExpRouteLineOnly(it.routeLine)
              const metaShown = navExpMetaSansBooking(it.metaLine, routeOnly)
              return (
                <a key={it.id} href={it.href} className="mob-item mob-item--exp">
                  <div className="mob-item-thumb">{it.thumbUrl ? <img src={it.thumbUrl} alt="" width={80} height={60} /> : null}</div>
                  <div className="mob-item-text">
                    <div className="mob-item-route">{routeOnly}</div>
                    <div className="mob-item-name">{it.name}</div>
                    {metaShown ? <div className="mob-item-meta">{metaShown}</div> : null}
                  </div>
                  <span className="mob-item-arrow" aria-hidden>
                    →
                  </span>
                </a>
              )
            })}
          </div>
        ))}
        <div className="mob-cat">Tailor Made</div>
        {(() => {
          const tcta = nav.experiences.tailor.cta
          const tailorInner = (
            <>
              <div className="mob-item-thumb mob-item-thumb--icon mob-tailor-row__icon" aria-hidden>
                <svg width="16" height="15" viewBox="0 0 105 101" fill="none">
                  <path
                    d="M103.703 59.25C102.343 49.75 97.3635 41.34 89.6735 35.59C89.3235 35.33 88.9635 35.07 88.6035 34.82C88.0135 15.52 72.1235 0 52.6835 0C33.6535 0 18.0434 14.86 16.8234 33.58C11.1834 37.11 6.62343 42.15 3.64343 48.28C-0.556567 56.91 -1.14654 66.66 1.98346 75.74C5.11346 84.81 11.5934 92.13 20.2234 96.33C25.2034 98.75 30.5535 99.98 35.9235 99.98C39.8735 99.98 43.8335 99.32 47.6735 98C49.0635 97.52 50.4034 96.96 51.7134 96.33L51.9534 96.46C56.9534 98.99 62.4335 100.31 68.0535 100.31C69.7735 100.31 71.5035 100.19 73.2335 99.94C82.7335 98.58 91.1434 93.6 96.8934 85.91C102.643 78.22 105.063 68.75 103.703 59.25Z"
                    fill="#ECE5D5"
                  />
                </svg>
              </div>
              <div className="mob-item-text">
                <div className="mob-item-route">Tailor Made</div>
                <div className="mob-item-name">{nav.experiences.tailor.title}</div>
                <div className="mob-item-meta">{nav.experiences.tailor.subtitle}</div>
              </div>
              {tcta ? (
                <span className="mob-item-arrow" aria-hidden>
                  →
                </span>
              ) : null}
            </>
          )
          if (tcta) {
            return (
              <a
                href={tcta.href}
                className="mob-item mob-item--tailor mob-tailor-row"
                {...(tcta.openInNewTab ? { target: '_blank', rel: tcta.rel } : {})}
              >
                {tailorInner}
              </a>
            )
          }
          return <div className="mob-item mob-item--tailor mob-tailor-row">{tailorInner}</div>
        })()}
        {nav.experiences.seeAll ? (
          <a
            href={nav.experiences.seeAll.href}
            className="mob-see-all"
            {...(nav.experiences.seeAll.openInNewTab ? { target: '_blank', rel: nav.experiences.seeAll.rel } : {})}
          >
            {nav.experiences.seeAll.label} →
          </a>
        ) : null}
      </div>

      <button type="button" className="mob-acc-btn" data-mob-acc-panel="mob-acc-lodges">
        <div>
          Lodges
          <span className="mob-acc-sub">Camanti · Manu Road · Manu Core</span>
        </div>
        <svg className="mob-acc-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="mob-acc-content" id="mob-acc-lodges">
        {nav.lodges.routes.map((r) => (
          <div key={r.panelId}>
            <div className="mob-cat">{r.eyebrow}</div>
            {r.lodges.map((L) => (
              <a key={L.id} href={L.href} className="mob-item mob-item--lodge">
                <div className="mob-item-thumb">{L.imageUrl ? <img src={L.imageUrl} alt="" width={80} height={60} /> : null}</div>
                <div className="mob-item-text">
                  <div className="mob-item-name">{L.name}</div>
                  <div className="mob-item-meta">{L.description.slice(0, 80)}{L.description.length > 80 ? '…' : ''}</div>
                </div>
                <span className="mob-item-arrow" aria-hidden>
                  →
                </span>
              </a>
            ))}
          </div>
        ))}
        {nav.lodges.seeAll ? (
          <a href={nav.lodges.seeAll.href} className="mob-see-all" {...(nav.lodges.seeAll.openInNewTab ? { target: '_blank', rel: nav.lodges.seeAll.rel } : {})}>
            {nav.lodges.seeAll.label} →
          </a>
        ) : null}
      </div>

      <a href="/routes" className="mob-item mob-item--direct">
        <span className="mob-item-text mob-item-text--single">
          <span className="mob-item-name">Routes</span>
        </span>
        <span className="mob-item-arrow" aria-hidden>
          →
        </span>
      </a>
      <a href="/about" className="mob-item mob-item--direct">
        <span className="mob-item-text mob-item-text--single">
          <span className="mob-item-name">About</span>
        </span>
        <span className="mob-item-arrow" aria-hidden>
          →
        </span>
      </a>
    </div>
  )
}

type SiteHeaderProps = {
  /**
   * When true (default), the bar renders with `solid` on first paint — readable on light pages.
   * Set false for the home hero / full-bleed dark hero so the bar starts transparent until scroll (`EcotoneV2Client`).
   */
  mainNavSolid?: boolean
}

export async function SiteHeader({ mainNavSolid = true }: SiteHeaderProps = {}) {
  const [shell, nav] = await Promise.all([getSiteSettingsShell(), getSiteHeaderNav()])
  const { headerLogoLightUrl, headerLogoDarkUrl, homePath, primaryCta, mobileMenuAriaLabel } = shell
  const useCms = typeof headerLogoLightUrl === 'string' && headerLogoLightUrl.length > 0
  const headerDarkResolved = resolveHeaderLogoDarkUrl(headerLogoDarkUrl)
  const navClassName = mainNavSolid ? 'top-nav solid' : 'top-nav'
  const rawHome = (homePath || '/').trim()
  const logoHref = /^https?:\/\//i.test(rawHome)
    ? rawHome
    : rawHome.startsWith('/')
      ? rawHome
      : `/${rawHome}`

  return (
    <>
      <div className="site-header-mega-root">
        <nav className={navClassName} id="topNav">
          <div className="nav-inner">
            <a href={logoHref} className="nav-logo">
              {useCms ? (
                <SiteHeaderLogoCms
                  lightUrl={headerLogoLightUrl}
                  darkUrl={headerDarkResolved}
                  initialSolid={mainNavSolid}
                  alt="Ecotone"
                />
              ) : (
                <InlineHeaderLogo />
              )}
            </a>
            <ul className="nav-links">
              <li className="site-header-dd-trigger-li site-header-desktop-dd">
                <button type="button" className="nav-link-btn" id="site-nav-btn-experiences" aria-expanded="false" aria-haspopup="true" aria-controls="site-nav-dd-experiences">
                  Experiences
                  <ChevSm />
                </button>
              </li>
              <li className="site-header-dd-trigger-li site-header-desktop-dd">
                <button type="button" className="nav-link-btn" id="site-nav-btn-lodges" aria-expanded="false" aria-haspopup="true" aria-controls="site-nav-dd-lodges">
                  Lodges
                  <ChevSm />
                </button>
              </li>
              <li>
                <a href="/routes" className="nav-link-direct">
                  Routes
                </a>
              </li>
              <li>
                <a href="/about" className="nav-link-direct">
                  About
                </a>
              </li>
            </ul>
            <SiteHeaderNavBookButtons
              label={primaryCta.label}
              href={primaryCta.href}
              openInNewTab={primaryCta.openInNewTab}
            />
            <button type="button" className="hamburger site-header-mobile-only" id="ham" aria-label={mobileMenuAriaLabel} aria-expanded="false" aria-controls="drawer">
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
        <ExperiencesMega nav={nav.experiences} />
        <LodgesMega nav={nav.lodges} />
      </div>
      <div className="nav-overlay" id="navOverlay" aria-hidden="true" />
      <MobileDrawer nav={nav} />
      <SiteHeaderShellClient />
    </>
  )
}
