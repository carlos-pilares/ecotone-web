import '@/app/site-header-mega.css'

import { TrackedExperienceNavLink } from '@/components/TrackedExperienceNavLink'
import { getSiteHeaderNav } from '@/lib/getSiteHeaderNav'
import { getAnnouncementBarSettings } from '@/lib/getPromotions'
import { getSiteSettingsShell } from '@/lib/getSiteSettingsShell'
import { resolveHeaderLogoDarkUrl } from '@/lib/headerLogoPublic'
import { ExperiencePriceDisplay } from '@/components/experience/ExperiencePriceDisplay'
import type { ExperienceNavPriceMeta } from '@/lib/formatExperiencePrice'
import type {
  ResolvedSiteHeaderNav,
  ResolvedSiteHeaderNavExperiences,
  ResolvedSiteHeaderNavLodges,
  ResolvedSiteHeaderNavTab,
  SiteHeaderNavCta,
  SiteHeaderNavExpItem,
} from '@/lib/resolveSiteHeaderNavData'

import { SiteHeaderLogoCms } from '@/components/SiteHeaderLogoCms'
import { SiteHeaderNavBookButtons } from '@/components/SiteHeaderNavBookButtons'
import { SiteHeaderShellClient } from '@/components/SiteHeaderShellClient'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { SiteHeaderTailorMobileRow, SiteHeaderTailorPanel } from '@/components/SiteHeaderTailorPanel'

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

