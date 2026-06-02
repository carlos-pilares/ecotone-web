/**
 * Sanity → shape `soqtapataExperience` (mismo que `data/soqtapataExperienceLocal.ts`).
 * Solo capa de datos: URLs de imagen, mapeo de campos, partial para `deepMergeWithLocalFallback`.
 */
import type { SanityImageSource } from '@sanity/image-url'

import { soqtapataExperience } from '@/data/soqtapataExperienceLocal'
import type {
  SoqtapataAlsoCamanti,
  SoqtapataBook,
  SoqtapataMedia,
  SoqtapataMediaThumb,
  SoqtapataPhase1BreadcrumbItem,
  SoqtapataPhase1GalleryCell,
  SoqtapataLodgeCard,
  SoqtapataRelatedCardImage,
  SoqtapataRelatedCardTailor,
  SoqtapataResourceCard,
  SoqtapataWhen,
  SoqtapataWhenMonth,
  BfygCard,
} from '@/data/soqtapataExperienceLocal'

type SoqtapataExperience = typeof soqtapataExperience
import type { ReviewDoc, TechnologyProductDoc } from '@/lib/queries'
import type { CmsInternalNav } from '@/lib/soqtapataInternalNav'
import type { SoqtapataPageModuleRow } from '@/lib/soqtapataSectionPresentation'
import { resolveLodgeIdentityImageUrl } from '@/lib/lodgeGalleryResolve'
import type { LodgeGalleryItemRow } from '@/lib/lodgePageCmsTypes'
import { mergeLodgeGalleryWithPhotoLibrary, type PhotoCollectionDoc } from '@/lib/photoLibraryResolve'
import { urlFor } from '@/lib/sanity'
import { resolveTailorMadeBand } from '@/lib/tailorMadeBand'
import { formatLodgeAltitudeForSubtitle } from '@/lib/lodgeAltitudeDisplay'
import { resolveRouteLabel } from '@/data/lodgeSoqtapataResolverDefaults'
import { DEFAULT_EXPERIENCE_RESOURCE_DOWNLOAD_CTA_LABEL } from '@/lib/experienceResourceCmsDefaults'
import { mergeFaqsSource, type FaqsSettingsRow } from '@/lib/faqsCms'
import {
  mergeTravellerGuideSubsectionsSource,
  type TravellerGuideSettingsRow,
  type TravellerGuideSubsectionResolved,
} from '@/lib/travellerGuideCms'
import {
  mergeTermsPanelsSource,
  resolveTermsPdfUrlForExperience,
  type TermsConditionsSettingsRow,
} from '@/lib/termsConditionsCms'
import type { ReserveCtaSettingsGroq } from '@/lib/reserveCtaGroq'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import { buildBookingSummaryFromCmsExperience } from '@/lib/buildBookingSummaryFromCms'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'
import { resolveSmartLinkOrLegacy, smartLinkIsDisabled } from '@/lib/resolveSmartLink'
import { buildDefaultExperienceReserveRows, type ExperienceReserveFacts } from '@/lib/experienceReserveRows'
import { toExperienceCardData } from '@/lib/experienceCardData'
import {
  formatExperiencePriceLine,
  formatExperiencePricePartsWithPromotions,
  parseUsdAmountFromLabel,
} from '@/lib/formatExperiencePrice'
import type { PromotionDoc } from '@/lib/promotionTypes'
import { resolvePromotionLegalInfo } from '@/lib/promotionPricing'
import { isActiveExperienceStatus } from '@/lib/reserveCtaPricing'
import { resolveReserveCtaCard } from '@/lib/resolveReserveCtaCard'
import {
  HIGHLIGHT_LIST_KEY_PREFIX,
  INCLUDE_LIST_KEY_PREFIX,
  NOT_INCLUDE_LIST_KEY_PREFIX,
  resolvePlainStringKcList,
} from '@/lib/experienceKcStringListKeys'
import { buildSnapshotHighlightsBarFromCms, type CmsSnapshotHighlightRow } from '@/lib/snapshotHighlightsResolve'
import { buildExperienceItineraryFromCms, type CmsExperienceItineraryFields } from '@/lib/mapExperienceItinerary'

/** CMS sometimes stores non-string rows in string-array fields; coerce to display lines. */
function normalizeStringHighlightList(raw: unknown[] | null | undefined): string[] {
  if (!raw?.length) return []
  const out: string[] = []
  for (const item of raw) {
    if (typeof item === 'string') {
      const t = item.trim()
      if (t) out.push(t)
      continue
    }
    if (item && typeof item === 'object') {
      const o = item as { text?: unknown; title?: unknown; value?: unknown }
      const t = String(o.text ?? o.value ?? o.title ?? '').trim()
      if (t) out.push(t)
    }
  }
  return out
}

function pickByIndices<T>(source: T[] | null | undefined, order: number[] | null | undefined): T[] | null {
  if (!source?.length) return null
  if (!order?.length) return null
  const out: T[] = []
  const seen = new Set<number>()
  for (const raw of order) {
    const i = typeof raw === 'number' ? raw : Number(raw)
    if (!Number.isFinite(i) || i < 0 || i >= source.length || seen.has(i)) continue
    seen.add(i)
    const v = source[i]
    if (v !== undefined) out.push(v)
  }
  return out.length ? out : null
}

type CmsKeyedStringRow = { _key?: string | null; text?: string | null }

function pickByKeys<T extends { _key?: string | null }>(
  source: T[] | null | undefined,
  order: string[] | null | undefined,
): T[] | null {
  if (!source?.length || !order?.length) return null
  const m = new Map<string, T>()
  source.forEach((item, i) => {
    if (item == null || typeof item !== 'object') return
    const k = item._key
    if (k && !m.has(k)) m.set(k, item)
    if (!m.has(`legacy-str:${i}`)) m.set(`legacy-str:${i}`, item)
    if (!m.has(String(i))) m.set(String(i), item)
  })
  const out: T[] = []
  const seen = new Set<string>()
  for (const rawKey of order) {
    const key = typeof rawKey === 'string' ? rawKey.trim() : String(rawKey).trim()
    if (!key || seen.has(key)) continue
    let v = m.get(key)
    if (v === undefined) {
      const legacy = /^legacy-str:(\d+)$/.exec(key)
      if (legacy) v = m.get(`legacy-str:${legacy[1]}`) ?? m.get(legacy[1]!)
    }
    if (v !== undefined) {
      seen.add(key)
      out.push(v)
    }
  }
  return out.length ? out : null
}

function orderKeyedRowsSelectedFirst<T extends { _key?: string | null }>(
  source: T[] | null | undefined,
  orderKeys: string[] | null | undefined,
): T[] {
  const rows = [...(source ?? [])]
  if (!rows.length || !orderKeys?.length) return rows
  const picked = pickByKeys(rows, orderKeys)
  if (!picked?.length) return rows

  const pickedRefs = new Set(picked)
  const pickedKeys = new Set(picked.map((item) => item._key?.trim()).filter((key): key is string => Boolean(key)))
  const rest = rows.filter((item) => {
    if (pickedRefs.has(item)) return false
    const key = item._key?.trim()
    return !key || !pickedKeys.has(key)
  })
  return [...picked, ...rest]
}

/** Order / filter string lines from Knowledge Center using Sanity `_key`s, with legacy index fallback. */
function orderedExperienceStringLines(
  keyed: CmsKeyedStringRow[] | null | undefined,
  orderKeys: string[] | null | undefined,
  legacyFlat: unknown[] | null | undefined,
  legacyIdx: number[] | null | undefined,
): string[] {
  const baseFlat = normalizeStringHighlightList(legacyFlat)
  if (orderKeys?.length && keyed?.length) {
    const keyedRows = keyed
      .filter((k): k is CmsKeyedStringRow => k != null && typeof k === 'object')
      .map((k, i) => ({
        _key: (k._key && String(k._key)) || `__idx${i}`,
        text: k.text,
      }))
    const picked = pickByKeys(keyedRows, orderKeys)
    if (picked?.length) {
      const texts = picked.map((p) => String((p as CmsKeyedStringRow).text ?? '').trim()).filter(Boolean)
      if (texts.length) return texts
    }
  }
  if (legacyIdx?.length && baseFlat.length) {
    const p = pickByIndices([...baseFlat], legacyIdx)
    if (p?.length) return p
  }
  return baseFlat
}

// --- public row shape (subset of GROQ result) ---

export type SoqtapataStructuredPageRow = {
  _id: string
  internalTitle?: string | null
  slug?: { current?: string | null } | null
  seo?: { title?: string | null; description?: string | null } | null
  /** Overrides por bloque (eyebrow, título, intro, visible). */
  sectionModules?: SoqtapataPageModuleRow[] | null
  pageHero?: CmsPageHero | null
  reviewsLayout?: CmsReviewsLayout | null
  reviewsSection?: {
    eyebrow?: string | null
    title?: string | null
    body?: string | null
    rotatingReviews?: CmsReviewDoc[] | null
    reviewCards?: CmsReviewDoc[] | null
  } | null
  reviewsSettings?: unknown
  reviewRefs?: unknown[] | null
  reviewDocs?: CmsReviewDoc[] | null
  techProductRefs?: unknown[] | null
  techProductDocs?: CmsTechProduct[] | null
  includedTechProductIds?: string[] | null
  galleryOrderKeys?: string[] | null
  relatedSectionEyebrow?: string | null
  relatedSectionTitle?: string | null
  relatedRefIds?: string[] | null
  relatedExperiencesFromLanding?: CmsRelatedLandingRow[] | null
  showTailorMade?: boolean | null
  tailorMadeEyebrow?: string | null
  tailorMadeTitle?: string | null
  tailorMadeBody?: string | null
  tailorMadeCtaLabel?: string | null
  tailorMadeCtaSmartLink?: SmartLinkGroq | null
  tailorMadeImage?: SanityImageSource | null
  tailorMadeImageUrl?: string | null
  tailorMadeAlt?: string | null
  reserveCtaSettings?: ReserveCtaSettingsGroq
  reserveBlock?: CmsReserveBlock | null
  /** Landing: prioridad sobre `experience.resources` para tarjetas + preview map/brochure. */
  resources?: CmsExperiencePageResources | null
  internalNav?: CmsInternalNav | null
  /** Stats bar — curated KC snapshot highlight `_key` order (max 6 on site). */
  snapshotHighlightOrderKeys?: string[] | null
  /** @deprecated Legacy logistics slot picks — hidden in Studio */
  snapshotStatSelections?: Array<{ slot?: string | null; visible?: boolean | null }> | null
  /** Curate Knowledge Center rows (Sanity `_key` order; omitted = hidden). */
  overviewHighlightKeys?: string[] | null
  lodgesOrderKeys?: string[] | null
  wildlifeOrderKeys?: string[] | null
  includesOrderKeys?: string[] | null
  notIncludesOrderKeys?: string[] | null
  faqOrderKeys?: string[] | null
  travellerGuideOrderKeys?: string[] | null
  resourcesFromExperienceKeys?: string[] | null
  termsOrderKeys?: string[] | null
  termsImportantNotesKeys?: string[] | null
  /** @deprecated Hidden legacy: 0-based indices; resolver still reads for old documents */
  overviewHighlightOrder?: number[] | null
  wildlifeDisplayOrder?: number[] | null
  includesDisplayOrder?: number[] | null
  notIncludesDisplayOrder?: number[] | null
  faqDisplayOrder?: number[] | null
  resourcesFromExperienceOrder?: number[] | null
  termsImportantNotesOrder?: number[] | null
  termsDownloadEnabled?: boolean | null
  termsDownloadLabel?: string | null
  /** `lodgePageLink` dereferenciado en GROQ (`slug.current`). */
  lodgePageSlug?: string | null
  /** Etiqueta del botón «View full lodge page» en esta landing. */
  lodgeCtaVisible?: boolean | null
  lodgeCtaLabel?: string | null
  lodgeCtaSmartLink?: SmartLinkGroq | null
  /** Central Terms & Conditions CK (fetched alongside page row). */
  termsConditions?: TermsConditionsSettingsRow
  /** Central FAQs CK (fetched alongside page row). */
  faqsSettings?: FaqsSettingsRow
  /** Central Traveller Guide CK (fetched alongside page row). */
  travellerGuideSettings?: TravellerGuideSettingsRow
  experience?: CmsExperience | null
} | null

type CmsExperiencePageResources = {
  mapPreviewTitle?: string | null
  mapPreviewSubtitle?: string | null
  brochurePreviewBadge?: string | null
  cards?: CmsExperienceResourceRow[] | null
}

