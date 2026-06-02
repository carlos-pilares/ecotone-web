'use client'

import type { SoqtapataItinerary } from '@/data/soqtapataExperienceLocal'
import { experienceItineraryHasContent } from '@/lib/mapExperienceItinerary'

import { ExperienceDurationOptions } from '@/components/experience/ExperienceDurationOptions'
import { ExperienceItineraryDayByDay } from '@/components/experience/ExperienceItineraryDayByDay'
import { ExperienceItineraryDaySummary } from '@/components/experience/ExperienceItineraryDaySummary'
import { ExperienceItineraryProgrammeFlow } from '@/components/experience/ExperienceItineraryProgrammeFlow'
import { ExperienceItineraryTypicalDay } from '@/components/experience/ExperienceItineraryTypicalDay'

import '@/components/experience/experience-itinerary-modes.css'

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

/**
 * Itinerary / programme section — mode driven by Experience KC `itineraryMode`.
 * Anchor id stays `#itinerary` (custom nav label via Experience Page internal menu).
 */
export function ExperienceItinerarySoqtapata({ data }: { data: SoqtapataItinerary }) {
  if (!experienceItineraryHasContent(data)) return null

  const mode = data.mode ?? 'dayByDay'
  const durations = data.durationOptions ?? []

  const headerEyebrow =
    (mode === 'programmeFlow' && data.programmeFlow?.eyebrow) ||
    (mode === 'typicalDay' && data.typicalDay?.eyebrow) ||
    data.eyebrow
  const headerTitle =
    (mode === 'programmeFlow' && data.programmeFlow?.title) ||
    (mode === 'typicalDay' && data.typicalDay?.title) ||
    data.h2
  const headerLead =
    (mode === 'programmeFlow' && data.programmeFlow?.intro) ||
    (mode === 'typicalDay' && data.typicalDay?.intro) ||
    data.lead

  return (
    <section className="content-section fade" id="itinerary">
      <div className="content-inner">
        <div className="eyebrow">{headerEyebrow}</div>
        <h2 className="h2">{headerTitle}</h2>
        <SectionLead text={headerLead} />

        {durations.length > 0 ? <ExperienceDurationOptions options={durations} /> : null}

        {mode === 'dayByDay' ? <ExperienceItineraryDayByDay days={data.days} /> : null}

        {mode === 'programmeFlow' && data.programmeFlow ? (
          <ExperienceItineraryProgrammeFlow section={data.programmeFlow} showHeader={false} />
        ) : null}

        {mode === 'typicalDay' && data.typicalDay ? (
          <ExperienceItineraryTypicalDay section={data.typicalDay} showHeader={false} />
        ) : null}

        {mode === 'hybrid' ? (
          <>
            {data.programmeFlow?.phases.length ? (
              <ExperienceItineraryProgrammeFlow
                section={{
                  ...data.programmeFlow,
                  eyebrow: data.programmeFlow.eyebrow || 'Programme flow',
                  title: data.programmeFlow.title || 'Your pathway',
                }}
              />
            ) : null}
            {data.typicalDay?.rows.length ? (
              <ExperienceItineraryTypicalDay
                section={{
                  ...data.typicalDay,
                  eyebrow: data.typicalDay.eyebrow || 'A typical day',
                  title: data.typicalDay.title || 'In the field',
                }}
              />
            ) : null}
            {data.hybridSummaryIntro || data.days.length > 0 ? (
              <div className="exp-itin-subsection">
                <div className="eyebrow">At a glance</div>
                <h3 className="h2">Itinerary summary</h3>
                <SectionLead text={data.hybridSummaryIntro} />
                <ExperienceItineraryDaySummary days={data.days} />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  )
}
