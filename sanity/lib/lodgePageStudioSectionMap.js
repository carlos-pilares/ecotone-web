/**
 * Pestaña Studio (options.section) → clave en `lodgePage.sections` para overrides de copy.
 * null = sin formulario de copy (solo fuente / vista previa / campos dedicados de la pestaña).
 */
export const LODGE_PAGE_TAB_TO_SECTIONS_KEY = {
  general: null,
  hero: null,
  highlights: null,
  navigation: null,
  overview: 'overview',
  accommodations: 'accommodation',
  commonAreas: 'facilities',
  gettingHere: 'location',
  science: 'research',
  experiences: 'experiences',
  reviews: 'reviews',
  faq: 'faq',
  booking: 'booking',
}

export function getLodgePageSectionsCopyKey(tab) {
  if (!tab) return null
  return LODGE_PAGE_TAB_TO_SECTIONS_KEY[tab] ?? null
}
