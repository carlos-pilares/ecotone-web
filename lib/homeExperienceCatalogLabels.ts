/**
 * Resolver defaults: visible labels for `experience.programType` / `experience.route` enum values on Home.
 * Per-experience overrides can use `priceLabel` (Sanity) for card pricing; badges use these maps unless extended later.
 */
import { EXPERIENCE_PROGRAM_TYPE_LABEL } from '@/lib/experienceCardLabels'

export const HOME_EXPERIENCE_PROGRAM_TO_FILTER: Record<
  string,
  'all' | 'nature' | 'family' | 'learning' | 'tailor'
> = {
  all: 'all',
  'nature-core': 'nature',
  'family-adventure': 'family',
  'experiential-learning': 'learning',
  'tailor-made': 'tailor',
}

export const HOME_EXPERIENCE_PROGRAM_BADGE: Record<string, string> = EXPERIENCE_PROGRAM_TYPE_LABEL

export const HOME_EXPERIENCE_ROUTE_LABEL: Record<string, string> = {
  camanti: 'Camanti Route',
  'manu-road': 'Manu Route',
  'manu-core': 'Manu Core',
}
