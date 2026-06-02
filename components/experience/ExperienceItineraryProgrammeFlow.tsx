import type { ExperienceProgrammeFlowSection } from '@/data/soqtapataExperienceLocal'

const LODGE_SVG = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={2} aria-hidden>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
)

export function ExperienceItineraryProgrammeFlow({
  section,
  showHeader = true,
}: {
  section: ExperienceProgrammeFlowSection
  showHeader?: boolean
}) {
  if (!section.phases.length) return null

  return (
    <div className="exp-itin-subsection">
      {showHeader ? (
        <>
          {section.eyebrow ? <div className="eyebrow">{section.eyebrow}</div> : null}
          {section.title ? <h3 className="h2">{section.title}</h3> : null}
          {section.intro ? (
            <p
              className="body"
              style={{
                fontSize: 15,
                fontWeight: 300,
                color: 'var(--n700)',
                lineHeight: 1.75,
                maxWidth: 640,
                marginBottom: 16,
              }}
            >
              {section.intro}
            </p>
          ) : null}
        </>
      ) : null}
      <div className="exp-prog-flow">
        {section.phases.map((phase, index) => (
          <article
            key={phase.id}
            className={'exp-prog-phase' + (phase.imageSrc ? '' : ' exp-prog-phase--no-image')}
          >
            <div>
              <div className="exp-prog-phase__meta">
                <span className="exp-prog-phase__index">
                  Phase {index + 1}
                  {section.phases.length > 1 ? ` of ${section.phases.length}` : ''}
                </span>
                {phase.durationLabel ? (
                  <span className="exp-prog-phase__duration">{phase.durationLabel}</span>
                ) : null}
              </div>
              <h4 className="exp-prog-phase__title">{phase.title}</h4>
              {phase.subtitle ? <p className="exp-prog-phase__subtitle">{phase.subtitle}</p> : null}
              <p className="exp-prog-phase__body">{phase.body}</p>
              {phase.accommodation ? (
                <p className="exp-prog-phase__accommodation">
                  {LODGE_SVG}
                  {phase.accommodation}
                </p>
              ) : null}
            </div>
            {phase.imageSrc ? (
              <figure className="exp-prog-phase__figure">
                <img src={phase.imageSrc} alt={phase.imageAlt || phase.title} decoding="async" />
              </figure>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
