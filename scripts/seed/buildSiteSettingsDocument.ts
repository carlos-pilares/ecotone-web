/**
 * Builds the fixed-id `siteSettings` document for Sanity: logos from `scripts/seed/brand-assets/`,
 * copy from `data/cmsApproved/siteSettingsApprovedContent.ts` (kept in sync with SiteHeader / SiteFooter).
 *
 * If an empty `drafts.siteSettings` exists, Studio can show the draft (blank) instead of the
 * published `siteSettings` (seeded) — always run `removeSiteSettingsDraft` before
 * `createOrReplace` (see `commitSiteSettingsDocument`).
 */
import { join } from 'node:path'
import type { SanityClient } from '@sanity/client'

import { CMS_IDS } from '@/data/cmsApproved/ids'
import {
  DEFAULT_WHATSAPP_URL,
  FOOTER,
  FOOTER_CONTACT_LINKS,
  FOOTER_EXPLORE_LINKS,
  FOOTER_LEGAL_LINKS,
  HEADER,
  HEADER_MAIN_NAV,
  HEADER_NAV_ABOUT_SMART_LINK,
  HEADER_NAV_BOOK_NOW_SMART_LINK,
  HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT,
  HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK,
  HEADER_NAV_EXPERIENCES_TAILOR_MENU_DEFAULT,
  HEADER_NAV_LODGES_SEE_ALL_BLOCK,
  HEADER_NAV_LODGE_GROUPS_DEFAULT,
  HEADER_NAV_ROUTES_SMART_LINK,
  HEADER_NAV_TAILOR_MADE,
  SITE_DEFAULT_SEO,
  SITE_NAME,
  SOCIAL,
  SOCIAL_LINKS,
  type SiteSettingsApprovedLink,
} from '@/data/cmsApproved/siteSettingsApprovedContent'
import { uploadImageFileFromPath } from './sanityWriteClient.js'

const BRAND_ASSETS_DIR = join(process.cwd(), 'scripts/seed/brand-assets')

const SITE_SETTINGS_PUBLISHED_ID = CMS_IDS.siteSettings
const SITE_SETTINGS_DRAFT_ID = 'drafts.siteSettings' as const

/** Matches `sanity/schemaTypes/objects/seo.js` (validation max). */
function clipSeoTitle(s: string) {
  return s.length > 70 ? s.slice(0, 70) : s
}
function clipSeoDescription(s: string) {
  return s.length > 200 ? s.slice(0, 200) : s
}

function linkWithLabel(x: SiteSettingsApprovedLink) {
  return {
    _key: x._key,
    _type: 'linkWithLabel' as const,
    label: x.label,
    href: x.href,
    openInNewTab: x.openInNewTab,
  }
}

function mapLinks(list: readonly SiteSettingsApprovedLink[]) {
  return list.map(linkWithLabel)
}

/**
 * Uploads the cream horizontal, brown horizontal (solid bar), and library marks; returns a full `siteSettings` payload.
 */
