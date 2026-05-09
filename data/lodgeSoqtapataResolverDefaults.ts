/**
 * Copy usado solo en `mergeLodgePageCms` / builders (no en componentes).
 * Fallback técnico cuando Sanity no aporta el campo; sustituir por proyección GROQ cuando exista en `lodge` / `lodgePage` / `experience`.
 */

export const lodgeSoqtapataProgramTypeFallbackLabel = 'Nature Core'

export const lodgeSoqtapataRouteLabels: Record<string, string> = {
  camanti: 'Camanti Route',
  'manu-road': 'Manu Road',
  'manu-core': 'Manu Core',
}

export const lodgeSoqtapataRouteFallbackLabel = 'Camanti Route'

export function resolveProgramTypeLabel(pt: string | null | undefined): string {
  if (!pt?.trim()) return lodgeSoqtapataProgramTypeFallbackLabel
  return pt
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function resolveRouteLabel(route: string | null | undefined): string {
  if (!route?.trim()) return lodgeSoqtapataRouteFallbackLabel
  const k = route.trim().toLowerCase()
  return lodgeSoqtapataRouteLabels[k] ?? resolveProgramTypeLabel(route)
}

export function formatLodgeRoomMetaLine(units: number, cap: string): string {
  return `${units} room(s) · Up to ${cap} guests`
}

export const lodgeSoqtapataRoomListDefaults = {
  photosCta: 'View photos',
  imageAltFallback: 'Room',
  featuredBadge: 'Most popular',
} as const

export const lodgeSoqtapataExperienceCardDefaults = {
  enquireLabel: 'Enquire',
  perPersonLabel: 'per person',
  defaultExperienceHref: '/experiences/soqtapata-pristine-immersion',
  /** Prefijo precio cuando solo hay número en CMS (`experience.price`). */
  priceCurrencyPrefix: 'USD ',
} as const

/** Cuando el documento `experience.slug` no coincide con la landing `experiencePage` publicada. */
export const EXPERIENCE_DOCUMENT_SLUG_TO_PUBLIC_SLUG: Record<string, string> = {
  'soqtapata-pristine-immersion-3d-2n': 'soqtapata-pristine-immersion',
}

/** Bloque reseñas — alineado a `ReviewsSection` + enlace “ver todas”. */
export function formatCommonAreaGalleryAltFallback(indexZeroBased: number): string {
  return `Area ${indexZeroBased + 1}`
}

/** Valor fila “Group size” cuando solo hay `lodge.maxGroupSize` en CMS. */
export function formatLodgeBookGroupSizeValue(maxGroupSize: number): string {
  return `2 – ${maxGroupSize} people`
}

/** Valor fila “Starting from” cuando solo hay precio en CMS. */
export function formatLodgeBookStartingFromValue(currency: string, startingPrice: number): string {
  return `${currency} ${startingPrice} per person`
}

export const lodgeSoqtapataReviewsSectionDefaults = {
  eyebrow: 'What guests say',
  headline: 'Real stays',
  sectionLead: null as string | null,
  emptyMessage: 'No guest reviews for this program yet. Be the first to share your experience.',
} as const
