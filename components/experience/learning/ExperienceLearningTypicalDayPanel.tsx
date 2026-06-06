import type { ExperienceLearningTypicalDayContent } from '@/lib/experienceLearningTypes'

const NOTE_SVG = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={2} aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

export function ExperienceLearningTypicalDayPanel({
  content,
  intro,
}: {
  content: ExperienceLearningTypicalDayContent
  intro?: string
}) {
  const { rows, imageSrc, imageAlt, imageCaption, footnote } = content
  if (!rows.length) return null

  return (
    <>
      <p className="exp-learning-lead exp-learning-typical-day__intro">
        {intro?.trim() ||
          'Rhythms shift with season and project rotation — this is the shape of a standard field day, not a fixed itinerary.'}
      </p>
      <div className="exp-learning-typical-day">
        <div className="exp-learning-typical-day__grid">
          <div className="exp-learning-typical-day__timeline">
            {rows.map((row) => (
              <div key={row.id} className="timeline-item">
                <div className="timeline-time">{row.timeLabel}</div>
                <div>
                  <div className="timeline-title">{row.title}</div>
                  {row.body ? <div className="timeline-desc">{row.body}</div> : null}
                </div>
              </div>
            ))}
            {footnote ? (
              <div className="exp-learning-typical-day__note">
                {NOTE_SVG}
                <span className="exp-learning-typical-day__note-text">{footnote}</span>
              </div>
            ) : null}
          </div>
          <figure className="exp-learning-typical-day__image">
            <img src={imageSrc} alt={imageAlt} decoding="async" />
            <div className="day-photo-overlay" aria-hidden />
            {imageCaption ? <figcaption className="day-photo-caption is-visible">{imageCaption}</figcaption> : null}
          </figure>
        </div>
      </div>
    </>
  )
}
