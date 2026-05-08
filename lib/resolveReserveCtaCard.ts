import type { ReserveCtaCta, ReserveCtaDetailRow } from '@/components/shared/ReserveCtaSection'
import type { ReserveCtaSettingsGroq } from '@/lib/reserveCtaGroq'
import { formatReservePriceDisplay } from '@/lib/reserveCtaPricing'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'
import { resolveSmartLinkOrLegacy, smartLinkIsDisabled } from '@/lib/resolveSmartLink'

export type LegacyCtaPair = {
  primarySmart?: SmartLinkGroq | null
  primaryLabel?: string | null
  primaryHref?: string | null
  secondarySmart?: SmartLinkGroq | null
  secondaryLabel?: string | null
  secondaryHref?: string | null
}

function rowFromOverride(
  rows: Array<{ label?: string | null; value?: string | null }> | null | undefined,
): ReserveCtaDetailRow[] {
  if (!rows || !Array.isArray(rows) || rows.length === 0) return []
  return rows
    .map((r) => ({
      label: (r?.label ?? '').trim(),
      value: (r?.value ?? '').trim(),
    }))
    .filter((r) => r.label && r.value)
}

function ctaFromResolved(
  resolved: { label: string; href: string; openInNewTab?: boolean } | null,
  variant: 'primary' | 'secondary',
): ReserveCtaCta | null {
  if (!resolved) return null
  const label = resolved.label.trim()
  const href = resolved.href.trim()
  if (!label || !href) return null
  const external =
    resolved.openInNewTab === true || /^https?:/i.test(href) || href.startsWith('mailto:')
  const whatsappIcon = variant === 'secondary' && (/wa\.me\//i.test(href) || /whatsapp/i.test(label))
  return { label, href, variant, external, whatsappIcon }
}

/**
 * Merge `reserveCtaSettings` with legacy CTAs and derived pricing.
 * Priority: settings → legacy presentation → defaults.
 */
export function resolveReserveCtaCard(opts: {
  settings: ReserveCtaSettingsGroq | undefined
  lowestUsd: number | null
  /** `exact` for a single experience card; default `from` for lowest-among-pages. */
  priceLineStyle?: 'from' | 'exact'
  legacyPriceLine?: string | null
  legacyPriceSuffix?: string | null
  legacySubline?: string | null
  defaultSubline: string
  defaultRows: ReserveCtaDetailRow[]
  legacyCtas: LegacyCtaPair
  defaultTermsHref: string
}): {
  priceLine: string
  priceSuffix: string
  subline: string
  rows: ReserveCtaDetailRow[]
  ctas: ReserveCtaCta[]
  termsHref?: string
} {
  const s = opts.settings
  const hasOverride = Boolean(s?.priceOverrideText?.trim())
  let priceLine: string
  let priceSuffix: string

  if (hasOverride) {
    const f = formatReservePriceDisplay({
      priceOverrideText: s?.priceOverrideText,
      pricePrefixOverride: s?.pricePrefixOverride,
      priceSuffixOverride: s?.priceSuffixOverride,
    })
    priceLine = f.priceLine
    priceSuffix = f.priceSuffix
  } else {
    const f = formatReservePriceDisplay({
      pricePrefixOverride: s?.pricePrefixOverride,
      priceSuffixOverride: s?.priceSuffixOverride,
      lowestUsd: opts.lowestUsd,
      priceLineStyle: opts.priceLineStyle,
    })
    if (f.priceLine === 'Enquire' && opts.legacyPriceLine?.trim()) {
      priceLine = opts.legacyPriceLine.trim()
      priceSuffix = opts.legacyPriceSuffix?.trim() || f.priceSuffix
    } else {
      priceLine = f.priceLine
      priceSuffix = f.priceSuffix
    }
  }

  const subline =
    s?.sublineOverride?.trim() || opts.legacySubline?.trim() || opts.defaultSubline || ''

  const ovRows = rowFromOverride(s?.rowsOverride ?? null)
  const rows = ovRows.length > 0 ? ovRows : opts.defaultRows

  const pLegacy = {
    label: opts.legacyCtas.primaryLabel,
    href: opts.legacyCtas.primaryHref,
    openInNewTab: /^https?:/i.test(opts.legacyCtas.primaryHref ?? ''),
  }
  const sLegacy = {
    label: opts.legacyCtas.secondaryLabel,
    href: opts.legacyCtas.secondaryHref,
    openInNewTab: true,
  }

  const pRes = smartLinkIsDisabled(s?.primaryCtaSmartLink)
    ? null
    : resolveSmartLinkOrLegacy(s?.primaryCtaSmartLink, pLegacy, {
        label: pLegacy.label ?? '',
        href: pLegacy.href ?? '',
        openInNewTab: pLegacy.openInNewTab === true,
      })
  const sRes = smartLinkIsDisabled(s?.secondaryCtaSmartLink)
    ? null
    : resolveSmartLinkOrLegacy(s?.secondaryCtaSmartLink, sLegacy, {
        label: sLegacy.label ?? '',
        href: sLegacy.href ?? '',
        openInNewTab: true,
      })

  const ctas = [
    ctaFromResolved(pRes, 'primary'),
    ctaFromResolved(sRes, 'secondary'),
  ].filter(Boolean) as ReserveCtaCta[]

  let termsHref: string | undefined = opts.defaultTermsHref
  if (!smartLinkIsDisabled(s?.termsSmartLink)) {
    const tRes = resolveSmartLinkOrLegacy(
      s?.termsSmartLink,
      { label: 'Terms & Conditions', href: opts.defaultTermsHref, openInNewTab: false },
      { label: 'Terms & Conditions', href: opts.defaultTermsHref, openInNewTab: false },
    )
    if (tRes?.href?.trim()) termsHref = tRes.href.trim()
  }

  return { priceLine, priceSuffix, subline, rows, ctas, termsHref }
}
