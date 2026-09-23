import type { AboutPageResolved } from '@/lib/resolveAboutPageData'

type DiffData = AboutPageResolved['difference']

const MANIFESTO_INTRO_FALLBACK =
  'More than places, our journeys are built on people, purpose and a deep respect for the natural world. These four principles guide everything we do.'

/**
 * What makes us different — editorial manifesto (approved production treatment).
 * Icon card layout retained only via unused `default` path for reference; production uses manifesto.
 */
export function AboutDifference({ data }: { data: DiffData }) {
  const intro = data.intro?.trim() || MANIFESTO_INTRO_FALLBACK
  const imageUrl = data.imageUrl
  const imageAlt = data.imageAlt

  return (
    <section className="content-section bg-warm fade" id={data.sectionId}>
      <div className="content-inner">
        <div className="diff-manifesto">
          <div className="diff-manifesto-lead">
            <div className="eyebrow">{data.eyebrow}</div>
            <h2 className="h2 diff-manifesto-title">{data.headline}</h2>
            <p className="body diff-manifesto-intro">{intro}</p>
            <div className="diff-manifesto-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={imageAlt}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="diff-manifesto-principles">
            {data.cards.map((c, i) => (
              <article key={c.key} className="diff-panel">
                <p className="diff-panel-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <span className="diff-panel-rule" aria-hidden="true" />
                <h3 className="diff-panel-title">{c.title}</h3>
                <p className="diff-panel-body">{c.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