type CmsRelatedExperience = {
  _id: string
  name?: string | null
  tagline?: string | null
  programType?: string | null
  route?: string | null
  routeSlug?: string | null
  routeLabel?: string | null
  duration?: string | null
  price?: number | null
  priceLabel?: string | null
  shortDescription?: string | null
  mainImageUrl?: string | null
  slug?: string | null
  /** Parent `experiencePage` document id (for `relatedRefIds` ordering). */
  pageId?: string | null
}

/** Dereferenced `relatedExperienceRefs[]` (experience page or legacy experience doc). */
type CmsRelatedLandingRow = {
  _id: string
  _type?: string | null
  pageSlug?: string | null
  experience?: CmsRelatedExperience | null
}

type CmsReserveBlock = {
  eyebrow?: string | null
  headline?: string | null
  price?: string | null
  priceNote?: string | null
  priceSub?: string | null
  infoRows?: { label?: string | null; value?: string | null }[] | null
  wetravelUrl?: string | null
  wetravelLabel?: string | null
  wetravelSmartLink?: SmartLinkGroq | null
  whatsappUrl?: string | null
  whatsappLabel?: string | null
  whatsappSmartLink?: SmartLinkGroq | null
  legalNote?: string | null
  legalTermsLink?: string | null
  termsLinkLabel?: string | null
  termsSmartLink?: SmartLinkGroq | null
  trustStripItems?: { text?: string | null }[] | null
}

type CmsPageHero = {
  eyebrow?: string | null
  headline?: string | null
  headlineSub?: string | null
  pills?: string[] | null
  manualRatingValue?: string | null
  manualReviewCount?: number | null
  manualReviewProviderLabel?: string | null
  priceLine?: string | null
  priceSub?: string | null
  useProductPrice?: boolean | null
  bookCta?: { label?: string | null; href?: string | null; openInNewTab?: boolean | null } | null
  bookCtaSmartLink?: SmartLinkGroq | null
  heroImage?: { image?: SanityImageSource | null; alt?: string | null; imageUrl?: string | null } | null
} | null

type CmsReviewsLayout = {
  eyebrow?: string | null
  headline?: string | null
  averageRating?: string | null
  sectionClassName?: string | null
  contentInnerClassName?: string | null
  useHomepageSampleReviewsIfEmpty?: boolean | null
  sourceLabel?: string | null
  secondaryRatingLine?: string | null
  emptyMessage?: string | null
  reviewsRegionAriaLabel?: string | null
  reviewTablistAriaLabel?: string | null
  quoteDotAriaLabelPrefix?: string | null
  reviewDotAriaLabelPrefix?: string | null
  guestFallbackName?: string | null
} | null

type CmsReviewDoc = {
  _id: string
  quote?: string | null
  authorName?: string | null
  authorCity?: string | null
  authorCountry?: string | null
  experience?: {
    name?: string | null
    slug?: { current?: string | null } | null
  } | null
  experienceName?: string | null
  experienceProgramme?: string | null
  rating?: number | null
  isFeatured?: boolean | null
}

type CmsTechProduct = {
  _id: string
  stableId?: string | null
  name?: string | null
  number?: string | null
  description?: string | null
  image?: SanityImageSource | null
  badgeText?: string | null
  badgeTextWhenExcluded?: string | null
  slug?: { current?: string | null } | null
}

type CmsExperienceResourceRow = {
  _key?: string
  title?: string | null
  subtitle?: string | null
  resourceType?: string | null
  visualPreset?: string | null
  previewImage?: { alt?: string | null; imageUrl?: string | null } | null
  fileUrl?: string | null
  fileAssetUrl?: string | null
  ctaLabel?: string | null
  visible?: boolean | null
  order?: number | null
}

type CmsExperience = {
  _id: string
  highlightsKeyed?: CmsKeyedStringRow[] | null
  includesKeyed?: CmsKeyedStringRow[] | null
  notIncludesKeyed?: CmsKeyedStringRow[] | null
  importantNotesKeyed?: CmsKeyedStringRow[] | null
  name?: string | null
  tagline?: string | null
  programType?: string | null
  route?: string | null
  duration?: string | null
  price?: number | null
  priceLabel?: string | null
  shortDescription?: string | null
  fullDescription?: string | null
  mainImage?: SanityImageSource | null
  mainImageUrl?: string | null
  gallery?: CmsGalleryItem[] | null
  videoUrl?: string | null
  videoTitle?: string | null
  videoDuration?: string | null
  highlights?: string[] | null
  itinerary?: CmsItineraryDay[] | null
  itineraryMode?: string | null
  programmeFlow?: CmsExperienceItineraryFields['programmeFlow']
  typicalDay?: CmsExperienceItineraryFields['typicalDay']
  hybridSummaryIntro?: string | null
  durationOptions?: CmsExperienceItineraryFields['durationOptions']
  includes?: string[] | null
  notIncludes?: string[] | null
  lodge?: CmsLodge | null
  lodgeNightLabel?: string | null
  groupSizeMin?: number | null
  groupSizeMax?: number | null
  altitude?: string | null
  distanceFromCusco?: string | null
  ecosystem?: string | null
  wildlife?: CmsWildlifeItem[] | null
  includedTechProducts?: unknown[] | null
  includedTechProductDocs?: CmsTechProduct[] | null
  bestTimeByMonth?: CmsMonthRow[] | null
  entryRequirements?: { title?: string; description?: string }[] | null
  packingList?: string[] | null
  gettingHereInfo?: { title?: string; description?: string }[] | null
  cancellationPolicy?: string | null
  termsAndConditions?: string | null
  importantNotes?: string[] | null
  mapPdfUrl?: string | null
  mapPdfLabel?: string | null
  brochurePdfUrl?: string | null
  brochurePdfLabel?: string | null
  resources?: CmsExperienceResourceRow[] | null
  knowledgeResources?: CmsKnowledgeResourceRow[] | null
  termsPanels?: { _key?: string | null; title?: string | null; text?: string | null }[] | null
  fullTermsPdfUrl?: string | null
  seasonLegend?: CmsSeasonLegend | null
  travelerGuideSections?: CmsTravelerGuideSection[] | null
  travelerGuideSubsections?: CmsTravelerGuideSubsection[] | null
  snapshotHighlights?: CmsSnapshotHighlightRow[] | null
  lodgePresentationRows?: CmsLodgePresentationRow[] | null
  faqs?: { _key?: string | null; question?: string; answer?: string }[] | null
  seo?: { title?: string | null; description?: string | null } | null
  routeDocument?: {
    name?: string | null
    shortDescription?: string | null
    slug?: string | null | { current?: string | null }
    shortLabel?: string | null
    tagline?: string | null
} | null
  status?: string | null
}

type CmsKnowledgeResourceRow = {
  _key?: string
  resourceType?: string | null
  title?: string | null
  text?: string | null
  showCta?: boolean | null
  ctaLabel?: string | null
  ctaSmartLink?: SmartLinkGroq | null
  image?: { alt?: string | null; title?: string | null; image?: SanityImageSource | null; imageUrl?: string | null } | null
}

type CmsSeasonLegend = {
  seasonKeyTitle?: string | null
  intro?: string | null
  peakLabel?: string | null
  peakDescription?: string | null
  greatLabel?: string | null
  greatDescription?: string | null
  alwaysLabel?: string | null
  alwaysDescription?: string | null
  /** @deprecated Use seasonKeyTitle */
  eyebrow?: string | null
  peak?: { label?: string | null; description?: string | null; visualKey?: string | null } | null
  good?: { label?: string | null; description?: string | null; visualKey?: string | null } | null
  alwaysGood?: { label?: string | null; description?: string | null; visualKey?: string | null } | null
}

/** Resolved copy for month ★ aria + legend (flat CMS or legacy nested). */
type ResolvedSeasonLegendCopy = {
  seasonKeyEyebrow: string
  peak: { label: string; description: string }
  great: { label: string; description: string }
  always: { label: string; description: string }
}

function resolveSeasonLegendCopy(legend: CmsSeasonLegend | null | undefined, mergedWhen: SoqtapataWhen): ResolvedSeasonLegendCopy {
  const lg = mergedWhen.legend
  const fb0 = lg.items[0]!
  const fb1 = lg.items[1]!
  const fb2 = lg.items[2]!
  const descFromRest = (rest: string) => {
    const t = rest.trim()
    if (!t.startsWith('—')) return ''
    return t.replace(/^—\s*/, '').trim()
  }
  if (!legend) {
    return {
      seasonKeyEyebrow: lg.eyebrow,
      peak: { label: fb0.strong, description: descFromRest(fb0.rest) },
      great: { label: fb1.strong, description: descFromRest(fb1.rest) },
      always: { label: fb2.strong, description: descFromRest(fb2.rest) },
    }
  }
  const peakLabel = legend.peakLabel?.trim() || legend.peak?.label?.trim() || fb0.strong
  const peakDescription =
    legend.peakDescription?.trim() || legend.peak?.description?.trim() || descFromRest(fb0.rest)
  const greatLabel = legend.greatLabel?.trim() || legend.good?.label?.trim() || fb1.strong
  const greatDescription =
    legend.greatDescription?.trim() || legend.good?.description?.trim() || descFromRest(fb1.rest)
  const alwaysLabel = legend.alwaysLabel?.trim() || legend.alwaysGood?.label?.trim() || fb2.strong
  const alwaysDescription =
    legend.alwaysDescription?.trim() || legend.alwaysGood?.description?.trim() || descFromRest(fb2.rest)
  return {
    seasonKeyEyebrow: legend.seasonKeyTitle?.trim() || legend.eyebrow?.trim() || lg.eyebrow,
    peak: { label: peakLabel, description: peakDescription },
    great: { label: greatLabel, description: greatDescription },
    always: { label: alwaysLabel, description: alwaysDescription },
  }
}

type CmsTravelerGuideSection = {
  bucket?: string | null
  headerIcon?: string | null
  title?: string | null
  packingLead?: string | null
  pairItems?: { iconKey?: string | null; title?: string | null; body?: string | null }[] | null
  bulletItems?: string[] | null
}

type CmsTravelerGuideQaRowCms = {
  _type?: string | null
  iconKey?: string | null
  title?: string | null
  body?: string | null
  label?: string | null
}

type CmsTravelerGuideChecklistRowCms = {
  _type: 'experienceTravelerGuideChecklistRow'
  iconKey?: string | null
  label?: string | null
}

type CmsTravelerGuideRowUnion = CmsTravelerGuideQaRowCms | CmsTravelerGuideChecklistRowCms

type CmsTravelerGuideSubsection = {
  _key?: string
  displayType?: string | null
  headerIcon?: string | null
  title?: string | null
  rows?: CmsTravelerGuideRowUnion[] | null
}

function isTravelerGuideChecklistRow(r: unknown): r is CmsTravelerGuideChecklistRowCms {
  const t = r && typeof r === 'object' ? (r as {_type?: string | null})._type : null
  return t === 'experienceTravelerGuideChecklistRow' || t === 'travellerGuideChecklistRow'
}

type CmsLodge = {
  _id?: string
  name?: string | null
  shortDescription?: string | null
  altitude?: string | null
  route?: string | null
  mainImage?: SanityImageSource | null
  mainImageUrl?: string | null
  gallery?: LodgeGalleryItemRow[] | null
  photoCollection?: PhotoCollectionDoc
  amenities?: string[] | null
  pageSlug?: string | null
  lodgePage?: CmsLodgePageHero | null
}

type CmsLodgePageHero = {
  heroShortDescription?: string | null
  heroHighlights?: Array<{ text?: string | null; key?: string | null }> | null
  heroGalleryOrderKeys?: string[] | null
  menuThumbnailImage?: string | null
  slug?: string | null
}

type CmsLodgePresentationRow = {
  _key?: string | null
  lodge?: (CmsLodge & { _id?: string }) | null
  nightsLabel?: string | null
  highlightLabel?: string | null
  /** @deprecated — card chips from Lodge Page hero pills */
  highlights?: string[] | null
  ctaLabel?: string | null
  ctaVisible?: boolean | null
  ctaSmartLink?: SmartLinkGroq | null
}

function resolveLodgePageHeroShortDescription(
  lodgePage: CmsLodgePageHero | null | undefined,
  lodge: CmsLodge,
): string {
  return lodgePage?.heroShortDescription?.trim() || lodge.shortDescription?.trim() || ''
}

function resolveLodgePageHeroPillTexts(
  lodgePage: CmsLodgePageHero | null | undefined,
): string[] {
  if (!lodgePage?.heroHighlights?.length) return []
  const out: string[] = []
  for (const h of lodgePage.heroHighlights) {
    const t = h?.text?.trim()
    if (t) out.push(t)
    if (out.length >= 3) break
  }
  return out
}

type CmsGalleryItem = {
  _key?: string | null
  mediaType?: string | null
  title?: string | null
  alt?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
  videoUrl?: string | null
  videoThumbnail?: SanityImageSource | null
  videoThumbnailUrl?: string | null
  caption?: string | null
  category?: string | null
}

