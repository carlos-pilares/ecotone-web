'use client'

import type { SoqtapataItinerary } from '@/data/soqtapataExperienceLocal'
import { experienceItineraryHasContent } from '@/lib/mapExperienceItinerary'

import { ExperienceItineraryDayByDay } from '@/components/experience/ExperienceItineraryDayByDay'

const leadStyle = {
  fontSize: 15,
  fontWeight: 300,
  color: 'var(--n700)',
  lineHeight: 1.75,
  maxWidth: 640,
  marginBottom: 16,
} as const

function SectionLead({ text }: { text?: string }) {
  if (!text?.trim()) return null
  return (
    <p className="body" style={leadStyle}>
      {text}
    </p>
  )
}

/** Day-by-day tourism itinerary section. Anchor id stays `#itinerary`. */
export function ExperienceItinerarySoqtapata({ data }: { data: SoqtapataItinerary }) {
  if (!experienceItineraryHasContent(data)) return null

  return (
    <section className="content-section fade" id="itinerary">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2">{data.h2}</h2>
        <SectionLead text={data.lead} />
        <ExperienceItineraryDayByDay days={data.days} />
      </div>
    </section>
  )
}
