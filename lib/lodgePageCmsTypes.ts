import type { SanityImageSource } from '@sanity/image-url'

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
  eyebrow?: string | null
  title?: string | null
  body?: string | null
}

export type LodgePageSectionsRow = {
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
  title?: string | null
  description?: string | null
  category?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
}

export type LodgeRoomGalleryItemRow = {
  title?: string | null
  description?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
}

export type LodgeRoomRow = {
  stableId?: string | null
  name?: string | null
  numberOfRooms?: number | null
  capacity?: number | null
  highlights?: string[] | null
  gallery?: LodgeRoomGalleryItemRow[] | null
}

export type LodgeCommonAreaRow = {
  title?: string | null
  description?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
}

export type LodgeAmenityRow = {
  icon?: string | null
  title?: string | null
  description?: string | null
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
  name?: string | null
  tagline?: string | null
  programType?: string | null
  route?: string | null
  duration?: string | null
  price?: number | null
  priceLabel?: string | null
  shortDescription?: string | null
  mainImage?: SanityImageSource | null
  mainImageUrl?: string | null
  slug?: string | null
}

export type LodgeDocumentRow = {
  _id?: string
  name?: string | null
  slug?: { current?: string | null } | null
  route?: string | null
  location?: string | null
  altitude?: number | null
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

export type LodgeStructuredPageRow = {
  _id?: string
  internalTitle?: string | null
  slug?: { current?: string | null } | null
  seo?: { title?: string | null; description?: string | null; ogImage?: unknown; noIndex?: boolean | null } | null
  heroImage?: SanityImageSource | null
  heroHighlights?: Array<{ key?: string | null } | null> | null
  heroCTA?: LodgeLinkWithLabel | null
  snapshotSelection?: Array<{ key?: string | null } | null> | null
  navTitle?: string | null
  navSubtitle?: string | null
  navCTA?: LodgeLinkWithLabel | null
  sections?: LodgePageSectionsRow
  featuredRoomStableId?: string | null
  experiencesSelection?: LodgeCmsExperienceCardRow[] | null
  fallbackToLodgeRelations?: boolean | null
  reviewsSelection?: ReviewDoc[] | null
  reviewsPresentation?: LodgePageReviewsPresentationRow
  bookingCta?: {
    title?: string | null
    body?: string | null
    ctas?: LodgeLinkWithLabel[] | null
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

/** Copy del bloque reseñas — `lodgePage.sections.reviews` + defaults (`data/lodgeSoqtapataResolverDefaults.ts`). */
export type LodgeReviewsSectionResolved = {
  eyebrow: string
  headline: string
  /** Intro bajo el H2 (equivalente a `body` en Studio / secciones). */
  sectionLead: string | null
  /** Línea bajo las estrellas (p. ej. “12 verified reviews”). */
  secondaryRatingLine: string
  averageRating: string
  sourceLabel: string
  carouselEndLabel: string
  carouselEndHref: string
  emptyMessage: string
}

/** Resultado fusionado listo para el front (próxima fase). */
export type LodgePageResolvedPayload = {
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
  /** Copy completo del bloque reseñas + enlace “ver todas” (resolver; overrides en `sections.reviews`). */
  reviewsSection: LodgeReviewsSectionResolved
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
