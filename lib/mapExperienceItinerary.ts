import type {
  SoqtapataItinerary,
  SoqtapataItineraryDay,
  SoqtapataItineraryDayId,
} from '@/data/soqtapataExperienceLocal'
import type { SanityImageSource } from '@sanity/image-url'

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

export type CmsExperienceItineraryFields = {
  itinerary?: CmsItineraryDay[] | null
}

const DAY_IDS: SoqtapataItineraryDayId[] = [
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
]

function imgW(src: string | SanityImageSource | null | undefined, w: number): string | null {
  if (!src) return null
  if (typeof src === 'string') return src
  try {
    return urlFor(src).width(w).quality(85).url()
  } catch {
    return null
  }
}

function mapDayByDayDays(
  e: CmsExperienceItineraryFields,
  local: SoqtapataItinerary,
  lodgeModifiersFor: (
    lodgeId: string | undefined | null,
  ) => { highlightLabel?: string | null; nightsLabel?: string | null } | null,
): SoqtapataItineraryDay[] | null {
  const rows = e.itinerary
  if (!rows?.length) return null

  return rows.map((d, i) => {
    const template = local.days[i] ?? local.days[local.days.length - 1]!
    const dayNum = String(d.dayNumber ?? i + 1)
    const id: SoqtapataItineraryDayId = DAY_IDS[i] ?? template.id
    const photoSrc =
      (d.imageUrl && d.imageUrl.trim()) ||
      imgW(d.image, 960) ||
      template.photoSrc
    return {
      id,
      dayNum,
      title: (d.title && d.title.trim()) || template.title,
      subtitle: (d.subtitle && d.subtitle.trim()) || template.subtitle,
      photoSrc,
      photoAlt: (d.title && d.title.trim()) || template.photoAlt,
      caption: (d.photoCaption && d.photoCaption.trim()) || template.caption,
      timeline: (d.timeline ?? []).map((t, j) => {
        const fb = template.timeline[j] ?? template.timeline[template.timeline.length - 1]!
        return {
          time: (t.time && t.time.trim()) || fb.time,
          title: (t.title && t.title.trim()) || fb.title,
          desc: (t.description && t.description.trim()) || fb.desc,
        }
      }),
      lodgeBadge: (() => {
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
  const cmsDays = mapDayByDayDays(e, local, opts?.lodgeModifiersFor ?? (() => null))
  const days = cmsDays && cmsDays.length > 0 ? cmsDays : local.days

  return {
    ...local,
    days,
  }
}

export function experienceItineraryHasContent(data: SoqtapataItinerary): boolean {
  return data.days.length > 0
}
