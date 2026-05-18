import type { ExperienceBookingSummary } from '@/components/booking/types'
import {
  resolveSmartLinkOrLegacy,
  smartLinkIsDisabled,
  type SmartLinkGroq,
} from '@/lib/resolveSmartLink'

export type TailorMadeBandCmsRow = {
  showTailorMade?: boolean | null
  enabled?: boolean | null
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  ctaSmartLink?: SmartLinkGroq | null
  tailorMadeEyebrow?: string | null
  tailorMadeTitle?: string | null
  tailorMadeBody?: string | null
  tailorMadeCta?: SmartLinkGroq | null
  /** @deprecated lodge legacy */
  description?: string | null
} | null | undefined

export type TailorMadeBandResolved = {
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
  href: string
  openInNewTab?: boolean
  rel?: string
  bookingModal?: 'plan' | 'experience'
  bookingSummary?: ExperienceBookingSummary
}

export type TailorMadeBandFallback = {
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
  href: string
  openInNewTab?: boolean
}

export type ResolveTailorMadeBandOptions = {
  pageBookingSummary?: ExperienceBookingSummary | null
  /** CMS-only eyebrow/title/subtitle — no marketing copy fallbacks. */
  strict?: boolean
  /** Fallback used only to resolve the CTA smart link (href / label / booking modal). */
  ctaFallback?: Pick<TailorMadeBandFallback, 'ctaLabel' | 'href' | 'openInNewTab'>
}

const EMPTY_STRICT_FALLBACK: TailorMadeBandFallback = {
  eyebrow: '',
  title: '',
  subtitle: '',
  ctaLabel: '',
  href: '',
}

function trimField(v: string | null | undefined): string | undefined {
  const t = v?.trim()
  return t || undefined
}

function smartLinkUsable(raw: SmartLinkGroq | null | undefined): boolean {
  if (!raw) return false
  if (raw.enabled === false) return false
  return Boolean(raw.linkType?.trim()) || Boolean(raw.label?.trim()) || Boolean(raw.externalUrl?.trim())
}

/** Resolve CMS Tailor Made band; returns undefined when hidden or incomplete. */
export function resolveTailorMadeBand(
  row: TailorMadeBandCmsRow,
  fallback: TailorMadeBandFallback,
  options?: ResolveTailorMadeBandOptions,
): TailorMadeBandResolved | undefined {
  if (!row) return undefined
  const show = row.showTailorMade === true || row.enabled === true
  if (!show) return undefined

  const copyFb = options?.strict ? EMPTY_STRICT_FALLBACK : fallback
  const ctaFb = options?.ctaFallback ?? fallback

  const eyebrow =
    trimField(row.eyebrow) ?? trimField(row.tailorMadeEyebrow) ?? copyFb.eyebrow
  const title = trimField(row.title) ?? trimField(row.tailorMadeTitle) ?? copyFb.title
  const subtitle =
    trimField(row.subtitle) ??
    trimField(row.tailorMadeBody) ??
    trimField(row.description) ??
    copyFb.subtitle

  const rawLink = row.ctaSmartLink ?? row.tailorMadeCta
  if (smartLinkIsDisabled(rawLink)) {
    return { eyebrow, title, subtitle, ctaLabel: '', href: '' }
  }

  const hasSmart = smartLinkUsable(rawLink)
  const smart =
    hasSmart && rawLink ? { ...rawLink, label: rawLink.label?.trim() || ctaFb.ctaLabel } : null
  const resolved = resolveSmartLinkOrLegacy(
    smart,
    undefined,
    {
      label: ctaFb.ctaLabel,
      href: ctaFb.href,
      openInNewTab: ctaFb.openInNewTab ?? true,
    },
    options,
  )

  if (!resolved?.href?.trim() || resolved.href === '#') {
    return { eyebrow, title, subtitle, ctaLabel: '', href: '' }
  }

  return {
    eyebrow,
    title,
    subtitle,
    ctaLabel: resolved.label?.trim() || ctaFb.ctaLabel,
    href: resolved.href,
    openInNewTab: resolved.openInNewTab === true,
    rel: resolved.rel,
    bookingModal: resolved.bookingModal,
    bookingSummary: resolved.bookingSummary,
  }
}

export function tailorMadeBandHasCta(band: TailorMadeBandResolved | undefined): boolean {
  if (!band) return false
  return Boolean(band.ctaLabel.trim() && band.href.trim() && band.href !== '#')
}

export type TailorMadeBandComponentProps = {
  visible: boolean
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel?: string
  href?: string
  openInNewTab?: boolean
  rel?: string
  bookingModal?: 'plan' | 'experience'
  bookingSummary?: ExperienceBookingSummary
  className?: string
  dataType?: string
}

export function tailorMadeBandFromResolved(
  band: TailorMadeBandResolved | undefined,
  options?: { className?: string; dataType?: string },
): TailorMadeBandComponentProps | null {
  if (!band) return null
  return {
    visible: true,
    eyebrow: band.eyebrow,
    title: band.title,
    subtitle: band.subtitle,
    ctaLabel: band.ctaLabel,
    href: band.href,
    openInNewTab: band.openInNewTab,
    rel: band.rel,
    bookingModal: band.bookingModal,
    bookingSummary: band.bookingSummary,
    className: options?.className,
    dataType: options?.dataType,
  }
}
