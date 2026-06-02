import type {
  SoqtapataItinerary,
  SoqtapataItineraryDay,
} from '@/data/soqtapataExperienceLocal'
import type { SanityImageSource } from '@sanity/image-url'

import {
  normalizeExperienceItineraryMode,
  type ExperienceDurationOption,
  type ExperienceItineraryMode,
  type ExperienceProgrammeFlowSection,
  type ExperienceTypicalDaySection,
} from '@/lib/experienceItineraryTypes'
import { formatUsdAmountPublic } from '@/lib/formatExperiencePrice'
import { urlFor } from '@/lib/sanity'

type CmsItineraryDay = {
  dayNumber?: number | null
  title?: string | null
  subtitle?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
  photoCaption?: string | null
  timeline?: { time?: string; title?: string; description?: string }[] | null
  overnight?: { mode?: string | null } | null
  overnightLodge?: { _id?: string; name?: string | null } | null
  lodgeOvernight?: string | null
  lodgeSub?: string | null
}

type CmsProgrammePhase = {
  _key?: string | null
  title?: string | null
  subtitle?: string | null
  body?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
  durationLabel?: string | null
  accommodation?: string | null
}

type CmsTypicalDayRow = {
  _key?: string | null
  timeLabel?: string | null
  title?: string | null
  body?: string | null
}

type CmsDurationOption = {
  _key?: string | null
  label?: string | null
  durationDetail?: string | null
  shortBreakdown?: string | null
  price?: number | null
  startDates?: string | null
  enabled?: boolean | null
}

export type CmsExperienceItineraryFields = {
  itineraryMode?: string | null
  programmeFlow?: {
    eyebrow?: string | null
    title?: string | null
    intro?: string | null
    phases?: CmsProgrammePhase[] | null
  } | null
  typicalDay?: {
    eyebrow?: string | null
    title?: string | null
    intro?: string | null
    rows?: CmsTypicalDayRow[] | null
  } | null
  hybridSummaryIntro?: string | null
  durationOptions?: CmsDurationOption[] | null
  itinerary?: CmsItineraryDay[] | null
}

const DAY_IDS = [
  'day1',
  'day2',
  'day3',
  'day4',
  'day5',
  'day6',
  'day7',
  'day8',
  'day9',
  'day10',
] as const

function assetToUrl(image: SanityImageSource | null | undefined, width: number, fallback: string): string {
  if (!image) return fallback
  try {
    return urlFor(image).width(width).quality(85).auto('format').url()
  } catch {
    return fallback
  }
}

function mapDurationOptions(raw: CmsDurationOption[] | null | undefined): ExperienceDurationOption[] {
  if (!raw?.length) return []
  return raw
    .filter((o) => o && o.enabled !== false && String(o.label ?? '').trim())
    .map((o, i) => {
      const price =
        typeof o.price === 'number' && o.price > 0
          ? `from USD ${formatUsdAmountPublic(o.price)}`
          : undefined
      return {
        id: (o._key && String(o._key)) || `dur-${i}`,
        label: String(o.label).trim(),
        durationDetail: o.durationDetail?.trim() || undefined,
        shortBreakdown: o.shortBreakdown?.trim() || undefined,
        priceLabel: price,
        startDates: o.startDates?.trim() || undefined,
        enabled: o.enabled !== false,
      }
    })
}

function mapProgrammeFlow(
  raw: CmsExperienceItineraryFields['programmeFlow'],
): ExperienceProgrammeFlowSection | undefined {
  const phases = (raw?.phases ?? [])
    .filter((p) => p && String(p.title ?? '').trim() && String(p.body ?? '').trim())
    .map((p, i) => ({
      id: (p._key && String(p._key)) || `phase-${i}`,
      title: String(p.title).trim(),
      subtitle: p.subtitle?.trim() || undefined,
      body: String(p.body).trim(),
      imageSrc: p.imageUrl || (p.image ? assetToUrl(p.image, 960, '') : undefined) || undefined,
      imageAlt: p.title?.trim() || undefined,
      durationLabel: p.durationLabel?.trim() || undefined,
      accommodation: p.accommodation?.trim() || undefined,
    }))
  if (!phases.length && !raw?.intro?.trim()) return undefined
  return {
    eyebrow: raw?.eyebrow?.trim() || undefined,
    title: raw?.title?.trim() || undefined,
    intro: raw?.intro?.trim() || undefined,
    phases,
  }
}

