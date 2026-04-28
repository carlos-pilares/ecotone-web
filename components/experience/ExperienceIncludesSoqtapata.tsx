import type { SoqtapataIncludes } from '@/data/soqtapataExperienceLocal'

function IncCheckSvg() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IncCrossSvg() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--n400)" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

/** `section#includes` — paridad con `ecotone-experience_2.html`. */
export function ExperienceIncludesSoqtapata({ data }: { data: SoqtapataIncludes }) {
  return (
    <section className="content-section bg-warm fade" id="includes">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={data.lead ? { ...data.h2Style, marginBottom: 6 } : data.h2Style}>
          {data.h2}
        </h2>
        {data.lead ? (
          <p className="body" style={{ fontSize: 14, maxWidth: 560, marginBottom: 18, color: 'var(--n700)' }}>
            {data.lead}
          </p>
        ) : null}
        <div className="includes-grid">
          <div className="includes-col includes-col-yes">
            <div className="includes-title includes-title-yes">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#27500A" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {data.includedTitle}
            </div>
            <ul className="includes-list">
              {data.yes.map((line) => (
                <li className="includes-item includes-item-yes" key={line}>
                  <div className="inc-check">
                    <IncCheckSvg />
                  </div>
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="includes-col includes-col-no">
            <div className="includes-title includes-title-no">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--n400)" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              {data.notTitle}
            </div>
            <ul className="includes-list">
              {data.no.map((line) => (
                <li className="includes-item includes-item-no" key={line}>
                  <div className="inc-cross">
                    <IncCrossSvg />
                  </div>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
