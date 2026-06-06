import type { SanityImageSource } from '@sanity/image-url'

import type { ReserveCtaSettingsGroq } from '@/lib/reserveCtaGroq'
import type { ReviewsRatingSummary } from '@/lib/reviewsRatingSummary'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'
import type {
  LodgeBookCtaData,
  LodgeExperiencesData,
  LodgeFacilitiesData,
  LodgeFaqData,
  LodgeHeroData,
  LodgeInPageNavData,
  LodgeLocationData,
  LodgeOverviewData,
  LodgeResearchData,
  LodgeRoomsData,
  LodgeSnapshotItem,
} from '@/data/lodgeSoqtapataStatic'
import type { ReviewDoc } from '@/lib/queries'
import type { LodgePageSectionVisibility } from '@/lib/lodgePageSectionVisibility'

/** Slug por defecto de la landing Soqtapata en `/lodges/[slug]` (alineado a `lodgePage` en Sanity). */
export const LODGE_SOQTAPATA_PAGE_SLUG = 'soqtapata-lodge' as const

export const lodgeSoqtapataSeoDefault = {
  title: 'Soqtapata Lodge — Ecotone · Camanti Route, Cusco',
  description:
    'The only lodge inside the Soqtapata Reserve. Cloud forest stays adjacent to CIDS research station — max 14 guests.',
} as const

export type LodgeLinkWithLabel = {
  label?: string | null
  href?: string | null
  openInNewTab?: boolean | null
}

export type LodgePageSectionCopyRow = {
  visible?: boolean | null
  eyebrow?: string | null
  title?: string | null
  body?: string | null
}

export type LodgePageSectionsRow = {
  hero?: LodgePageSectionCopyRow | null
  highlights?: LodgePageSectionCopyRow | null
  navigation?: LodgePageSectionCopyRow | null
  overview?: LodgePageSectionCopyRow | null
  accommodation?: LodgePageSectionCopyRow | null
  facilities?: LodgePageSectionCopyRow | null
  location?: LodgePageSectionCopyRow | null
  research?: LodgePageSectionCopyRow | null
  experiences?: LodgePageSectionCopyRow | null
  reviews?: LodgePageSectionCopyRow | null
  faq?: LodgePageSectionCopyRow | null
  booking?: LodgePageSectionCopyRow | null
} | null

export type LodgeSnapshotItemRow = {
  key?: string | null
  label?: string | null
  value?: string | null
}

export type LodgeGalleryItemRow = {
  _key?: string | null
  stableKey?: string | null
  title?: string | null
  caption?: string | null
  altText?: string | null
  description?: string | null
  alt?: string | null
  /** New editorial category (hero | accommodation | commonAreasAmenities | other). */
  photoCategory?: string | null
  /** Links to `rooms[]` row `_key` when category is accommodation. */
  accommodationRoomKey?: string | null
  usageSection?: 'hero' | 'accommodation' | 'commonAreas' | string | null
  roomStableId?: string | null
  /** @deprecated legacy categorization */
  category?: string | null
  /** @deprecated legacy relation */
  relatedRoomStableId?: string | null
  /** @deprecated legacy relation */
  relatedCommonAreaKey?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
}

export type LodgeRoomGalleryItemRow = {
  title?: string | null
  description?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
}

export type LodgeRoomGalleryPickRow = {
  galleryStableKey?: string | null
}

export type LodgeRoomRow = {
  _key?: string | null
  stableId?: string | null
  name?: string | null
  numberOfRooms?: number | null
  capacity?: number | null
  highlights?: string[] | null
  /** @deprecated legacy picks from `lodge.gallery` by `stableKey`. */
  galleryItemKeys?: LodgeRoomGalleryPickRow[] | null
  /** @deprecated Upload images only on Global gallery; use galleryItemKeys. */
  gallery?: LodgeRoomGalleryItemRow[] | null
}

export type LodgeCommonAreaRow = {
  stableKey?: string | null
  /** References `lodge.gallery[].stableKey` (preferred over legacy `image`). */
  galleryStableKey?: string | null
  title?: string | null
  description?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
}

export type LodgeAmenityRow = {
  _key?: string | null
  icon?: string | null
  title?: string | null
  description?: string | null
}

