import { cache } from 'react'
import {
  soqtapataExperience,
  soqtapataExperienceReviewsLayout,
} from '@/data/soqtapataExperienceLocal'
import type { ReviewDoc, TechnologyProductDoc } from '@/lib/queries'
import { soqtapataStructuredPageBySlugQuery } from '@/lib/queries'
import { clientServer } from '@/lib/sanity'
import {
  alsoBookFromStructuredRow,
  includedIdsFromRow,
  reviewsFromRow,
  reviewsLayoutFromRow,
  seoFromStructuredRow,
  soqtapataPartialFromStructuredRow,
  techProductsFromRow,
  type SoqtapataStructuredPageRow,
} from '@/lib/soqtapataStructuredCms'
import { mergeInternalNavIntoPageNav } from '@/lib/soqtapataInternalNav'
import {
  applySoqtapataSectionPresentation,
  type SoqtapataPageModuleRow,
} from '@/lib/soqtapataSectionPresentation'
import type { SectionModuleKey } from '@/lib/sectionPresentationTypes'
import { applyExperienceReviewsLayoutResolvers } from '@/lib/experienceReviewsPresentation'
import type { ExperienceReviewsLayoutMutable } from '@/lib/experienceReviewsPresentation'

export type SoqtapataExperience = typeof soqtapataExperience & {
  techEyebrow?: string
  techTitle?: string
}

export type SoqtapataCmsV1Payload = {
  v: 1
  experience: SoqtapataExperience
  /** Overrides opcionales de copy/layout para `ReviewsSection` (módulo reutilizable). */
  reviewsLayout?: Partial<{
    eyebrow: string
    headline: string
    averageRating: string
    sectionClassName: string
    contentInnerClassName: string
    useHomepageSampleReviewsIfEmpty: boolean
    sourceLabel: string
    secondaryRatingLine: string | null
    emptyMessage: string
  }>
}

function isEmptyValue(v: unknown): boolean {
  if (v === null || v === undefined) return true
  if (typeof v === 'string') return v.trim() === ''
  if (Array.isArray(v)) return v.length === 0
  return false
}

/**
 * Fusión profunda con respeto a “vacío = usar fallback local” (fase 1,
 * no sobrescribir con [], '' o null desde CMS).
 */
export function deepMergeWithLocalFallback<T>(local: T, remote: Partial<T> | null | undefined): T {
  if (remote == null) return local
  if (typeof local !== 'object' || local === null) {
    return isEmptyValue(remote) ? local : (remote as T)
  }
  if (Array.isArray(local)) {
    const r = remote as unknown
    if (Array.isArray(r) && r.length > 0) return r as T
    return local
  }
  const out: Record<string, unknown> = { ...(local as object as Record<string, unknown>) }
  for (const k of Object.keys(local as object)) {
    const lk = (local as Record<string, unknown>)[k]
    const rk = (remote as Record<string, unknown>)[k]
    if (rk === undefined) continue
    if (isEmptyValue(rk)) continue
    if (Array.isArray(lk)) {
      if (Array.isArray(rk) && rk.length > 0) out[k] = rk
    } else if (typeof lk === 'object' && lk !== null && !Array.isArray(lk)) {
      if (typeof rk === 'object' && rk !== null && !Array.isArray(rk)) {
        out[k] = deepMergeWithLocalFallback(lk, rk as Partial<typeof lk>)
      } else {
        out[k] = rk
      }
    } else {
      out[k] = rk
    }
  }
  return out as T
}

function normalizeTechProducts(list: TechnologyProductDoc[] | undefined): TechnologyProductDoc[] {
  if (!list?.length) return []
  return list.map((p) => ({
    _id: p._id,
    name: p.name,
    number: p.number,
    description: p.description,
    badgeText: p.badgeText,
    badgeTextWhenExcluded: p.badgeTextWhenExcluded,
    image: p.image ?? null,
  }))
}

function normalizeReviews(list: ReviewDoc[] | undefined): ReviewDoc[] {
  if (!list?.length) return []
  return list.map((r) => ({ ...r }))
}

