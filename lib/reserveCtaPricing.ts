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

/** Active or coming-soon (or legacy unset) — matches programmes shown on lodge experience cards. */
export function isListedExperienceStatus(status: string | null | undefined): boolean {
  const s = status == null ? '' : String(status).trim()
  if (s === '') return true
  return s === 'active' || s === 'coming-soon'
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

/** First plausible USD integer in a marketing price label (e.g. "$986", "USD 1,200+"). */
function parseUsdFromPriceLabel(label: string | null | undefined): number | null {
  if (label == null) return null
  const s = String(label).trim()
  if (!s) return null
  const normalized = s.replace(/,/g, '')
  const matches = [...normalized.matchAll(/\$?\s*(\d{2,6})(?:\.\d+)?/g)]
  let best: number | null = null
  for (const m of matches) {
    const n = Math.round(parseFloat(m[1]))
    if (n >= 50 && n <= 500_000 && (best == null || n < best)) best = n
  }
  return best
}

/**
 * Lowest positive USD among listed experiences (`active` + `coming-soon` + unset status).
 * Uses each doc's numeric `price` when > 0, otherwise the first plausible amount in `priceLabel`.
 */
export function getLowestListedExperienceUsd(experiences: ExperiencePriceInput[]): number | null {
  const nums: number[] = []
  for (const e of experiences) {
    if (!isListedExperienceStatus(e.status)) continue
    if (typeof e.price === 'number' && e.price > 0) {
      nums.push(Math.round(e.price))
      continue
    }
    const fromLabel = parseUsdFromPriceLabel(e.priceLabel ?? undefined)
    if (fromLabel != null) nums.push(fromLabel)
  }
  if (nums.length === 0) return null
  return Math.min(...nums)
}

/**
 * Lodge reserve card: lowest from related listed experiences, else lodge `startingPrice`
 * (same numeric source as the book details "Starting from" row in `lodgePageCms` merge).
 */
export function getLodgeReserveLowestUsd(
  experiences: ExperiencePriceInput[],
  lodgeStartingPrice: number | null | undefined,
): number | null {
  const fromExp = getLowestListedExperienceUsd(experiences)
  if (fromExp != null) return fromExp
  if (typeof lodgeStartingPrice === 'number' && lodgeStartingPrice > 0) {
    return Math.round(lodgeStartingPrice)
  }
  return null
}

export type FormatReservePriceInput = {
  /** When set, replaces the entire main price line (legacy / custom full line). */
  priceOverrideText?: string | null
  /** Custom amount only (assembled with prefix). */
  customPriceText?: string | null
  pricePrefixOverride?: string | null
  priceSuffixOverride?: string | null
  /** Derived USD integer from experience documents. */
  lowestUsd?: number | null
  /** Pre-formatted amount from KC `priceLabel` (e.g. “USD 1,800”). */
  linkedPriceLine?: string | null
  /**
   * When building from numeric/linked amount: `from` → `from USD N` (listing pages), `exact` → amount only style.
   * Ignored when override/custom full line is set.
   */
  priceLineStyle?: 'from' | 'exact'
  /**
   * `custom` — only `customPriceText` (Enquire when empty; never falls back to linked).
   * `linked` — only linked KC / lowestUsd (never reads custom text).
   * `auto` — custom text when present, else linked (home / routes legacy).
   */
  mode?: 'custom' | 'linked' | 'auto'
}

function resolveReservePrefix(raw: string | null | undefined, defaultWhenUnset: string): string {
  if (raw === undefined || raw === null) return defaultWhenUnset
  return raw.trim()
}

function resolveReserveSuffix(raw: string | null | undefined, defaultWhenUnset: string): string {
  if (raw === undefined || raw === null) return defaultWhenUnset
  return raw.trim()
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function stripLeadingPrefixFromAmount(amount: string, prefix: string): string {
  let a = amount.trim()
  if (!a) return a
  const candidates = new Set<string>()
  const p = prefix.trim()
  if (p) candidates.add(p)
  candidates.add('from')
  for (const candidate of candidates) {
    const re = new RegExp(`^${escapeRegExp(candidate)}\\s+`, 'i')
    while (re.test(a)) a = a.replace(re, '').trim()
  }
  return a
}

/** Amount only — no prefix or trailing “per person”. */
function normalizeReserveAmount(amount: string, prefix: string): string {
  return stripLeadingPrefixFromAmount(amount, prefix)
    .replace(/\s+per person\s*$/i, '')
    .trim()
}

export type ReservePriceParts = {
  pricePrefix: string
  priceAmount: string
  priceSuffix: string
}

/**
 * Main price parts for `ReserveCtaSection`.
 * Prefix and suffix are separate from the large amount typography.
 */
export function formatReservePriceDisplay(input: FormatReservePriceInput): ReservePriceParts {
  const suffix = resolveReserveSuffix(input.priceSuffixOverride, 'per person')
  const prefix = resolveReservePrefix(input.pricePrefixOverride, 'from')
  const mode = input.mode ?? 'auto'

  const customAmount = input.customPriceText?.trim() || input.priceOverrideText?.trim()
  if (mode === 'custom' || (mode === 'auto' && customAmount)) {
    if (!customAmount) {
      return { pricePrefix: prefix, priceAmount: 'Enquire', priceSuffix: suffix }
    }
    return {
      pricePrefix: prefix,
      priceAmount: normalizeReserveAmount(customAmount, prefix),
      priceSuffix: suffix,
    }
  }

  const linkedLine = input.linkedPriceLine?.trim()
  if (linkedLine) {
    return {
      pricePrefix: prefix,
      priceAmount: normalizeReserveAmount(linkedLine, prefix),
      priceSuffix: suffix,
    }
  }

  const n = input.lowestUsd
  if (n != null && n > 0) {
    const usd = `USD ${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    return {
      pricePrefix: prefix,
      priceAmount: usd,
      priceSuffix: suffix,
    }
  }
  return { pricePrefix: '', priceAmount: 'Enquire', priceSuffix: '' }
}

/** Split a legacy combined price line (e.g. “from USD 986”) for reserve cards. */
export function parseLegacyReservePriceLine(
  line: string,
  prefixOverride?: string | null,
): ReservePriceParts {
  const raw = line.trim()
  if (!raw) return { pricePrefix: '', priceAmount: '', priceSuffix: '' }
  const explicitPrefix =
    prefixOverride === undefined || prefixOverride === null ? null : prefixOverride.trim()
  const fromMatch = raw.match(/^(from)\s+(.+)$/i)
  const resolvedPrefix = explicitPrefix ?? (fromMatch ? fromMatch[1]!.toLowerCase() : '')
  const rawAmount = fromMatch ? fromMatch[2]!.trim() : raw
  return {
    pricePrefix: resolvedPrefix,
    priceAmount: normalizeReserveAmount(rawAmount, resolvedPrefix),
    priceSuffix: '',
  }
}

/** Resolve linked KC price for reserve cards (Experience or Learning Programme). */
export function resolveLinkedProductReservePrice(input: ExperiencePriceInput): {
  lowestUsd: number | null
  linkedPriceLine: string | null
} {
  if (input.status != null && String(input.status).trim() !== '' && !isActiveExperienceStatus(input.status)) {
    return { lowestUsd: null, linkedPriceLine: null }
  }
  const label = input.priceLabel?.trim()
  if (label) {
    return { lowestUsd: parseUsdFromPriceLabel(label), linkedPriceLine: label }
  }
  if (typeof input.price === 'number' && input.price > 0) {
    const usd = Math.round(input.price)
    return {
      lowestUsd: usd,
      linkedPriceLine: `USD ${usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
    }
  }
  return { lowestUsd: null, linkedPriceLine: null }
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
