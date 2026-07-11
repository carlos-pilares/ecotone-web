/**
 * CMS link resolution for the Next app.
 *
 * **Public API:** import only `resolveSmartLinkOrLegacy` (plus types). It is the single entry point
 * for “smartLink overrides legacy” behaviour across pages.
 *
 * `resolveSmartLink` / `resolveLegacyLinkWithLabel` are module-private helpers — do not import them.
 */

import type { ExperienceBookingSummary } from '@/components/booking/types'
import {
  buildBookingSummaryFromCmsExperience,
  type CmsBookingExperienceRow,
} from '@/lib/buildBookingSummaryFromCms'

export type SmartLinkGroq = {
  enabled?: boolean | null
  label?: string | null
  linkType?: string | null
  /** In-document section id (same page); also accepts legacy `sectionId` when `linkType === 'samePageSection'`. */
  samePageSectionId?: string | null
  internalPage?: string | null
  /** Anchor for `linkType === 'websitePage'` (preferred). Legacy `sectionId` is still read as fallback. */
  websitePageSectionId?: string | null
  sectionId?: string | null
  externalUrl?: string | null
  fileUrl?: string | null
  bookFallbackUrl?: string | null
  bookingMode?: string | null
  bookingExperience?: CmsBookingExperienceRow | null
  emailAddress?: string | null
  whatsappNumber?: string | null
  whatsappMessage?: string | null
  openInNewTab?: boolean | null
  experiencePageSlug?: string | null
  lodgePageSlug?: string | null
}

export type ResolvedSmartLink = {
  label: string
  href: string
  openInNewTab: boolean
  rel: string
  /** Opens PlanJourneyModal (general booking) or BookExperienceModal (specific experience). */
  bookingModal?: 'plan' | 'experience'
  bookingSummary?: ExperienceBookingSummary
}

export type LegacyLinkWithLabel = {
  label?: string | null
  href?: string | null
  openInNewTab?: boolean | null
}

export type ResolveSmartLinkOptions = {
  /** Current page experience — fallback when booking link is “specific” but no ref is set. */
  pageBookingSummary?: ExperienceBookingSummary | null
}

function sanitizeSectionId(raw: string | null | undefined): string {
  const t = raw?.trim()
  if (!t) return ''
  return t.replace(/[^a-zA-Z0-9_-]/g, '')
}

/** True when the app should treat `href` as leaving the site or opening in a new tab by default. */
export function isExternalHref(href: string): boolean {
  return (
    /^https?:\/\//i.test(href) ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('//')
  )
}

function computeRel(href: string, openInNewTab: boolean): string {
  if (openInNewTab || isExternalHref(href)) return 'noopener noreferrer'
  return ''
}

function pagePathFor(
  internalPage: string | null | undefined,
  experiencePageSlug?: string | null,
  lodgePageSlug?: string | null,
): string | null {
  const p = internalPage?.trim()
  if (!p) return null
  switch (p) {
    case 'home':
      return '/'
    case 'experiencesIndex':
      return '/experiences'
    case 'routes':
    case 'routesPage':
      return '/routes'
    case 'lodgesIndex':
      return '/lodges'
    case 'about':
    case 'aboutPage':
      return '/about'
    case 'journal':
      return '/journal'
    case 'privacyPolicy':
      return '/privacy-policy'
    case 'experiencePage': {
      const slug = experiencePageSlug?.trim()
      return slug ? `/experiences/${slug}` : null
    }
    case 'lodgePage': {
      const slug = lodgePageSlug?.trim()
      return slug ? `/lodges/${slug}` : null
    }
    default:
      return null
  }
}

function validateHttpUrl(raw: string | null | undefined): string | null {
  const t = raw?.trim()
  if (!t) return null
  try {
    const u = new URL(t)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    return u.toString()
  } catch {
    return null
  }
}

function digitsForWa(raw: string | null | undefined): string | null {
  const t = raw?.trim()
  if (!t) return null
  const d = t.replace(/\D/g, '')
  return d.length > 0 ? d : null
}

function buildWhatsAppHref(number: string, message?: string | null): string {
  const base = `https://wa.me/${number}`
  const msg = message?.trim()
  if (!msg) return base
  return `${base}?text=${encodeURIComponent(msg)}`
}

function resolveBookingSmartLink(
  doc: SmartLinkGroq,
  label: string,
  fallback: ResolvedSmartLink,
  options?: ResolveSmartLinkOptions,
): ResolvedSmartLink {
  const mode = doc.bookingMode?.trim() === 'specific' ? 'specific' : 'general'

  if (mode === 'general') {
    return {
      label,
      href: '#',
      openInNewTab: false,
      rel: '',
      bookingModal: 'plan',
    }
  }

  const fromRef = buildBookingSummaryFromCmsExperience(doc.bookingExperience ?? null)
  const summary = fromRef ?? options?.pageBookingSummary ?? null
  if (summary) {
    return {
      label,
      href: '#',
      openInNewTab: false,
      rel: '',
      bookingModal: 'experience',
      bookingSummary: summary,
    }
  }

  const u = validateHttpUrl(doc.bookFallbackUrl)
  const href = u || fallback.href
  return {
    label,
    href,
    openInNewTab: doc.openInNewTab === true,
    rel: computeRel(href, doc.openInNewTab === true),
  }
}

