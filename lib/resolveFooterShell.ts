import {
  FOOTER,
  FOOTER_CONTACT_LINKS,
  FOOTER_EXPLORE_LINKS,
  FOOTER_LEGAL_LINKS,
  SOCIAL,
  type SiteSettingsApprovedLink,
} from '@/data/cmsApproved/siteSettingsApprovedContent'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'
import { resolveSmartLinkOrLegacy, smartLinkIsDisabled } from '@/lib/resolveSmartLink'

export type FooterShellLink = {
  label: string
  /** `null` = render label as plain text (no destination). */
  href: string | null
  openInNewTab: boolean
  rel: string
}

export type FooterLinksColumnResolved = {
  title: string
  links: FooterShellLink[]
}

export type FooterCredentialResolved = {
  label: string
  href: string | null
  openInNewTab: boolean
  rel: string
}

export type FooterBrandColumnResolved = {
  showBrandDeco: boolean
  tagline: string
  descriptionLine1: string
  descriptionLine2: string
  footerLogo: unknown
  footerLogoFullHorizontal: unknown
}

export type FooterBottomBarResolved = {
  leftText: string
  credentials: FooterCredentialResolved[]
}

export type FooterSocialItemRow = {
  icon?: unknown
  alt?: string | null
  smartLink?: SmartLinkGroq | null
} | null

export type FooterSocialItemResolved = {
  iconUrl: string
  alt: string
  href: string | null
}

export type ResolvedFooterShell = {
  brand: FooterBrandColumnResolved
  /** Link columns 2–4 (column 1 is `brand`). */
  columns: [
    FooterLinksColumnResolved,
    FooterLinksColumnResolved,
    FooterLinksColumnResolved,
  ]
  bottomBar: FooterBottomBarResolved
  socialMedia: FooterSocialItemResolved[]
}

export type FooterImageUrlFn = (source: unknown) => string | null

export type FooterLinkItemRow = {
  label?: string | null
  smartLink?: SmartLinkGroq | null
  href?: string | null
  openInNewTab?: boolean | null
}

export type FooterLinksColumnRow = {
  title?: string | null
  links?: FooterLinkItemRow[] | null
} | null

export type FooterBrandColumnRow = {
  footerLogo?: unknown
  footerLogoFullHorizontal?: unknown
  showBrandDeco?: boolean | null
  tagline?: string | null
  descriptionLine1?: string | null
  descriptionLine2?: string | null
  descriptionLines?: string[] | null
} | null

export type FooterCredentialRow = {
  label?: string | null
  smartLink?: SmartLinkGroq | null
} | null

export type FooterBottomBarRow = {
  leftText?: string | null
  credentials?: FooterCredentialRow[] | null
} | null

export type LegacyFooterBlockRow = {
  footerLogo?: unknown
  footerLogoFullHorizontal?: unknown
  showBrandDeco?: boolean | null
  tagline?: string | null
  descriptionLines?: string[] | null
  exploreTitle?: string | null
  exploreLinks?: FooterLinkItemRow[] | null
  contactTitle?: string | null
  contactLinks?: FooterLinkItemRow[] | null
  legalLinks?: FooterLinkItemRow[] | null
  footerCertText?: string[] | null
} | null

export type FooterSettingsDocumentRow = {
  column1?: FooterBrandColumnRow
  column2?: FooterLinksColumnRow
  column3?: FooterLinksColumnRow
  column4?: FooterLinksColumnRow
  bottomBar?: FooterBottomBarRow
  footer?: LegacyFooterBlockRow
  copyright?: string | null
  defaultWhatsappUrl?: string | null
  socialMedia?: FooterSocialItemRow[] | null
  /** @deprecated Legacy text social links — use `socialMedia`. */
  socialLinks?: FooterLinkItemRow[] | null
} | null

export type LegacySiteSettingsFooterRow = {
  footer?: LegacyFooterBlockRow
  copyright?: string | null
  defaultWhatsappUrl?: string | null
  socialLinks?: FooterLinkItemRow[] | null
} | null

