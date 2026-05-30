import {
  formatUsdAmountPublic as formatUsdAmount,
  parseUsdAmountFromLabel,
  type ExperiencePriceFields,
} from '@/lib/formatExperiencePrice'
import type {
  ExperiencePromotionTarget,
  PromotionDoc,
  PromotionLegalAccordionItem,
  PromotionLegalInfo,
  PromotionPricingMode,
} from '@/lib/promotionTypes'
import { selectBestPromotionForExperience, selectMatchingPromotionsForExperience } from '@/lib/promotionMatching'
import { resolveSmartLinkOrLegacy } from '@/lib/resolveSmartLink'

export type PromotionalPriceDisplay =
  | {
      kind: 'enquire'
      promoLabel?: string
      promoMicrocopy?: string
    }
  | {
      kind: 'priced'
      from: string
      amount: string
      perPerson: string
      suffixExtra?: string
      originalAmount?: string
      promoLabel?: string
      promoMicrocopy?: string
      hasDiscount: boolean
    }

const PER_PERSON = 'per person'
const ENQUIRE = 'Enquire'

function isEnquireOnlyLabel(label: string): boolean {
  const t = label.trim().toLowerCase()
  if (!t) return true
  if (!/\d/.test(t) && /^(enquire|custom|contact|price on request)/i.test(t)) return true
  return false
}

/** Resolve base USD from KC price fields (before promotion). */
export function resolveOriginalExperienceUsd(exp: ExperiencePriceFields): number | null {
  const pl = exp.priceLabel?.trim() ?? ''
  if (pl && isEnquireOnlyLabel(pl)) return null
  const fromLabel = pl ? parseUsdAmountFromLabel(pl) : null
  if (fromLabel != null && fromLabel > 0) return fromLabel
  if (typeof exp.price === 'number' && exp.price > 0) return Math.round(exp.price)
  return null
}

function pricingMode(promo: PromotionDoc | null | undefined): PromotionPricingMode {
  const m = promo?.pricingMode?.trim()
  if (m === 'percentageDiscount' || m === 'fixedFinalPrice' || m === 'none') return m
  return 'none'
}

function applyPromotionToUsd(originalUsd: number | null, promo: PromotionDoc | null): {
  displayUsd: number | null
  displayAmount: string | null
  hasDiscount: boolean
} {
  if (originalUsd == null || originalUsd <= 0 || !promo) {
    return { displayUsd: originalUsd, displayAmount: null, hasDiscount: false }
  }

  const mode = pricingMode(promo)
  if (mode === 'none') {
    return { displayUsd: originalUsd, displayAmount: formatUsdAmount(originalUsd), hasDiscount: false }
  }

  if (mode === 'fixedFinalPrice') {
    const label = promo.fixedFinalPriceLabel?.trim()
    if (label) {
      const parsed = parseUsdAmountFromLabel(label)
      return {
        displayUsd: parsed ?? promo.fixedFinalPrice ?? originalUsd,
        displayAmount: label,
        hasDiscount: parsed != null ? parsed < originalUsd : Boolean(promo.fixedFinalPrice && promo.fixedFinalPrice < originalUsd),
      }
    }
    const fixed =
      typeof promo.fixedFinalPrice === 'number' && promo.fixedFinalPrice >= 0
        ? Math.round(promo.fixedFinalPrice)
        : originalUsd
    return {
      displayUsd: fixed,
      displayAmount: formatUsdAmount(fixed),
      hasDiscount: fixed < originalUsd,
    }
  }

  if (mode === 'percentageDiscount') {
    const pct =
      typeof promo.percentageDiscount === 'number' && promo.percentageDiscount > 0
        ? Math.min(99, promo.percentageDiscount)
        : 0
    if (!pct) {
      return { displayUsd: originalUsd, displayAmount: formatUsdAmount(originalUsd), hasDiscount: false }
    }
    const discounted = Math.max(0, Math.round(originalUsd * (1 - pct / 100)))
    return {
      displayUsd: discounted,
      displayAmount: formatUsdAmount(discounted),
      hasDiscount: discounted < originalUsd,
    }
  }

  return { displayUsd: originalUsd, displayAmount: formatUsdAmount(originalUsd), hasDiscount: false }
}

