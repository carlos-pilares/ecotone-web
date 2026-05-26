import type { SoqtapataAlsoCamanti } from '@/data/soqtapataExperienceLocal'
import { HOME_EXPERIENCE_PROGRAM_TO_FILTER } from '@/lib/homeExperienceCatalogLabels'
import {
  resolveExperienceCardPublicHref,
  toExperienceCardDataFromSanity,
  type ExperienceCardData,
} from '@/lib/experienceCardData'
import { resolveExperienceHeroImageUrl } from '@/lib/experienceHeroImage'
import type { ExperienceGalleryLikeRow, PhotoCollectionDoc } from '@/lib/photoLibraryResolve'
import type { ExperienceFromSanity } from '@/lib/queries'

function dataTypeFromProgram(programType: string | null | undefined): string {
  if (!programType) return 'nature'
  return HOME_EXPERIENCE_PROGRAM_TO_FILTER[programType] ?? programType
}

export type ExperienceCardImageSource = ExperienceFromSanity & {
  gallery?: ExperienceGalleryLikeRow[] | null
  galleryOrderKeys?: string[] | null
  photoCollection?: PhotoCollectionDoc
}

export function experienceCardImageUrl(doc: ExperienceCardImageSource, fallback?: string): string {
  const resolved = resolveExperienceHeroImageUrl({
    gallery: doc.gallery,
    galleryOrderKeys: doc.galleryOrderKeys,
    photoCollection: doc.photoCollection,
    mainImage: doc.mainImage,
    mainImageUrl: doc.mainImageUrl,
    width: 900,
  })
  if (resolved) return resolved
  return fallback?.trim() || ''
}

export function buildHomeExplorerSectionItems(
  list: ExperienceFromSanity[],
  opts: { cardImageFallback: string; cardCtaLabel: string },
): Array<{ key: string; card: ExperienceCardData; filterDataType: string }> {
  const out: Array<{ key: string; card: ExperienceCardData; filterDataType: string }> = []
  for (const doc of list) {
    const imageUrl = experienceCardImageUrl(doc, opts.cardImageFallback)
    const href = resolveExperienceCardPublicHref({
      experienceLandingSlug: doc.experienceLandingSlug,
      experienceSlug: doc.experienceSlug ?? doc.slug?.current,
    })
    const card = toExperienceCardDataFromSanity(doc, {
      href: href.trim(),
      imageUrl,
      ctaLabel: opts.cardCtaLabel,
    })
    if (!card) continue
    out.push({
      key: doc._id,
      card,
      filterDataType: dataTypeFromProgram(doc.programType),
    })
  }
  return out
}

export function buildLodgeExperienceSectionItems(
  cards: ExperienceCardData[],
  ctaLabel: string,
): Array<{ key: string; card: ExperienceCardData }> {
  return cards.map((card, i) => ({
    key: `${card.href}-${i}`,
    card: { ...card, ctaLabel: card.ctaLabel?.trim() || ctaLabel },
  }))
}

export function buildRoutesExperienceSectionItems(
  cards: Array<ExperienceCardData & { route?: string }>,
  ctaLabel: string,
): Array<{ key: string; card: ExperienceCardData; dataRoute?: string }> {
  return cards.map((card) => ({
    key: card.href,
    card: { ...card, ctaLabel: card.ctaLabel?.trim() || ctaLabel },
    dataRoute: card.route?.trim() || card.routeSlug,
  }))
}

export function buildRelatedExperienceSectionItems(
  cards: SoqtapataAlsoCamanti['cards'],
): Array<{ key: string; card: ExperienceCardData }> {
  const out: Array<{ key: string; card: ExperienceCardData }> = []
  let i = 0
  for (const raw of cards) {
    if (raw.kind !== 'image') continue
    const { kind: _k, ...card } = raw
    out.push({ key: `related-${i}`, card })
    i += 1
  }
  return out
}
