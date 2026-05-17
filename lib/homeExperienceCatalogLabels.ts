/**
 * Resolver defaults: visible labels for `experience.programType` / `experience.route` enum values on Home.
 * Per-experience overrides can use `priceLabel` (Sanity) for card pricing; badges use these maps unless extended later.
 */
export const HOME_EXPERIENCE_PROGRAM_TO_FILTER: Record<string, 'nature' | 'family' | 'learning' | 'tailor'> = {
  'nature-core': 'nature',
  'family-adventure': 'family',
  'experiential-learning': 'learning',
  'tailor-made': 'tailor',
}

export const HOME_EXPERIENCE_PROGRAM_BADGE: Record<string, string> = {
  'nature-core': 'Classic Nature',
  'family-adventure': 'Signature Expeditions',
  'experiential-learning': 'Experiential Learning',
  'tailor-made': 'Tailor Made',
}

export const HOME_EXPERIENCE_ROUTE_LABEL: Record<string, string> = {
  camanti: 'Camanti Route',
  'manu-road': 'Manu Route',
  'manu-core': 'Manu Core',
}
