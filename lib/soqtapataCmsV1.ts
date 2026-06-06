import { cache } from 'react'
import {
  soqtapataExperience,
  soqtapataExperienceReviewsLayout,
} from '@/data/soqtapataExperienceLocal'
import type { ReviewDoc, TechnologyProductDoc } from '@/lib/queries'
import {
  faqsSettingsQuery,
  soqtapataStructuredPageBySlugQuery,
  termsConditionsSettingsQuery,
  travellerGuideSettingsQuery,
} from '@/lib/queries'
import type { FaqsSettingsRow } from '@/lib/faqsCms'
import type { TermsConditionsSettingsRow } from '@/lib/termsConditionsCms'
import type { TravellerGuideSettingsRow } from '@/lib/travellerGuideCms'
import { clientServer } from '@/lib/sanity'
import {
  alsoBookFromStructuredRow,
  applyCmsExclusiveExperienceContent,
  experiencePromotionTarget,
  includedIdsFromRow,
  reviewsFromRow,
  reviewsLayoutFromRow,
  seoFromStructuredRow,
  soqtapataPartialFromStructuredRow,
  techProductsFromRow,
  type SoqtapataStructuredPageRow,
} from '@/lib/soqtapataStructuredCms'
import { buildSoqtapataBookingSummary } from '@/lib/buildSoqtapataBookingSummary'
import { getActivePromotions } from '@/lib/getPromotions'
import type { PromotionLegalAccordionItem } from '@/lib/promotionTypes'
import { resolvePromotionLegalItemsForExperience } from '@/lib/promotionPricing'

import type { ExperienceLearningContent } from '@/lib/experienceLearningTypes'
import { buildLearningPagePayloadFromStructuredRow } from '@/lib/learningProgrammeCms'
import { mergeInternalNavIntoPageNav } from '@/lib/soqtapataInternalNav'
import { buildRotatingQuoteItemsFromReviews } from '@/lib/reviewQuoteItems'
import {
  applySoqtapataSectionPresentation,
  type SoqtapataPageModuleRow,
  type SoqtapataSectionVisibility,
} from '@/lib/soqtapataSectionPresentation'
import {
  DEFAULT_REVIEWS_RATING_SUMMARY,
  normalizeReviewsRatingSummary,
  type ReviewsRatingSummary,
} from '@/lib/reviewsRatingSummary'
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
    reviewsRegionAriaLabel: string
    reviewTablistAriaLabel: string
    quoteDotAriaLabelPrefix: string
    reviewDotAriaLabelPrefix: string
    guestFallbackName: string
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
    ...(p.reviewsRegionAriaLabel?.trim() ? { reviewsRegionAriaLabel: p.reviewsRegionAriaLabel.trim() } : {}),
    ...(p.reviewTablistAriaLabel?.trim() ? { reviewTablistAriaLabel: p.reviewTablistAriaLabel.trim() } : {}),
    ...(p.quoteDotAriaLabelPrefix?.trim() ? { quoteDotAriaLabelPrefix: p.quoteDotAriaLabelPrefix.trim() } : {}),
    ...(p.reviewDotAriaLabelPrefix?.trim() ? { reviewDotAriaLabelPrefix: p.reviewDotAriaLabelPrefix.trim() } : {}),
    ...(p.guestFallbackName?.trim() ? { guestFallbackName: p.guestFallbackName.trim() } : {}),
  }
  return { experience: merged, reviewsLayout }
}

export type SoqtapataCmsPageDoc = {
  _id?: string
  slug?: { current?: string | null } | null
  /** Page-level SEO; structured fields (not legacy title/seoDescription). */
  seo?: { title?: string | null; description?: string | null } | null
} | null

export type {
  SoqtapataLayoutSectionKey,
  SoqtapataSectionVisibility,
} from '@/lib/soqtapataSectionPresentation'

/**
 * When Sanity env vars are missing or the published `experiencePage` / `experience` ref is unavailable,
 * the app can still render this slug using local static `soqtapataExperience` (dev / resilient builds).
 */
export const SOQTAPATA_LOCAL_FALLBACK_SLUG = 'soqtapata-pristine-immersion' as const

