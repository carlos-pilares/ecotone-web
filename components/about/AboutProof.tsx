import type { AboutPageResolved } from '@/lib/resolveAboutPageData'

type ProofData = AboutPageResolved['proof']

export function AboutProof({ data }: { data: ProofData }) {
  return (
    <section className="content-section bg-dark fade" id={data.sectionId}>
      <div className="content-inner">
        <div className="eyebrow eyebrow-lt">{data.eyebrow}</div>
        <h2 className="about-proof-h2">{data.headline}</h2>
        <p className="about-proof-intro">{data.intro}</p>
        <div className="proof-stats">
          {data.stats.map((s) => (
            <div key={s.label} className="proof-stat">
              <div className="proof-stat-n">{s.number}</div>
              <div className="proof-stat-label">{s.label}</div>
              <div className="proof-stat-desc">{s.description}</div>
            </div>
          ))}
        </div>
        <div className="proof-divider" aria-hidden />
        <div className="proof-certs">
          <span className="proof-cert-label">{data.certLabel}</span>
          {data.certs.map((label) => (
            <span key={label} className="proof-cert">
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
