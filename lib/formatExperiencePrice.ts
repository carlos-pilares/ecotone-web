/**
 * Canonical experience price copy: “from USD X,XXX per person” or “Enquire”.
 */

export type ExperiencePriceFields = {
  price?: number | null
  priceLabel?: string | null
}

const PER_PERSON = 'per person'
const ENQUIRE = 'Enquire'

function formatUsdAmount(n: number): string {
  const rounded = Math.round(n)
  return `USD ${rounded.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

/** First plausible USD integer in a marketing label (e.g. "$986", "USD 1,220+"). */
function parseUsdAmountFromLabel(label: string): number | null {
  const normalized = label.replace(/,/g, '')
  const matches = [...normalized.matchAll(/\$?\s*(\d{2,6})(?:\.\d+)?/g)]
  let best: number | null = null
  for (const m of matches) {
    const n = Math.round(parseFloat(m[1]))
    if (n >= 50 && n <= 500_000 && (best == null || n < best)) best = n
  }
  return best
}

function isEnquireOnlyLabel(label: string): boolean {
  const t = label.trim().toLowerCase()
  if (!t) return true
  if (!/\d/.test(t) && /^(enquire|custom|contact|price on request)/i.test(t)) return true
  return false
}

/** Normalize “USD 1220”, “$986”, etc. to “USD X,XXX”. */
function normalizeUsdToken(label: string): string | null {
  const fromLabel = parseUsdAmountFromLabel(label)
  if (fromLabel != null) return formatUsdAmount(fromLabel)
  const t = label.trim()
  if (/^usd\s/i.test(t)) {
    const n = parseUsdAmountFromLabel(t)
    if (n != null) return formatUsdAmount(n)
  }
  return null
}

/**
 * Single-line price for cards, nav, route footers, etc.
 */
export function formatExperiencePriceLine(exp: ExperiencePriceFields): string {
  const pl = exp.priceLabel?.trim() ?? ''
  if (pl && isEnquireOnlyLabel(pl)) return ENQUIRE

  if (pl) {
    const low = pl.toLowerCase()
    const usd = normalizeUsdToken(pl)
    if (usd) return `from ${usd} ${PER_PERSON}`
    if (low.startsWith('from ') && low.includes(PER_PERSON)) {
      return normalizeUsdToken(pl) ? `from ${normalizeUsdToken(pl)} ${PER_PERSON}` : pl.replace(/\$/g, 'USD')
    }
    if (low.includes(PER_PERSON)) {
      const token = normalizeUsdToken(pl) ?? pl.replace(/^\s*from\s+/i, '').replace(/\s*per person.*$/i, '').trim()
      return `from ${token} ${PER_PERSON}`
    }
    if (low.startsWith('from ')) {
      const token = normalizeUsdToken(pl) ?? pl.replace(/^\s*from\s+/i, '').trim()
      return `from ${token} ${PER_PERSON}`
    }
    const token = normalizeUsdToken(pl) ?? pl
    return `from ${token} ${PER_PERSON}`
  }

  if (typeof exp.price === 'number' && exp.price > 0) {
    return `from ${formatUsdAmount(exp.price)} ${PER_PERSON}`
  }

  return ENQUIRE
}

export type ExperiencePricePartsOptions = {
  /** Appended after “per person”, e.g. “all inclusive”. */
  inclusiveExtra?: string | null
}

export type ExperiencePriceStructuredParts =
  | { kind: 'enquire' }
  | { kind: 'priced'; from: string; amount: string; perPerson: string; suffixExtra?: string }

/** Structured price for hero, nav, header cards (from / amount / per person). */
export function formatExperiencePriceStructured(
  exp: ExperiencePriceFields,
  options?: ExperiencePricePartsOptions,
): ExperiencePriceStructuredParts {
  const line = formatExperiencePriceLine(exp)
  if (line === ENQUIRE) return { kind: 'enquire' }
  const usd =
    normalizeUsdToken(exp.priceLabel ?? '') ??
    (typeof exp.price === 'number' && exp.price > 0 ? formatUsdAmount(exp.price) : null)
  const amount = usd ?? line.replace(/^\s*from\s+/i, '').replace(new RegExp(`\\s*${PER_PERSON}\\s*$`, 'i'), '').trim()
  const extra = options?.inclusiveExtra?.trim()
  return {
    kind: 'priced',
    from: 'from',
    amount,
    perPerson: PER_PERSON,
    ...(extra ? { suffixExtra: extra } : {}),
  }
}

/**
 * Split price for hero / reserve blocks: amount line + suffix line (no “from” in main).
 */
export function formatExperiencePriceParts(
  exp: ExperiencePriceFields,
  options?: ExperiencePricePartsOptions,
): { from: string; amount: string; suffix: string } {
  const structured = formatExperiencePriceStructured(exp, options)
  if (structured.kind === 'enquire') {
    const extra = options?.inclusiveExtra?.trim()
    return {
      from: '',
      amount: ENQUIRE,
      suffix: extra ? `${PER_PERSON} · ${extra}` : PER_PERSON,
    }
  }
  const suffix = structured.suffixExtra
    ? `${structured.perPerson} · ${structured.suffixExtra}`
    : structured.perPerson
  return { from: structured.from, amount: structured.amount, suffix }
}

export type ExperienceCardPriceDisplay =
  | { kind: 'enquire' }
  | { kind: 'priced'; from: string; amount: string; perPerson: string }

/** Structured price for experience cards (“from” / amount / “per person”). */
export function formatExperienceCardPriceDisplay(exp: ExperiencePriceFields): ExperienceCardPriceDisplay {
  const structured = formatExperiencePriceStructured(exp)
  if (structured.kind === 'enquire') return { kind: 'enquire' }
  return {
    kind: 'priced',
    from: structured.from,
    amount: structured.amount,
    perPerson: structured.perPerson,
  }
}

export type ExperienceNavPriceMeta =
  | { kind: 'enquire' }
  | { kind: 'priced'; from: string; amount: string; perPerson: string }

/** Header mega menu / mobile drawer price row. */
export function formatExperienceNavPriceMeta(exp: ExperiencePriceFields): ExperienceNavPriceMeta {
  return formatExperiencePriceStructured(exp)
}

/** Route card footer HTML: count + price line with per person. */
export function formatRouteCardFootPriceHtml(count: number, lowestUsd: number | null): string {
  const countLabel = count === 1 ? '1 experience' : `${count} experiences`
  if (count === 0) {
    return `0 experiences · <span class="routes-price-enquire">Enquire</span>`
  }
  if (lowestUsd != null && lowestUsd > 0) {
    const amount = formatUsdAmount(lowestUsd)
    return `${countLabel} · from <strong>${amount}</strong> ${PER_PERSON}`
  }
  return `${countLabel} · <span class="routes-price-enquire">Enquire</span>`
}
