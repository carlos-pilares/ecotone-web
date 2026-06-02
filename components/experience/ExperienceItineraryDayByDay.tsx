'use client'

import { useCallback, useState } from 'react'
import type { SoqtapataItineraryDay } from '@/data/soqtapataExperienceLocal'

const LODGE_SVG = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={2}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
)

function DayChevron({ open }: { open: boolean }) {
  return (
    <svg
      className="day-chevron"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={open ? 'var(--brown)' : 'var(--n400)'}
      strokeWidth="2.5"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

/** Classic day-by-day accordion itinerary. */
export function ExperienceItineraryDayByDay({ days }: { days: SoqtapataItineraryDay[] }) {
  const [openId, setOpenId] = useState<string>(days[0]?.id ?? 'day1')

  const handleToggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? '' : id))
  }, [])

  if (!days.length) return null

  return (
    <div className="itinerary">
      {days.map((day) => (
        <ItineraryDayCard key={day.id} day={day} open={openId === day.id} onToggle={handleToggle} />
      ))}
    </div>
  )
}

function ItineraryDayCard({
  day,
  open,
  onToggle,
}: {
  day: SoqtapataItineraryDay
  open: boolean
  onToggle: (id: string) => void
}) {
  return (
    <div className={'day-card' + (open ? ' open' : '')} id={day.id}>
      <div className="day-header" onClick={() => onToggle(day.id)}>
        <div className="day-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="day-num">{day.dayNum}</div>
            <div>
              <div className="day-title">{day.title}</div>
              <div className="day-subtitle">{day.subtitle}</div>
            </div>
          </div>
          <DayChevron open={open} />
        </div>
      </div>
      <div className="day-body">
        <div className="day-open-content">
          <div className="day-open-text">
            <div className="day-body-inner">
              {day.timeline.map((t) => (
                <div className="timeline-item" key={`${t.time}-${t.title}`}>
                  <div className="timeline-time">{t.time}</div>
                  <div>
                    <div className="timeline-title">{t.title}</div>
                    <div className="timeline-desc">{t.desc}</div>
                  </div>
                </div>
              ))}
              {day.lodgeBadge ? (
                <div className="day-lodge-badge">
                  {LODGE_SVG}
                  <span className="day-lodge-name">{day.lodgeBadge.name}</span>
                  <span className="day-lodge-sub">{day.lodgeBadge.sub}</span>
                </div>
              ) : null}
            </div>
          </div>
          <figure className="day-image">
            <img src={day.photoSrc} alt={day.photoAlt} decoding="async" />
            <div className="day-photo-overlay" />
            {day.caption ? <figcaption className="day-photo-caption">{day.caption}</figcaption> : null}
          </figure>
        </div>
      </div>
    </div>
  )
}