/** Core resolver: returns fallback when smart link is incomplete or invalid. @internal */
function resolveSmartLink(
  doc: SmartLinkGroq | null | undefined,
  fallback: ResolvedSmartLink,
  options?: ResolveSmartLinkOptions,
): ResolvedSmartLink {
  const label = doc?.label?.trim() || fallback.label
  const linkType = doc?.linkType?.trim() || 'websitePage'

  let href = ''
  let openInNewTab = doc?.openInNewTab === true

  if (linkType === 'externalUrl') {
    const u = validateHttpUrl(doc?.externalUrl)
    href = u || fallback.href
    if (doc?.openInNewTab != null) openInNewTab = doc.openInNewTab === true
    else openInNewTab = true
  } else if (linkType === 'file') {
    const u = doc?.fileUrl?.trim()
    href = u || fallback.href
    if (doc?.openInNewTab != null) openInNewTab = doc.openInNewTab === true
    else openInNewTab = true
  } else if (linkType === 'email') {
    const addr = doc?.emailAddress?.trim()
    href = addr ? `mailto:${addr}` : fallback.href
    openInNewTab = openInNewTab || false
  } else if (linkType === 'whatsapp') {
    const n = digitsForWa(doc?.whatsappNumber)
    href = n ? buildWhatsAppHref(n, doc?.whatsappMessage) : fallback.href
    if (doc?.openInNewTab != null) openInNewTab = doc.openInNewTab === true
    else openInNewTab = true
  } else if (linkType === 'samePageSection') {
    const id = sanitizeSectionId(doc?.samePageSectionId || doc?.sectionId)
    href = id ? `#${id}` : ''
  } else if (linkType === 'book' || linkType === 'booking') {
    return resolveBookingSmartLink(doc!, label, fallback, options)
  } else if (linkType === 'websitePage' || linkType === 'internalPage' || linkType === 'pageSection') {
    const base = pagePathFor(doc?.internalPage, doc?.experiencePageSlug, doc?.lodgePageSlug)
    const hash = sanitizeSectionId(doc?.websitePageSectionId ?? doc?.sectionId)
    if (base) {
      href = hash ? `${base}#${hash}` : base
    }
    if (linkType === 'pageSection' && base && !hash) {
      href = fallback.href
    }
  } else {
    href = fallback.href
  }

  if (!href?.trim()) href = fallback.href

  const rel = computeRel(href, openInNewTab)
  return { label, href, openInNewTab, rel }
}

/** Maps legacy `linkWithLabel` (or label+href pairs) to the same shape as `resolveSmartLink`. @internal */
function resolveLegacyLinkWithLabel(
  legacy: LegacyLinkWithLabel | null | undefined,
  fallbackLabel: string,
  fallbackHref: string,
  fallbackOpenInNewTab?: boolean,
): ResolvedSmartLink {
  const label = legacy?.label?.trim() || fallbackLabel
  const href = legacy?.href?.trim() || fallbackHref
  const openInNewTab = legacy?.openInNewTab === true || fallbackOpenInNewTab === true
  return { label, href, openInNewTab, rel: computeRel(href, openInNewTab) }
}

/** CMS “Show on site” off — callers must not fall back to legacy or static defaults for that control. */
export function smartLinkIsDisabled(smart: SmartLinkGroq | null | undefined): boolean {
  return Boolean(smart && typeof smart === 'object' && smart.enabled === false)
}

function smartLinkIsPresent(smart: SmartLinkGroq | null | undefined): boolean {
  if (!smart || typeof smart !== 'object') return false
  if (smart.enabled === false) return false
  const lt = smart.linkType?.trim()
  if (lt === 'book' || lt === 'booking') return true
  return Boolean(smart.label?.trim())
}

/**
 * Prefer `smartLink` when it is enabled and has a label; otherwise legacy `linkWithLabel`; then static fallback.
 * Returns `null` when the smart link exists and `enabled === false` (hidden CTA) — never use legacy in that case.
 */
export function resolveSmartLinkOrLegacy(
  smart: SmartLinkGroq | null | undefined,
  legacy: LegacyLinkWithLabel | null | undefined,
  fallback: { label: string; href: string; openInNewTab?: boolean },
  options?: ResolveSmartLinkOptions,
): ResolvedSmartLink | null {
  if (smartLinkIsDisabled(smart)) return null

  const fbResolved: ResolvedSmartLink = {
    label: fallback.label,
    href: fallback.href,
    openInNewTab: fallback.openInNewTab === true,
    rel: computeRel(fallback.href, fallback.openInNewTab === true),
  }

  if (smartLinkIsPresent(smart)) {
    const r = resolveSmartLink(smart!, fbResolved, options)
    if (r.bookingModal) return r
    if (r.href && r.href !== '#') return r
  }
  return resolveLegacyLinkWithLabel(legacy, fallback.label, fallback.href, fallback.openInNewTab)
}
