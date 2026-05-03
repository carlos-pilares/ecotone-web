import type { SoqtapataLodge } from '@/data/soqtapataExperienceLocal'

/** `section#lodges` — paridad con `ecotone-experience_2.html`. */
export function ExperienceLodgeSoqtapata({ data }: { data: SoqtapataLodge }) {
  const c = data.card
  const ctaHref = data.ctaHref ?? c.ctaHref
  const ctaLabel = data.ctaLabel ?? c.ctaLabel
  return (
    <section className="content-section fade" id="lodges">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={data.h2Style}>
          {data.h2}
        </h2>
        <p style={data.introStyle}>{data.intro}</p>
        <div className="lodge-cards">
          <div className="lodge-card">
            <div className="lodge-card-img">
              <img src={c.imageSrc} alt={c.imageAlt} />
            </div>
            <div className="lodge-card-body">
              <div>
                <div className="lodge-card-header">
                  <div>
                    <span className="lodge-night-badge">{c.nightBadge}</span>
                    <div className="lodge-card-name" style={c.nameStyle}>
                      {c.name}
                    </div>
                  </div>
                  <span className="pill pill-amber" style={c.pillStyle}>
                    {c.pillText}
                  </span>
                </div>
                <div className="lodge-card-meta" style={c.metaStyle}>
                  {c.meta}
                </div>
              </div>
              <div>
                <div className="lodge-card-chips" style={c.chipsWrapperStyle}>
                  {c.chips.map((ch) => (
                    <span className="lodge-chip" key={ch}>
                      {ch}
                    </span>
                  ))}
                </div>
                <a href={ctaHref} className="lodge-card-cta">
                  {ctaLabel}
                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="var(--brown)" strokeWidth={2}>
                    <line x1="2" y1="6" x2="10" y2="6" />
                    <polyline points="7 3 10 6 7 9" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