/** Payload merged from Sanity `experiencePage` + linked KC + local fallback. */
export type SoqtapataPageCmsPayload = {
  experience: SoqtapataExperience
  pageKind: 'tourism' | 'learning'
  learningContent: ExperienceLearningContent | null
  /** Experience KC `programType` — informational on tourism pages; `experiential-learning` on learning pages. */
  programType: string | null
  reviewsLayout: ExperienceReviewsLayoutMutable
  doc: SoqtapataCmsPageDoc
  cmsError: string | null
  seo: { title: string; description: string }
  sectionVisibility: SoqtapataSectionVisibility
  reviewsSectionLead: string | null | undefined
  reviewsRatingSummary: ReviewsRatingSummary
  rotatingQuoteItems: { text: string; attr: string }[]
  offerTerms: PromotionLegalAccordionItem[]
}

export const soqtapataPristineSeoDefault = {
  title: 'Soqtapata Pristine Immersion — Ecotone · Cusco, Perú',
  description:
    'The untouched cloud forest. Soqtapata Reserve, EcoDroneView®, ForestWhisper®, expert naturalist guide.',
} as const

/**
 * Loads `experiencePage` by slug, merges linked KC (`experience` or `learningProgramme`) with local fallback shape.
 *
 * Returns `null` when there is no published page for `slug`, no linked source KC, both sources linked,
 * or `slug` is empty — callers should `notFound()`.
 *
 * Exception: **`soqtapata-pristine-immersion`** may still resolve from **local static data only** when
 * Sanity env is not configured or the fetch fails, so offline dev keeps working.
 */
