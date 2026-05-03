/**
 * Tipos de conveniencia para proyecciones GROQ / capa de datos.
 * No generados automáticamente: mantener alineados con `schemaTypes/lodge.js` y `lodgePage.js`.
 */

export type LodgeGalleryCategory = 'room' | 'common' | 'wildlife' | 'research' | 'journey'

export type LodgeAmenityIconId =
  | 'meals'
  | 'guide'
  | 'transport'
  | 'boots'
  | 'flask'
  | 'wifi'
  | 'shield'
  | 'book'
  | 'droplet'

export type LodgeCertification = {
  label: string
  detail?: string
  url?: string
}

export type LodgeSnapshotItem = {
  key: string
  label: string
  value: string
}

export type LodgeGalleryItem = {
  image: unknown
  title: string
  description?: string
  category: LodgeGalleryCategory
}

export type LodgeRoomGalleryItem = {
  image: unknown
  title?: string
  description?: string
}

export type LodgeRoom = {
  stableId: string
  name: string
  numberOfRooms: number
  capacity?: number
  highlights?: string[]
  gallery?: LodgeRoomGalleryItem[]
}

export type LodgeCommonArea = {
  image: unknown
  title: string
  description?: string
}

export type LodgeAmenity = {
  icon: LodgeAmenityIconId
  title: string
  description?: string
}

export type LodgeJourneyStep = {
  title: string
  description?: string
}

export type LodgeScienceHighlight = {
  title: string
  subtitle?: string
}

export type LodgeResearchArea = {
  title: string
  description?: string
}

export type LodgeFaq = {
  question: string
  answer: string
}

export type LodgeTrustItem = {
  title: string
  subtitle?: string
}

/** Documento `lodge` (subset; refs expandidas según query). */
export type LodgeDocument = {
  _id: string
  _type: 'lodge'
  name: string
  slug: {current?: string}
  route?: string
  location?: string
  altitude?: number
  certifications?: LodgeCertification[]
  shortDescription?: string
  longDescription?: string
  keyElements?: string[]
  snapshotItems?: LodgeSnapshotItem[]
  gallery?: LodgeGalleryItem[]
  rooms?: LodgeRoom[]
  commonAreas?: LodgeCommonArea[]
  amenities?: LodgeAmenity[]
  mapImage?: unknown
  journeySteps?: LodgeJourneyStep[]
  highlights?: LodgeScienceHighlight[]
  researchAreas?: LodgeResearchArea[]
  specialMessage?: string
  experiences?: Array<{_ref: string}>
  reviews?: Array<{_ref: string}>
  faqs?: LodgeFaq[]
  startingPrice?: number
  currency?: string
  maxGroupSize?: number
  availabilityNote?: string
  bookingMessage?: string
  trustItems?: LodgeTrustItem[]
  seo?: {title?: string; description?: string; ogImage?: unknown; noIndex?: boolean}
  seoTitle?: string
  seoDescription?: string
  ogImage?: unknown
  mainImage?: unknown
}

export type LodgeSnapshotKeyPick = {
  _type: 'lodgeSnapshotKeyPick'
  key: string
}

export type LodgePageSectionCopy = {
  eyebrow?: string
  title?: string
  body?: string
}

export type LodgePageSections = {
  overview?: LodgePageSectionCopy
  accommodation?: LodgePageSectionCopy
  facilities?: LodgePageSectionCopy
  location?: LodgePageSectionCopy
  research?: LodgePageSectionCopy
  experiences?: LodgePageSectionCopy
  reviews?: LodgePageSectionCopy
  faq?: LodgePageSectionCopy
  booking?: LodgePageSectionCopy
}

/** Documento `lodgePage` (subset). */
export type LodgePageDocument = {
  _id: string
  _type: 'lodgePage'
  internalTitle: string
  slug: {current?: string}
  lodge: {_ref: string} | LodgeDocument
  seo?: LodgeDocument['seo']
  heroImage?: unknown
  heroHighlights?: LodgeSnapshotKeyPick[]
  heroCTA?: {label?: string; href?: string; openInNewTab?: boolean}
  snapshotSelection?: LodgeSnapshotKeyPick[]
  navTitle?: string
  navSubtitle?: string
  navCTA?: {label?: string; href?: string; openInNewTab?: boolean}
  sections?: LodgePageSections
  featuredRoomStableId?: string
  experiencesSelection?: Array<{_ref: string}>
  fallbackToLodgeRelations?: boolean
  reviewsSelection?: Array<{_ref: string}>
  bookingCta?: {
    title?: string
    body?: string
    ctas?: Array<{label?: string; href?: string; openInNewTab?: boolean}>
    trustItemsOverride?: LodgeTrustItem[]
  }
}