export function resolvePromotionalPriceDisplay(
  exp: ExperiencePriceFields,
  promo: PromotionDoc | null | undefined,
  options?: { inclusiveExtra?: string | null },
): PromotionalPriceDisplay {
  const pl = exp.priceLabel?.trim() ?? ''
  if (pl && isEnquireOnlyLabel(pl) && resolveOriginalExperienceUsd(exp) == null) {
    return {
      kind: 'enquire',
      promoLabel: promo?.promoLabel?.trim() || undefined,
      promoMicrocopy: promo?.promoMicrocopy?.trim() || undefined,
    }
  }

  const originalUsd = resolveOriginalExperienceUsd(exp)
  if (originalUsd == null) {
    return {
      kind: 'enquire',
      promoLabel: promo?.promoLabel?.trim() || undefined,
      promoMicrocopy: promo?.promoMicrocopy?.trim() || undefined,
    }
  }

  const { displayAmount, hasDiscount } = applyPromotionToUsd(originalUsd, promo ?? null)
  const amount = displayAmount ?? formatUsdAmount(originalUsd)
  const extra = options?.inclusiveExtra?.trim()

  return {
    kind: 'priced',
    from: 'from',
    amount,
    perPerson: PER_PERSON,
    ...(extra ? { suffixExtra: extra } : {}),
    ...(hasDiscount ? { originalAmount: formatUsdAmount(originalUsd) } : {}),
    promoLabel: promo?.promoLabel?.trim() || undefined,
    promoMicrocopy: promo?.promoMicrocopy?.trim() || undefined,
    hasDiscount,
  }
}

export function resolveExperiencePromotion(
  target: ExperiencePromotionTarget & ExperiencePriceFields,
  promotions: PromotionDoc[] | null | undefined,
  options?: { inclusiveExtra?: string | null },
): { promotion: PromotionDoc | null; display: PromotionalPriceDisplay } {
  const promotion = selectBestPromotionForExperience(target, promotions)
  const display = resolvePromotionalPriceDisplay(target, promotion, options)
  return { promotion, display }
}

export function resolvePromotionLegalInfo(promo: PromotionDoc | null | undefined): PromotionLegalInfo | null {
  if (!promo) return null
  const legalText = promo.legalText?.trim() ?? ''
  const promoLabel = promo.promoLabel?.trim() ?? ''

  let legalLink: PromotionLegalInfo['legalLink'] = null
  const smart = promo.legalSmartLink
  if (smart && smart.enabled !== false) {
    const resolved = resolveSmartLinkOrLegacy(smart, null, {
      label: 'View offer terms',
      href: '#',
      openInNewTab: true,
    })
    if (resolved?.href && resolved.href !== '#') {
      legalLink = {
        label: resolved.label?.trim() || 'View offer terms',
        href: resolved.href,
        openInNewTab: resolved.openInNewTab,
        rel: resolved.rel,
      }
    }
  }

  if (!legalText && !legalLink) return null

  return {
    legalText,
    legalLink,
    promoLabel,
    promoMicrocopy: promo.promoMicrocopy?.trim() ?? '',
  }
}

function promotionLegalAccordionTitle(promo: PromotionDoc, info: PromotionLegalInfo): string {
  return info.promoLabel || promo.internalTitle?.trim() || 'Promotion'
}

/** Legal accordion rows for all matching active promotions that have legal text or link. */
export function resolvePromotionLegalItemsForExperience(
  target: ExperiencePromotionTarget,
  promotions: PromotionDoc[] | null | undefined,
  now: Date = new Date(),
): PromotionLegalAccordionItem[] {
  const matched = selectMatchingPromotionsForExperience(target, promotions, now)
  const out: PromotionLegalAccordionItem[] = []
  const seen = new Set<string>()

  for (const promo of matched) {
    const id = promo._id?.trim()
    if (!id || seen.has(id)) continue
    const info = resolvePromotionLegalInfo(promo)
    if (!info) continue
    seen.add(id)
    out.push({
      id,
      title: promotionLegalAccordionTitle(promo, info),
      legalText: info.legalText,
      legalLink: info.legalLink,
    })
  }

  return out
}

export function lowestPromotionalUsdForRows(
  rows: Array<ExperiencePromotionTarget & ExperiencePriceFields>,
  promotions: PromotionDoc[] | null | undefined,
): number | null {
  let lowest: number | null = null
  for (const row of rows) {
    const { display } = resolveExperiencePromotion(row, promotions)
    if (display.kind !== 'priced') continue
    const usd = parseUsdAmountFromLabel(display.amount)
    if (usd == null) continue
    if (lowest == null || usd < lowest) lowest = usd
  }
  return lowest
}

export { ENQUIRE, PER_PERSON }
