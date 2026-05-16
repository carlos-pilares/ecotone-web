import type { ReserveCtaCta, ReserveCtaDetailRow, ReserveCtaTrustItem } from '@/components/shared/ReserveCtaSection'
import type { ExperienceReserveFacts } from '@/lib/experienceReserveRows'
import { resolveExperienceReserveCardRows as resolveExpReserveRows } from '@/lib/experienceReserveRows'
import type { ReserveCtaSettingsGroq, ReserveCtaTrustItemGroq } from '@/lib/reserveCtaGroq'
import { formatReservePriceDisplay } from '@/lib/reserveCtaPricing'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import type { ResolvedSmartLink, SmartLinkGroq } from '@/lib/resolveSmartLink'
import { resolveSmartLinkOrLegacy, smartLinkIsDisabled } from '@/lib/resolveSmartLink'

const DEFAULT_TERMS_PREFIX = 'By booking, you agree to our'
const DEFAULT_TERMS_LINK_LABEL = 'Terms & Conditions'
const DEFAULT_TERMS_SUFFIX = '.'

function trustItemsFromSettings(rows: ReserveCtaTrustItemGroq[] | null | undefined): ReserveCtaTrustItem[] {
  if (!rows || !Array.isArray(rows) || rows.length === 0) return []
  return rows
    .map((r) => {
      if (!r || typeof r !== 'object') return null
      const text = (r.text ?? '').trim()
      if (!text) return null
      const iconKey = (r.iconKey ?? '').trim()
      return { iconKey, text }
    })
    .filter((x): x is ReserveCtaTrustItem => x != null)
}

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
  resolved: ResolvedSmartLink | null,
  variant: 'primary' | 'secondary',
): ReserveCtaCta | null {
  if (!resolved) return null
  const label = resolved.label.trim()
  if (!label) return null
  if (resolved.bookingModal) {
    return {
      label,
      href: '#',
      variant,
      external: false,
      bookingModal: resolved.bookingModal,
      bookingSummary: resolved.bookingSummary,
    }
  }
  const href = resolved.href.trim()
  if (!href) return null
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
  /** When set (Experience landing), `experienceReserveRows` in settings resolve against this. */
  experienceReserveFacts?: ExperienceReserveFacts | null
  legacyCtas: LegacyCtaPair
  defaultTermsHref: string
  pageBookingSummary?: ExperienceBookingSummary | null
}): {
  priceLine: string
  priceSuffix: string
  subline: string
  rows: ReserveCtaDetailRow[]
  ctas: ReserveCtaCta[]
  termsHref?: string
  termsPrefixText: string
  termsLinkLabel: string
  termsSuffixText: string
  termsOpenInNewTab: boolean
  termsRel: string
  trustItems?: ReserveCtaTrustItem[]
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

  const structuredRows = resolveExpReserveRows(s?.experienceReserveRows, opts.experienceReserveFacts ?? null)
  const ovRows = rowFromOverride(s?.rowsOverride ?? null)
  const rows =
    structuredRows !== null ? structuredRows : ovRows.length > 0 ? ovRows : opts.defaultRows

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

  const linkOpts = { pageBookingSummary: opts.pageBookingSummary ?? null }
  const pRes = smartLinkIsDisabled(s?.primaryCtaSmartLink)
    ? null
    : resolveSmartLinkOrLegacy(
        s?.primaryCtaSmartLink,
        pLegacy,
        {
          label: pLegacy.label ?? '',
          href: pLegacy.href ?? '',
          openInNewTab: pLegacy.openInNewTab === true,
        },
        linkOpts,
      )
  const sRes = smartLinkIsDisabled(s?.secondaryCtaSmartLink)
    ? null
    : resolveSmartLinkOrLegacy(
        s?.secondaryCtaSmartLink,
        sLegacy,
        {
          label: sLegacy.label ?? '',
          href: sLegacy.href ?? '',
          openInNewTab: true,
        },
        linkOpts,
      )

  const ctas = [
    ctaFromResolved(pRes, 'primary'),
    ctaFromResolved(sRes, 'secondary'),
  ].filter(Boolean) as ReserveCtaCta[]

  const termsPrefixText = (s?.termsPrefixText ?? '').trim() || DEFAULT_TERMS_PREFIX
  const termsLinkLabel = (s?.termsLinkLabel ?? '').trim() || DEFAULT_TERMS_LINK_LABEL
  const termsSuffixText =
    s?.termsSuffixText === undefined || s?.termsSuffixText === null
      ? DEFAULT_TERMS_SUFFIX
      : s.termsSuffixText

  let termsHref: string | undefined = opts.defaultTermsHref
  let termsOpenInNewTab = false
  let termsRel = ''
  if (!smartLinkIsDisabled(s?.termsSmartLink)) {
    const tRes = resolveSmartLinkOrLegacy(
      s?.termsSmartLink,
      { label: termsLinkLabel, href: opts.defaultTermsHref, openInNewTab: false },
      { label: termsLinkLabel, href: opts.defaultTermsHref, openInNewTab: false },
    )
    if (tRes?.href?.trim()) {
      termsHref = tRes.href.trim()
      termsOpenInNewTab = tRes.openInNewTab
      termsRel = tRes.rel
    }
  }

  const trustParsed = trustItemsFromSettings(s?.trustItems ?? null)
  const trustItems = trustParsed.length > 0 ? trustParsed : undefined

  return {
    priceLine,
    priceSuffix,
    subline,
    rows,
    ctas,
    termsHref,
    termsPrefixText,
    termsLinkLabel,
    termsSuffixText,
    termsOpenInNewTab,
    termsRel,
    trustItems,
  }
}
