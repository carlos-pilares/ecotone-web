import type { ExperienceDurationOption } from '@/data/soqtapataExperienceLocal'

export function ExperienceDurationOptions({ options }: { options: ExperienceDurationOption[] }) {
  const enabled = options.filter((o) => o.enabled)
  if (!enabled.length) return null

  return (
    <div className="exp-itin-durations" role="list" aria-label="Programme duration options">
      {enabled.map((opt) => (
        <article key={opt.id} className="exp-itin-duration-card" role="listitem">
          <p className="exp-itin-duration-card__label">{opt.label}</p>
          {opt.durationDetail ? <p className="exp-itin-duration-card__detail">{opt.durationDetail}</p> : null}
          {opt.shortBreakdown ? <p className="exp-itin-duration-card__breakdown">{opt.shortBreakdown}</p> : null}
          {opt.startDates ? <p className="exp-itin-duration-card__dates">{opt.startDates}</p> : null}
          {opt.priceLabel ? <p className="exp-itin-duration-card__price">{opt.priceLabel}</p> : null}
        </article>
      ))}
    </div>
  )
}