export async function buildSiteSettingsDocument(client: SanityClient) {
  const logoCream = await uploadImageFileFromPath(
    client,
    join(BRAND_ASSETS_DIR, 'logo-full-horizontal.svg'),
    'ecotone-logo-full-horizontal-cream.svg',
  )
  const logoBrown = await uploadImageFileFromPath(
    client,
    join(BRAND_ASSETS_DIR, 'logo-full-horizontal-906730.svg'),
    'ecotone-logo-full-horizontal-906730.svg',
  )
  const brandIsotipo = await uploadImageFileFromPath(
    client,
    join(BRAND_ASSETS_DIR, 'isotipo.svg'),
    'ecotone-isotipo.svg',
  )
  const brandLogoFullVertical = await uploadImageFileFromPath(
    client,
    join(BRAND_ASSETS_DIR, 'logo-full-vertical.svg'),
    'ecotone-logo-full-vertical.svg',
  )
  const brandLogoNombre = await uploadImageFileFromPath(
    client,
    join(BRAND_ASSETS_DIR, 'logo-nombre.svg'),
    'ecotone-logo-nombre.svg',
  )

  return {
    _id: SITE_SETTINGS_PUBLISHED_ID,
    _type: 'siteSettings' as const,
    siteName: SITE_NAME,
    defaultSeo: {
      _type: 'seo' as const,
      title: clipSeoTitle(SITE_DEFAULT_SEO.title),
      description: clipSeoDescription(SITE_DEFAULT_SEO.description),
    },
    brandIsotipo,
    brandLogoFullVertical,
    brandLogoNombre,
    header: {
      headerLogoFullHorizontal: logoCream,
      headerLogoLight: logoCream,
      headerLogoDark: logoBrown,
      homePath: HEADER.homePath,
      mainNav: mapLinks(HEADER_MAIN_NAV),
      routesEnabled: true,
      routesLabel: 'Routes',
      routesLinkSmartLink: HEADER_NAV_ROUTES_SMART_LINK,
      aboutEnabled: true,
      aboutLabel: 'About',
      aboutLinkSmartLink: HEADER_NAV_ABOUT_SMART_LINK,
      experiencesEnabled: true,
      experiencesLabel: 'Experiences',
      experiencesGroupOverrides: [],
      experiencesItemOverrides: [],
      experiencesTailorMenu: {...HEADER_NAV_EXPERIENCES_TAILOR_MENU_DEFAULT},
      experiencesGroups: {...HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT},
      experiencesSeeAll: {...HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK},
      lodgesEnabled: true,
      lodgesLabel: 'Lodges',
      lodgesRouteOverrides: [],
      lodgesItemOverrides: [],
      lodgeGroups: {...HEADER_NAV_LODGE_GROUPS_DEFAULT},
      lodgesSeeAll: {...HEADER_NAV_LODGES_SEE_ALL_BLOCK},
      navBookNowSmartLink: HEADER_NAV_BOOK_NOW_SMART_LINK,
      primaryCta: HEADER.primaryCta,
      mobileMenuAriaLabel: HEADER.mobileMenuAriaLabel,
      navTailorMadeTitle: HEADER_NAV_TAILOR_MADE.title,
      navTailorMadeSubtitle: HEADER_NAV_TAILOR_MADE.subtitle,
      navTailorMadeBody: HEADER_NAV_TAILOR_MADE.body,
      navTailorMadeSmartLink: HEADER_NAV_TAILOR_MADE.smartLink,
    },
    footer: {
      footerLogo: logoCream,
      footerLogoFullHorizontal: logoCream,
      showBrandDeco: FOOTER.showBrandDeco,
      tagline: FOOTER.tagline,
      descriptionLines: [...FOOTER.descriptionLines],
      exploreTitle: FOOTER.exploreTitle,
      exploreLinks: mapLinks(FOOTER_EXPLORE_LINKS),
      contactTitle: FOOTER.contactTitle,
      contactLinks: mapLinks(FOOTER_CONTACT_LINKS),
      legalLinks: mapLinks(FOOTER_LEGAL_LINKS),
      footerCertText: [...FOOTER.footerCertText],
    },
    socialLinks: mapLinks(SOCIAL_LINKS),
    copyright: SOCIAL.copyright,
    defaultWhatsappUrl: DEFAULT_WHATSAPP_URL,
  }
}

/**
 * Removes a stale empty draft for the same singleton. Otherwise Studio can open
 * `drafts.siteSettings` and ignore published `header` / `footer` values.
 */
export async function removeSiteSettingsDraft(client: SanityClient): Promise<void> {
  try {
    await client.delete(SITE_SETTINGS_DRAFT_ID)
  } catch (e) {
    const s = e instanceof Error ? e.message : String(e)
    if (/\bnot\s*found\b|HTTP\s*404|404|does not exist|Document not found/i.test(s)) {
      return
    }
    throw e
  }
}

/**
 * Build document, remove draft, createOrReplace published doc, and verify a few field paths
 * (catches API/schema rejections and wrong dataset id).
 */
export async function commitSiteSettingsDocument(client: SanityClient): Promise<void> {
  const doc = await buildSiteSettingsDocument(client)
  await removeSiteSettingsDraft(client)
  await client.createOrReplace(doc as any)
  type Pub = {
    _id: string
    siteName?: string
    header?: {
      mainNav?: unknown[]
      headerLogoFullHorizontal?: unknown
      experiencesLabel?: string | null
      routesLabel?: string | null
    }
    footer?: {
      tagline?: string
      footerLogo?: unknown
      exploreLinks?: unknown[]
      contactLinks?: unknown[]
    }
  }
  const row = await client.fetch<Pub | null>('*[_id == $id][0]', { id: SITE_SETTINGS_PUBLISHED_ID })
  if (!row || row.siteName !== SITE_NAME) {
    throw new Error('siteSettings post-commit: document missing or siteName mismatch. Check dataset and _id "siteSettings".')
  }
  if (row.footer?.tagline !== FOOTER.tagline) {
    throw new Error(
      `siteSettings post-commit: footer.tagline not stored (got ${JSON.stringify(row?.footer?.tagline)}). Check schema object field names (footer.*).`,
    )
  }
  if (row.header?.experiencesLabel?.trim() !== 'Experiences') {
    throw new Error(
      `siteSettings post-commit: header.experiencesLabel missing or wrong (got ${JSON.stringify(row.header?.experiencesLabel)}). Check structured header fields.`,
    )
  }
  if (row.header?.routesLabel?.trim() !== 'Routes') {
    throw new Error(
      `siteSettings post-commit: header.routesLabel missing or wrong (got ${JSON.stringify(row.header?.routesLabel)}).`,
    )
  }
  if (row.footer?.footerLogo == null) {
    throw new Error('siteSettings post-commit: footer.footerLogo is null. Check image field names in schema vs seed.')
  }
  if (row.header?.headerLogoFullHorizontal == null) {
    throw new Error('siteSettings post-commit: header.headerLogoFullHorizontal is null. Check image field names in schema vs seed.')
  }
}
