import type { SoqtapataPhase1PageNav } from '@/data/soqtapataExperienceLocal'

/** Navegación interna + shim + scrim — paridad con `ecotone-experience_2.html` (#pageNav). */
export function ExperiencePageNavSoqtapata({ data }: { data: SoqtapataPhase1PageNav }) {
  return (
    <>
      <nav className="page-nav" id="pageNav" aria-label="On this page">
        <div className="page-nav-grid">
          <div className="pnav-lead">
            <div className="pnav-lead-name">{data.leadName}</div>
            <div className="pnav-lead-days">{data.leadDays}</div>
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
          <div className="pnav-cta">
            <div className="pnav-from-price" aria-label={data.fromAriaLabel}>
              <span className="pnav-from-label">{data.fromLabel}</span>
              <span className="pnav-from-num">{data.fromNum}</span>
              <span className="pnav-from-sub">{data.fromSub}</span>
            </div>
            {data.bookVisible !== false ? (
              <a href={data.bookHref} className="btn btn-primary pnav-book-btn">
                {data.bookLabel}
              </a>
            ) : null}
          </div>
          <div className="page-nav-cols" id="pageNavCols">
            {data.links.map((l) => (
              <a
                key={l.href + l.label}
                href={l.href}
                className={l.className}
                {...(l.dataActiveWhen != null && l.dataActiveWhen !== ''
                  ? { 'data-active-when': l.dataActiveWhen }
                  : {})}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
      <div id="pnavScrollShim" className="pnav-scroll-shim" aria-hidden="true" />
      <div className="pnav-mobile-scrim" id="pnavMobileScrim" aria-hidden="true" />
    </>
  )
}
