/**
 * Same-origin full-horizontal logo for solid header (#906730 fill). Used when
 * `siteSettings.header.headerLogoDark` is not set in Sanity.
 * Avoids CORS; matches --brown / .nav-book.
 */
export const LOCAL_HEADER_LOGO_BROWN_SRC = '/brand/logo-full-horizontal-906730.svg'

/**
 * @param cmsDarkUrl - from Sanity `headerLogoDark` (optional)
 * @returns URL for solid bar: CMS asset, or local brown SVG
 */
export function resolveHeaderLogoDarkUrl(cmsDarkUrl: string | null | undefined): string {
  if (typeof cmsDarkUrl === 'string' && cmsDarkUrl.length > 0) return cmsDarkUrl
  return LOCAL_HEADER_LOGO_BROWN_SRC
}
