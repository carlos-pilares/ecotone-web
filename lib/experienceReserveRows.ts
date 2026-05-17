import type { ReserveCtaDetailRow } from '@/components/shared/ReserveCtaSection'
import type { ExperienceReserveCardRowGroq } from '@/lib/reserveCtaGroq'
import { EXPERIENCE_ROUTE_DISPLAY, isActiveExperienceStatus } from '@/lib/reserveCtaPricing'

const PROGRAM_TYPE_LABEL: Record<string, string> = {
  'nature-core': 'Classic Nature',
  'family-adventure': 'Signature Expeditions',
  'experiential-learning': 'Experiential Learning',
  'tailor-made': 'Tailor Made',
}

const DEFAULT_LABEL: Record<string, string> = {
  route: 'Route',
  duration: 'Duration',
  groupSize: 'Group size',
  pickupTime: 'Pickup time',
  pickupLocation: 'Pickup',
  pickupSummary: 'Pickup',
  includes: 'Includes',
  price: 'Price',
  programType: 'Program type',
  difficulty: 'Difficulty',
}

function sortByOrderRank(rows: ExperienceReserveCardRowGroq[]): ExperienceReserveCardRowGroq[] {
  return [...rows].sort((a, b) => {
    const ar = a.orderRank ?? null
    const br = b.orderRank ?? null
    if (ar != null && br != null && ar !== br) return ar - br
    if (ar != null && br == null) return -1
    if (ar == null && br != null) return 1
    return 0
  })
}

function routeValue(route: string | null | undefined): string | null {
  const r = route?.trim()
  if (!r) return null
  return EXPERIENCE_ROUTE_DISPLAY[r] || r.replace(/-/g, ' ')
}

function groupSizeValue(facts: ExperienceReserveFacts): string | null {
  const { groupSizeMin, groupSizeMax } = facts
  if (groupSizeMin != null && groupSizeMax != null) {
    return `${groupSizeMin} – ${groupSizeMax} people`
  }
  if (groupSizeMax != null) return `Up to ${groupSizeMax} people`
  return null
}

function includesJoined(includes: string[] | null | undefined): string | null {
  if (!includes?.length) return null
  const s = includes
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(' · ')
  return s || null
}

/** Pickup time: prefer a short title that looks like a time window — never long “getting here” body copy. */
function pickupTimeFromFacts(facts: ExperienceReserveFacts): string | null {
  const blocks = facts.gettingHereInfo ?? []
  for (const b of blocks) {
    const t = b.title?.trim() ?? ''
    if (!t || t.length > 72) continue
    if (/\d|am\.?|pm\.?|a\.m|p\.m|:/i.test(t)) return t
  }
  const t0 = blocks[0]?.title?.trim()
  if (t0 && t0.length <= 48) return t0
  return null
}

/** Short meet / logistics line without accordion paragraphs. */
function pickupLocationFromFacts(facts: ExperienceReserveFacts): string | null {
  const d = facts.distanceFromCusco?.trim()
  if (d) return d
  const t0 = facts.gettingHereInfo?.[0]?.title?.trim()
  if (t0 && t0.length <= 72) return t0
  return null
}

/** Distance + first short title; no description text. */
function pickupSummaryFromFacts(facts: ExperienceReserveFacts): string | null {
  const parts: string[] = []
  const d = facts.distanceFromCusco?.trim()
  if (d) parts.push(d)
  const t0 = facts.gettingHereInfo?.[0]?.title?.trim()
  if (t0 && t0.length <= 80) parts.push(t0)
  if (parts.length === 0) return null
  return parts.join(' · ').slice(0, 120)
}

function priceRowValue(facts: ExperienceReserveFacts): string | null {
  if (isActiveExperienceStatus(facts.status)) {
    const n = facts.priceUsd
    if (n != null && n > 0) return `$${n}`
  }
  const pl = facts.priceLabel?.trim()
  return pl || null
}

