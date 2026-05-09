/**
 * Approved shell copy for `siteSettings` — mirrors the live `SiteHeader` and `SiteFooter` markup
 * (`components/SiteHeader.tsx`, `components/SiteFooter.tsx`) as of the Next shell.
 * Used by `scripts/seed/buildSiteSettingsDocument.ts` (full `npm run seed:cms` and `npm run seed:site-settings` only).
 * When you change the visible menu/footer, update this file first, then re-seed.
 */

export type SiteSettingsApprovedLink = {
  _key: string
  label: string
  href: string
  openInNewTab: boolean
}

export const SITE_NAME = 'Ecotone'

/** Fallback when `homePage.bookingCta2Link` is empty — mirrored on `siteSettings.defaultWhatsappUrl` in seed. */
export const DEFAULT_WHATSAPP_URL =
  'https://wa.me/51974781094?text=I%20want%20information%20about%20Ecotone%20experiences'

export const SITE_DEFAULT_SEO = {
  title: 'Ecotone — Immersive nature in Peru',
  description:
    'Immersive nature experiences in the Peruvian cloud forest and Amazon — expert guides, small groups, and conservation-minded programs in Cusco, Manu, and Camanti.',
} as const

/**
 * `header.headerLogoFullHorizontal` in Studio = full lockup, cream on dark (ECE5D5 art from seed).
 * `header.headerLogoLight` = same treatment for “on hero” (explicit; same asset as full horizontal in seed).
 * `header.headerLogoDark` = brown #906730 lockup for light/solid bar (separate file in seed).
 */
export const HEADER_MAIN_NAV: SiteSettingsApprovedLink[] = [
  { _key: 'hnav0', label: 'Experiences', href: '/#experiences', openInNewTab: false },
  { _key: 'hnav1', label: 'Routes', href: '/#routes', openInNewTab: false },
  { _key: 'hnav2', label: 'Lodges', href: 'https://www.ecotone.eco/destinations', openInNewTab: true },
  { _key: 'hnav3', label: 'Journal', href: '/journal', openInNewTab: false },
  { _key: 'hnav4', label: 'About', href: '/#about', openInNewTab: false },
]

/** Seed payloads for `siteSettings.header` mega menu + sticky Book (smartLink objects). */
export const HEADER_NAV_BOOK_NOW_SMART_LINK = {
  _type: 'smartLink' as const,
  enabled: true,
  label: 'Book now',
  linkType: 'websitePage' as const,
  internalPage: 'home',
  websitePageSectionId: 'book',
  openInNewTab: false,
}

export const HEADER_NAV_EXPERIENCES_SEE_ALL_SMART_LINK = {
  _type: 'smartLink' as const,
  enabled: true,
  label: 'All experiences',
  linkType: 'websitePage' as const,
  internalPage: 'home',
  websitePageSectionId: 'experiences',
  openInNewTab: false,
}

export const HEADER_NAV_LODGES_SEE_ALL_SMART_LINK = {
  _type: 'smartLink' as const,
  enabled: true,
  label: 'All lodges',
  linkType: 'websitePage' as const,
  internalPage: 'lodgesIndex',
  openInNewTab: false,
}

/** Direct header links (mega menu top bar): Routes / About. */
export const HEADER_NAV_ROUTES_SMART_LINK = {
  _type: 'smartLink' as const,
  enabled: true,
  label: 'Routes',
  linkType: 'websitePage' as const,
  internalPage: 'routes' as const,
  openInNewTab: false,
}

export const HEADER_NAV_ABOUT_SMART_LINK = {
  _type: 'smartLink' as const,
  enabled: true,
  label: 'About',
  linkType: 'websitePage' as const,
  internalPage: 'about' as const,
  openInNewTab: false,
}

export const HEADER_NAV_EXPERIENCES_GROUPS_DEFAULT = {
  classicNature: { label: 'Classic Nature', enabled: true, order: 0 },
  signatureExpeditions: { label: 'Signature Expeditions', enabled: true, order: 1 },
  experientialLearning: { label: 'Experiential Learning', enabled: true, order: 2 },
  tailorMade: { label: 'Tailor Made', enabled: true, order: 3 },
} as const

export const HEADER_NAV_LODGE_GROUPS_DEFAULT = {
  camanti: { label: 'Camanti', enabled: true, order: 0 },
  manuRoad: { label: 'Manu Road', enabled: true, order: 1 },
  manuCore: { label: 'Manu Core', enabled: true, order: 2 },
} as const

