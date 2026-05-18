import {
  lodgeSoqtapataRouteLabels,
  normalizeLodgeRouteKey,
} from '@/data/lodgeSoqtapataResolverDefaults'

/** Maps Experience KC `programType` enum values to public marketing labels. */
export const EXPERIENCE_PROGRAM_TYPE_LABEL: Record<string, string> = {
  'nature-core': 'Classic Nature',
  'family-adventure': 'Signature Expeditions',
  'experiential-learning': 'Experiential Learning',
  'tailor-made': 'Tailor Made',
  signature: 'Signature Expeditions',
  custom: 'Tailor Made',
}

function humanizeProgramTypeToken(raw: string): string {
  return raw
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Public program label from KC `programType` only — no default product name when unset. */
export function resolveExperienceProgramTypeLabel(programType: string | null | undefined): string {
  const p = programType?.trim().toLowerCase() ?? ''
  if (!p) return ''
  if (EXPERIENCE_PROGRAM_TYPE_LABEL[p]) return EXPERIENCE_PROGRAM_TYPE_LABEL[p]
  return humanizeProgramTypeToken(p)
}

/** Route display from KC `routeRef` label, else resolved Route KC name from slug — never a marketing default. */
export function resolveExperienceRouteLabel(input: {
  routeLabel?: string | null
  routeSlug?: string | null
  route?: string | null
}): string {
  const fromRef = input.routeLabel?.trim()
  if (fromRef) return fromRef
  const slug = input.routeSlug?.trim() || input.route?.trim()
  if (!slug) return ''
  const canon = normalizeLodgeRouteKey(slug)
  if (canon) return lodgeSoqtapataRouteLabels[canon] ?? canon
  return humanizeProgramTypeToken(slug)
}
