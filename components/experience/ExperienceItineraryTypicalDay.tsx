import type { ExperienceTypicalDaySection } from '@/data/soqtapataExperienceLocal'

export function ExperienceItineraryTypicalDay({
  section,
  showHeader = true,
}: {
  section: ExperienceTypicalDaySection
  showHeader?: boolean
}) {
  if (!section.rows.length) return null

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
      <div className="exp-typical-day">
        {section.rows.map((row) => (
          <div key={row.id} className="exp-typical-day__row">
            {row.timeLabel ? <div className="exp-typical-day__time">{row.timeLabel}</div> : <div aria-hidden />}
            <div>
              <p className="exp-typical-day__title">{row.title}</p>
              <p className="exp-typical-day__body">{row.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
