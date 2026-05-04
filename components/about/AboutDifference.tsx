import type { AboutPageResolved } from '@/lib/resolveAboutPageData'

type DiffData = AboutPageResolved['difference']

const sw = 1.8

function DiffIcon({ kind }: { kind: string }) {
  if (kind === 'immersive') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth={sw} />
        <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth={sw} />
      </svg>
    )
  }
  if (kind === 'guides') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth={sw} />
        <path d="M8 13c-3 1-5 4-5 7h18c0-3-2-6-5-7" stroke="currentColor" strokeWidth={sw} />
      </svg>
    )
  }
  if (kind === 'conservation') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth={sw} />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={sw} />
      <path
        d="M12 2v3m0 14v3M4.22 4.22l2.12 2.12m11.32 11.32 2.12 2.12M2 12h3m14 0h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
        stroke="currentColor"
        strokeWidth={sw}
      />
    </svg>
  )
}

export function AboutDifference({ data }: { data: DiffData }) {
  return (
    <section className="content-section bg-warm fade" id={data.sectionId}>
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2 about-diff-h2">{data.headline}</h2>
        <div className="diff-grid">
          {data.cards.map((c) => (
            <div key={c.key} className="diff-card">
              <div className="diff-icon">
                <DiffIcon kind={c.key} />
              </div>
              <div className="diff-title">{c.title}</div>
              <p className="diff-desc">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
