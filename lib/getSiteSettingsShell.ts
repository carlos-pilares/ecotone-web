import { cache } from 'react'
import type { SanityImageSource } from '@sanity/image-url'

import {
  FOOTER,
  FOOTER_CONTACT_LINKS,
  FOOTER_EXPLORE_LINKS,
  HEADER,
  HEADER_MAIN_NAV,
  SOCIAL,
  type SiteSettingsApprovedLink,
} from '@/data/cmsApproved/siteSettingsApprovedContent'
import { siteSettingsShellQuery, type SiteSettingsShellRow } from '@/lib/queries'
import { resolveSmartLinkOrLegacy } from '@/lib/resolveSmartLink'
import { clientServer, urlFor } from '@/lib/sanity'

export type ShellNavLink = {
  label: string
  href: string
  openInNewTab: boolean
}

export type GlobalSiteSettingsShell = {
  /** Site-wide fallback when Home booking / explorer omit WhatsApp URL. */
  defaultWhatsappUrl: string | null
  headerLogoLightUrl: string | null
  headerLogoDarkUrl: string | null
  footerLogoUrl: string | null
  brandIsotipoUrl: string | null
  homePath: string
  mainNav: ShellNavLink[]
  primaryCta: ShellNavLink
  mobileMenuAriaLabel: string
  footer: {
    showBrandDeco: boolean
    tagline: string
    descriptionLines: string[]
    exploreTitle: string
    exploreLinks: ShellNavLink[]
    contactTitle: string
    contactLinks: ShellNavLink[]
  }
  copyright: string
  footerCertText: string[]
}

function toUrl(source: SanityImageSource | null | undefined): string | null {
  if (!source) return null
  try {
    return urlFor(source).width(720).quality(90).url() || null
  } catch {
    return null
  }
}

function mapLinkList(
  raw: Array<{ label?: string; href?: string; openInNewTab?: boolean }> | null | undefined,
  fallbacks: SiteSettingsApprovedLink[],
): ShellNavLink[] {
  if (!raw?.length) {
    return fallbacks.map((x) => ({ label: x.label, href: x.href, openInNewTab: x.openInNewTab }))
  }
  const out: ShellNavLink[] = []
  for (const item of raw) {
    const label = typeof item?.label === 'string' ? item.label.trim() : ''
    const href = typeof item?.href === 'string' ? item.href.trim() : ''
    if (!label || !href) continue
    out.push({
      label,
      href,
      openInNewTab: Boolean(item.openInNewTab),
    })
  }
  if (!out.length) {
    return fallbacks.map((x) => ({ label: x.label, href: x.href, openInNewTab: x.openInNewTab }))
  }
  return out
}

function pickPrimaryCta(
  raw: NonNullable<SiteSettingsShellRow>['primaryCta'],
): ShellNavLink {
  const label = raw?.label?.trim()
  const href = raw?.href?.trim()
  if (label && href) {
    return { label, href, openInNewTab: Boolean(raw?.openInNewTab) }
  }
  return {
    label: HEADER.primaryCta.label,
    href: HEADER.primaryCta.href,
    openInNewTab: HEADER.primaryCta.openInNewTab,
  }
}

function pickBookNowPrimaryCta(row: NonNullable<SiteSettingsShellRow>): ShellNavLink {
  const fallback = HEADER.primaryCta
  const resolved = resolveSmartLinkOrLegacy(row.navBookNowSmartLink, row.primaryCta, {
    label: fallback.label,
    href: fallback.href,
    openInNewTab: fallback.openInNewTab,
  })
  if (resolved) {
    return {
      label: resolved.label,
      href: resolved.href,
      openInNewTab: resolved.openInNewTab,
    }
  }
  return pickPrimaryCta(row.primaryCta)
}

function pickStringLines(
  raw: string[] | null | undefined,
  fallback: readonly string[] | string[],
): string[] {
  if (!raw?.length) return [...fallback]
  const lines = raw.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean)
  return lines.length ? lines : [...fallback]
}

