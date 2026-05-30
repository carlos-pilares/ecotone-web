import type { SmartLinkGroq } from '@/lib/resolveSmartLink'

export type PromotionPricingMode = 'none' | 'percentageDiscount' | 'fixedFinalPrice'

export type PromotionDoc = {
  _id: string
  internalTitle?: string | null
  enabled?: boolean | null
  priority?: number | null
  startDate?: string | null
  endDate?: string | null
  promoLabel?: string | null
  promoMicrocopy?: string | null
  legalText?: string | null
  legalSmartLink?: SmartLinkGroq | null
  appliesToAll?: boolean | null
  routes?: Array<{ _ref?: string; _id?: string } | null> | null
  programTypes?: string[] | null
  experiences?: Array<{ _ref?: string; _id?: string } | null> | null
  pricingMode?: PromotionPricingMode | string | null
  percentageDiscount?: number | null
  fixedFinalPrice?: number | null
  fixedFinalPriceLabel?: string | null
}

export type ExperiencePromotionTarget = {
  experienceId?: string | null
  routeRefId?: string | null
  routeSlug?: string | null
  programType?: string | null
}

export type AnnouncementBarDoc = {
  enabled?: boolean | null
  message?: string | null
  secondaryText?: string | null
  ctaLabel?: string | null
  ctaSmartLink?: SmartLinkGroq | null
  startDate?: string | null
  endDate?: string | null
  showOnPages?: string | null
  dismissible?: boolean | null
}

export type ResolvedAnnouncementBar = {
  visible: boolean
  message: string
  secondaryText: string
  cta: { label: string; href: string; openInNewTab: boolean; rel: string } | null
  dismissible: boolean
  storageKey: string
}

export type PromotionLegalInfo = {
  legalText: string
  legalLink: { label: string; href: string; openInNewTab: boolean; rel: string } | null
  promoLabel: string
  promoMicrocopy: string
}

/** One accordion row on experience detail — legal copy only (pricing uses highest-priority promo). */
export type PromotionLegalAccordionItem = {
  id: string
  title: string
  legalText: string
  legalLink: PromotionLegalInfo['legalLink']
}