export type LodgeFacilitiesGallerySelectionPickRow = {
  galleryRowKey?: string | null
  /** @deprecated Legacy stable key; resolver still resolves when galleryRowKey is empty. */
  galleryStableKey?: string | null
}

export type LodgeFacilitiesAmenitySelectionPickRow = {
  amenityRowKey?: string | null
  /** @deprecated Legacy manual icon key; resolver matches first unused lodge row with same icon. */
  amenityIcon?: string | null
}

export type LodgeJourneyStepRow = {
  title?: string | null
  description?: string | null
}

export type LodgeScienceHighlightRow = {
  title?: string | null
  subtitle?: string | null
}

export type LodgeResearchAreaRow = {
  title?: string | null
  description?: string | null
}

export type LodgeCertificationRow = {
  label?: string | null
  detail?: string | null
  url?: string | null
}

export type LodgeTrustItemRow = {
  title?: string | null
  subtitle?: string | null
}

export type LodgeFaqRow = {
  question?: string | null
  answer?: string | null
}

/** Experience projection embebida en `lodgePage` / `lodge.experiences`. */
export type LodgeCmsExperienceCardRow = {
  _id: string
  /** Resolved from `experience.lodge` — must match the page's linked lodge. */
  linkedLodgeId?: string | null
  name?: string | null
  tagline?: string | null
  programType?: string | null
  route?: string | null
  routeSlug?: string | null
  routeLabel?: string | null
  duration?: string | null
  price?: number | null
  priceLabel?: string | null
  status?: string | null
  shortDescription?: string | null
  mainImage?: SanityImageSource | null
  mainImageUrl?: string | null
  slug?: string | null
  /** `experiencePage.slug` vinculada a esta experiencia (URL pública `/experiences/...`). */
  experienceLandingSlug?: string | null
  /** Si la tarjeta del lodge es “Enquire”, destino del clic cuando no es la landing de experiencia. */
  lodgeEnquireSmartLink?: SmartLinkGroq | null
}

export type LodgeDocumentRow = {
  _id?: string
  name?: string | null
  slug?: { current?: string | null } | null
  route?: string | null
  location?: string | null
  /** Canonical string in CMS; GROQ may still merge raw legacy `altitude`. */
  altitudeLegacy?: string | null
  altitude?: number | string | null
  certifications?: LodgeCertificationRow[] | null
  shortDescription?: string | null
  longDescription?: string | null
  keyElements?: string[] | null
  snapshotItems?: LodgeSnapshotItemRow[] | null
  gallery?: LodgeGalleryItemRow[] | null
  rooms?: LodgeRoomRow[] | null
  commonAreas?: LodgeCommonAreaRow[] | null
  amenities?: LodgeAmenityRow[] | null
  mapImage?: SanityImageSource | null
  mapImageUrl?: string | null
  journeySteps?: LodgeJourneyStepRow[] | null
  highlights?: LodgeScienceHighlightRow[] | null
  researchAreas?: LodgeResearchAreaRow[] | null
  specialMessage?: string | null
  accommodationSpecialMessage?: string | null
  experiences?: LodgeCmsExperienceCardRow[] | null
  reviews?: ReviewDoc[] | null
  faqs?: LodgeFaqRow[] | null
  startingPrice?: number | null
  currency?: string | null
  maxGroupSize?: number | null
  availabilityNote?: string | null
  bookingMessage?: string | null
  trustItems?: LodgeTrustItemRow[] | null
  seo?: { title?: string | null; description?: string | null; ogImage?: unknown; noIndex?: boolean | null } | null
  seoTitle?: string | null
  seoDescription?: string | null
  ogImage?: SanityImageSource | null
  mainImage?: SanityImageSource | null
  mainImageUrl?: string | null
  heroGalleryOpenAriaLabel?: string | null
  facilitiesAmenitiesEyebrow?: string | null
  facilitiesGalleryTileAriaPrefix?: string | null
  facilitiesGalleryStripMoreAriaLabel?: string | null
  facilitiesStripMoreCount?: string | null
  facilitiesStripMoreLabel?: string | null
  locationMapLabels?: {
    cuscoTitle?: string | null
    cuscoSubtitle?: string | null
    trailheadLabel?: string | null
    walkHint?: string | null
    lodgeTitle?: string | null
    lodgeSubtitle?: string | null
  } | null
  experienceCardCtaLabel?: string | null
  experienceCardPricePrefix?: string | null
  experienceCardPriceSuffix?: string | null
  bookingDetailRowLabels?: {
    shortestProgram?: string | null
    startingFrom?: string | null
    groupSize?: string | null
    availability?: string | null
  } | null
}

