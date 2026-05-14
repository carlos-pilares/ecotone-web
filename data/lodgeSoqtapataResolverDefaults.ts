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

/** Canonical keys for commercial routes (lodges, experiences, filters). */
export type LodgeRouteKey = 'camanti' | 'manu-road' | 'manu-core'

/**
 * Maps legacy or human-readable route text to a canonical key.
 * Empty string when unknown (callers may fall back to raw text or program-type styling).
 */
export function normalizeLodgeRouteKey(route: string | null | undefined): LodgeRouteKey | '' {
  const raw = route?.trim()
  if (!raw) return ''
  const spaced = raw.toLowerCase().replace(/_/g, '-').replace(/\s+/g, ' ').trim()
  const hyphen = spaced.replace(/\s+/g, '-')

  const toKey: Record<string, LodgeRouteKey> = {
    camanti: 'camanti',
    'camanti-route': 'camanti',
    'camanti route': 'camanti',
    'manu-road': 'manu-road',
    'manu road': 'manu-road',
    'manu-core': 'manu-core',
    'manu core': 'manu-core',
  }

  if (toKey[spaced]) return toKey[spaced]
  if (toKey[hyphen]) return toKey[hyphen]
  return ''
}

/**
 * Single slug segment for matching Route documents (`slug.current`) and lodge grouping.
 * Known commercial keys normalize like `normalizeLodgeRouteKey`; other values become hyphenated lowercase.
 */
export function canonicalizeLodgeRouteSlug(route: string | null | undefined): string {
  const k = normalizeLodgeRouteKey(route)
  if (k) return k
  const raw = route?.trim().toLowerCase() ?? ''
  if (!raw) return ''
  return raw.replace(/_/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
}

export function resolveProgramTypeLabel(pt: string | null | undefined): string {
  if (!pt?.trim()) return lodgeSoqtapataProgramTypeFallbackLabel
  return pt
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function resolveRouteLabel(route: string | null | undefined): string {
  const canon = normalizeLodgeRouteKey(route)
  if (canon) return lodgeSoqtapataRouteLabels[canon] ?? canon
  if (!route?.trim()) return lodgeSoqtapataRouteFallbackLabel
  return resolveProgramTypeLabel(route)
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