export function hasFooterSettingsDocument(
  doc: FooterSettingsDocumentRow | undefined | null,
): boolean {
  return Boolean(doc && typeof doc === 'object')
}

/** Split link columns into two vertical lists when CMS has 6–10 links. */
export function splitFooterColumnLinks(links: FooterShellLink[]): {
  primary: FooterShellLink[]
  secondary: FooterShellLink[]
} {
  if (links.length <= 5) {
    return { primary: links, secondary: [] }
  }
  return { primary: links.slice(0, 5), secondary: links.slice(5, 10) }
}

function mapApprovedLinks(fallback: SiteSettingsApprovedLink[]): FooterShellLink[] {
  return fallback.map((x) => ({
    label: x.label,
    href: x.href,
    openInNewTab: x.openInNewTab,
    rel: x.openInNewTab ? 'noopener noreferrer' : '',
  }))
}

function resolveFooterLinkItem(item: FooterLinkItemRow): FooterShellLink | null {
  const label = item?.label?.trim() ?? ''
  if (!label) return null
  if (smartLinkIsDisabled(item?.smartLink)) return null

  const legacyHref = item?.href?.trim() ?? ''
  const resolved = resolveSmartLinkOrLegacy(
    item?.smartLink,
    { label, href: legacyHref, openInNewTab: item?.openInNewTab },
    { label, href: legacyHref || '#', openInNewTab: Boolean(item?.openInNewTab) },
  )

  let href: string | null = null
  let openInNewTab = false
  let rel = ''

  if (resolved?.href && resolved.href !== '#') {
    href = resolved.href
    openInNewTab = resolved.openInNewTab
    rel = resolved.rel
  } else if (legacyHref) {
    href = legacyHref
    openInNewTab = Boolean(item?.openInNewTab)
    rel = openInNewTab ? 'noopener noreferrer' : ''
  }

  return {
    label: resolved?.label?.trim() || label,
    href,
    openInNewTab,
    rel,
  }
}

function mapFooterLinks(
  items: FooterLinkItemRow[] | null | undefined,
  fallback: SiteSettingsApprovedLink[],
  useApprovedFallback: boolean,
): FooterShellLink[] {
  if (!items?.length) {
    return useApprovedFallback ? mapApprovedLinks(fallback) : []
  }
  const out: FooterShellLink[] = []
  for (const item of items) {
    const row = resolveFooterLinkItem(item)
    if (row) out.push(row)
  }
  if (!out.length && useApprovedFallback) {
    return mapApprovedLinks(fallback)
  }
  return out
}

function resolveFooterSocialMedia(
  items: FooterSocialItemRow[] | null | undefined,
  imageUrl: FooterImageUrlFn,
): FooterSocialItemResolved[] {
  if (!items?.length) return []
  const out: FooterSocialItemResolved[] = []
  for (const item of items) {
    if (!item || typeof item !== 'object') continue
    const iconUrl = imageUrl(item.icon)
    if (!iconUrl) continue
    const alt = item.alt?.trim() ?? ''
    if (!alt) continue

    let href: string | null = null
    const smart = item.smartLink
    if (smart && !smartLinkIsDisabled(smart)) {
      const resolved = resolveSmartLinkOrLegacy(smart, null, {
        label: alt,
        href: '#',
        openInNewTab: true,
      })
      if (resolved?.href && resolved.href !== '#') {
        href = resolved.href
      }
    }

    out.push({ iconUrl, alt, href })
  }
  return out
}

function columnHasContent(col: FooterLinksColumnRow | undefined): boolean {
  if (!col) return false
  return Boolean(col.title?.trim() || col.links?.length)
}

function resolveLinksColumn(
  col: FooterLinksColumnRow | undefined,
  legacy: { title?: string | null; links?: FooterLinkItemRow[] | null },
  fallbacks: { title: string; links: SiteSettingsApprovedLink[] },
  useApprovedFallback: boolean,
): FooterLinksColumnResolved {
  const fromNew = columnHasContent(col)
  const title = (fromNew ? col?.title : legacy.title)?.trim() || fallbacks.title
  const links = fromNew
    ? mapFooterLinks(col?.links, fallbacks.links, false)
    : mapFooterLinks(legacy.links, fallbacks.links, useApprovedFallback)
  return { title, links }
}

