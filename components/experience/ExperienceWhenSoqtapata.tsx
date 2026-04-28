import type { SoqtapataWhen, SoqtapataWhenMonth } from '@/data/soqtapataExperienceLocal'

function monthCardClass(m: SoqtapataWhenMonth) {
  if (m.cardClass === 'good') return 'month-card good'
  if (m.cardClass === 'peak') return 'month-card peak'
  return 'month-card'
}

function MonthName({ m }: { m: SoqtapataWhenMonth }) {
  return (
    <div className="month-name">
      {m.name}
      {m.stars && m.stars.level === 1 ? (
        <>
          {' '}
          <span className="month-peak-stars" aria-label={m.stars.aria}>
            ★
          </span>
        </>
      ) : null}
      {m.stars && m.stars.level === 2 ? (
        <>
          {' '}
          <span className="month-peak-stars" aria-label={m.stars.aria}>
            ★★
          </span>
        </>
      ) : null}
    </div>
  )
}

/**
 * `section#when` con clase `when-soqtapata-mobile` para grid 2 col en móvil (sin scroll horizontal).
 * Paridad de contenido con `ecotone-experience_2.html`.
 */
export function ExperienceWhenSoqtapata({ data }: { data: SoqtapataWhen }) {
  return (
    <section
      className="content-section bg-warm fade when-soqtapata-mobile"
      id="when"
    >
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={data.h2Style}>
          {data.h2}
        </h2>
        <p style={data.introStyle}>{data.intro}</p>
        <div className="months-grid" role="list">
          {data.months.map((m) => (
            <div className={monthCardClass(m)} role="listitem" key={m.name}>
              <div className="month-bar" style={{ background: m.barStyle }} />
              <div className="month-body">
                <MonthName m={m} />
                <div className="month-highlight">{m.highlight}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="months-legend" role="group" aria-label="How to read the season bands">
          <div className="months-legend-eyebrow">{data.legend.eyebrow}</div>
          {data.legend.items.map((it) => (
            <div className="legend-item" key={it.strong}>
              <div className="legend-swatch" style={it.swatchStyle} />
              <span>
                <strong>{it.strong}</strong>
                {it.rest}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
