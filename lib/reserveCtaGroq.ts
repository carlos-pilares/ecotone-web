import { GROQ_SMART_LINK_FIELDS } from '@/lib/smartLinkGroq'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'

/** CMS trust row under `reserveCtaSettings.trustItems`. */
export type ReserveCtaTrustItemGroq = {
  iconKey?: string | null
  text?: string | null
}

/** One structured row for Experience page reserve card (`experienceReserveRows`). */
export type ExperienceReserveCardRowGroq = {
  sourceField?: string | null
  labelOverride?: string | null
  valueOverride?: string | null
  show?: boolean | null
  orderRank?: number | null
}

/** CMS object `reserveCtaSettings` (Sanity). */
export type ReserveCtaSettingsGroq = {
  eyebrow?: string | null
  title?: string | null
  body?: string | null
  priceSource?: 'linked' | 'custom' | null
  priceLinkedExperienceRef?: { _ref?: string | null } | null
  customPriceText?: string | null
  priceOverrideText?: string | null
  pricePrefixOverride?: string | null
  priceSuffixOverride?: string | null
  sublineOverride?: string | null
  /** Experience landing: source-bound rows (see `experienceReserveCardRow`). */
  experienceReserveRows?: ExperienceReserveCardRowGroq[] | null
  rowsOverride?: Array<{ label?: string | null; value?: string | null }> | null
  primaryCtaSmartLink?: SmartLinkGroq | null
  secondaryCtaSmartLink?: SmartLinkGroq | null
  trustItems?: ReserveCtaTrustItemGroq[] | null
  termsPrefixText?: string | null
  termsLinkLabel?: string | null
  termsSuffixText?: string | null
  termsSmartLink?: SmartLinkGroq | null
} | null

/** Inline GROQ projection for `reserveCtaSettings { … }`. */
export const GROQ_RESERVE_CTA_SETTINGS_FIELDS = `
  eyebrow,
  title,
  body,
  priceSource,
  priceLinkedExperienceRef,
  customPriceText,
  priceOverrideText,
  pricePrefixOverride,
  priceSuffixOverride,
  sublineOverride,
  experienceReserveRows[]{ sourceField, labelOverride, valueOverride, show, orderRank },
  rowsOverride[]{ label, value },
  primaryCtaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
  secondaryCtaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
  trustItems[]{ iconKey, text },
  termsPrefixText,
  termsLinkLabel,
  termsSuffixText,
  termsSmartLink { ${GROQ_SMART_LINK_FIELDS} }
`
