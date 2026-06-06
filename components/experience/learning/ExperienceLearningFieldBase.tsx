import type { SoqtapataLodge } from '@/data/soqtapataExperienceLocal'
import type { ExperienceLearningFieldBaseCopy } from '@/lib/experienceLearningTypes'

type Props = {
  copy: ExperienceLearningFieldBaseCopy
  lodge: SoqtapataLodge
}

/** Field base / research station — reuses lodge card markup with learning-oriented copy. */
export function ExperienceLearningFieldBase({ copy, lodge }: Props) {
  if (!lodge.cards.length) return null

  return (
    <section className="content-section fade exp-learning-field-base" id="field-base">
      <div className="content-inner">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h2 className="h2" style={lodge.h2Style}>
          {copy.title}
        </h2>
        <p style={lodge.introStyle}>{copy.intro}</p>
        <div className="lodge-cards">
          {lodge.cards.map((c) => {
            const ctaHref = c.ctaHref?.trim()
            const ctaLabel = c.ctaLabel?.trim() || 'View field base'
            return (
              <div className="lodge-card" key={`${c.name}-${c.nightBadge}`}>
                <div className="lodge-card-img">
                  <img src={c.imageSrc} alt={c.imageAlt} />
                </div>
                <div className="lodge-card-body">
                  <div>
                    <div className="lodge-card-header">
                      <div>
                        <span className="lodge-night-badge">{c.nightBadge || 'Field base'}</span>
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
                    {ctaHref ? (
                      <a href={ctaHref} className="lodge-card-cta">
                        {ctaLabel}
                        <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="var(--brown)" strokeWidth={2}>
                          <line x1="2" y1="6" x2="10" y2="6" />
                          <polyline points="7 3 10 6 7 9" />
                        </svg>
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
