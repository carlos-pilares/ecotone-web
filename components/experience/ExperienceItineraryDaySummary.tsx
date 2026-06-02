import type { SoqtapataItineraryDay } from '@/data/soqtapataExperienceLocal'

export function ExperienceItineraryDaySummary({ days }: { days: SoqtapataItineraryDay[] }) {
  if (!days.length) return null

  return (
    <div className="exp-itin-summary" aria-label="Programme summary by day">
      {days.map((day) => (
        <div key={day.id} className="exp-itin-summary__item">
          <span className="exp-itin-summary__num">{day.dayNum}</span>
          <div>
            <p className="exp-itin-summary__title">{day.title}</p>
            {day.subtitle ? <p className="exp-itin-summary__sub">{day.subtitle}</p> : null}
          </div>
        </div>
      ))}
    </div>
  )
}
