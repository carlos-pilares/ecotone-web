import { cache } from 'react'

import { getSiteSettingsShell } from '@/lib/getSiteSettingsShell'

export type SiteSettingsLogos = {
  /** Light mark (over hero / dark areas) */
  headerLogoLightUrl: string | null
  /** Optional: marrón / “solid bar” — only if set in Studio; no coalesce (avoids fake “dark”). */
  headerLogoDarkUrl: string | null
  footerLogoUrl: string | null
  brandIsotipoUrl: string | null
}

/**
 * Logos only — delegates to the shared `getSiteSettingsShell` fetch (one Content Lake call per request).
 */
export const getSiteSettingsLogos = cache(async (): Promise<SiteSettingsLogos> => {
  const s = await getSiteSettingsShell()
  return {
    headerLogoLightUrl: s.headerLogoLightUrl,
    headerLogoDarkUrl: s.headerLogoDarkUrl,
    footerLogoUrl: s.footerLogoUrl,
    brandIsotipoUrl: s.brandIsotipoUrl,
  }
})