export type ResolvedExperienceMediaItem = {
  _key: string
  kind: 'photo' | 'video'
  title: string
  caption: string
  alt: string
  imageSrc: string
  videoUrl?: string
}

const MEDIA_VISIBLE_MAX = 6

function galleryPhotoUrl(g: CmsGalleryItem, width: number): string | null {
  const direct = g.imageUrl?.trim()
  if (direct) return direct
  if (g.image) {
    const built = assetToUrl(g.image, width, '')
    return built?.trim() ? built : null
  }
  return null
}

function galleryVideoThumbnailUrl(g: CmsGalleryItem, width: number): string | null {
  const direct = g.videoThumbnailUrl?.trim()
  if (direct) return direct
  if (g.videoThumbnail) {
    const built = assetToUrl(g.videoThumbnail, width, '')
    return built?.trim() ? built : null
  }
  return galleryPhotoUrl(g, width)
}

function mediaItemLabel(g: CmsGalleryItem, idx: number): string {
  return (
    (g.alt && g.alt.trim()) ||
    (g.caption && g.caption.trim()) ||
    (g.title && g.title.trim()) ||
    `Media ${idx + 1}`
  ).slice(0, 80)
}

function normalizeCmsGalleryItem(g: CmsGalleryItem, idx: number): ResolvedExperienceMediaItem | null {
  const isVideo = g.mediaType?.trim() === 'video'
  const title = (g.title && g.title.trim()) || ''
  const caption = (g.caption && g.caption.trim()) || ''
  const alt = mediaItemLabel(g, idx)

  if (isVideo) {
    const videoUrl = g.videoUrl?.trim()
    const imageSrc = galleryVideoThumbnailUrl(g, 1200)
    if (!videoUrl || !imageSrc) return null
    return {
      _key: g._key || `media-${idx}`,
      kind: 'video',
      title,
      caption,
      alt,
      imageSrc,
      videoUrl,
    }
  }

  const imageSrc = galleryPhotoUrl(g, 1200)
  if (!imageSrc) return null
  return {
    _key: g._key || `media-${idx}`,
    kind: 'photo',
    title,
    caption,
    alt,
    imageSrc,
  }
}

function resolveExperienceGalleryItems(
  e: CmsExperience,
  row: NonNullable<SoqtapataStructuredPageRow>,
  h1: string,
): ResolvedExperienceMediaItem[] {
  const items = orderKeyedRowsSelectedFirst(e.gallery, row.galleryOrderKeys)

  let resolved = items
    .map((g, i) => normalizeCmsGalleryItem(g, i))
    .filter((x): x is ResolvedExperienceMediaItem => x != null)

  const hasGalleryVideo = resolved.some((i) => i.kind === 'video')
  if (!hasGalleryVideo && e.videoUrl?.trim() && !items.some((g) => g.mediaType === 'video')) {
    const thumb = e.mainImageUrl?.trim() || resolved[0]?.imageSrc
    if (thumb) {
      const legacyTitle = (e.videoTitle && e.videoTitle.trim()) || h1
      resolved = [
        {
          _key: 'legacy-experience-video',
          kind: 'video',
          title: legacyTitle,
          caption: '',
          alt: legacyTitle,
          imageSrc: thumb,
          videoUrl: e.videoUrl.trim(),
        },
        ...resolved,
      ]
    }
  }

  return resolved
}

function lightboxItemsFromResolvedMedia(
  items: ResolvedExperienceMediaItem[],
): NonNullable<SoqtapataMedia['lightboxItems']> {
  return items
    .filter((item) => item.imageSrc?.trim())
    .map((item) => ({
      src: item.imageSrc,
      alt: item.alt,
      title: (item.title || item.alt).trim() || undefined,
      description: item.caption?.trim() || undefined,
    }))
}

function pickMainMediaItem(items: ResolvedExperienceMediaItem[]): ResolvedExperienceMediaItem | null {
  if (!items.length) return null
  return items.find((i) => i.kind === 'video') ?? items[0]!
}

function layoutMediaTiles(items: ResolvedExperienceMediaItem[]): {
  main: ResolvedExperienceMediaItem | null
  secondary: ResolvedExperienceMediaItem[]
  moreItem?: ResolvedExperienceMediaItem
  moreCount?: SoqtapataMedia['moreCount']
} {
  const n = items.length
  if (n === 0) return { main: null, secondary: [] }

  const main = pickMainMediaItem(items)
  if (!main) return { main: null, secondary: [] }
  const rest = items.filter((i) => i._key !== main._key)

  if (n <= MEDIA_VISIBLE_MAX) {
    return { main, secondary: rest }
  }

  const normalVisibleCount = MEDIA_VISIBLE_MAX - 1
  const hidden = n - normalVisibleCount
  const secondary = rest.slice(0, normalVisibleCount - 1)
  const moreItem = rest[normalVisibleCount - 1]

  return {
    main,
    secondary,
    moreItem,
    moreCount: {
      dataExpLb: '0',
      countLabel: `+${hidden}`,
      subLabel: 'See all',
      ariaLabel: 'Open full photo gallery',
    },
  }
}

/** Thumbnail overlay: title only; caption is reserved for lightbox/detail. */
function mediaThumbDisplayTitle(item: ResolvedExperienceMediaItem): string {
  return (item.title || item.alt || '').trim().slice(0, 40)
}

function mediaThumbFromItem(item: ResolvedExperienceMediaItem, dataExpLb: string): SoqtapataMediaThumb {
  const label = mediaThumbDisplayTitle(item)
  if (item.kind === 'video') {
    return {
      kind: 'video',
      dataExpLb,
      ariaLabel: `Open video, ${item.alt}`,
      imageSrc: item.imageSrc,
      imageAlt: item.alt,
      overlayStyle: { background: 'rgba(0,0,0,.35)' },
      label,
      labelStyle: { background: 'rgba(144,103,48,.75)' },
    }
  }
  return {
    kind: 'image',
    dataExpLb,
    ariaLabel: `Open photo, ${item.alt}`,
    imageSrc: item.imageSrc,
    imageAlt: item.alt,
    label,
    labelStyle: { background: 'rgba(0,0,0,.55)' },
  }
}

export function buildHeroGalleryFromItems(items: ResolvedExperienceMediaItem[]): SoqtapataPhase1GalleryCell[] {
  const photos = items
    .map((item, index) => ({ item, index }))
    .filter((entry) => entry.item.kind === 'photo')
  if (!photos.length) return []

  const first = photos[0]!
  const cells: SoqtapataPhase1GalleryCell[] = [
    {
      kind: 'main',
      dataExpLb: String(first.index),
      ariaLabel: 'Open photo gallery, image 1',
      imageSrc: first.item.imageSrc,
      imageAlt: first.item.alt,
    },
  ]

  if (photos.length > 1) {
    const second = photos[1]!
    cells.push({
      kind: 'thumb',
      dataExpLb: String(second.index),
      ariaLabel: 'Open photo gallery, image 2',
      imageSrc: second.item.imageSrc,
      imageAlt: second.item.alt,
      galleryLabel: (second.item.caption || second.item.title || second.item.alt).slice(0, 40),
    })
  }

  const visiblePhotoEntries = photos.slice(2, 5)
  for (let i = 0; i < visiblePhotoEntries.length; i++) {
    const entry = visiblePhotoEntries[i]!
    const photoNumber = i + 3
    const isLastVisible = i === visiblePhotoEntries.length - 1
    const hiddenPhotos = Math.max(0, photos.length - photoNumber)
    cells.push({
      kind: 'thumb',
      dataExpLb: String(entry.index),
      ariaLabel: `Open photo gallery, image ${photoNumber}`,
      imageSrc: entry.item.imageSrc,
      imageAlt: entry.item.alt,
      stylePositionRelative: true,
      galleryLabel: mediaThumbDisplayTitle(entry.item),
      ...(isLastVisible && hiddenPhotos > 0
        ? {
            moreBadge: {
              text: `+${hiddenPhotos} more`,
              dataExpLb: String(first.index),
              ariaLabel: 'Open full photo gallery',
            },
          }
        : {}),
    })
  }

  return cells
}

export function buildMediaFromGalleryItems(
  items: ResolvedExperienceMediaItem[],
  lMedia: SoqtapataMedia,
  h1: string,
): SoqtapataMedia | null {
  const { main, secondary, moreCount, moreItem } = layoutMediaTiles(items)
  if (!main) return null

  const mainIndex = Math.max(0, items.indexOf(main))
  const thumbs = secondary.map((item) => mediaThumbFromItem(item, String(Math.max(0, items.indexOf(item)))))
  const filmPill = main.title || main.caption || h1
  const lightboxItems = lightboxItemsFromResolvedMedia(items)

  return {
    eyebrow: lMedia.eyebrow,
    h2: lMedia.h2,
    h2Style: lMedia.h2Style,
    lead: lMedia.lead,
    video: {
      imageSrc: main.imageSrc,
      imageAlt: main.alt,
      filmPill,
      officialPill: lMedia.video.officialPill,
      isVideo: main.kind === 'video',
      videoUrl: main.videoUrl,
      dataExpLb: String(mainIndex),
    },
    thumbs,
    ...(moreCount
      ? {
          moreCount: {
            ...moreCount,
            dataExpLb: moreItem ? String(Math.max(0, items.indexOf(moreItem))) : String(mainIndex),
            ...(moreItem ? { imageSrc: moreItem.imageSrc, imageAlt: moreItem.alt } : {}),
          },
        }
      : {}),
    lightboxItems,
  }
}

function emptyMediaShell(lMedia: SoqtapataMedia, h1: string): SoqtapataMedia {
  return {
    eyebrow: lMedia.eyebrow,
    h2: lMedia.h2,
    h2Style: lMedia.h2Style,
    lead: lMedia.lead,
    video: {
      imageSrc: '',
      imageAlt: h1,
      filmPill: h1,
      officialPill: lMedia.video.officialPill,
      isVideo: false,
    },
    thumbs: [],
    lightboxItems: [],
  }
}

