import type { ExperiencePriceFields, ExperiencePricePartsOptions } from '@/lib/formatExperiencePrice'
import {
  formatExperiencePriceParts,
  formatExperiencePriceStructured,
} from '@/lib/formatExperiencePrice'
import type { PromotionDoc } from '@/lib/promotionTypes'
import {
  resolveExperiencePromotion,
  type PromotionalPriceDisplay,
} from '@/lib/promotionPricing'

export type ExperienceCardPriceDisplay =
  | { kind: 'enquire'; promoLabel?: string; promoMicrocopy?: string }
  | {
      kind: 'priced'
      from: string
      amount: string
      perPerson: string
      originalAmount?: string
      promoLabel?: string
      promoMicrocopy?: string
      hasDiscount?: boolean
    }

export type ExperienceNavPriceMeta =
  | { kind: 'enquire'; promoLabel?: string }
  | {
      kind: 'priced'
      from: string
      amount: string
      perPerson: string
      originalAmount?: string
      promoLabel?: string
      hasDiscount?: boolean
    }

export type ExperiencePromotionFields = ExperiencePriceFields & {
  experienceId?: string | null
  routeRefId?: string | null
  routeSlug?: string | null
  programType?: string | null
}

function promotionalToCardDisplay(display: PromotionalPriceDisplay): ExperienceCardPriceDisplay {
  if (display.kind === 'enquire') {
    return {
      kind: 'enquire',
      promoLabel: display.promoLabel,
      promoMicrocopy: display.promoMicrocopy,
    }
  }
  return {
    kind: 'priced',
    from: display.from,
    amount: display.amount,
    perPerson: display.perPerson,
    originalAmount: display.originalAmount,
    promoLabel: display.promoLabel,
    promoMicrocopy: display.promoMicrocopy,
    hasDiscount: display.hasDiscount,
  }
}

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

export function formatExperienceCardPriceDisplayWithPromotions(
  exp: ExperiencePromotionFields,
  promotions?: PromotionDoc[] | null,
): ExperienceCardPriceDisplay {
  const { display } = resolveExperiencePromotion(exp, promotions)
  return promotionalToCardDisplay(display)
}

/** Header mega menu price row. */
export function formatExperienceNavPriceMeta(exp: ExperiencePriceFields): ExperienceNavPriceMeta {
  return formatExperienceCardPriceDisplay(exp)
}

export function formatExperienceNavPriceMetaWithPromotions(
  exp: ExperiencePromotionFields,
  promotions?: PromotionDoc[] | null,
): ExperienceNavPriceMeta {
  return formatExperienceCardPriceDisplayWithPromotions(exp, promotions)
}

export function formatExperiencePricePartsWithPromotions(
  exp: ExperiencePromotionFields,
  promotions?: PromotionDoc[] | null,
  options?: ExperiencePricePartsOptions,
): { from: string; amount: string; suffix: string; originalAmount?: string; promoLabel?: string; promoMicrocopy?: string } {
  const { display } = resolveExperiencePromotion(exp, promotions, options)
  if (display.kind === 'enquire') {
    const extra = options?.inclusiveExtra?.trim()
    return {
      from: '',
      amount: 'Enquire',
      suffix: extra ? `per person · ${extra}` : 'per person',
      promoLabel: display.promoLabel,
      promoMicrocopy: display.promoMicrocopy,
    }
  }
  const suffix = display.suffixExtra
    ? `${display.perPerson} · ${display.suffixExtra}`
    : display.perPerson
  return {
    from: display.from,
    amount: display.amount,
    suffix,
    originalAmount: display.originalAmount,
    promoLabel: display.promoLabel,
    promoMicrocopy: display.promoMicrocopy,
  }
}

/** Back-compat when no promotions list is available. */
export function formatExperiencePricePartsLegacy(
  exp: ExperiencePriceFields,
  options?: ExperiencePricePartsOptions,
) {
  return formatExperiencePriceParts(exp, options)
}