export type LodgePageReviewsPresentationRow = {
  sourceLabel?: string | null
  averageRating?: string | null
  secondaryRatingLine?: string | null
  carouselEndLabel?: string | null
  carouselEndHref?: string | null
  emptyMessage?: string | null
} | null

export type LodgePageExperiencesTailorCtaRow = {
  /** @deprecated use `showTailorMade` */
  enabled?: boolean | null
  showTailorMade?: boolean | null
  /** @deprecated use `tailorMadeEyebrow` */
  eyebrow?: string | null
  /** @deprecated use `tailorMadeTitle` */
  title?: string | null
  /** @deprecated use `tailorMadeBody` */
  description?: string | null
  subtitle?: string | null
  tailorMadeEyebrow?: string | null
  tailorMadeTitle?: string | null
  tailorMadeBody?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
  imageAlt?: string | null
  /** @deprecated use `tailorMadeCta` */
  ctaSmartLink?: SmartLinkGroq | null
  tailorMadeCta?: SmartLinkGroq | null
} | null

export type LodgeStructuredPageRow = {
  _id?: string
  internalTitle?: string | null
  slug?: { current?: string | null } | null
  seo?: { title?: string | null; description?: string | null; ogImage?: unknown; noIndex?: boolean | null } | null
  heroImage?: SanityImageSource | null
  heroGalleryOrderKeys?: string[] | null
  menuThumbnailImage?: string | null
  heroHighlights?: Array<{ text?: string | null; key?: string | null } | null> | null
  heroTitle?: string | null
  heroShortDescription?: string | null
  heroCTA?: LodgeLinkWithLabel | null
  heroCtaSmartLink?: SmartLinkGroq | null
  heroSecondaryCtaSmartLink?: SmartLinkGroq | null
  highlightLines?: Array<{ title?: string | null; subtitle?: string | null } | null> | null
  snapshotSelection?: Array<{ key?: string | null } | null> | null
  navTitle?: string | null
  navSubtitle?: string | null
  navCTA?: LodgeLinkWithLabel | null
  navCtaSmartLink?: SmartLinkGroq | null
  overviewHighlights?: Array<string | null> | null
  facilitiesAmenitiesEyebrow?: string | null
  facilitiesGallerySelection?: LodgeFacilitiesGallerySelectionPickRow[] | null
  facilitiesAmenitiesSelection?: LodgeFacilitiesAmenitySelectionPickRow[] | null
  heroSectionCopy?: LodgePageSectionCopyRow | null
  highlightsSectionCopy?: LodgePageSectionCopyRow | null
  navigationSectionCopy?: LodgePageSectionCopyRow | null
  overviewSectionCopy?: LodgePageSectionCopyRow | null
  accommodationSectionCopy?: LodgePageSectionCopyRow | null
  facilitiesSectionCopy?: LodgePageSectionCopyRow | null
  locationSectionCopy?: LodgePageSectionCopyRow | null
  gettingHereImage?: SanityImageSource | null
  gettingHereImageUrl?: string | null
  gettingHereImageAlt?: string | null
  gettingHereIndications?: Array<{ _key?: string; title?: string | null; text?: string | null } | null> | null
  researchSectionCopy?: LodgePageSectionCopyRow | null
  experiencesSectionCopy?: LodgePageSectionCopyRow | null
  faqSectionCopy?: LodgePageSectionCopyRow | null
  bookingSectionCopy?: LodgePageSectionCopyRow | null
  scienceHighlights?: Array<{ title?: string | null; subtitle?: string | null } | null> | null
  scienceProjects?: Array<{ title?: string | null; subtitle?: string | null } | null> | null
  scienceSpecialText?: { iconKey?: string | null; text?: string | null } | null
  faqItems?: Array<{ title?: string | null; text?: string | null } | null> | null
  sections?: LodgePageSectionsRow
  featuredRoomStableId?: string | null
  /** Lodge ref on this page (for reverse experience queries). */
  lodgeRef?: string | null
  /** Tourism experiences with this lodge in KC → Lodges → `lodgePresentationRows[]`. */
  linkedExperiencesFromPresentation?: LodgeCmsExperienceCardRow[] | null
  /** Learning programmes linked via `experiencePage.learningProgramme` + lodge / field base rows. */
  linkedLearningProgrammesFromPresentation?: LodgeCmsExperienceCardRow[] | null
  /** @deprecated manual lodge page picks — not used on the public site. */
  experiencesSelection?: LodgeCmsExperienceCardRow[] | null
  /** @deprecated */
  fallbackToLodgeRelations?: boolean | null
  experiencesTailorCta?: LodgePageExperiencesTailorCtaRow
  reviewsSection?: {
    eyebrow?: string | null
    title?: string | null
    body?: string | null
    rotatingReviews?: ReviewDoc[] | null
    reviewCards?: ReviewDoc[] | null
  } | null
  reviewsSettings?: {
    ratingValue?: number | null
    reviewCount?: number | null
    reviewProviderName?: string | null
    reviewProviderUrl?: string | null
    reviewProviderLogoUrl?: string | null
    reviewProviderLogoAlt?: string | null
  } | null
  reviewsSelection?: ReviewDoc[] | null
  reviewsPresentation?: LodgePageReviewsPresentationRow
  reserveCtaSettings?: ReserveCtaSettingsGroq
  bookingCta?: {
    title?: string | null
    body?: string | null
    ctas?: LodgeLinkWithLabel[] | null
    bookingPrimarySmartLink?: SmartLinkGroq | null
    bookingSecondarySmartLink?: SmartLinkGroq | null
    trustItemsOverride?: LodgeTrustItemRow[] | null
  } | null
  lodge?: LodgeDocumentRow | null
} | null