function resolveBrandColumn(
  col: FooterBrandColumnRow | undefined,
  legacy: LegacyFooterBlockRow,
  useApprovedFallback: boolean,
): FooterBrandColumnResolved {
  const src = col ?? legacy
  const lines = col?.descriptionLines ?? legacy?.descriptionLines
  const line1 =
    col?.descriptionLine1?.trim() ||
    (Array.isArray(lines) ? lines[0]?.trim() : '') ||
    (useApprovedFallback ? FOOTER.descriptionLines[0] : '')
  const line2 =
    col?.descriptionLine2?.trim() ||
    (Array.isArray(lines) ? lines[1]?.trim() : '') ||
    (useApprovedFallback ? FOOTER.descriptionLines[1] : '')

  return {
    footerLogo: col?.footerLogo ?? legacy?.footerLogo ?? null,
    footerLogoFullHorizontal:
      col?.footerLogoFullHorizontal ?? legacy?.footerLogoFullHorizontal ?? null,
    showBrandDeco: (src?.showBrandDeco ?? legacy?.showBrandDeco) !== false,
    tagline:
      src?.tagline?.trim() || (useApprovedFallback ? FOOTER.tagline : ''),
    descriptionLine1: line1,
    descriptionLine2: line2,
  }
}

function mapCredentialsFromText(lines: string[] | null | undefined): FooterCredentialResolved[] {
  if (!lines?.length) return []
  return lines
    .map((s) => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean)
    .map((label) => ({ label, href: null, openInNewTab: false, rel: '' }))
}

function mapCredentials(
  items: FooterCredentialRow[] | null | undefined,
  legacyText: string[] | null | undefined,
  useApprovedFallback: boolean,
): FooterCredentialResolved[] {
  if (items?.length) {
    const out: FooterCredentialResolved[] = []
    for (const item of items) {
      const label = item?.label?.trim() ?? ''
      if (!label) continue
      let href: string | null = null
      let openInNewTab = false
      let rel = ''
      let displayLabel = label

      const smart = item?.smartLink
      if (smart && !smartLinkIsDisabled(smart)) {
        const resolved = resolveSmartLinkOrLegacy(smart, null, {
          label,
          href: '#',
          openInNewTab: false,
        })
        if (resolved?.href && resolved.href !== '#') {
          href = resolved.href
          openInNewTab = resolved.openInNewTab
          rel = resolved.rel
          displayLabel = resolved.label || label
        }
      }

      out.push({ label: displayLabel, href, openInNewTab, rel })
    }
    if (out.length) return out
  }

  const fromLegacy = mapCredentialsFromText(legacyText)
  if (fromLegacy.length) return fromLegacy
  return useApprovedFallback
    ? FOOTER.footerCertText.map((label) => ({
        label,
        href: null,
        openInNewTab: false,
        rel: '',
      }))
    : []
}

function resolveBottomBar(
  bar: FooterBottomBarRow | undefined,
  legacyCopyright: string | null | undefined,
  legacyCertText: string[] | null | undefined,
  useApprovedFallback: boolean,
): FooterBottomBarResolved {
  const leftFromNew = bar?.leftText?.trim()
  const leftText =
    leftFromNew ||
    legacyCopyright?.trim() ||
    (useApprovedFallback ? SOCIAL.copyright : '')

  const credentials = mapCredentials(
    bar?.credentials,
    legacyCertText,
    useApprovedFallback,
  )

  return { leftText, credentials }
}

function legacyBlockFromDoc(doc: FooterSettingsDocumentRow): LegacyFooterBlockRow {
  return doc?.footer ?? null
}

/**
 * Footer shell: `footerSettings` document when present (no siteSettings footer merge).
 * Falls back to legacy `siteSettings` + approved defaults when the document is missing.
 */