function mapTypicalDay(
  raw: CmsExperienceItineraryFields['typicalDay'],
): ExperienceTypicalDaySection | undefined {
  const rows = (raw?.rows ?? [])
    .filter((r) => r && String(r.title ?? '').trim() && String(r.body ?? '').trim())
    .map((r, i) => ({
      id: (r._key && String(r._key)) || `tday-${i}`,
      timeLabel: r.timeLabel?.trim() || undefined,
      title: String(r.title).trim(),
      body: String(r.body).trim(),
    }))
  if (!rows.length && !raw?.intro?.trim()) return undefined
  return {
    eyebrow: raw?.eyebrow?.trim() || undefined,
    title: raw?.title?.trim() || undefined,
    intro: raw?.intro?.trim() || undefined,
    rows,
  }
}

function mapDayByDayDays(
  e: CmsExperienceItineraryFields,
  local: SoqtapataItinerary,
  lodgeModifiersFor: (
    lodgeId: string | undefined | null,
  ) => { highlightLabel?: string | null; nightsLabel?: string | null } | null,
  experienceLodgeRows?: { lodge?: { _id?: string; name?: string | null } | null }[] | null,
): SoqtapataItineraryDay[] | null {
  if (!e.itinerary?.length) return null
  const localDays = local.days
  const lastLocal = localDays[localDays.length - 1]!
  return e.itinerary.map((d, i) => {
    const template = localDays[i] ?? lastLocal
    const id = (DAY_IDS[i] ?? (`day${i + 1}` as (typeof DAY_IDS)[number])) as SoqtapataItineraryDay['id']
    const photo = d.imageUrl || (d.image ? assetToUrl(d.image, 1000, template.photoSrc) : template.photoSrc)
    return {
      ...template,
      id,
      dayNum: String(d.dayNumber ?? i + 1),
      title: d.title || template.title,
      subtitle: d.subtitle || template.subtitle,
      photoSrc: photo,
      photoAlt: d.title || template.photoAlt,
      caption: d.photoCaption || template.caption,
      timeline: (d.timeline && d.timeline.length > 0
        ? d.timeline.map((t) => ({
            time: t.time || '',
            title: t.title || '',
            desc: t.description || '',
          }))
        : template.timeline) as SoqtapataItineraryDay['timeline'],
      lodgeBadge: (() => {
        const mode = d.overnight?.mode
        if (mode === 'none') return undefined
        const lod = d.overnightLodge
        if (lod?.name?.trim()) {
          const mod = lodgeModifiersFor?.(lod._id)
          const sub =
            (mod?.highlightLabel && mod.highlightLabel.trim()) ||
            (mod?.nightsLabel && mod.nightsLabel.trim()) ||
            ''
          return { name: lod.name.trim(), sub }
        }
        if (d.lodgeOvernight || d.lodgeSub) {
          return { name: (d.lodgeOvernight || '').trim(), sub: (d.lodgeSub || '').trim() }
        }
        return template.lodgeBadge
      })(),
    }
  })
}

export function buildExperienceItineraryFromCms(
  e: CmsExperienceItineraryFields,
  local: SoqtapataItinerary,
  opts?: {
    lodgeModifiersFor?: (
      lodgeId: string | undefined | null,
    ) => { highlightLabel?: string | null; nightsLabel?: string | null } | null
  },
): SoqtapataItinerary {
  const mode: ExperienceItineraryMode = normalizeExperienceItineraryMode(e.itineraryMode)
  const programmeFlow = mapProgrammeFlow(e.programmeFlow)
  const typicalDay = mapTypicalDay(e.typicalDay)
  const durationOptions = mapDurationOptions(e.durationOptions)
  const hybridSummaryIntro = e.hybridSummaryIntro?.trim() || undefined

  const cmsDays = mapDayByDayDays(e, local, opts?.lodgeModifiersFor ?? (() => null))
  const days =
    mode === 'programmeFlow' || mode === 'typicalDay'
      ? []
      : cmsDays && cmsDays.length > 0
        ? cmsDays
        : mode === 'dayByDay'
          ? local.days
          : []

  return {
    ...local,
    mode,
    days,
    programmeFlow,
    typicalDay,
    hybridSummaryIntro,
    durationOptions: durationOptions.length ? durationOptions : undefined,
  }
}

export function experienceItineraryHasContent(data: SoqtapataItinerary): boolean {
  if (data.durationOptions?.some((d) => d.enabled)) return true
  if (data.programmeFlow?.phases?.length) return true
  if (data.typicalDay?.rows?.length) return true
  if (data.mode === 'dayByDay' || data.mode === 'hybrid') {
    if (data.days.length > 0) return true
  }
  if (data.hybridSummaryIntro?.trim()) return true
  return false
}
