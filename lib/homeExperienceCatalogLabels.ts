/** Maps Sanity `experience` enums to visible labels on Home (explorer). Not lodge/experience-page specific. */
export const HOME_EXPERIENCE_PROGRAM_TO_FILTER: Record<string, 'nature' | 'family' | 'learning' | 'tailor'> = {
  'nature-core': 'nature',
  'family-adventure': 'family',
  'experiential-learning': 'learning',
  'tailor-made': 'tailor',
}

export const HOME_EXPERIENCE_PROGRAM_BADGE: Record<string, string> = {
  'nature-core': 'Nature Core',
  'family-adventure': 'Family Adventure',
  'experiential-learning': 'Exp. Learning',
  'tailor-made': 'Tailor Made',
}

export const HOME_EXPERIENCE_ROUTE_LABEL: Record<string, string> = {
  camanti: 'Camanti Route',
  'manu-road': 'Manu Route',
  'manu-core': 'Manu Core',
}
