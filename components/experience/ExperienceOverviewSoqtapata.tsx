import type { SoqtapataOverview } from '@/data/soqtapataExperienceLocal'

/** Paridad con `ecotone-experience_2.html` — `#overview`. */
export function ExperienceOverviewSoqtapata({ data }: { data: SoqtapataOverview }) {
  return (
    <section className="content-section bg-warm fade" id="overview">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2">{data.h2}</h2>
        {data.lead ? (
          <p
            className="body"
            style={{
              fontSize: 15,
              fontWeight: 300,
              color: 'var(--n700)',
              lineHeight: 1.8,
              maxWidth: 640,
              marginBottom: 12,
            }}
          >
            {data.lead}
          </p>
        ) : null}
        <p
          style={{
            fontSize: 15,
            fontWeight: 300,
            color: 'var(--n700)',
            lineHeight: 1.8,
            maxWidth: 640,
            marginBottom: 12,
          }}
        >
          {data.paragraphs[0]}
        </p>
        <p
          style={{
            fontSize: 15,
            fontWeight: 300,
            color: 'var(--n700)',
            lineHeight: 1.8,
            maxWidth: 640,
          }}
        >
          {data.paragraphs[1]}
        </p>
        <ul className="highlights" style={{ maxWidth: 560, marginTop: 20 }}>
          {data.highlights.map((h) => (
            <li className="highlight-item" key={h}>
              <div className="highlight-dot" />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