/** Postprocesa la experiencia fusionada (IDs tech, reseñas, etc.). */
function normalizeMergedExperience(e: SoqtapataExperience): SoqtapataExperience {
  return {
    ...e,
    techProducts: normalizeTechProducts(e.techProducts),
    reviews: normalizeReviews(e.reviews),
  }
}

export function parseSoqtapataPayloadV1(text: string | null | undefined): SoqtapataCmsV1Payload | null {
  if (typeof text !== 'string' || !text.trim()) return null
  try {
    const raw = JSON.parse(text) as unknown
    if (!raw || typeof raw !== 'object') return null
    const o = raw as Record<string, unknown>
    if (o.v === 1 && o.experience && typeof o.experience === 'object') {
      return {
        v: 1,
        experience: o.experience as SoqtapataExperience,
        reviewsLayout: o.reviewsLayout as SoqtapataCmsV1Payload['reviewsLayout'],
      }
    }
    return null
  } catch {
    return null
  }
}

export function mergeFromCmsV1(
  local: SoqtapataExperience,
  localReviewsLayout: typeof soqtapataExperienceReviewsLayout,
  payload: SoqtapataCmsV1Payload | null,
): {
  experience: SoqtapataExperience
  reviewsLayout: ExperienceReviewsLayoutMutable
} {
  if (!payload) {
    return {
      experience: local,
      reviewsLayout: reviewsLayoutFromRow(null, localReviewsLayout),
    }
  }
  const merged = normalizeMergedExperience(
    deepMergeWithLocalFallback(local, payload.experience) as SoqtapataExperience,
  )
  const p = payload.reviewsLayout && typeof payload.reviewsLayout === 'object' ? payload.reviewsLayout : {}
  const reviewsLayout: ExperienceReviewsLayoutMutable = {
    ...reviewsLayoutFromRow(null, localReviewsLayout),
    ...(p.eyebrow?.trim() ? { eyebrow: p.eyebrow.trim() } : {}),
    ...(p.headline?.trim() ? { headline: p.headline.trim() } : {}),
    ...(p.averageRating?.trim() ? { averageRating: p.averageRating.trim() } : {}),
    ...(p.sectionClassName?.trim() ? { sectionClassName: p.sectionClassName.trim() } : {}),
    ...(p.contentInnerClassName?.trim() ? { contentInnerClassName: p.contentInnerClassName.trim() } : {}),
    ...(p.useHomepageSampleReviewsIfEmpty != null
      ? { useHomepageSampleReviewsIfEmpty: p.useHomepageSampleReviewsIfEmpty }
      : {}),
    ...(p.sourceLabel?.trim() ? { sourceLabel: p.sourceLabel.trim() } : {}),
    ...(p.secondaryRatingLine !== undefined && p.secondaryRatingLine !== null
      ? { secondaryRatingLine: String(p.secondaryRatingLine).trim() || '' }
      : {}),
    ...(p.emptyMessage !== undefined && p.emptyMessage !== null
      ? { emptyMessage: String(p.emptyMessage).trim() || '' }
      : {}),
  }
  return { experience: merged, reviewsLayout }
}

export type SoqtapataCmsPageDoc = {
  _id?: string
  slug?: { current?: string | null } | null
  /** Page-level SEO; structured fields (not legacy title/seoDescription). */
  seo?: { title?: string | null; description?: string | null } | null
} | null

export type SoqtapataSectionVisibility = Record<SectionModuleKey, boolean>

/**
 * Carga un documento `experiencePage` y fusiona v1 + fallback local.
 * Cacheada por request (Next dedup entre page + generateMetadata).
 */
const SOQTAPAT_SLUG = 'soqtapata-pristine-immersion' as const

export const soqtapataPristineSeoDefault = {
  title: 'Soqtapata Pristine Immersion — Ecotone · Cusco, Perú',
  description:
    'The untouched cloud forest. Soqtapata Reserve, EcoDroneView®, ForestWhisper®, expert naturalist guide.',
} as const