function DirectNavLink({ cta }: { cta: SiteHeaderNavCta | null }) {
  if (!cta) return null
  return (
    <li>
      <a
        href={cta.href}
        className="nav-link-direct"
        {...(cta.openInNewTab ? { target: '_blank', rel: cta.rel } : {})}
      >
        {cta.label}
      </a>
    </li>
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

function navMetaToDisplay(meta: ExperienceNavPriceMeta) {
  if (meta.kind === 'enquire') {
    return { kind: 'enquire' as const, promoLabel: meta.promoLabel }
  }
  return {
    kind: 'priced' as const,
    from: meta.from,
    amount: meta.amount,
    perPerson: meta.perPerson,
    originalAmount: meta.originalAmount,
    promoLabel: meta.promoLabel,
    hasDiscount: meta.hasDiscount,
  }
}

function NavExpPriceMeta({ meta }: { meta: ExperienceNavPriceMeta }) {
  return <ExperiencePriceDisplay display={navMetaToDisplay(meta)} layout="mega" />
}

/** Mobile drawer: price line only when “Enquire” (no $ amounts in global menu). */
function navExpMetaSansBooking(it: SiteHeaderNavExpItem): string {
  if (it.priceMeta.kind === 'enquire') return 'Enquire'
  return ''
}

function ExperiencesMega({ tab }: { tab: ResolvedSiteHeaderNavTab }) {
  const nav = tab.experiences as ResolvedSiteHeaderNavExperiences
  const groupActive = defaultActivePanel(nav.groups)
  const allGroupsEmpty = nav.groups.every((g) => g.items.length === 0)
  const active = allGroupsEmpty ? nav.tailor.panelId : groupActive
  return (
    <div className="nav-dropdown site-header-desktop-dd" id={tab.ddId} role="navigation" aria-label={`${tab.label} menu`}>
      <div className="nav-dd-inner">
        <div className="dd-sidebar">
          <div className="dd-sb-head">{nav.sideMenuTitle}</div>
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
          {nav.tailorVisible ? (
            <button
              type="button"
              className={'dd-sb-item' + (nav.tailor.panelId === active ? ' active' : '')}
              data-panel={nav.tailor.panelId}
            >
              <div>
                <span className="dd-sb-name">{nav.tailorSidebarLabel}</span>
                {nav.tailorSidebarSubLabel ? (
                  <span className="dd-sb-meta">{nav.tailorSidebarSubLabel}</span>
                ) : null}
              </div>
              <ChevSb />
            </button>
          ) : null}
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
                  return (
                    <TrackedExperienceNavLink
                      key={it.id}
                      href={it.href}
                      experienceName={it.name}
                      sourceSection="mega_menu"
                      route={routeOnly || undefined}
                      className="dd-exp-card"
                    >
                      <div className="dd-exp-thumb">{it.thumbUrl ? <img src={it.thumbUrl} alt="" width={160} height={112} /> : null}</div>
                      <div className="dd-exp-body">
                        {routeOnly ? (
                          <div className="dd-mega-pills">
                            <span className="dd-mega-pill dd-mega-pill--route">{routeOnly}</span>
                          </div>
                        ) : null}
                        <div className="dd-exp-title">{it.name}</div>
                        <NavExpPriceMeta meta={it.priceMeta} />
                        <div className="dd-exp-view">
                          View experience
                          <ArrowSeeAll />
                        </div>
                      </div>
                    </TrackedExperienceNavLink>
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
          <SiteHeaderTailorPanel tailor={nav.tailor} />

        </div>
      </div>
    </div>
  )
}

function LodgesMega({ tab }: { tab: ResolvedSiteHeaderNavTab }) {
  const nav = tab.lodges as ResolvedSiteHeaderNavLodges
  const active = defaultActiveLodgeRoute(nav.routes)
  return (
    <div className="nav-dropdown site-header-desktop-dd" id={tab.ddId} role="navigation" aria-label={`${tab.label} menu`}>
      <div className="nav-dd-inner">
        <div className="dd-sidebar">
          <div className="dd-sb-head">{nav.sideMenuTitle}</div>
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
                        {L.ctaLabel}
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

function MobAccChevron() {
  return (
    <svg className="mob-acc-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function MobileExperiencesPanel({ tab }: { tab: ResolvedSiteHeaderNavTab }) {
  const exp = tab.experiences!
  return (
    <>
      <button type="button" className="mob-acc-btn" data-mob-acc-panel={tab.mobAccId}>
        <div>
          {tab.label}
          <span className="mob-acc-sub">
            {exp.groups.map((g) => g.sidebarLabel).join(' · ')}
            {exp.tailorVisible ? ` · ${exp.tailorSidebarLabel}` : ''}
          </span>
        </div>
        <MobAccChevron />
      </button>
      <div className="mob-acc-content" id={tab.mobAccId}>
        {exp.groups.map((g) => (
          <div key={g.panelId}>
            <div className="mob-cat">{g.eyebrow}</div>
            {g.items.map((it) => {
              const routeOnly = navExpRouteLineOnly(it.routeLine)
              const metaShown = navExpMetaSansBooking(it)
              return (
                <TrackedExperienceNavLink
                  key={it.id}
                  href={it.href}
                  experienceName={it.name}
                  sourceSection="mega_menu"
                  route={routeOnly || undefined}
                  className="mob-item mob-item--exp"
                >
                  <div className="mob-item-thumb">{it.thumbUrl ? <img src={it.thumbUrl} alt="" width={80} height={60} /> : null}</div>
                  <div className="mob-item-text">
                    <div className="mob-item-route">{routeOnly}</div>
                    <div className="mob-item-name">{it.name}</div>
                    {metaShown ? <div className="mob-item-meta">{metaShown}</div> : null}
                  </div>
                  <span className="mob-item-arrow" aria-hidden>
                    →
                  </span>
                </TrackedExperienceNavLink>
              )
            })}
          </div>
        ))}
        {exp.tailorVisible ? <div className="mob-cat">{exp.tailorSidebarLabel}</div> : null}
        {exp.tailorVisible ? <SiteHeaderTailorMobileRow tailor={exp.tailor} /> : null}

        {exp.seeAll ? (
          <a
            href={exp.seeAll.href}
            className="mob-see-all"
            {...(exp.seeAll.openInNewTab ? { target: '_blank', rel: exp.seeAll.rel } : {})}
          >
            {exp.seeAll.label} →
          </a>
        ) : null}
      </div>
    </>
  )
}

function MobileLodgesPanel({ tab }: { tab: ResolvedSiteHeaderNavTab }) {
  const lodges = tab.lodges!
  return (
    <>
      <button type="button" className="mob-acc-btn" data-mob-acc-panel={tab.mobAccId}>
        <div>
          {tab.label}
          <span className="mob-acc-sub">
            {lodges.routes.length ? lodges.routes.map((r) => r.sidebarLabel).join(' · ') : 'By route'}
          </span>
        </div>
        <MobAccChevron />
      </button>
      <div className="mob-acc-content" id={tab.mobAccId}>
        {lodges.routes.map((r) => (
          <div key={r.panelId}>
            <div className="mob-cat">{r.eyebrow}</div>
            {r.lodges.map((L) => (
              <a key={L.id} href={L.href} className="mob-item mob-item--lodge">
                <div className="mob-item-thumb">{L.imageUrl ? <img src={L.imageUrl} alt="" width={80} height={60} /> : null}</div>
                <div className="mob-item-text">
                  <div className="mob-item-name">{L.name}</div>
                  <div className="mob-item-meta">
                    {L.description.slice(0, 80)}
                    {L.description.length > 80 ? '…' : ''}
                  </div>
                </div>
                <span className="mob-item-arrow" aria-hidden>
                  →
                </span>
              </a>
            ))}
          </div>
        ))}
        {lodges.seeAll ? (
          <a
            href={lodges.seeAll.href}
            className="mob-see-all"
            {...(lodges.seeAll.openInNewTab ? { target: '_blank', rel: lodges.seeAll.rel } : {})}
          >
            {lodges.seeAll.label} →
          </a>
        ) : null}
      </div>
    </>
  )
}

function MobileDirectLink({ cta }: { cta: SiteHeaderNavCta }) {
  return (
    <a
      href={cta.href}
      className="mob-item mob-item--direct"
      {...(cta.openInNewTab ? { target: '_blank', rel: cta.rel } : {})}
    >
      <span className="mob-item-text mob-item-text--single">
        <span className="mob-item-name">{cta.label}</span>
      </span>
      <span className="mob-item-arrow" aria-hidden>
        →
      </span>
    </a>
  )
}

function MobileDrawer({ nav }: { nav: ResolvedSiteHeaderNav }) {
  return (
    <div className="mobile-drawer site-header-mobile-drawer site-header-mobile-only" id="drawer" data-header-drawer="managed">
      {nav.tabs.map((tab) => {
        if (tab.hasDropdown && tab.dropdownType === 'experiences' && tab.experiences) {
          return <MobileExperiencesPanel key={tab.key} tab={tab} />
        }
        if (tab.hasDropdown && tab.dropdownType === 'lodges' && tab.lodges) {
          return <MobileLodgesPanel key={tab.key} tab={tab} />
        }
        if (tab.simpleLink) {
          return <MobileDirectLink key={tab.key} cta={tab.simpleLink} />
        }
        return null
      })}
    </div>
  )
}

type SiteHeaderProps = {
  /**
   * When true (default), the bar renders with `solid` on first paint — readable on light pages.
   * Set false for the home hero / full-bleed dark hero so the bar starts transparent until scroll (`EcotoneV2Client`).
   */
  mainNavSolid?: boolean
  /**
   * Home hero: fixed nav + announcement overlay the hero media; no document-flow spacer.
   * Internal pages: header stack pushes content down via `.site-header-stack-spacer`.
   */
  overlayOnHero?: boolean
}

export async function SiteHeader({ mainNavSolid = true, overlayOnHero = false }: SiteHeaderProps = {}) {
  const [shell, nav, announcementSettings] = await Promise.all([
    getSiteSettingsShell(),
    getSiteHeaderNav(),
    getAnnouncementBarSettings(),
  ])

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[HEADER RENDER TABS]', {
      source: 'nav.tabs',
      tabsLength: nav.tabs.length,
      labels: nav.tabs.map((t) => t.label),
      primaryCta: { label: shell.primaryCta.label, href: shell.primaryCta.href },
    })
  }

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
      <div
        className={
          'site-header-mega-root' + (overlayOnHero ? ' site-header-mega-root--hero-overlay' : '')
        }
      >
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
              {nav.tabs.map((tab) => {
                if (tab.hasDropdown && tab.dropdownType === 'experiences') {
                  return (
                    <li key={tab.key} className="site-header-dd-trigger-li site-header-desktop-dd">
                      <button
                        type="button"
                        className="nav-link-btn"
                        id={tab.btnId}
                        aria-expanded="false"
                        aria-haspopup="true"
                        aria-controls={tab.ddId}
                      >
                        {tab.label}
                        <ChevSm />
                      </button>
                    </li>
                  )
                }
                if (tab.hasDropdown && tab.dropdownType === 'lodges') {
                  return (
                    <li key={tab.key} className="site-header-dd-trigger-li site-header-desktop-dd">
                      <button
                        type="button"
                        className="nav-link-btn"
                        id={tab.btnId}
                        aria-expanded="false"
                        aria-haspopup="true"
                        aria-controls={tab.ddId}
                      >
                        {tab.label}
                        <ChevSm />
                      </button>
                    </li>
                  )
                }
                if (tab.simpleLink) {
                  return <DirectNavLink key={tab.key} cta={tab.simpleLink} />
                }
                return null
              })}
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
        <AnnouncementBar settings={announcementSettings} />
        <div className="site-header-stack-spacer" aria-hidden="true" />
        {nav.tabs.map((tab) => {
          if (tab.hasDropdown && tab.dropdownType === 'experiences' && tab.experiences) {
            return <ExperiencesMega key={tab.key} tab={tab} />
          }
          if (tab.hasDropdown && tab.dropdownType === 'lodges' && tab.lodges) {
            return <LodgesMega key={tab.key} tab={tab} />
          }
          return null
        })}
      </div>
      <div className="nav-overlay" id="navOverlay" aria-hidden="true" />
      <MobileDrawer nav={nav} />
      <SiteHeaderShellClient />
    </>
  )
}