export const HEADER_NAV_EXPERIENCES_SEE_ALL_BLOCK = {
  enabled: true,
  label: 'All experiences',
  smartLink: HEADER_NAV_EXPERIENCES_SEE_ALL_SMART_LINK,
} as const

/** Tailor Made sidebar row (explicit CTA; not derived from experience program types). */
export const HEADER_NAV_EXPERIENCES_TAILOR_MENU_DEFAULT = {
  enabled: true,
  label: 'Tailor Made',
} as const

export const HEADER_NAV_LODGES_SEE_ALL_BLOCK = {
  enabled: true,
  label: 'All lodges',
  smartLink: HEADER_NAV_LODGES_SEE_ALL_SMART_LINK,
} as const

export const HEADER_NAV_TAILOR_MADE = {
  title: 'Design your program',
  subtitle: 'Any duration · Any group · Fully custom',
  body:
    'We build a program around your goals — school groups, researchers, families, or solo explorers. Any route, any duration.',
  smartLink: {
    _type: 'smartLink' as const,
    enabled: true,
    label: 'Enquire',
    linkType: 'whatsapp' as const,
    whatsappNumber: '51974781094',
    openInNewTab: true,
  },
} as const

export const HEADER = {
  homePath: '/',
  mainNav: HEADER_MAIN_NAV,
  primaryCta: {
    _type: 'cta' as const,
    label: 'Book now',
    href: '/#book',
    openInNewTab: false,
    style: 'navBook' as const,
  },
  mobileMenuAriaLabel: 'Open menu',
} as const

export const FOOTER_EXPLORE_LINKS: SiteSettingsApprovedLink[] = [
  { _key: 'fexp0', label: 'Experiences', href: '/#experiences', openInNewTab: false },
  { _key: 'fexp1', label: 'Routes', href: 'https://www.ecotone.eco/copy-of-programas', openInNewTab: true },
  { _key: 'fexp2', label: 'Lodges', href: 'https://www.ecotone.eco/destinations', openInNewTab: true },
  { _key: 'fexp3', label: 'Programs', href: 'https://www.ecotone.eco/services-4', openInNewTab: true },
  { _key: 'fexp4', label: 'Journal', href: '/journal', openInNewTab: false },
]

export const FOOTER_CONTACT_LINKS: SiteSettingsApprovedLink[] = [
  { _key: 'fcon0', label: 'WhatsApp', href: 'https://wa.me/51974781094', openInNewTab: true },
  { _key: 'fcon1', label: 'ecotone.eco', href: 'https://www.ecotone.eco', openInNewTab: true },
  { _key: 'fcon2', label: 'Instagram', href: 'https://www.instagram.com', openInNewTab: true },
  { _key: 'fcon3', label: 'Privacy policy', href: 'https://www.ecotone.eco', openInNewTab: true },
]

/** Footer legal row (footer UI may render separately later); URLs align with the Webflow main site. */
export const FOOTER_LEGAL_LINKS: SiteSettingsApprovedLink[] = [
  { _key: 'fleg0', label: 'Terms & conditions', href: 'https://www.ecotone.eco', openInNewTab: true },
  { _key: 'fleg1', label: 'Cookie policy', href: 'https://www.ecotone.eco', openInNewTab: true },
]

export const FOOTER = {
  showBrandDeco: true,
  tagline: 'People meet nature',
  descriptionLines: ['Immersive nature tourism', 'Cusco, Perú · Manu & Camanti'],
  exploreTitle: 'Explore',
  exploreLinks: FOOTER_EXPLORE_LINKS,
  contactTitle: 'Contact',
  contactLinks: FOOTER_CONTACT_LINKS,
  legalLinks: FOOTER_LEGAL_LINKS,
  footerCertText: ['B Corp', 'ATTA Member', 'GSTC'],
} as const

/** Distinct from contact Instagram — global social list for Studio + future block. */
export const SOCIAL_LINKS: SiteSettingsApprovedLink[] = [
  { _key: 'soc0', label: 'Instagram', href: 'https://www.instagram.com', openInNewTab: true },
  { _key: 'soc1', label: 'Facebook', href: 'https://www.facebook.com', openInNewTab: true },
  { _key: 'soc2', label: 'YouTube', href: 'https://www.youtube.com', openInNewTab: true },
]

export const SOCIAL = {
  socialLinks: SOCIAL_LINKS,
  copyright: '© 2026 Ecotone · HERPIRO · All rights reserved.',
} as const
