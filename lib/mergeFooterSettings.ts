import { FOOTER, FOOTER_CONTACT_LINKS, FOOTER_EXPLORE_LINKS, SOCIAL } from '@/data/cmsApproved/siteSettingsApprovedContent'

export type FooterBlockRow = {
  showBrandDeco?: boolean | null
  tagline?: string | null
  descriptionLines?: string[] | null
  exploreTitle?: string | null
  exploreLinks?: Array<{ label?: string; href?: string; openInNewTab?: boolean }> | null
  contactTitle?: string | null
  contactLinks?: Array<{ label?: string; href?: string; openInNewTab?: boolean }> | null
  legalLinks?: Array<{ label?: string; href?: string; openInNewTab?: boolean }> | null
  footerCertText?: string[] | null
  footerCertPartners?: unknown
  footerLogo?: unknown
  footerLogoFullHorizontal?: unknown
}

export type FooterSettingsDocumentRow = {
  footer?: FooterBlockRow | null
  socialLinks?: Array<{ label?: string; href?: string; openInNewTab?: boolean }> | null
  copyright?: string | null
  defaultWhatsappUrl?: string | null
} | null

export type LegacySiteSettingsFooterRow = {
  footer?: FooterBlockRow | null
  socialLinks?: Array<{ label?: string; href?: string; openInNewTab?: boolean }> | null
  copyright?: string | null
  defaultWhatsappUrl?: string | null
} | null

function hasFooterDoc(next: FooterSettingsDocumentRow | undefined | null): boolean {
  return Boolean(next && typeof next === 'object')
}

function pick<T>(next: T | null | undefined, legacy: T | null | undefined): T | null | undefined {
  if (next !== undefined && next !== null) return next
  return legacy
}

/** Footer + social fields: footerSettings first, then legacy siteSettings. */
export function mergeFooterShellFields(
  next: FooterSettingsDocumentRow | null | undefined,
  legacy: LegacySiteSettingsFooterRow | null | undefined,
): {
  defaultWhatsappUrl: string | null
  footer: FooterBlockRow
  copyright: string | null
  socialLinks: FooterSettingsDocumentRow extends infer R ? (R extends { socialLinks?: infer S } ? S : null) : null
} {
  const useNext = hasFooterDoc(next)
  const nextFt = next?.footer
  const legacyFt = legacy?.footer

  const footer: FooterBlockRow = {
    showBrandDeco: pick(nextFt?.showBrandDeco, legacyFt?.showBrandDeco),
    tagline: pick(nextFt?.tagline, legacyFt?.tagline),
    descriptionLines: pick(nextFt?.descriptionLines, legacyFt?.descriptionLines),
    exploreTitle: pick(nextFt?.exploreTitle, legacyFt?.exploreTitle),
    exploreLinks: pick(nextFt?.exploreLinks, legacyFt?.exploreLinks),
    contactTitle: pick(nextFt?.contactTitle, legacyFt?.contactTitle),
    contactLinks: pick(nextFt?.contactLinks, legacyFt?.contactLinks),
    legalLinks: pick(nextFt?.legalLinks, legacyFt?.legalLinks),
    footerCertText: pick(nextFt?.footerCertText, legacyFt?.footerCertText),
    footerCertPartners: pick(nextFt?.footerCertPartners, legacyFt?.footerCertPartners),
    footerLogo: pick(nextFt?.footerLogo, legacyFt?.footerLogo),
    footerLogoFullHorizontal: pick(nextFt?.footerLogoFullHorizontal, legacyFt?.footerLogoFullHorizontal),
  }

  return {
    defaultWhatsappUrl: pick(next?.defaultWhatsappUrl, legacy?.defaultWhatsappUrl) ?? null,
    footer,
    copyright: pick(next?.copyright, legacy?.copyright) ?? null,
    socialLinks: (useNext ? next?.socialLinks : pick(next?.socialLinks, legacy?.socialLinks)) ?? null,
  }
}

export function mergeFooterLogoFields(
  next: FooterSettingsDocumentRow | null | undefined,
  legacy: LegacySiteSettingsFooterRow | null | undefined,
  headerLogoPrimary: unknown,
): {
  footerLogo: unknown
} {
  const nextFt = next?.footer
  const legacyFt = legacy?.footer
  const footerLogo =
    nextFt?.footerLogo ??
    nextFt?.footerLogoFullHorizontal ??
    legacyFt?.footerLogo ??
    legacyFt?.footerLogoFullHorizontal ??
    headerLogoPrimary ??
    null
  return { footerLogo }
}
