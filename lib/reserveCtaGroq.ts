import { GROQ_SMART_LINK_FIELDS } from '@/lib/smartLinkGroq'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'

/** CMS trust row under `reserveCtaSettings.trustItems`. */
export type ReserveCtaTrustItemGroq = {
  iconKey?: string | null
  text?: string | null
}

/** CMS object `reserveCtaSettings` (Sanity). */
export type ReserveCtaSettingsGroq = {
  eyebrow?: string | null
  title?: string | null
  body?: string | null
  priceOverrideText?: string | null
  pricePrefixOverride?: string | null
  priceSuffixOverride?: string | null
  sublineOverride?: string | null
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
  priceOverrideText,
  pricePrefixOverride,
  priceSuffixOverride,
  sublineOverride,
  rowsOverride[]{ label, value },
  primaryCtaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
  secondaryCtaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
  trustItems[]{ iconKey, text },
  termsPrefixText,
  termsLinkLabel,
  termsSuffixText,
  termsSmartLink { ${GROQ_SMART_LINK_FIELDS} }
`