export function resolveFooterShell(
  footerSettings: FooterSettingsDocumentRow | null | undefined,
  legacySiteSettings: LegacySiteSettingsFooterRow | null | undefined,
  imageUrl: FooterImageUrlFn = () => null,
): ResolvedFooterShell {
  const useApproved = !hasFooterSettingsDocument(footerSettings)
  const legacyFooter = legacySiteSettings?.footer ?? null

  if (hasFooterSettingsDocument(footerSettings)) {
    const doc = footerSettings!
    const nested = legacyBlockFromDoc(doc)

    const brand = resolveBrandColumn(doc.column1, nested, false)
    const columns: ResolvedFooterShell['columns'] = [
      resolveLinksColumn(
        doc.column2,
        { title: nested?.exploreTitle, links: nested?.exploreLinks },
        { title: '', links: [] },
        false,
      ),
      resolveLinksColumn(
        doc.column3,
        { title: nested?.contactTitle, links: nested?.contactLinks },
        { title: '', links: [] },
        false,
      ),
      resolveLinksColumn(
        doc.column4,
        {
          title: nested?.legalLinks?.length ? 'Legal' : null,
          links: nested?.legalLinks,
        },
        { title: '', links: [] },
        false,
      ),
    ]
    const bottomBar = resolveBottomBar(
      doc.bottomBar,
      doc.copyright,
      nested?.footerCertText,
      false,
    )
    const socialMedia = resolveFooterSocialMedia(doc.socialMedia, imageUrl)

    return { brand, columns, bottomBar, socialMedia }
  }

  const brand = resolveBrandColumn(null, legacyFooter, useApproved)
  const columns: ResolvedFooterShell['columns'] = [
    resolveLinksColumn(
      null,
      { title: legacyFooter?.exploreTitle, links: legacyFooter?.exploreLinks },
      { title: FOOTER.exploreTitle, links: FOOTER_EXPLORE_LINKS },
      useApproved,
    ),
    resolveLinksColumn(
      null,
      { title: legacyFooter?.contactTitle, links: legacyFooter?.contactLinks },
      { title: FOOTER.contactTitle, links: FOOTER_CONTACT_LINKS },
      useApproved,
    ),
    resolveLinksColumn(
      null,
      { title: 'Legal', links: legacyFooter?.legalLinks },
      { title: 'Legal', links: FOOTER_LEGAL_LINKS },
      useApproved,
    ),
  ]
  const bottomBar = resolveBottomBar(
    null,
    legacySiteSettings?.copyright,
    legacyFooter?.footerCertText,
    useApproved,
  )
  const socialMedia = resolveFooterSocialMedia(null, imageUrl)

  return { brand, columns, bottomBar, socialMedia }
}

export function mergeFooterWhatsappAndSocial(
  footerSettings: FooterSettingsDocumentRow | null | undefined,
  legacy: LegacySiteSettingsFooterRow | null | undefined,
): {
  defaultWhatsappUrl: string | null
  socialLinks: FooterLinkItemRow[] | null
} {
  const useNext = hasFooterSettingsDocument(footerSettings)
  if (useNext) {
    return {
      defaultWhatsappUrl: footerSettings?.defaultWhatsappUrl?.trim() || null,
      socialLinks: footerSettings?.socialLinks ?? null,
    }
  }
  return {
    defaultWhatsappUrl:
      footerSettings?.defaultWhatsappUrl?.trim() ||
      legacy?.defaultWhatsappUrl?.trim() ||
      null,
    socialLinks: legacy?.socialLinks ?? footerSettings?.socialLinks ?? null,
  }
}

export function mergeFooterLogoFromResolved(
  brand: FooterBrandColumnResolved,
  headerLogoPrimary: unknown,
): { footerLogo: unknown } {
  const footerLogo =
    brand.footerLogo ??
    brand.footerLogoFullHorizontal ??
    headerLogoPrimary ??
    null
  return { footerLogo }
}
