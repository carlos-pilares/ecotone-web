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
import {
  mergeFooterLogoFields,
  mergeFooterShellFields,
  type FooterSettingsDocumentRow,
} from '@/lib/mergeFooterSettings'
import {
  hasHeaderSettingsDoc,
  mergeHeaderShellFields,
  type HeaderSettingsDocumentRow,
  type LegacySiteSettingsHeaderRow,
} from '@/lib/mergeHeaderSettings'
import { siteSettingsShellQuery } from '@/lib/queries'
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

type SiteSettingsShellBundleRow = {
  headerSettings?: HeaderSettingsDocumentRow
  footerSettings?: FooterSettingsDocumentRow
  legacySiteSettings?: {
    defaultWhatsappUrl?: string | null
    brandIsotipo?: SanityImageSource | null
    copyright?: string | null
    socialLinks?: Array<{ label?: string; href?: string; openInNewTab?: boolean }> | null
    header?: LegacySiteSettingsHeaderRow
    footer?: NonNullable<FooterSettingsDocumentRow>['footer']
  } | null
} | null

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
  raw: { label?: string; href?: string; openInNewTab?: boolean } | null | undefined,
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

function pickBookNowPrimaryCta(
  shell: ReturnType<typeof mergeHeaderShellFields>,
  headerSettingsOnly: boolean,
): ShellNavLink {
  const fallback = HEADER.primaryCta
  if (headerSettingsOnly) {
    const resolved = shell.navBookNowSmartLink
      ? resolveSmartLinkOrLegacy(shell.navBookNowSmartLink, undefined, {
          label: '',
          href: '#',
          openInNewTab: false,
        })
      : null
    if (resolved?.href && resolved.href !== '#') {
      const label = shell.navBookNowSmartLink?.label?.trim() || resolved.label
      if (label) {
        return {
          label,
          href: resolved.href,
          openInNewTab: resolved.openInNewTab,
        }
      }
    }
    return { label: '', href: '#', openInNewTab: false }
  }
  const resolved = resolveSmartLinkOrLegacy(shell.navBookNowSmartLink, shell.primaryCta, {
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
  return pickPrimaryCta(shell.primaryCta)
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
 * Logos + header CTA from `headerSettings` (fallback: legacy `siteSettings.header`).
 * Footer + social from `footerSettings` (fallback: legacy `siteSettings`).
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

  let bundle: SiteSettingsShellBundleRow
  try {
    bundle = await clientServer.fetch<SiteSettingsShellBundleRow>(siteSettingsShellQuery)
  } catch {
    return empty
  }
  if (!bundle) {
    return empty
  }

  const legacy = bundle.legacySiteSettings
  const headerDoc = bundle.headerSettings ?? null
  const headerFound = hasHeaderSettingsDoc(headerDoc)
  const headerShell = mergeHeaderShellFields(
    headerDoc,
    headerFound ? null : (legacy?.header ?? null),
  )
  const footerMerged = mergeFooterShellFields(bundle.footerSettings ?? null, {
    footer: legacy?.footer,
    socialLinks: legacy?.socialLinks,
    copyright: legacy?.copyright,
    defaultWhatsappUrl: legacy?.defaultWhatsappUrl,
  })
  const footerLogo = mergeFooterLogoFields(
    bundle.footerSettings ?? null,
    { footer: legacy?.footer },
    headerShell.headerLogoLight,
  )

  const ft = footerMerged.footer
  const defaultWa = footerMerged.defaultWhatsappUrl?.trim() || legacy?.defaultWhatsappUrl?.trim() || null

  return {
    defaultWhatsappUrl: defaultWa,
    headerLogoLightUrl: toUrl(headerShell.headerLogoLight as SanityImageSource),
    headerLogoDarkUrl: toUrl(headerShell.headerLogoDark as SanityImageSource),
    footerLogoUrl: toUrl(footerLogo.footerLogo as SanityImageSource),
    brandIsotipoUrl: toUrl(legacy?.brandIsotipo),
    homePath: headerShell.homePath?.trim() || HEADER.homePath,
    mainNav: mapLinkList(legacy?.header?.mainNav ?? null, HEADER_MAIN_NAV),
    primaryCta: pickBookNowPrimaryCta(headerShell, headerFound),
    mobileMenuAriaLabel: headerShell.mobileMenuAriaLabel?.trim() || HEADER.mobileMenuAriaLabel,
    footer: {
      showBrandDeco: ft?.showBrandDeco !== false,
      tagline: ft?.tagline?.trim() || FOOTER.tagline,
      descriptionLines: pickStringLines(ft?.descriptionLines ?? null, FOOTER.descriptionLines),
      exploreTitle: ft?.exploreTitle?.trim() || FOOTER.exploreTitle,
      exploreLinks: mapLinkList(ft?.exploreLinks, FOOTER_EXPLORE_LINKS),
      contactTitle: ft?.contactTitle?.trim() || FOOTER.contactTitle,
      contactLinks: mapLinkList(ft?.contactLinks, FOOTER_CONTACT_LINKS),
    },
    copyright: footerMerged.copyright?.trim() || SOCIAL.copyright,
    footerCertText: pickCertText(ft?.footerCertText ?? null),
  }
})