function pickCertText(raw: string[] | null | undefined): string[] {
  if (!raw?.length) return [...FOOTER.footerCertText]
  const lines = raw.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean)
  return lines.length ? lines : [...FOOTER.footerCertText]
}

/**
 * Single cached fetch: logos + header/footer copy for the global shell.
 * When Sanity is off, fetch fails, or fields are empty, values match the previous hardcoded shell
 * (see `data/cmsApproved/siteSettingsApprovedContent.ts`).
 */
export const getSiteSettingsShell = cache(async (): Promise<GlobalSiteSettingsShell> => {
  const empty: GlobalSiteSettingsShell = {
    defaultWhatsappUrl: null,
    headerLogoLightUrl: null,
    headerLogoDarkUrl: null,
    footerLogoUrl: null,
    brandIsotipoUrl: null,
    homePath: HEADER.homePath,
    mainNav: HEADER_MAIN_NAV.map((x) => ({ label: x.label, href: x.href, openInNewTab: x.openInNewTab })),
    primaryCta: {
      label: HEADER.primaryCta.label,
      href: HEADER.primaryCta.href,
      openInNewTab: HEADER.primaryCta.openInNewTab,
    },
    mobileMenuAriaLabel: HEADER.mobileMenuAriaLabel,
    footer: {
      showBrandDeco: FOOTER.showBrandDeco,
      tagline: FOOTER.tagline,
      descriptionLines: [...FOOTER.descriptionLines],
      exploreTitle: FOOTER.exploreTitle,
      exploreLinks: FOOTER_EXPLORE_LINKS.map((x) => ({ label: x.label, href: x.href, openInNewTab: x.openInNewTab })),
      contactTitle: FOOTER.contactTitle,
      contactLinks: FOOTER_CONTACT_LINKS.map((x) => ({ label: x.label, href: x.href, openInNewTab: x.openInNewTab })),
    },
    copyright: SOCIAL.copyright,
    footerCertText: [...FOOTER.footerCertText],
  }

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return empty
  }

  let row: SiteSettingsShellRow
  try {
    row = await clientServer.fetch<SiteSettingsShellRow>(siteSettingsShellQuery)
  } catch {
    return empty
  }
  if (!row) {
    return empty
  }

  const ft = row.footer
  const defaultWa = row.defaultWhatsappUrl?.trim() || null
  return {
    defaultWhatsappUrl: defaultWa,
    headerLogoLightUrl: toUrl(row.headerLogoLight),
    headerLogoDarkUrl: toUrl(row.headerLogoDark),
    footerLogoUrl: toUrl(row.footerLogo),
    brandIsotipoUrl: toUrl(row.brandIsotipo),
    homePath: row.homePath?.trim() || HEADER.homePath,
    mainNav: mapLinkList(row.mainNav, HEADER_MAIN_NAV),
    primaryCta: pickBookNowPrimaryCta(row),
    mobileMenuAriaLabel: row.mobileMenuAriaLabel?.trim() || HEADER.mobileMenuAriaLabel,
    footer: {
      showBrandDeco: ft?.showBrandDeco !== false,
      tagline: ft?.tagline?.trim() || FOOTER.tagline,
      descriptionLines: pickStringLines(ft?.descriptionLines ?? null, FOOTER.descriptionLines),
      exploreTitle: ft?.exploreTitle?.trim() || FOOTER.exploreTitle,
      exploreLinks: mapLinkList(ft?.exploreLinks, FOOTER_EXPLORE_LINKS),
      contactTitle: ft?.contactTitle?.trim() || FOOTER.contactTitle,
      contactLinks: mapLinkList(ft?.contactLinks, FOOTER_CONTACT_LINKS),
    },
    copyright: row.copyright?.trim() || SOCIAL.copyright,
    footerCertText: pickCertText(row.footerCertText),
  }
})