export const getSoqtapataPageCms = cache(async () => {
  const local = soqtapataExperience
  const defaultsRl = soqtapataExperienceReviewsLayout

  function finalizePayload(params: {
    experience: SoqtapataExperience
    reviewsLayout: ExperienceReviewsLayoutMutable
    doc: SoqtapataCmsPageDoc
    cmsError: string | null
    seo: { title: string; description: string }
    sectionModules: SoqtapataPageModuleRow[] | null | undefined
  }) {
    const pres = applySoqtapataSectionPresentation({
      experience: params.experience,
      reviewsLayout: params.reviewsLayout,
      sectionModules: params.sectionModules ?? null,
    })
    applyExperienceReviewsLayoutResolvers(
      params.reviewsLayout,
      params.experience.reviews?.length ?? 0,
      params.experience.hero?.h1?.trim() || 'this program',
    )
    return {
      experience: params.experience,
      reviewsLayout: params.reviewsLayout,
      doc: params.doc,
      cmsError: params.cmsError,
      seo: params.seo,
      sectionVisibility: pres.sectionVisibility,
      reviewsSectionLead: pres.reviewsSectionLead,
    }
  }

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    const experience = structuredClone(local) as SoqtapataExperience
    const reviewsLayout = reviewsLayoutFromRow(null, defaultsRl)
    return finalizePayload({
      experience,
      reviewsLayout,
      doc: null,
      cmsError: null,
      seo: soqtapataPristineSeoDefault,
      sectionModules: null,
    })
  }
  let row: SoqtapataStructuredPageRow = null
  let cmsError: string | null = null
  try {
    row = await clientServer.fetch<SoqtapataStructuredPageRow | null>(soqtapataStructuredPageBySlugQuery, {
      slug: SOQTAPAT_SLUG,
    })
  } catch (e) {
    cmsError = e instanceof Error ? e.message : 'Sanity fetch failed'
  }
  if (!row?.experience) {
    const experience = structuredClone(local) as SoqtapataExperience
    const reviewsLayout = reviewsLayoutFromRow(row ?? null, defaultsRl)
    return finalizePayload({
      experience,
      reviewsLayout,
      doc: null,
      cmsError,
      seo: soqtapataPristineSeoDefault,
      sectionModules: row?.sectionModules ?? null,
    })
  }
  const partial: Partial<SoqtapataExperience> = {
    ...soqtapataPartialFromStructuredRow(row),
    ...alsoBookFromStructuredRow(row, local),
  }
  const t = techProductsFromRow(row)
  if (t) partial.techProducts = t
  const inc = includedIdsFromRow(row)
  if (inc) partial.includedProductIds = inc as SoqtapataExperience['includedProductIds']
  let experience = normalizeMergedExperience(
    deepMergeWithLocalFallback(local, partial) as SoqtapataExperience,
  )
  const curatedReviews = reviewsFromRow(row)
  if (curatedReviews !== null) {
    experience = normalizeMergedExperience({ ...experience, reviews: curatedReviews })
  }
  const pageNavFromCms = mergeInternalNavIntoPageNav(row.internalNav, experience.pageNav)
  if (pageNavFromCms) {
    experience = { ...experience, pageNav: pageNavFromCms }
  }
  const reviewsLayout = reviewsLayoutFromRow(row, soqtapataExperienceReviewsLayout)
  const doc: SoqtapataCmsPageDoc = { _id: row._id, slug: row.slug, seo: row.seo }
  const seo = seoFromStructuredRow(row, { ...soqtapataPristineSeoDefault })
  return finalizePayload({
    experience,
    reviewsLayout,
    doc,
    cmsError,
    seo,
    sectionModules: row.sectionModules ?? null,
  })
})

export function buildDefaultPayloadV1String(): string {
  const p: SoqtapataCmsV1Payload = {
    v: 1,
    experience: soqtapataExperience,
    reviewsLayout: { ...soqtapataExperienceReviewsLayout },
  }
  return JSON.stringify(p, null, 2)
}