function warnCurateKeyMiss(context: string, key: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[experiencePage CMS] ${context}: could not resolve curated key "${key}"`)
  }
}

/**
 * String-list curation: when `orderKeys` is non-empty, returns ONLY matched keys in order (never all KC).
 * When `orderKeys` is empty, returns full KC list (legacy index or flat order).
 */
function pageCuratedStringList(
  keyed: CmsKeyedStringRow[] | null | undefined,
  orderKeys: string[] | null | undefined,
  legacyFlat: unknown[] | null | undefined,
  legacyIdx: number[] | null | undefined,
  context = 'curated strings',
): string[] {
  const flat = normalizeStringHighlightList(legacyFlat)
  const hasSelection = (orderKeys?.length ?? 0) > 0

  if (!hasSelection) {
    if (legacyIdx?.length && flat.length) {
      const p = pickByIndices([...flat], legacyIdx)
      if (p?.length) return p
    }
    return flat
  }

  const keyedList = Array.isArray(keyed) ? keyed.filter((k): k is CmsKeyedStringRow => k != null) : []
  const byKey = new Map<string, string>()
  keyedList.forEach((k, i) => {
    const key = (k._key && String(k._key)) || `legacy-str:${i}`
    const text = String(k.text ?? '').trim() || (flat[i] ?? '').trim()
    if (text) {
      byKey.set(key, text)
      byKey.set(`legacy-str:${i}`, text)
    }
  })

  const out: string[] = []
  for (const rawKey of orderKeys!) {
    const key = String(rawKey).trim()
    if (!key) continue
    let text = byKey.get(key) ?? ''
    if (!text) {
      const legacy = /^legacy-str:(\d+)$/.exec(key)
      if (legacy) text = (flat[Number(legacy[1])] ?? '').trim()
    }
    if (text) {
      out.push(text)
    } else {
      warnCurateKeyMiss(context, key)
    }
  }
  return out
}

/** KC rows with `_key`: when `orderKeys` is set, return only those rows (strict). */
function curateKeyedRowsStrict<T extends { _key?: string | null }>(
  source: T[] | null | undefined,
  orderKeys: string[] | null | undefined,
  context: string,
): T[] | null {
  const hasSelection = (orderKeys?.length ?? 0) > 0
  if (!hasSelection) return null
  if (!source?.length) return []
  const picked = pickByKeys(source, orderKeys)
  if (picked?.length) return picked
  for (const rawKey of orderKeys!) {
    const key = String(rawKey).trim()
    if (!key) continue
    if (!source.some((row) => row._key === key)) warnCurateKeyMiss(context, key)
  }
  return []
}

function applyTermsPageSettings(
  terms: SoqtapataExperience['terms'],
  row: NonNullable<SoqtapataStructuredPageRow>,
  local: SoqtapataExperience,
): SoqtapataExperience['terms'] {
  let t = terms
  const label = row.termsDownloadLabel?.trim()
  if (label) {
    t = { ...t, pdfDownloadLabel: label }
  } else if (!t.pdfDownloadLabel?.trim()) {
    t = { ...t, pdfDownloadLabel: local.terms.pdfDownloadLabel }
  }
  if (row.termsDownloadEnabled === false) {
    t = { ...t, pdfHref: '#' }
  }
  return t
}

function buildIncludesFromCms(
  e: CmsExperience,
  row: NonNullable<SoqtapataStructuredPageRow>,
  local: SoqtapataExperience,
): SoqtapataExperience['includes'] | null {
  if (!(e.includes?.length || e.notIncludes?.length)) return null

  const yes = resolvePlainStringKcList(
    e.includes as unknown[],
    row.includesOrderKeys,
    row.includesDisplayOrder,
    INCLUDE_LIST_KEY_PREFIX,
    'includes',
    pickByIndices,
  )
  const no = resolvePlainStringKcList(
    e.notIncludes as unknown[],
    row.notIncludesOrderKeys,
    row.notIncludesDisplayOrder,
    NOT_INCLUDE_LIST_KEY_PREFIX,
    'notIncludes',
    pickByIndices,
  )

  return {
    eyebrow: local.includes.eyebrow,
    h2: local.includes.h2,
    h2Style: local.includes.h2Style,
    lead: local.includes.lead,
    includedTitle: local.includes.includedTitle,
    notTitle: local.includes.notTitle,
    yes,
    no,
  }
}

function buildWildlifeFromCms(
  e: CmsExperience,
  row: NonNullable<SoqtapataStructuredPageRow>,
  local: SoqtapataExperience,
): SoqtapataExperience['wildlife'] | null {
  if (!e.wildlife?.length) return null
  const l = local.wildlife
  let wRows = [...e.wildlife]
  if (row.wildlifeOrderKeys?.length) {
    wRows = (curateKeyedRowsStrict(wRows as { _key?: string | null }[], row.wildlifeOrderKeys, 'wildlife') ??
      []) as CmsWildlifeItem[]
  } else if (row.wildlifeDisplayOrder?.length) {
    const p = pickByIndices(wRows, row.wildlifeDisplayOrder)
    if (p?.length) wRows = p
  }
  const species = wRows.map((s, i) => {
    const nameMatch = s.name
      ? l.species.find((sp) => (sp.name || '').trim() === (s.name || '').trim())
      : undefined
    const fallback = nameMatch ?? l.species[i] ?? l.species[0]!
    const cmsImg = s.imageUrl ? imgW(s.imageUrl, 960) : null
    const badgeTrim = (s.badge && s.badge.trim()) || fallback?.badge
    const base = {
      name: s.name || fallback?.name || '',
      sub: s.description || fallback?.sub || '',
      iconId: (s.iconType && W_ICON[s.iconType] !== undefined ? W_ICON[s.iconType]! : fallback?.iconId ?? 6) as
        | 0
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6,
    }
    const photo =
      cmsImg != null
        ? { imageSrc: cmsImg, imageAlt: (s.name || fallback?.name || 'Species').trim() }
        : fallback?.imageSrc
          ? { imageSrc: fallback.imageSrc, imageAlt: (fallback.imageAlt ?? fallback.name).trim() }
          : {}
    return {
      ...base,
      ...photo,
      ...(badgeTrim ? { badge: badgeTrim } : {}),
    }
  })
  return {
    ...l,
    species,
  }
}

function buildOverviewFromCms(
  e: CmsExperience,
  row: NonNullable<SoqtapataStructuredPageRow>,
  local: SoqtapataExperience,
): SoqtapataExperience['overview'] {
  const highlights = resolvePlainStringKcList(
    e.highlights,
    row.overviewHighlightKeys,
    row.overviewHighlightOrder,
    HIGHLIGHT_LIST_KEY_PREFIX,
    'overview highlights',
    pickByIndices,
  ).slice(0, 6)
  return {
    eyebrow: local.overview.eyebrow,
    h2: local.overview.h2,
    paragraphs: ['', ''] as [string, string],
    highlights,
  }
}

function buildTermsFromCms(
  e: CmsExperience,
  row: NonNullable<SoqtapataStructuredPageRow>,
  local: SoqtapataExperience,
): SoqtapataExperience['terms'] | null {
  const experienceId = e._id
  const panelSource = mergeTermsPanelsSource(
    row.termsConditions,
    experienceId,
    e.termsPanels,
  )

  if (panelSource.length) {
    let panels = [...panelSource]
    if (row.termsOrderKeys?.length) {
      panels = curateKeyedRowsStrict(panels, row.termsOrderKeys, 'terms panels') ?? []
    }
    const tc = local.terms
    const pdf = resolveTermsPdfUrlForExperience(
      row.termsConditions,
      experienceId,
      e.fullTermsPdfUrl,
    )
    return {
      ...tc,
      ...(pdf ? { pdfHref: pdf } : {}),
      cards: panels.map((p, i) => ({
        id: p._key ? `terms-panel-${p._key}` : `terms-panel-${i}`,
        title: (p.title && p.title.trim()) || '',
        body: (p.text && p.text.trim()) || '',
      })),
    }
  }

  if (!e.cancellationPolicy?.trim() && !e.termsAndConditions?.trim() && !e.importantNotes?.length) {
    return null
  }

  const tc = local.terms
  const cards = tc.cards.map((c, i) => {
    if (i === 0 && e.cancellationPolicy?.trim()) {
      return { ...c, body: e.cancellationPolicy.trim() }
    }
    if (i === 1 && e.termsAndConditions?.trim()) {
      return { ...c, body: e.termsAndConditions.trim() }
    }
    if (i === 4 && e.importantNotes?.length) {
      const notes = pageCuratedStringList(
        e.importantNotesKeyed,
        row.termsImportantNotesKeys,
        e.importantNotes,
        row.termsImportantNotesOrder,
        'terms important notes',
      )
      return { ...c, body: [c.body, notes.join('\n')].filter(Boolean).join('\n\n') }
    }
    return c
  })
  const pdf = resolveTermsPdfUrlForExperience(
    row.termsConditions,
    e._id,
    e.fullTermsPdfUrl,
  )
  return { ...tc, ...(pdf ? { pdfHref: pdf } : {}), cards }
}

/** KC-only fields for a published landing — replaces local/static fallbacks after merge. */
export function applyCmsExclusiveExperienceContent(
  experience: SoqtapataExperience,
  row: NonNullable<SoqtapataStructuredPageRow>,
  local: SoqtapataExperience,
  alsoBook: { also: SoqtapataAlsoCamanti; book: SoqtapataBook },
  promotions?: PromotionDoc[] | null,
): SoqtapataExperience {
  const e = row.experience
  if (!e) return experience

  const ph = row.pageHero
  const h1 = resolveExperiencePageTitle(ph, e, row.internalTitle)
  const heroPrice = resolveExperienceHeroPriceParts(e, ph, promotions)
  const priceFrom = heroPrice.from
  const priceAmount = heroPrice.amount
  const priceSub = heroPrice.suffix
  const breadcrumb = buildExperiencePageBreadcrumb(h1, resolveExperienceRouteLabel(e))
  const items = resolveExperienceGalleryItems(e, row, h1)
  const heroGallery = buildHeroGalleryFromItems(items)
  const media = buildMediaFromGalleryItems(items, local.media, h1)
  const includes = buildIncludesFromCms(e, row, local)
  const termsBase = buildTermsFromCms(e, row, local) ?? experience.terms
  const terms = applyTermsPageSettings(termsBase, row, local)
  const overview = buildOverviewFromCms(e, row, local)
  const wildlife = buildWildlifeFromCms(e, row, local)
  const stats = buildSnapshotHighlightsBarFromCms(e.snapshotHighlights, row.snapshotHighlightOrderKeys)
  const lodge = buildLodgesFromCms(e, row, local)

  return {
    ...experience,
    hero: {
      ...experience.hero,
      h1,
      gallery: heroGallery,
      priceFrom,
      priceAmount,
      priceSub,
      priceOriginalAmount: heroPrice.originalAmount,
      promoLabel: heroPrice.promoLabel,
      promoMicrocopy: heroPrice.promoMicrocopy,
      breadcrumb,
    },
    pageNav: {
      ...experience.pageNav,
      leadName: h1,
      fromNum: priceAmount,
      fromOriginalNum: heroPrice.promoLabel ? undefined : heroPrice.originalAmount,
      promoLabel: heroPrice.promoLabel,
      fromSub: 'per person',
      fromAriaLabel: heroPrice.promoLabel
        ? `${heroPrice.promoLabel}, ${priceAmount}`
        : heroPrice.originalAmount
          ? `Offer price ${priceAmount}, was ${heroPrice.originalAmount} per person`
          : `From ${priceAmount} per person`,
    },
    stats,
    overview,
    lodge,
    ...(wildlife ? { wildlife } : {}),
    also: {
      eyebrow: alsoBook.also.eyebrow,
      h2: alsoBook.also.h2,
      h2Style: alsoBook.also.h2Style,
      lead: alsoBook.also.lead,
      cards: alsoBook.also.cards,
      ...(alsoBook.also.tailorBand ? { tailorBand: alsoBook.also.tailorBand } : {}),
    },
    media: media ?? emptyMediaShell(local.media, h1),
    ...(includes ? { includes } : {}),
    ...(terms ? { terms } : {}),
  }
}

export function experienceHasMediaSection(media: SoqtapataMedia): boolean {
  return Boolean(media.video.imageSrc?.trim()) || media.thumbs.length > 0
}

function relatedProductsFromLanding(rows: CmsRelatedLandingRow[] | null | undefined): CmsRelatedExperience[] {
  if (!rows?.length) return []
  const out: CmsRelatedExperience[] = []
  for (const row of rows) {
    const exp = row.experience
    if (!exp?._id) continue
    out.push({
      ...exp,
      pageId: row._id,
      slug: (row.pageSlug && row.pageSlug.trim()) || exp.slug || null,
    })
  }
  return out
}

type CmsItineraryDay = {
  dayNumber?: number | null
  title?: string | null
  subtitle?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
  photoCaption?: string | null
  timeline?: { time?: string; title?: string; description?: string }[] | null
  overnight?: { mode?: string | null } | null
  overnightLodge?: CmsLodge | null
  lodgeOvernight?: string | null
  lodgeSub?: string | null
}

type CmsWildlifeItem = {
  _key?: string | null
  name?: string
  description?: string | null
  iconType?: string | null
  imageUrl?: string | null
  badge?: string | null
}

type CmsMonthRow = { month?: string; highlight?: string; level?: string }

// --- mappers ---

const PROGRAM: Record<string, string> = {
  'nature-core': 'Classic Nature',
  'family-adventure': 'Signature Expeditions',
  'experiential-learning': 'Exp. Learning',
  'tailor-made': 'Tailor Made',
}

const MONTH_SLUG: Record<string, string> = {
  january: 'January',
  february: 'February',
  march: 'March',
  april: 'April',
  may: 'May',
  june: 'June',
  july: 'July',
  august: 'August',
  september: 'September',
  october: 'October',
  november: 'November',
  december: 'December',
}

const W_ICON: Record<string, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
  bird: 0,
  bear: 1,
  cat: 2,
  jaguar: 3,
  monkey: 5,
  otter: 6,
  reptile: 4,
  fish: 4,
  plant: 4,
  insect: 4,
  generic: 6,
}

const DAY_IDS = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7', 'day8', 'day9', 'day10'] as const

/** Segmento de ruta seguro para `/lodges/{slug}` (evita valores raros desde CMS). */
const LODGE_PAGE_SLUG_SEGMENT = /^[a-z0-9][a-z0-9-]*$/i

function orderLodgePresentationRows(
  rows: CmsLodgePresentationRow[] | null | undefined,
  orderKeys: string[] | null | undefined,
): CmsLodgePresentationRow[] {
  const withLodges = (rows ?? []).filter((r) => r.lodge?.name?.trim())
  if (!withLodges.length) return []
  const keyed = withLodges.map((r, i) => ({
    ...r,
    _key: (r._key && String(r._key).trim()) || `lodge-${i}`,
  }))
  if (!orderKeys?.length) return keyed
  return curateKeyedRowsStrict(keyed, orderKeys, 'lodges') ?? []
}

function buildLodgesFromCms(
  e: CmsExperience,
  row: NonNullable<SoqtapataStructuredPageRow>,
  local: SoqtapataExperience,
): SoqtapataExperience['lodge'] {
  const shell = local.lodge
  const ordered = orderLodgePresentationRows(e.lodgePresentationRows, row.lodgesOrderKeys)
  if (!ordered.length) {
    return { ...shell, cards: [] }
  }
  const template = shell.cards[0] ?? {
    imageSrc: '',
    imageAlt: 'Lodge',
    nightBadge: '',
    name: '',
    nameStyle: { marginTop: 8 },
    pillText: '',
    pillStyle: { fontSize: 11, flexShrink: 0, whiteSpace: 'nowrap' as const },
    meta: '',
    metaStyle: { marginTop: 6 },
    chips: [],
    chipsWrapperStyle: { marginBottom: 14 },
    ctaHref: '',
    ctaLabel: 'View full lodge page',
  }
  const hideCta = row.lodgeCtaVisible === false
  const defaultCtaLabel = row.lodgeCtaLabel?.trim() || template.ctaLabel || 'View full lodge page'

  const cards: SoqtapataLodgeCard[] = []
  for (const pres of ordered) {
    const lod = pres.lodge!
    const lodgePage = lod.lodgePage
    const slugRaw = (lodgePage?.slug?.trim() || lod.pageSlug?.trim()) ?? ''
    const slugOk = slugRaw && LODGE_PAGE_SLUG_SEGMENT.test(slugRaw) ? slugRaw : ''
    const rowCtaVisible = pres.ctaVisible !== false
    const showCta = !hideCta && rowCtaVisible && Boolean(slugOk)
    const ctaHref = showCta ? `/lodges/${slugOk}` : ''
    const ctaLabel = showCta ? pres.ctaLabel?.trim() || defaultCtaLabel : ''
    const chips = resolveLodgePageHeroPillTexts(lodgePage)
    const meta = resolveLodgePageHeroShortDescription(lodgePage, lod) || template.meta
    const mergedGallery = mergeLodgeGalleryWithPhotoLibrary(lod.photoCollection ?? null, lod.gallery)
    const imageSrc = resolveLodgeIdentityImageUrl({
      gallery: mergedGallery,
      heroGalleryOrderKeys: lodgePage?.heroGalleryOrderKeys,
      menuThumbnailKey: lodgePage?.menuThumbnailImage,
      mainImage: lod.mainImage,
      mainImageUrl: lod.mainImageUrl,
      width: 800,
    })

    cards.push({
      imageSrc,
      imageAlt: (lod.name && lod.name.trim()) || 'Lodge',
      nightBadge: pres.nightsLabel?.trim() || template.nightBadge,
      name: lod.name!.trim(),
      nameStyle: template.nameStyle,
      pillText: pres.highlightLabel?.trim() || template.pillText,
      pillStyle: template.pillStyle,
      meta,
      metaStyle: template.metaStyle,
      chips,
      chipsWrapperStyle: template.chipsWrapperStyle,
      ctaHref,
      ctaLabel,
    })
  }

  return {
    eyebrow: shell.eyebrow,
    h2: shell.h2,
    h2Style: shell.h2Style,
    intro: shell.intro,
    introStyle: shell.introStyle,
    cards,
  }
}

function imgW(src: string | null | undefined, w: number): string | null {
  if (!src) return null
  return src
}

function assetToUrl(
  source: SanityImageSource | null | undefined,
  width: number,
  fallback: string,
): string {
  if (!source) return fallback
  try {
    return urlFor(source).width(width).quality(85).url() || fallback
  } catch {
    return fallback
  }
}

function techToDoc(t: CmsTechProduct | null | undefined): TechnologyProductDoc {
  if (!t) {
    return { _id: '' }
  }
  return {
    _id: (t.stableId || t._id) as string,
    name: t.name,
    number: t.number,
    description: t.description,
    image: t.image ?? null,
    badgeText: t.badgeText,
    badgeTextWhenExcluded: t.badgeTextWhenExcluded,
    slug: t.slug ? { current: t.slug.current ?? undefined } : null,
  }
}

function reviewToDoc(r: CmsReviewDoc | null | undefined): ReviewDoc | null {
  if (!r?._id) return null
  return {
    _id: r._id,
    quote: r.quote,
    authorName: r.authorName,
    authorCity: r.authorCity,
    authorCountry: r.authorCountry,
    experience: r.experience ?? null,
    experienceName: r.experienceName,
    experienceProgramme: r.experienceProgramme,
    rating: r.rating,
    isFeatured: r.isFeatured,
  }
}

function normalizedMonthTier(level: string | null | undefined): 'default' | 'good' | 'peak' {
  const v = String(level ?? '')
    .trim()
    .toLowerCase()
  if (v === 'peak') return 'peak'
  if (v === 'great' || v === 'good') return 'good'
  if (v === 'always' || v === 'always-good') return 'default'
  return 'default'
}

function levelToBar(level: 'default' | 'good' | 'peak'): string {
  if (level === 'peak') return 'linear-gradient(90deg,var(--brown-dk),var(--brown-xdk))'
  if (level === 'good') return 'linear-gradient(90deg,var(--brown),var(--brown-dk))'
  return 'linear-gradient(90deg,#5a8a3a,#4a7a2a)'
}

function levelToStars(
  tier: 'default' | 'good' | 'peak',
  tierLabels: ResolvedSeasonLegendCopy,
): { level: 1 | 2; aria: string } | null {
  if (tier === 'peak') return { level: 2, aria: tierLabels.peak.label.trim() || 'Peak season' }
  if (tier === 'good') return { level: 1, aria: tierLabels.great.label.trim() || 'Great season' }
  return null
}

function whenMonthFromCms(
  m: CmsMonthRow,
  base: SoqtapataWhen,
  idx: number,
  tierLabels: ResolvedSeasonLegendCopy,
): SoqtapataWhenMonth {
  const b = base.months[idx]!
  const tier = normalizedMonthTier(m.level)
  const name = (m.month && MONTH_SLUG[m.month]) || b.name
  return {
    cardClass: tier,
    barStyle: levelToBar(tier),
    name,
    stars: levelToStars(tier, tierLabels),
    highlight: m.highlight && m.highlight.trim() ? m.highlight : b.highlight,
  }
}

const DEFAULT_EXPERIENCE_PRICE_SUB = 'per person · all inclusive'

export function experiencePromotionTarget(
  e: Partial<Pick<CmsExperience, '_id' | 'programType' | 'routeDocument' | 'route'>> & {
    routeRef?: { _id?: string | null } | null
    routeRefId?: string | null
  },
): {
  experienceId?: string | null
  routeRefId?: string | null
  programType?: string | null
} {
  const routeRefId =
    e.routeRefId?.trim() ||
    (typeof e.routeRef === 'object' && e.routeRef && '_id' in e.routeRef
      ? String((e.routeRef as { _id?: string })._id ?? '').trim()
      : '') ||
    null
  return {
    experienceId: e._id?.trim() || null,
    routeRefId: routeRefId || null,
    programType: e.programType,
  }
}

/** KC price wins when `useProductPrice` is true; legacy `pageHero` only when override off. */
function resolveExperienceHeroPriceParts(
  e: Partial<Pick<CmsExperience, '_id' | 'price' | 'priceLabel' | 'programType' | 'routeDocument' | 'route'>> & {
    routeRef?: { _id?: string | null } | null
    routeRefId?: string | null
  },
  ph?: { priceLine?: string | null; priceSub?: string | null; useProductPrice?: boolean | null } | null,
  promotions?: PromotionDoc[] | null,
): { from: string; amount: string; suffix: string; originalAmount?: string; promoLabel?: string; promoMicrocopy?: string } {
  if (ph?.useProductPrice === false) {
    const raw = ph.priceLine?.trim() || 'Enquire'
    const sub = ph.priceSub?.trim() || DEFAULT_EXPERIENCE_PRICE_SUB
    if (raw.toLowerCase() === 'enquire') return { from: '', amount: 'Enquire', suffix: sub }
    return { from: 'from', amount: raw.replace(/^\s*from\s+/i, '').trim(), suffix: sub }
  }
  const parts = formatExperiencePricePartsWithPromotions(
    { ...experiencePromotionTarget(e), price: e.price, priceLabel: e.priceLabel },
    promotions,
    { inclusiveExtra: 'all inclusive' },
  )
  return {
    from: parts.from,
    amount: parts.amount,
    suffix: parts.suffix,
    originalAmount: parts.originalAmount,
    promoLabel: parts.promoLabel,
    promoMicrocopy: parts.promoMicrocopy,
  }
}

/** Plain-text breadcrumb trail (non-clickable), aligned with lodge pages. */
function buildExperiencePageBreadcrumb(pageTitle: string, routeLabel: string): SoqtapataPhase1BreadcrumbItem[] {
  const route = routeLabel.trim() || 'Route'
  const current = pageTitle.trim() || 'Experience'
  return [
    { type: 'span-muted', text: 'Home' },
    { type: 'span-muted', text: '›' },
    { type: 'span-muted', text: 'Experiences' },
    { type: 'span-muted', text: '›' },
    { type: 'span-muted', text: route },
    { type: 'span-muted', text: '›' },
    { type: 'current', text: current },
  ]
}

function resolveExperiencePageTitle(
  ph: CmsPageHero | null | undefined,
  e: CmsExperience,
  rowTitle?: string | null,
): string {
  return (
    (ph?.headline && ph.headline.trim()) ||
    e.name?.trim() ||
    rowTitle?.trim() ||
    'Experience'
  )
}

function resolveExperienceRouteLabel(e: CmsExperience): string {
  const routeSlug = experienceRouteSlug(e)
  return (
    (e.routeDocument?.name && e.routeDocument.name.trim()) ||
    (routeSlug ? resolveRouteLabel(routeSlug) : '') ||
    'Route'
  )
}

function experienceRouteSlug(e: CmsExperience): string | null {
  const doc = e.routeDocument
  const rawSlug = doc?.slug
  const slug =
    typeof rawSlug === 'string'
      ? rawSlug.trim()
      : rawSlug && typeof rawSlug === 'object'
        ? String((rawSlug as { current?: string | null }).current ?? '').trim()
        : ''
  if (slug) return slug
  return e.route?.trim() || null
}

function resolvePrimaryLodgeForExperience(e: CmsExperience): CmsLodge | null {
  if (e.lodge?.name) return e.lodge
  const fromRow = e.lodgePresentationRows?.map((r) => r.lodge).find((l) => l?.name)
  if (fromRow?.name) return fromRow
  const days = [...(e.itinerary ?? [])].sort((a, b) => (a.dayNumber ?? 0) - (b.dayNumber ?? 0))
  for (const d of days) {
    if (d.overnight?.mode === 'none') continue
    const ld = d.overnightLodge
    if (ld?.name) return ld
  }
  return null
}

function resolveHeroLodgeNamesForExperience(e: CmsExperience): string {
  const rowNames = (e.lodgePresentationRows ?? [])
    .map((r) => r.lodge?.name?.trim())
    .filter((name): name is string => Boolean(name))
  const uniqueRowNames = Array.from(new Set(rowNames))
  if (uniqueRowNames.length > 0) return uniqueRowNames.join(' · ')

  return resolvePrimaryLodgeForExperience(e)?.name?.trim() || ''
}

function lodgeModifiersFor(e: CmsExperience, lodgeId: string | undefined | null): CmsLodgePresentationRow | null {
  if (!lodgeId || !e.lodgePresentationRows?.length) return null
  return e.lodgePresentationRows.find((r) => r.lodge?._id === lodgeId) ?? null
}

function buildFlexibleTravelerGuideCardsFromSubsections(
  subs: TravellerGuideSubsectionResolved[] | CmsTravelerGuideSubsection[] | null | undefined,
): BfygCard[] | null {
  if (!subs?.length) return null
  const cards: BfygCard[] = []
  for (let i = 0; i < subs.length; i++) {
    const s = subs[i]!
    const layout = s.displayType?.trim() === 'checklist' ? 'checklist' : 'qa'
    const rawHi = s.headerIcon?.trim()
    const headerIcon = rawHi === 'luggage' || rawHi === 'phone' ? rawHi : 'entry'
    const id = (s._key && `bfyg-${s._key}`) || `bfyg-flex-${i}`
    const title = (s.title && s.title.trim()) || `Section ${cards.length + 1}`
    const defaultOpen = cards.length === 0

    if (layout === 'checklist') {
      const checklistItems = (s.rows ?? [])
        .filter(isTravelerGuideChecklistRow)
        .map((r) => ({
          label: (r.label && String(r.label).trim()) || '',
          ...(r.iconKey && String(r.iconKey).trim()
            ? { iconKey: String(r.iconKey).trim() }
            : {}),
        }))
        .filter((x): x is { label: string; iconKey?: string } => Boolean(x.label))
      if (!checklistItems.length) continue
      cards.push({
        kind: 'flex',
        flexLayout: 'checklist',
        id,
        defaultOpen,
        title,
        headerIcon,
        items: [],
        checklistItems,
      })
      continue
    }

    const items = (s.rows ?? [])
      .filter(
        (r): r is CmsTravelerGuideQaRowCms =>
          r != null && typeof r === 'object' && !isTravelerGuideChecklistRow(r),
      )
      .map((r) => {
        const titleCell = (r.title && String(r.title).trim()) || ''
        const body = r.body != null ? String(r.body).trim() : ''
        const iconKey = r.iconKey && String(r.iconKey).trim() ? String(r.iconKey).trim() : undefined
        if (!titleCell) return null
        return iconKey ? { title: titleCell, body, iconKey } : { title: titleCell, body }
      })
      .filter((x): x is { title: string; body: string; iconKey?: string } => x != null)
    if (!items.length) continue
    cards.push({
      kind: 'flex',
      flexLayout: 'qa',
      id,
      defaultOpen,
      title,
      headerIcon,
      items,
    })
  }
  if (!cards.length) return null
  return cards
}

function mergeTravelerGuideFromCms(e: CmsExperience, l: SoqtapataExperience, out: Partial<SoqtapataExperience>): void {
  const sections = e.travelerGuideSections
  if (!sections?.length) return
  const entry = sections.filter((s) => s.bucket === 'entry')
  const packing = sections.filter((s) => s.bucket === 'packing')
  const logistics = sections.filter((s) => s.bucket === 'logistics')
  const c0 = l.beforeYouGo.cards[0] as { id: 'bfyg1'; defaultOpen: true; title: string; headerIcon: 'entry'; items: { title: string; body: string }[] }
  const c1 = l.beforeYouGo.cards[1] as {
    id: 'bfyg2'
    defaultOpen: false
    title: string
    headerIcon: 'luggage'
    lead: string
    packItems: string[]
  }
  const c2 = l.beforeYouGo.cards[2] as {
    id: 'bfyg3'
    defaultOpen: false
    title: string
    headerIcon: 'phone'
    items: { title: string; body: string }[]
  }
  out.beforeYouGo = { ...l.beforeYouGo, cards: [...l.beforeYouGo.cards] }

  if (entry.length) {
    const top = entry[0]!
    const items = entry
      .flatMap((s) =>
        (s.pairItems ?? []).map((p) => ({
          title: (p.title && String(p.title).trim()) || '',
          body: (p.body && String(p.body).trim()) || '',
        })),
      )
      .filter((x) => x.title)
    if (items.length) {
      const hi = top.headerIcon === 'luggage' || top.headerIcon === 'phone' ? 'entry' : top.headerIcon || 'entry'
      ;(out.beforeYouGo!.cards[0] as typeof c0) = {
        ...c0,
        title: top.title?.trim() || c0.title,
        headerIcon: hi as 'entry',
        items,
      }
    }
  }

  if (packing.length) {
    const top = packing[0]!
    const packItems = packing.flatMap((s) => normalizeStringHighlightList((s.bulletItems ?? []) as unknown[]))
    if (packItems.length) {
      const lead =
        packing
          .map((s) => s.packingLead?.trim())
          .filter(Boolean)
          .join('\n\n') || c1.lead
      const hi = top.headerIcon === 'entry' || top.headerIcon === 'phone' ? 'luggage' : top.headerIcon || 'luggage'
      ;(out.beforeYouGo!.cards[1] as typeof c1) = {
        ...c1,
        title: top.title?.trim() || c1.title,
        headerIcon: hi as 'luggage',
        lead,
        packItems,
      }
    }
  }

  if (logistics.length) {
    const top = logistics[0]!
    const items = logistics
      .flatMap((s) =>
        (s.pairItems ?? []).map((p) => ({
          title: (p.title && String(p.title).trim()) || '',
          body: (p.body && String(p.body).trim()) || '',
        })),
      )
      .filter((x) => x.title)
    if (items.length) {
      const hi = top.headerIcon === 'entry' || top.headerIcon === 'luggage' ? 'phone' : top.headerIcon || 'phone'
      ;(out.beforeYouGo!.cards[2] as typeof c2) = {
        ...c2,
        title: top.title?.trim() || c2.title,
        headerIcon: hi as 'phone',
        items,
      }
    }
  }
}

function applySeasonLegendToWhen(
  merged: SoqtapataWhen,
  legend: CmsSeasonLegend | null | undefined,
  localWhen: SoqtapataWhen,
): SoqtapataWhen {
  if (!legend) return merged
  const copy = resolveSeasonLegendCopy(legend, localWhen)
  const baseLg = localWhen.legend
  const items: typeof baseLg.items = [
    {
      swatchStyle: baseLg.items[0]!.swatchStyle,
      strong: copy.peak.label || baseLg.items[0]!.strong,
      rest: copy.peak.description.trim()
        ? ` — ${copy.peak.description.trim()}`
        : baseLg.items[0]!.rest,
    },
    {
      swatchStyle: baseLg.items[1]!.swatchStyle,
      strong: copy.great.label || baseLg.items[1]!.strong,
      rest: copy.great.description.trim()
        ? ` — ${copy.great.description.trim()}`
        : baseLg.items[1]!.rest,
    },
    {
      swatchStyle: baseLg.items[2]!.swatchStyle,
      strong: copy.always.label || baseLg.items[2]!.strong,
      rest: copy.always.description.trim()
        ? ` — ${copy.always.description.trim()}`
        : baseLg.items[2]!.rest,
    },
  ]
  return {
    ...merged,
    ...(legend.intro?.trim() ? { intro: legend.intro.trim() } : {}),
    legend: {
      eyebrow: copy.seasonKeyEyebrow,
      items,
    },
  }
}

function mapKnowledgeResourcesRows(
  rows: CmsKnowledgeResourceRow[] | null | undefined,
  termsPdfUrl: string | null | undefined,
): SoqtapataResourceCard[] | null {
  if (!rows?.length) return null
  const cards: SoqtapataResourceCard[] = []
  let idx = 0
  for (const r of rows) {
    const title = (r.title && r.title.trim()) || ''
    if (!title) continue
    const resourceType = r.resourceType?.trim()
    if (resourceType === 'termsConditions') {
      const centralPdf = termsPdfUrl?.trim()
      if (!centralPdf) continue
      const show = r.showCta !== false
      const label = show
        ? (r.ctaLabel && r.ctaLabel.trim()) || DEFAULT_EXPERIENCE_RESOURCE_DOWNLOAD_CTA_LABEL
        : ''
      cards.push({
        id: r._key || `kr-${idx}`,
        kind: 'termsPdf',
        previewKind: 'termsPdf',
        title,
        meta: (r.text && r.text.trim()) || '',
        downloadHref: centralPdf,
        downloadLabel: label,
        openInNewTab: true,
      })
      idx += 1
      continue
    }
    const imgUrl = r.image?.imageUrl?.trim()
    const imgAlt = (r.image?.alt && r.image.alt.trim()) || title
    const show = r.showCta !== false
    const resolved = resolveSmartLinkOrLegacy(
      r.ctaSmartLink,
      undefined,
      {
        label: (r.ctaLabel && r.ctaLabel.trim()) || DEFAULT_EXPERIENCE_RESOURCE_DOWNLOAD_CTA_LABEL,
        href: '#',
        openInNewTab: true,
      },
    )
    const href = show ? (resolved?.href?.trim() || '#') : '#'
    const label = show ? (resolved?.label?.trim() || r.ctaLabel?.trim() || DEFAULT_EXPERIENCE_RESOURCE_DOWNLOAD_CTA_LABEL) : ''
    const openInNewTab = show && resolved?.openInNewTab === true
    const kind = cmsResourceKind(resourceType)
    cards.push({
      id: r._key || `kr-${idx}`,
      kind,
      previewKind: kind,
      title,
      meta: (r.text && r.text.trim()) || '',
      downloadHref: href,
      downloadLabel: label,
      ...(openInNewTab ? { openInNewTab: true } : {}),
      ...(imgUrl ? { previewImageSrc: imgUrl, previewImageAlt: imgAlt } : {}),
    })
    idx += 1
  }
  return cards.length ? cards : null
}

function cmsResourceKind(resourceType: string | null | undefined): SoqtapataResourceCard['kind'] {
  if (resourceType === 'map') return 'map'
  if (resourceType === 'brochure') return 'brochure'
  if (resourceType === 'termsConditions' || resourceType === 'termsPdf' || resourceType === 'terms') {
    return 'termsPdf'
  }
  return 'custom'
}

function normalizePreviewKind(
  preset: string | null | undefined,
  kind: SoqtapataResourceCard['kind'],
): SoqtapataResourceCard['previewKind'] {
  if (!preset || preset === 'auto') {
    return kind
  }
  if (preset === 'terms') return 'termsPdf'
  if (preset === 'map' || preset === 'brochure' || preset === 'custom') {
    return preset
  }
  return kind
}

function mapExperienceResourcesFromCms(
  rows: CmsExperienceResourceRow[] | null | undefined,
  termsPdfUrl: string | null | undefined,
): SoqtapataResourceCard[] | null {
  if (!rows || rows.length === 0) return null
  const indexed = rows.map((r, idx) => ({ r, idx }))
  const visible = indexed.filter(({ r }) => r.visible !== false)
  if (visible.length === 0) return null
  const sorted = [...visible].sort((a, b) => {
    const oa = a.r.order ?? 10_000
    const ob = b.r.order ?? 10_000
    if (oa !== ob) return oa - ob
    return a.idx - b.idx
  })
  const cards: SoqtapataResourceCard[] = []
  for (const { r, idx } of sorted) {
    const title = (r.title && r.title.trim()) || ''
    if (!title) continue
    const kind = cmsResourceKind(r.resourceType)
    const previewKind = normalizePreviewKind(r.visualPreset, kind)
    if (kind === 'termsPdf' && (r.resourceType === 'termsConditions' || r.resourceType === 'termsPdf')) {
      const centralPdf = termsPdfUrl?.trim()
      if (!centralPdf) continue
    }
    const href =
      kind === 'termsPdf'
        ? (termsPdfUrl?.trim() || '#')
        : (r.fileAssetUrl && String(r.fileAssetUrl).trim()) ||
      (r.fileUrl && String(r.fileUrl).trim()) ||
      '#'
    const label = (r.ctaLabel && r.ctaLabel.trim()) || DEFAULT_EXPERIENCE_RESOURCE_DOWNLOAD_CTA_LABEL
    const meta = (r.subtitle && r.subtitle.trim()) || ''
    const imgUrl = r.previewImage?.imageUrl?.trim()
    const imgAlt = (r.previewImage?.alt && r.previewImage.alt.trim()) || title
    const openInNewTab = kind === 'termsPdf' || /^https?:/i.test(href)
    cards.push({
      id: r._key || `resource-${idx}`,
      kind,
      previewKind,
      title,
      meta,
      downloadHref: href,
      downloadLabel: label,
      ...(openInNewTab ? { openInNewTab: true } : {}),
      ...(imgUrl ? { previewImageSrc: imgUrl, previewImageAlt: imgAlt } : {}),
    })
  }
  return cards.length > 0 ? cards : null
}

/**
 * Construye un `Partial<SoqtapataExperience>` desde el row GROQ (ya dereferenciado).
 * Omite claves que no tienen datos CMS útiles; el merge con local rellena el resto.
 */
export function soqtapataPartialFromStructuredRow(
  row: SoqtapataStructuredPageRow,
  local: SoqtapataExperience = soqtapataExperience,
  promotions?: PromotionDoc[] | null,
): Partial<SoqtapataExperience> {
  if (!row?.experience) return {}
  const e = row.experience
  const ph = row.pageHero
  const l = local

  const programBadge = (e.programType && PROGRAM[e.programType]) || 'Classic Nature'
  const routeSlug = experienceRouteSlug(e)
  const routeBadge = routeSlug ? resolveRouteLabel(routeSlug) : 'Camanti Route'
  const heroPrice = resolveExperienceHeroPriceParts(e, ph, promotions)
  const priceFrom = heroPrice.from
  const priceAmount = heroPrice.amount
  const priceSubline = heroPrice.suffix
  const h1 = resolveExperiencePageTitle(ph, e, row.internalTitle)
  const tag = (ph?.headlineSub && ph.headlineSub.trim()) || e.tagline?.trim() || l.hero.tagline
  const badges =
    (ph?.pills && ph.pills.length > 0) ? ph.pills : [programBadge, routeBadge, e.duration || l.stats[0]?.n || '3D · 2N']
  const bookSmart = ph?.bookCtaSmartLink
  const bookResolved = resolveSmartLinkOrLegacy(
    bookSmart,
    ph?.bookCta,
    {
      label: l.hero.bookLabel,
      href: l.hero.bookUrl,
      openInNewTab: ph?.bookCta?.openInNewTab === true,
    },
  )
  const bookHidden = smartLinkIsDisabled(bookSmart)
  const bookUrl = bookHidden ? '' : (bookResolved?.href ?? l.hero.bookUrl)
  const bookLabel = bookHidden ? '' : (bookResolved?.label ?? l.hero.bookLabel)

  const breadcrumb = buildExperiencePageBreadcrumb(h1, resolveExperienceRouteLabel(e))

  const ratingScore = ph?.manualRatingValue?.trim() || l.hero.ratingScore
  const ratingReviews = (() => {
    const n = ph?.manualReviewCount
    if (typeof n === 'number' && Number.isFinite(n) && n >= 0) {
      const suffix = n === 1 ? 'review' : 'reviews'
      const prov = ph?.manualReviewProviderLabel?.trim()
      return `· ${n} ${suffix}${prov ? ` · ${prov}` : ''}`
    }
    return l.hero.ratingReviews
  })()

  const out: Partial<SoqtapataExperience> = {
    hero: {
      ...l.hero,
      h1,
      tagline: tag,
      badges,
      priceFrom,
      priceAmount,
      priceSub: priceSubline,
      bookUrl,
      bookLabel,
      breadcrumb,
      lodgeName: resolveHeroLodgeNamesForExperience(e),
      ratingScore,
      ratingReviews,
    },
    pageNav: {
      ...l.pageNav,
      leadName: h1,
      leadDays: (e.duration && e.duration.trim()) || l.pageNav.leadDays,
      fromNum: priceAmount,
      fromSub: 'per person',
      fromAriaLabel: `From ${priceAmount} per person`,
      bookHref: bookUrl,
      bookLabel,
      ...(bookHidden ? { bookVisible: false } : {}),
    },
  }

  out.itinerary = buildExperienceItineraryFromCms(e, l.itinerary, {
    lodgeModifiersFor: (lodgeId) => lodgeModifiersFor(e, lodgeId),
  })

  if (e.wildlife && e.wildlife.length > 0) {
    let wRows = [...e.wildlife]
    if (row.wildlifeOrderKeys?.length) {
      const picked = pickByKeys(wRows as { _key?: string | null }[], row.wildlifeOrderKeys)
      if (picked?.length) wRows = picked as CmsWildlifeItem[]
    } else if (row.wildlifeDisplayOrder?.length) {
      const p = pickByIndices(wRows, row.wildlifeDisplayOrder)
      if (p?.length) wRows = p
    }
    let species = wRows.map((s, i) => {
        const nameMatch = s.name
          ? l.wildlife.species.find((sp) => (sp.name || '').trim() === (s.name || '').trim())
          : undefined
        const fallback = nameMatch ?? l.wildlife.species[i] ?? l.wildlife.species[0]!
        const cmsImg = s.imageUrl ? imgW(s.imageUrl, 960) : null
        const badgeTrim = (s.badge && s.badge.trim()) || fallback?.badge
        const base = {
          name: s.name || fallback?.name || '',
          sub: s.description || fallback?.sub || '',
          iconId: (s.iconType && W_ICON[s.iconType] !== undefined ? W_ICON[s.iconType]! : fallback?.iconId ?? 6) as
          | 0
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6,
        }
        const photo =
          cmsImg != null
            ? { imageSrc: cmsImg, imageAlt: (s.name || fallback?.name || 'Species').trim() }
            : fallback?.imageSrc
              ? { imageSrc: fallback.imageSrc, imageAlt: (fallback.imageAlt ?? fallback.name).trim() }
              : {}
        return {
          ...base,
          ...photo,
          ...(badgeTrim ? { badge: badgeTrim } : {}),
        }
      })
    out.wildlife = {
      ...l.wildlife,
      species,
    }
  }


  if (e.bestTimeByMonth && e.bestTimeByMonth.length === 12) {
    const tierLabels = resolveSeasonLegendCopy(e.seasonLegend, l.when)
    const mergedWhen = {
      ...l.when,
      months: e.bestTimeByMonth.map((m, i) => whenMonthFromCms(m, l.when, i, tierLabels)),
    } as SoqtapataWhen
    out.when = e.seasonLegend ? applySeasonLegendToWhen(mergedWhen, e.seasonLegend, l.when) : mergedWhen
  }

  let guideSubs = mergeTravellerGuideSubsectionsSource(
    row.travellerGuideSettings,
    e._id,
    e.travelerGuideSubsections,
  )
  if (row.travellerGuideOrderKeys?.length && guideSubs.length > 0) {
    guideSubs = (curateKeyedRowsStrict(
      guideSubs as { _key?: string | null }[],
      row.travellerGuideOrderKeys,
      'travellerGuide',
    ) ?? []) as TravellerGuideSubsectionResolved[]
  }
  const flexCards = buildFlexibleTravelerGuideCardsFromSubsections(guideSubs)
  if (flexCards) {
    out.beforeYouGo = { ...l.beforeYouGo, cards: flexCards }
  } else if (e.travelerGuideSections?.length) {
    mergeTravelerGuideFromCms(e, l, out)
  } else if (e.entryRequirements?.length || e.packingList?.length || e.gettingHereInfo?.length) {
    const c0 = l.beforeYouGo.cards[0] as { id: string; items: { title: string; body: string }[] }
    const c1 = l.beforeYouGo.cards[1] as { id: string; packItems: string[]; lead: string }
    const c2 = l.beforeYouGo.cards[2] as { id: string; items: { title: string; body: string }[] }
    out.beforeYouGo = { ...l.beforeYouGo, cards: [...l.beforeYouGo.cards] }
    if (e.entryRequirements && e.entryRequirements.length > 0) {
      ;(out.beforeYouGo!.cards[0] as typeof c0).items = e.entryRequirements.map((x) => ({
        title: x.title || '',
        body: x.description || '',
      }))
    }
    if (e.packingList && e.packingList.length > 0) {
      ;(out.beforeYouGo!.cards[1] as typeof c1).packItems = e.packingList
    }
    if (e.gettingHereInfo && e.gettingHereInfo.length > 0) {
      ;(out.beforeYouGo!.cards[2] as typeof c2).items = e.gettingHereInfo.map((x) => ({
        title: x.title || '',
        body: x.description || '',
      }))
    }
  }

  const useKnowledgeResources = Boolean(e.knowledgeResources?.length)
  let expRes = useKnowledgeResources ? e.knowledgeResources : e.resources
  if (row.resourcesFromExperienceKeys?.length && expRes && expRes.length > 0) {
    expRes = (curateKeyedRowsStrict(
      expRes as { _key?: string | null }[],
      row.resourcesFromExperienceKeys,
      'resources',
    ) ?? []) as typeof expRes
  } else if (row.resourcesFromExperienceOrder?.length && expRes && expRes.length > 0) {
    const p = pickByIndices(expRes as unknown[], row.resourcesFromExperienceOrder)
    if (p?.length) expRes = p as typeof expRes
  }
  const termsPdfUrl = resolveTermsPdfUrlForExperience(
    row.termsConditions,
    e._id,
    e.fullTermsPdfUrl,
  )
  const expCards = useKnowledgeResources
    ? mapKnowledgeResourcesRows(expRes as CmsKnowledgeResourceRow[], termsPdfUrl)
    : mapExperienceResourcesFromCms(expRes as CmsExperienceResourceRow[], termsPdfUrl)
  const previewBase = {
    mapPreviewTitle: l.resources.mapPreviewTitle,
    mapPreviewSubtitle: l.resources.mapPreviewSubtitle,
    brochurePreviewBadge: l.resources.brochurePreviewBadge,
  }

  if (expCards) {
    out.resources = { ...l.resources, ...previewBase, cards: expCards }
  } else if (e.mapPdfUrl || e.brochurePdfUrl) {
    const res = l.resources
    const cards = res.cards.map((c, i) => {
      if (i === 0 && c.kind === 'map' && e.mapPdfUrl) {
        return { ...c, downloadHref: e.mapPdfUrl, downloadLabel: e.mapPdfLabel || c.downloadLabel }
      }
      if (i === 1 && c.kind === 'brochure' && e.brochurePdfUrl) {
        return { ...c, downloadHref: e.brochurePdfUrl, downloadLabel: e.brochurePdfLabel || c.downloadLabel }
      }
      return c
    })
    out.resources = { ...res, ...previewBase, cards }
  }

  const mergedFaqs = mergeFaqsSource(row.faqsSettings, e._id, e.faqs)
  if (mergedFaqs.length > 0) {
    let faqList = [...mergedFaqs]
    if (row.faqOrderKeys?.length) {
      faqList = (curateKeyedRowsStrict(faqList as { _key?: string | null }[], row.faqOrderKeys, 'faq') ??
        []) as typeof faqList
    } else if (row.faqDisplayOrder?.length) {
      const p = pickByIndices(faqList, row.faqDisplayOrder)
      if (p?.length) faqList = p as typeof faqList
    }
    out.faq = {
      ...l.faq,
      items: faqList.map((f, i) => ({
        id: f._key || `faq${i + 1}`,
        question: f.question || '',
        answer: f.answer || '',
      })),
    }
  }

  if (out.terms) {
    if (row.termsDownloadLabel?.trim()) {
      out.terms = { ...out.terms, pdfDownloadLabel: row.termsDownloadLabel.trim() }
    }
    if (row.termsDownloadEnabled === false) {
      out.terms = { ...out.terms, pdfHref: '#' }
    }
  }

  return out
}

/**
 * Reseñas curadas en `experiencePage.reviewRefs`. Con documento Sanity cargado y experiencia resuelta:
 * lista vacía si no hay refs (no se reutilizan tarjetas locales inventadas).
 * `null` solo si no aplica override (sin fila / sin experiencia).
 */
export function reviewsFromRow(row: SoqtapataStructuredPageRow | null | undefined): ReviewDoc[] | null {
  if (!row?.experience) return null
  const docs = row.reviewDocs
  if (!docs || docs.length === 0) return []
  return docs.map((d) => reviewToDoc(d)).filter((x): x is ReviewDoc => x != null)
}

export function techProductsFromRow(row: SoqtapataStructuredPageRow): TechnologyProductDoc[] | null {
  const docs = row?.techProductDocs
  if (docs && docs.length > 0) {
    return docs.map((d) => techToDoc(d))
  }
  const fromExp = row?.experience?.includedTechProductDocs
  if (fromExp && fromExp.length > 0) {
    return fromExp.map((d) => techToDoc(d))
  }
  return null
}

export function includedIdsFromRow(row: SoqtapataStructuredPageRow): string[] | null {
  const ids = row?.includedTechProductIds
  if (!ids || ids.length === 0) return null
  return [...ids]
}

export function reviewsLayoutFromRow(
  row: SoqtapataStructuredPageRow | null | undefined,
  defaults: typeof import('@/data/soqtapataExperienceLocal').soqtapataExperienceReviewsLayout,
): import('@/lib/experienceReviewsPresentation').ExperienceReviewsLayoutMutable {
  const d = defaults
  const r = row?.reviewsLayout
  if (!r) {
    return {
      eyebrow: d.eyebrow,
      headline: d.headline,
      averageRating: d.averageRating,
      sectionClassName: d.sectionClassName,
      contentInnerClassName: d.contentInnerClassName,
      useHomepageSampleReviewsIfEmpty: d.useHomepageSampleReviewsIfEmpty,
      sourceLabel: d.sourceLabel,
      secondaryRatingLine: d.secondaryRatingLine?.trim() ? d.secondaryRatingLine : '',
      emptyMessage: d.emptyMessage?.trim() ? d.emptyMessage : '',
      reviewsRegionAriaLabel: d.reviewsRegionAriaLabel,
      reviewTablistAriaLabel: d.reviewTablistAriaLabel,
      quoteDotAriaLabelPrefix: d.quoteDotAriaLabelPrefix,
      reviewDotAriaLabelPrefix: d.reviewDotAriaLabelPrefix,
      guestFallbackName: d.guestFallbackName,
    }
  }
  return {
    eyebrow: r.eyebrow?.trim() || d.eyebrow,
    headline: r.headline?.trim() || d.headline,
    averageRating: r.averageRating?.trim() || d.averageRating,
    sectionClassName: r.sectionClassName?.trim() || d.sectionClassName,
    contentInnerClassName: r.contentInnerClassName?.trim() || d.contentInnerClassName,
    useHomepageSampleReviewsIfEmpty:
      r.useHomepageSampleReviewsIfEmpty != null ? r.useHomepageSampleReviewsIfEmpty : d.useHomepageSampleReviewsIfEmpty,
    sourceLabel: r.sourceLabel?.trim() || d.sourceLabel,
    secondaryRatingLine: r.secondaryRatingLine?.trim() ?? '',
    emptyMessage: r.emptyMessage?.trim() ?? '',
    reviewsRegionAriaLabel: r.reviewsRegionAriaLabel?.trim() || d.reviewsRegionAriaLabel,
    reviewTablistAriaLabel: r.reviewTablistAriaLabel?.trim() || d.reviewTablistAriaLabel,
    quoteDotAriaLabelPrefix: r.quoteDotAriaLabelPrefix?.trim() || d.quoteDotAriaLabelPrefix,
    reviewDotAriaLabelPrefix: r.reviewDotAriaLabelPrefix?.trim() || d.reviewDotAriaLabelPrefix,
    guestFallbackName: r.guestFallbackName?.trim() || d.guestFallbackName,
  }
}

export function seoFromStructuredRow(
  row: SoqtapataStructuredPageRow | null | undefined,
  fallbacks: { title: string; description: string },
): { title: string; description: string } {
  if (!row) return fallbacks
  const pageSeo = row.seo
  const expSeo = row.experience?.seo
  return {
    title: (pageSeo?.title && pageSeo.title.trim()) || (expSeo?.title && expSeo.title.trim()) || fallbacks.title,
    description:
      (pageSeo?.description && pageSeo.description.trim()) || (expSeo?.description && expSeo.description.trim()) || fallbacks.description,
  }
}

function strOrNull(v: unknown): string | null {
  if (v == null) return null
  const s = typeof v === 'string' ? v.trim() : String(v).trim()
  return s.length > 0 ? s : null
}

function orderRelatedByRefs(
  docs: CmsRelatedExperience[] | null | undefined,
  refIds: string[] | null | undefined,
): CmsRelatedExperience[] {
  if (!docs?.length) return []
  if (!refIds?.length) return docs
  const m = new Map<string, CmsRelatedExperience>()
  for (const d of docs) {
    if (d.pageId) m.set(d.pageId, d)
    m.set(d._id, d)
  }
  return refIds.map((id) => m.get(id)).filter((x): x is CmsRelatedExperience => x != null)
}

function relatedExperienceToCard(exp: CmsRelatedExperience): SoqtapataRelatedCardImage | null {
  const pageSlug = exp.slug?.trim()
  const href = pageSlug ? `/experiences/${pageSlug}` : ''
  if (!href) return null

  const card =
    toExperienceCardData(
      {
        name: exp.name,
        mainImageUrl: exp.mainImageUrl,
        programType: exp.programType,
        route: exp.route,
        routeSlug: exp.routeSlug,
        routeLabel: exp.routeLabel,
        shortDescription: exp.shortDescription,
        price: exp.price,
        priceLabel: exp.priceLabel,
        experienceId: exp._id,
        experienceLandingSlug: pageSlug,
      },
      { href, ctaLabel: 'View' },
    ) ?? null

  if (!card) return null
  return { kind: 'image', ...card }
}

/**
 * Construye el documento mínimo `experiencePage` en memoria (Studio) para reutilizar
 * `alsoBookFromStructuredRow` y mostrar el mismo texto que en la ruta pública.
 */
export function buildSoqtapataStudioPreviewRow(p: {
  relatedSectionEyebrow?: string | null
  relatedSectionTitle?: string | null
  relatedRefIds: string[]
  relatedExperiencesFromLanding: CmsRelatedLandingRow[] | null | undefined
  reserveCtaSettings?: ReserveCtaSettingsGroq
  reserveBlock?: CmsReserveBlock | null
}): SoqtapataStructuredPageRow {
  return {
    _id: 'studioPreview',
    relatedSectionEyebrow: p.relatedSectionEyebrow,
    relatedSectionTitle: p.relatedSectionTitle,
    relatedRefIds: p.relatedRefIds,
    relatedExperiencesFromLanding: p.relatedExperiencesFromLanding || [],
    reserveCtaSettings: p.reserveCtaSettings ?? null,
    reserveBlock: p.reserveBlock ?? null,
  }
}

/**
 * Aplica refs relacionadas (orden) y CTAs legacy / reserve.
 * Copy “Also like” viene de **sectionModules** (`applySoqtapataSectionPresentation`); `relatedSection*` ya no aplica aquí.
 */
export function alsoBookFromStructuredRow(
  row: SoqtapataStructuredPageRow,
  local: SoqtapataExperience,
  pageBookingSummary?: ExperienceBookingSummary | null,
  promotions?: PromotionDoc[] | null,
): { also: SoqtapataAlsoCamanti; book: SoqtapataBook } {
  if (!row) {
    return { also: local.also, book: local.book }
  }
  const lAlso = local.also
  const lBook = local.book
  const refIds = row.relatedRefIds || []
  const relatedProducts = relatedProductsFromLanding(row.relatedExperiencesFromLanding)
  const ordered = orderRelatedByRefs(relatedProducts, refIds)

  const cards: SoqtapataAlsoCamanti['cards'] = []
  for (const exp of ordered) {
    const card = relatedExperienceToCard(exp)
    if (card) cards.push(card)
  }

  const tailorBand = row.showTailorMade
    ? resolveTailorMadeBand(
        {
          showTailorMade: true,
          eyebrow: row.tailorMadeEyebrow,
          title: row.tailorMadeTitle,
          subtitle: row.tailorMadeBody,
          ctaSmartLink: row.tailorMadeCtaSmartLink,
        },
        {
          eyebrow: '',
          title: '',
          subtitle: '',
          ctaLabel: '',
          href: '#',
        },
        {
          pageBookingSummary: pageBookingSummary ?? null,
          strict: true,
          ctaFallback: { ctaLabel: 'Enquire →', href: '#', openInNewTab: false },
        },
      )
    : undefined

  const also: SoqtapataAlsoCamanti = {
    eyebrow: lAlso.eyebrow,
    h2: lAlso.h2,
    h2Style: lAlso.h2Style,
    lead: lAlso.lead,
    cards,
    ...(tailorBand ? { tailorBand } : {}),
  }

  const rb = row.reserveBlock
  const wetResolved = resolveSmartLinkOrLegacy(
    rb?.wetravelSmartLink,
    { label: rb?.wetravelLabel, href: rb?.wetravelUrl, openInNewTab: true },
    { label: lBook.wetravelLabel, href: lBook.wetravelUrl, openInNewTab: true },
  )
  const waResolved = resolveSmartLinkOrLegacy(
    rb?.whatsappSmartLink,
    { label: rb?.whatsappLabel, href: rb?.whatsappUrl, openInNewTab: true },
    { label: lBook.whatsappLabel, href: lBook.whatsappUrl, openInNewTab: true },
  )
  const termsResolved = resolveSmartLinkOrLegacy(
    rb?.termsSmartLink,
    { label: rb?.termsLinkLabel, href: rb?.legalTermsLink, openInNewTab: false },
    { label: lBook.termsLinkLabel, href: lBook.termsHash, openInNewTab: false },
  )
  const wetHidden = smartLinkIsDisabled(rb?.wetravelSmartLink)
  const waHidden = smartLinkIsDisabled(rb?.whatsappSmartLink)
  const termsHidden = smartLinkIsDisabled(rb?.termsSmartLink)
  let book: SoqtapataBook = {
    ...lBook,
    eyebrow: strOrNull(rb?.eyebrow) ?? lBook.eyebrow,
    h2: strOrNull(rb?.headline) ?? lBook.h2,
    h2Style: lBook.h2Style,
    price: strOrNull(rb?.price) ?? lBook.price,
    priceSmall: strOrNull(rb?.priceNote) ?? lBook.priceSmall,
    sub: strOrNull(rb?.priceSub) ?? lBook.sub,
    rows:
      rb?.infoRows && rb.infoRows.length > 0
        ? rb.infoRows.map((r) => ({
            label: (r?.label && r.label.trim()) || '',
            value: (r?.value && r.value.trim()) || '',
          }))
        : lBook.rows,
    wetravelUrl: wetHidden ? '' : (wetResolved?.href ?? lBook.wetravelUrl),
    wetravelLabel: wetHidden ? '' : (wetResolved?.label ?? lBook.wetravelLabel),
    whatsappUrl: waHidden ? '' : (waResolved?.href ?? lBook.whatsappUrl),
    whatsappLabel: waHidden ? '' : (waResolved?.label ?? lBook.whatsappLabel),
    termsNote: strOrNull(rb?.legalNote) ?? lBook.termsNote,
    termsHash: termsHidden ? '' : (termsResolved?.href ?? lBook.termsHash),
    termsLinkLabel: termsHidden ? '' : (termsResolved?.label ?? lBook.termsLinkLabel),
    trustStripItems:
      rb?.trustStripItems && rb.trustStripItems.length > 0
        ? rb.trustStripItems
            .map((t) => ({ text: (t?.text && String(t.text).trim()) || '' }))
            .filter((t) => t.text)
        : lBook.trustStripItems,
  }

  const exp = row.experience
  const promoParts =
    exp != null
      ? formatExperiencePricePartsWithPromotions(
          { ...experiencePromotionTarget(exp), price: exp.price, priceLabel: exp.priceLabel },
          promotions,
          { inclusiveExtra: 'all inclusive' },
        )
      : null
  const expPriceUsd =
    exp && isActiveExperienceStatus(exp.status) && typeof exp.price === 'number' && exp.price > 0
      ? exp.price
      : null
  const promoUsd = promoParts ? parseUsdAmountFromLabel(promoParts.amount) : null
  const displayUsd = promoUsd ?? expPriceUsd
  const expReserveFacts: ExperienceReserveFacts = {
      route: exp?.route,
      duration: exp?.duration,
      groupSizeMin: exp?.groupSizeMin,
      groupSizeMax: exp?.groupSizeMax,
      includes: exp?.includes ?? null,
    programType: exp?.programType,
    distanceFromCusco: exp?.distanceFromCusco,
    gettingHereInfo: exp?.gettingHereInfo ?? null,
    priceUsd: expPriceUsd,
    priceLabel: exp?.priceLabel,
    status: exp?.status,
  }
  const defaultRows = buildDefaultExperienceReserveRows(expReserveFacts)

  const defTermsHref = (termsHidden ? '' : (termsResolved?.href ?? lBook.termsHash)).trim() || '#terms'
  const rs = row.reserveCtaSettings
  const reserveCard = resolveReserveCtaCard({
    settings: rs,
    lowestUsd: displayUsd,
    priceLineStyle: 'exact',
    legacyPriceLine:
      promoParts != null
        ? [promoParts.from, promoParts.amount].filter(Boolean).join(' ').trim() || book.price
        : book.price,
    legacyPriceSuffix: book.priceSmall,
    legacySubline: book.sub,
    defaultSubline: lBook.sub,
    defaultRows,
    experienceReserveFacts: expReserveFacts,
    legacyCtas: {
      primarySmart: rb?.wetravelSmartLink,
      primaryLabel: book.wetravelLabel || rb?.wetravelLabel,
      primaryHref: book.wetravelUrl || rb?.wetravelUrl,
      secondarySmart: rb?.whatsappSmartLink,
      secondaryLabel: book.whatsappLabel || rb?.whatsappLabel,
      secondaryHref: book.whatsappUrl || rb?.whatsappUrl,
    },
    defaultTermsHref: defTermsHref,
    pageBookingSummary: pageBookingSummary ?? null,
  })

  const ctaP = reserveCard.ctas.find((c) => c.variant === 'primary')
  const ctaS = reserveCard.ctas.find((c) => c.variant === 'secondary')

  book = {
    ...book,
    eyebrow: rs?.eyebrow?.trim() || book.eyebrow,
    h2: rs?.title?.trim() || book.h2,
    lead: rs?.body?.trim() || book.lead,
    price: reserveCard.priceLine,
    priceSmall: reserveCard.priceSuffix,
    sub: reserveCard.subline,
    rows: reserveCard.rows,
    wetravelUrl: ctaP?.bookingModal ? '' : (ctaP?.href ?? book.wetravelUrl),
    wetravelLabel: ctaP?.label ?? book.wetravelLabel,
    ...(ctaP?.bookingModal
      ? {
          primaryBookingModal: ctaP.bookingModal,
          primaryBookingSummary: ctaP.bookingSummary ?? pageBookingSummary ?? undefined,
        }
      : {}),
    whatsappUrl: ctaS?.href ?? book.whatsappUrl,
    whatsappLabel: ctaS?.label ?? book.whatsappLabel,
    termsHash: reserveCard.termsHref?.trim() || book.termsHash,
    termsLinkLabel: reserveCard.termsLinkLabel || book.termsLinkLabel,
    termsPrefixText: reserveCard.termsPrefixText,
    termsSuffixText: reserveCard.termsSuffixText,
    termsOpenInNewTab: reserveCard.termsOpenInNewTab,
    termsRel: reserveCard.termsRel,
    reserveTrustItems: reserveCard.trustItems,
  }

  return { also, book }
}
