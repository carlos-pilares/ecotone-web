/** Experience page itinerary display modes (Experience KC). */

export type ExperienceItineraryMode = 'dayByDay' | 'programmeFlow' | 'typicalDay' | 'hybrid'

export type ExperienceProgrammePhase = {
  id: string
  title: string
  subtitle?: string
  body: string
  imageSrc?: string
  imageAlt?: string
  durationLabel?: string
  accommodation?: string
}

export type ExperienceProgrammeFlowSection = {
  eyebrow?: string
  title?: string
  intro?: string
  phases: ExperienceProgrammePhase[]
}

export type ExperienceTypicalDayRow = {
  id: string
  timeLabel?: string
  title: string
  body: string
}

export type ExperienceTypicalDaySection = {
  eyebrow?: string
  title?: string
  intro?: string
  rows: ExperienceTypicalDayRow[]
}

export type ExperienceDurationOption = {
  id: string
  label: string
  durationDetail?: string
  shortBreakdown?: string
  priceLabel?: string
  startDates?: string
  enabled: boolean
}

export function normalizeExperienceItineraryMode(
  raw: string | null | undefined,
): ExperienceItineraryMode {
  if (raw === 'programmeFlow' || raw === 'typicalDay' || raw === 'hybrid') return raw
  return 'dayByDay'
}
