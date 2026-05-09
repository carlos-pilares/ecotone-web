import { homePageTextFields } from '@/data/cmsApproved/homePageFields'

/** Experience-shaped input for lowest-price math (CMS + lists). */
export type ExperiencePriceInput = {
  status?: string | null
  price?: number | null
  priceLabel?: string | null
}

export function isActiveExperienceStatus(status: string | null | undefined): boolean {
  if (status == null || String(status).trim() === '') return true
  return status === 'active'
}

/**
 * Lowest positive `price` among experiences whose status is `active` (or unset).
 */
export function getLowestActiveExperiencePrice(experiences: ExperiencePriceInput[]): number | null {
  const nums = experiences
    .filter((e) => isActiveExperienceStatus(e.status))
    .map((e) => e.price)
    .filter((p): p is number => typeof p === 'number' && p > 0)
  if (nums.length === 0) return null
  return Math.min(...nums)
}

export type FormatReservePriceInput = {
  /** When set, replaces the entire main price line (no automatic “from”). */
  priceOverrideText?: string | null
  pricePrefixOverride?: string | null
  priceSuffixOverride?: string | null
  /** Derived USD integer from experience documents. */
  lowestUsd?: number | null
  /**
   * When `lowestUsd` is used: `from` → `from $N` (listing pages), `exact` → `$N` (single experience).
   * Ignored when `priceOverrideText` is set.
   */
  priceLineStyle?: 'from' | 'exact'
}

const DEFAULT_SUFFIX = '/ person'
const DEFAULT_PREFIX = 'from'

/**
 * Main price line + small suffix for `ReserveCtaSection`.
 * When no numeric and no override → “Enquire”, empty suffix.
 */
export function formatReservePriceDisplay(input: FormatReservePriceInput): {
  priceLine: string
  priceSuffix: string
} {
  const ov = input.priceOverrideText?.trim()
  if (ov) {
    return {
      priceLine: ov,
      priceSuffix: input.priceSuffixOverride?.trim() || DEFAULT_SUFFIX,
    }
  }
  const n = input.lowestUsd
  if (n != null && n > 0) {
    const style = input.priceLineStyle ?? 'from'
    if (style === 'exact') {
      return {
        priceLine: `$${n}`,
        priceSuffix: input.priceSuffixOverride?.trim() || DEFAULT_SUFFIX,
      }
    }
    const prefix = (input.pricePrefixOverride?.trim() || DEFAULT_PREFIX).replace(/\s+$/, '')
    return {
      priceLine: `${prefix} $${n}`,
      priceSuffix: input.priceSuffixOverride?.trim() || DEFAULT_SUFFIX,
    }
  }
  return { priceLine: 'Enquire', priceSuffix: '' }
}

/** Home / About / Routes default rows (Pickup → Pickup time). */
export function buildReserveRowsForHome(): { label: string; value: string }[] {
  return (homePageTextFields.bookingCardRows ?? [])
    .map((r) => {
      let label = (r?.label ?? '').trim()
      if (label === 'Pickup') label = 'Pickup time'
      const value = (r?.value ?? '').trim()
      return { label, value }
    })
    .filter((r) => r.label && r.value)
}

/** Route slug → reserve card / row label (shared). */
export const EXPERIENCE_ROUTE_DISPLAY: Record<string, string> = {
  camanti: 'Camanti · Soqtapata Reserve',
  'manu-road': 'Manu Road',
  'manu-core': 'Manu Core',
}

export type LodgeRowSource = {
  shortestProgramLabel?: string
  shortestProgramValue?: string
  startingFromLabel?: string
  startingFromValue?: string
  groupSizeLabel?: string
  groupSizeValue?: string
  availabilityLabel?: string
  availabilityValue?: string
}

/** Defaults aligned with `lodgeSoqtapataBook` row labels. */
export function buildReserveRowsForLodge(source: LodgeRowSource): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = []
  if (source.shortestProgramLabel && source.shortestProgramValue) {
    rows.push({ label: source.shortestProgramLabel, value: source.shortestProgramValue })
  }
  if (source.startingFromLabel && source.startingFromValue) {
    rows.push({ label: source.startingFromLabel, value: source.startingFromValue })
  }
  if (source.groupSizeLabel && source.groupSizeValue) {
    rows.push({ label: source.groupSizeLabel, value: source.groupSizeValue })
  }
  if (source.availabilityLabel && source.availabilityValue) {
    rows.push({ label: source.availabilityLabel, value: source.availabilityValue })
  }
  return rows
}