function programTypeValue(programType: string | null | undefined): string | null {
  const p = programType?.trim()
  if (!p) return null
  return PROGRAM_TYPE_LABEL[p] || p.replace(/-/g, ' ')
}

export type ExperienceReserveFacts = {
  route?: string | null
  duration?: string | null
  groupSizeMin?: number | null
  groupSizeMax?: number | null
  includes?: string[] | null
  programType?: string | null
  distanceFromCusco?: string | null
  gettingHereInfo?: Array<{ title?: string | null; description?: string | null }> | null
  priceUsd?: number | null
  priceLabel?: string | null
  status?: string | null
  /** Reserved for future experience field — no CMS field yet; use overrides if needed. */
  difficulty?: string | null
}

function structuredValueForSource(sourceField: string, facts: ExperienceReserveFacts): string | null {
  switch (sourceField) {
    case 'route':
      return routeValue(facts.route) || null
    case 'duration':
      return facts.duration?.trim() || null
    case 'groupSize':
      return groupSizeValue(facts)
    case 'pickupTime':
      return pickupTimeFromFacts(facts)
    case 'pickupLocation':
      return pickupLocationFromFacts(facts)
    case 'pickupSummary':
      return pickupSummaryFromFacts(facts)
    case 'includes':
      return includesJoined(facts.includes)
    case 'price':
      return priceRowValue(facts)
    case 'programType':
      return programTypeValue(facts.programType)
    case 'difficulty':
      return facts.difficulty?.trim() || null
    case 'custom':
      return null
    default:
      return null
  }
}

function resolveOneRow(raw: ExperienceReserveCardRowGroq, facts: ExperienceReserveFacts): ReserveCtaDetailRow | null {
  if (raw.show === false) return null
  const sf = (raw.sourceField ?? '').trim()
  if (!sf) return null

  if (sf === 'custom') {
    const label = (raw.labelOverride ?? '').trim()
    const value = (raw.valueOverride ?? '').trim()
    if (!label || !value) return null
    return { label, value }
  }

  const structured = structuredValueForSource(sf, facts)
  const value = (raw.valueOverride ?? '').trim() || (structured?.trim() ?? '')
  if (!value) return null

  const defaultLabel = DEFAULT_LABEL[sf] || sf
  const label = (raw.labelOverride ?? '').trim() || defaultLabel
  if (!label) return null
  return { label, value }
}

/**
 * When the Experience page configures `experienceReserveRows`, build card rows from
 * structured experience data + optional overrides. Returns `null` if the CMS list is
 * empty/missing (caller falls back to legacy rows or defaults).
 */
export function resolveExperienceReserveCardRows(
  cmsRows: ExperienceReserveCardRowGroq[] | null | undefined,
  facts: ExperienceReserveFacts | null | undefined,
): ReserveCtaDetailRow[] | null {
  if (!cmsRows || cmsRows.length === 0 || !facts) return null
  const sorted = sortByOrderRank(cmsRows)
  const out: ReserveCtaDetailRow[] = []
  for (const raw of sorted) {
    const row = resolveOneRow(raw, facts)
    if (row) out.push(row)
  }
  return out
}

/** Default reserve card rows when no CMS row config (and no legacy override). Uses short pickup lines only. */
export function buildDefaultExperienceReserveRows(
  facts: ExperienceReserveFacts | null | undefined,
): ReserveCtaDetailRow[] {
  if (!facts) return []
  const route = routeValue(facts.route) || '—'
  const duration = facts.duration?.trim() || '—'
  const group = groupSizeValue(facts) || '—'
  const pickup = pickupSummaryFromFacts(facts) || pickupLocationFromFacts(facts) || '—'
  const includes = includesJoined(facts.includes) || '—'
  return [
    { label: 'Route', value: route },
    { label: 'Duration', value: duration },
    { label: 'Group size', value: group },
    { label: 'Pickup', value: pickup },
    { label: 'Includes', value: includes },
  ]
}
