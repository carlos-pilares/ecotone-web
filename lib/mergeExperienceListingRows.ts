import { toExperienceCardData, type ExperienceCardData } from '@/lib/experienceCardData'
import { GROQ_LEARNING_PROGRAMME_LISTING_VIA_PAGE } from '@/lib/learningProgrammeGroq'
import type { ExperienceFromSanity } from '@/lib/queries'
import { groq } from 'next-sanity'

export type LearningProgrammeCardRow = {
  _id: string
  title?: string | null
  experienceSlug?: string | null
  experienceLandingSlug?: string | null
  programType?: string | null
  routeRefId?: string | null
  routeSlug?: string | null
  routeLabel?: string | null
  shortDescription?: string | null
  price?: number | null
  priceLabel?: string | null
  status?: string | null
  durationDisplay?: string | null
  mainImageUrl?: string | null
}

export const learningProgrammesForListingQuery = groq`
  *[_type == "experiencePage" && defined(learningProgramme._ref) && learningProgramme->status == "active" && defined(slug.current)]
    | order(learningProgramme->price asc) {
    ${GROQ_LEARNING_PROGRAMME_LISTING_VIA_PAGE}
  }
`

/** Maps a Learning Programme card row to the home explorer / listing shape. */
export function learningProgrammeToExperienceFromSanity(row: LearningProgrammeCardRow): ExperienceFromSanity {
  const slug = row.experienceLandingSlug?.trim() || row.experienceSlug?.trim() || ''
  return {
    _id: row._id,
    name: row.title?.trim() || '',
    slug: { current: slug },
    experienceSlug: slug,
    experienceLandingSlug: slug,
    programType: row.programType?.trim() || 'experiential-learning',
    route: row.routeSlug?.trim() || undefined,
    routeSlug: row.routeSlug?.trim() || undefined,
    routeLabel: row.routeLabel?.trim() || undefined,
    routeRefId: row.routeRefId?.trim() || undefined,
    shortDescription: row.shortDescription?.trim() || undefined,
    price: row.price ?? null,
    priceLabel: row.priceLabel ?? null,
    status: row.status?.trim() || 'active',
    duration: row.durationDisplay?.trim() || undefined,
    mainImageUrl: row.mainImageUrl?.trim() || undefined,
    mainImage: null,
  }
}

export function mergeExperienceListingRows(
  experiences: ExperienceFromSanity[],
  learningProgrammes: LearningProgrammeCardRow[] | null | undefined,
): ExperienceFromSanity[] {
  const merged = [...experiences]
  for (const row of learningProgrammes ?? []) {
    const slug = row.experienceLandingSlug?.trim() || row.experienceSlug?.trim()
    if (!row?._id || !row.title?.trim() || !slug) continue
    merged.push(learningProgrammeToExperienceFromSanity(row))
  }
  return merged
}

export function toExperienceCardDataFromLearningProgramme(
  row: LearningProgrammeCardRow,
  opts?: { href?: string; ctaLabel?: string },
): ExperienceCardData | null {
  const slug = row.experienceLandingSlug?.trim() || row.experienceSlug?.trim()
  const title = row.title?.trim()
  const imageUrl = row.mainImageUrl?.trim()
  if (!slug || !title || !imageUrl) return null
  const href = opts?.href?.trim() || `/experiences/${slug}`
  return (
    toExperienceCardData(
      {
        name: title,
        mainImageUrl: imageUrl,
        programType: row.programType?.trim() || 'experiential-learning',
        routeSlug: row.routeSlug?.trim(),
        routeLabel: row.routeLabel?.trim(),
        shortDescription: row.shortDescription?.trim(),
        price: row.price,
        priceLabel: row.priceLabel,
        experienceId: row._id,
        routeRefId: row.routeRefId?.trim(),
        experienceLandingSlug: slug,
        experienceSlug: slug,
        status: row.status?.trim() || 'active',
      },
      { href, ctaLabel: opts?.ctaLabel },
    ) ?? null
  )
}

export function learningProgrammeToRoutesListedRow(row: LearningProgrammeCardRow) {
  const slug = row.experienceLandingSlug?.trim() || row.experienceSlug?.trim()
  if (!slug || !row.title?.trim()) return null
  return {
    experienceId: row._id,
    landingSlug: slug,
    routeRefId: row.routeRefId?.trim(),
    routeSlug: row.routeSlug?.trim(),
    routeLabel: row.routeLabel?.trim(),
    name: row.title.trim(),
    experienceSlug: slug,
    duration: row.durationDisplay?.trim(),
    programType: row.programType?.trim() || 'experiential-learning',
    shortDescription: row.shortDescription?.trim(),
    price: row.price,
    priceLabel: row.priceLabel,
    status: row.status?.trim() || 'active',
    mainImageUrl: row.mainImageUrl?.trim(),
    lodgeEnquireSmartLink: null,
  }
}