export const getSoqtapataPageCms = cache(async (slug: string): Promise<SoqtapataPageCmsPayload | null> => {
  const normalized = typeof slug === 'string' ? slug.trim() : ''
  if (!normalized) return null

  const local = soqtapataExperience
  const defaultsRl = soqtapataExperienceReviewsLayout

  function finalizePayload(params: {
    experience: SoqtapataExperience
    programType: string | null
    reviewsLayout: ExperienceReviewsLayoutMutable
    doc: SoqtapataCmsPageDoc
    cmsError: string | null
    seo: { title: string; description: string }
    sectionModules: SoqtapataPageModuleRow[] | null | undefined
    pageReviews: { eyebrow?: string | null; title?: string | null; body?: string | null } | null | undefined
    reviewsRatingSummary: ReviewsRatingSummary
    rotatingQuoteItems: { text: string; attr: string }[]
    offerTerms: PromotionLegalAccordionItem[]
  }): SoqtapataPageCmsPayload {
    const pres = applySoqtapataSectionPresentation({
      experience: params.experience,
      reviewsLayout: params.reviewsLayout,
      sectionModules: params.sectionModules ?? null,
      pageReviews: params.pageReviews ?? null,
    })
    applyExperienceReviewsLayoutResolvers(
      params.reviewsLayout,
      params.experience.reviews?.length ?? 0,
      params.experience.hero?.h1?.trim() || 'this program',
    )
    return {
      experience: params.experience,
      pageKind: 'tourism',
      learningContent: null,
      programType: params.programType,
      reviewsLayout: params.reviewsLayout,
      doc: params.doc,
      cmsError: params.cmsError,
      seo: params.seo,
      sectionVisibility: pres.sectionVisibility,
      reviewsSectionLead: pres.reviewsSectionLead,
      reviewsRatingSummary: params.reviewsRatingSummary,
      rotatingQuoteItems: params.rotatingQuoteItems,
      offerTerms: params.offerTerms,
    }
  }

  function payloadFromLocalFallback(cmsErr: string | null): SoqtapataPageCmsPayload | null {
    if (normalized !== SOQTAPATA_LOCAL_FALLBACK_SLUG) return null
    const experience = structuredClone(local) as SoqtapataExperience
    const reviewsLayout = reviewsLayoutFromRow(null, defaultsRl)
    return finalizePayload({
      experience,
      programType: null,
      reviewsLayout,
      doc: null,
      cmsError: cmsErr,
      seo: soqtapataPristineSeoDefault,
      sectionModules: null,
      pageReviews: null,
      reviewsRatingSummary: { ...DEFAULT_REVIEWS_RATING_SUMMARY },
      rotatingQuoteItems: [],
      offerTerms: [],
    })
  }

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return payloadFromLocalFallback(null)
  }

  let row: SoqtapataStructuredPageRow | null = null
  let cmsError: string | null = null
  let promotions: Awaited<ReturnType<typeof getActivePromotions>> = []
  try {
    const [pageRow, termsConditions, faqsSettings, travellerGuideSettings, promoRows] = await Promise.all([
      clientServer.fetch<SoqtapataStructuredPageRow | null>(soqtapataStructuredPageBySlugQuery, {
        slug: normalized,
      }),
      clientServer.fetch<TermsConditionsSettingsRow>(termsConditionsSettingsQuery),
      clientServer.fetch<FaqsSettingsRow>(faqsSettingsQuery),
      clientServer.fetch<TravellerGuideSettingsRow>(travellerGuideSettingsQuery),
      getActivePromotions(),
    ])
    promotions = promoRows
    row = pageRow
      ? {
          ...pageRow,
          termsConditions: termsConditions ?? null,
          faqsSettings: faqsSettings ?? null,
          travellerGuideSettings: travellerGuideSettings ?? null,
        }
      : null
  } catch (e) {
    cmsError = e instanceof Error ? e.message : 'Sanity fetch failed'
    return payloadFromLocalFallback(cmsError)
  }

  if (!row) return null

  const programme = row.learningProgramme
  const exp = row.experience
  if (programme && exp) return null

  if (programme) {
    if (programme.status !== 'active') return null
    return buildLearningPagePayloadFromStructuredRow(
      row,
      programme,
      {
        faqs: row.faqsSettings ?? null,
        terms: row.termsConditions ?? null,
        travellerGuide: row.travellerGuideSettings ?? null,
      },
      promotions,
    )
  }

  if (!exp) return null
  const soqtapataPartial = soqtapataPartialFromStructuredRow(row, local, promotions)
  const partial: Partial<SoqtapataExperience> = {
    ...soqtapataPartial,
  }
  const t = techProductsFromRow(row)
  if (t) partial.techProducts = t
  const inc = includedIdsFromRow(row)
  if (inc) partial.includedProductIds = inc as SoqtapataExperience['includedProductIds']
  let experience = normalizeMergedExperience(
    deepMergeWithLocalFallback(local, partial) as SoqtapataExperience,
  )
  /**
   * `deepMergeWithLocalFallback` only walks keys present on `local.book`, so fields that only exist
   * on the CMS-resolved book (`reserveTrustItems`, `termsPrefixText`, etc.) were dropped. Overlay the
   * canonical `alsoBook.book` after merge so Reserve CTA trust/terms match `reserveCtaSettings`.
   */
  if (partial.book) {
    experience = {
      ...experience,
      book: { ...experience.book, ...partial.book },
    }
  }
  const pageBookingSummary = buildSoqtapataBookingSummary(experience.hero, experience.book)
  const alsoBook = alsoBookFromStructuredRow(row, local, pageBookingSummary, promotions)
  if (alsoBook.book) {
    experience = {
      ...experience,
      book: { ...experience.book, ...alsoBook.book },
    }
  }
  experience = applyCmsExclusiveExperienceContent(experience, row, local, alsoBook, promotions)
  const offerTerms = exp
    ? resolvePromotionLegalItemsForExperience(experiencePromotionTarget(exp), promotions)
    : []
  const curatedReviews = reviewsFromRow(row)
  if (curatedReviews !== null) {
    experience = normalizeMergedExperience({ ...experience, reviews: curatedReviews })
  }
  const presForNav = applySoqtapataSectionPresentation({
    experience,
    reviewsLayout: reviewsLayoutFromRow(row, soqtapataExperienceReviewsLayout),
    sectionModules: row.sectionModules ?? null,
    pageReviews: row.reviewsSection ?? null,
  })
  const pageNavFromCms = mergeInternalNavIntoPageNav(
    row.internalNav,
    experience.pageNav,
    presForNav.sectionVisibility,
  )
  if (pageNavFromCms) {
    experience = { ...experience, pageNav: pageNavFromCms }
  }
  const reviewsLayout = reviewsLayoutFromRow(row, soqtapataExperienceReviewsLayout)
  const doc: SoqtapataCmsPageDoc = { _id: row._id, slug: row.slug, seo: row.seo }
  const seo = seoFromStructuredRow(row, { ...soqtapataPristineSeoDefault })
  return finalizePayload({
    experience,
    programType: exp?.programType?.trim() ?? null,
    reviewsLayout,
    doc,
    cmsError,
    seo,
    sectionModules: row.sectionModules ?? null,
    pageReviews: row.reviewsSection ?? null,
    reviewsRatingSummary: normalizeReviewsRatingSummary(row.reviewsSettings ?? null),
    rotatingQuoteItems: buildRotatingQuoteItemsFromReviews(row.reviewsSection?.rotatingReviews ?? []),
    offerTerms,
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
