import { cache } from 'react'
import type { SanityImageSource } from '@sanity/image-url'

import { HEADER, HEADER_MAIN_NAV, type SiteSettingsApprovedLink } from '@/data/cmsApproved/siteSettingsApprovedContent'
import {
  hasHeaderSettingsDoc,
  mergeHeaderShellFields,
  type HeaderSettingsDocumentRow,
  type LegacySiteSettingsHeaderRow,
} from '@/lib/mergeHeaderSettings'
import {
  hasFooterSettingsDocument,
  mergeFooterLogoFromResolved,
  mergeFooterWhatsappAndSocial,
  resolveFooterShell,
  type FooterSettingsDocumentRow,
  type LegacySiteSettingsFooterRow,
  type ResolvedFooterShell,
} from '@/lib/resolveFooterShell'
import { resolveFloatingWhatsappFromCms, type ResolvedFloatingWhatsapp } from '@/lib/floatingWhatsapp'
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
  footer: ResolvedFooterShell
  floatingWhatsapp: ResolvedFloatingWhatsapp
}

type SiteSettingsShellBundleRow = {
  headerSettings?: HeaderSettingsDocumentRow
  footerSettings?: FooterSettingsDocumentRow
  siteSettingsDoc?: {
    whatsappFloatingEnabled?: boolean | null
    whatsappNumber?: string | null
    whatsappDefaultMessage?: string | null
    whatsappDesktopLabel?: string | null
    whatsappMobileLabel?: string | null
    whatsappFloatingHideOnMobile?: boolean | null
    whatsappFloatingHideOnPages?: string[] | null
  } | null
  legacySiteSettings?: {
    defaultWhatsappUrl?: string | null
    brandIsotipo?: SanityImageSource | null
    copyright?: string | null
    socialLinks?: Array<{ label?: string; href?: string; openInNewTab?: boolean }> | null
    header?: LegacySiteSettingsHeaderRow
    footer?: NonNullable<LegacySiteSettingsFooterRow>['footer']
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

function toFooterImageUrl(source: unknown): string | null {
  if (!source) return null
  try {
    return urlFor(source as SanityImageSource).width(96).height(96).quality(90).url() || null
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

/**
 * Logos + header CTA from `headerSettings` (fallback: legacy `siteSettings.header`).
 * Footer from `footerSettings` when the document exists; else legacy `siteSettings.footer`.
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
    footer: resolveFooterShell(null, null, toFooterImageUrl),
    floatingWhatsapp: resolveFloatingWhatsappFromCms(null, null),
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

  const footerDoc = bundle.footerSettings ?? null
  const footerResolved = resolveFooterShell(
    footerDoc,
    hasFooterSettingsDocument(footerDoc)
      ? null
      : {
          footer: legacy?.footer,
          copyright: legacy?.copyright,
          defaultWhatsappUrl: legacy?.defaultWhatsappUrl,
        },
    toFooterImageUrl,
  )
  const footerSocial = mergeFooterWhatsappAndSocial(
    footerDoc,
    hasFooterSettingsDocument(footerDoc) ? null : legacy,
  )
  const footerLogo = mergeFooterLogoFromResolved(
    footerResolved.brand,
    headerShell.headerLogoLight,
  )

  const defaultWa = footerSocial.defaultWhatsappUrl?.trim() || legacy?.defaultWhatsappUrl?.trim() || null
  const floatingWhatsapp = resolveFloatingWhatsappFromCms(bundle.siteSettingsDoc, defaultWa)

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
    footer: footerResolved,
    floatingWhatsapp,
  }
})