/** Bundle estático base (Phase 1) para merge. */
export type LodgeStaticBundle = {
  hero: LodgeHeroData
  pageNav: LodgeInPageNavData
  snapshot: readonly LodgeSnapshotItem[]
  overview: LodgeOverviewData
  rooms: LodgeRoomsData
  facilities: LodgeFacilitiesData
  location: LodgeLocationData
  research: LodgeResearchData
  experiences: LodgeExperiencesData
  reviews: ReviewDoc[]
  faq: LodgeFaqData
  book: LodgeBookCtaData
  featuredQuotes: readonly { text: string; attr: string }[]
}

/** Copy del bloque reseñas — `reviewsSection` + `sections.reviews` + defaults. */
export type LodgeReviewsSectionResolved = {
  eyebrow: string
  headline: string
  /** Intro bajo el H2 (equivalente a `body` en Studio / secciones). */
  sectionLead: string | null
  emptyMessage: string
}

/** Resultado fusionado listo para el front (próxima fase). */
export type LodgePageResolvedPayload = {
  sectionVisibility: LodgePageSectionVisibility
  source: 'cms' | 'fallback'
  cmsError: string | null
  pageSlug: string
  doc: {
    lodgePageId?: string
    lodgeId?: string
  } | null
  seo: { title: string; description: string }
  hero: LodgeHeroData
  pageNav: LodgeInPageNavData
  snapshot: readonly LodgeSnapshotItem[]
  overview: LodgeOverviewData
  rooms: LodgeRoomsData
  facilities: LodgeFacilitiesData
  location: LodgeLocationData
  research: LodgeResearchData
  experiences: LodgeExperiencesData
  reviews: ReviewDoc[]
  /** Copy del bloque reseñas (resolver). */
  reviewsSection: LodgeReviewsSectionResolved
  reviewsRatingSummary: ReviewsRatingSummary
  faq: LodgeFaqData
  book: LodgeBookCtaData
  featuredQuotes: readonly { text: string; attr: string }[]
  /** Curación CMS (para depuración / fase 2). */
  meta: {
    featuredRoomStableId?: string | null
    usedCmsExperiences: boolean
    usedCmsReviews: boolean
  }
}
