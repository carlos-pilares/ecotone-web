import { cache } from 'react'

import { resolveSiteHeaderNavData } from '@/lib/resolveSiteHeaderNavData'
import { siteHeaderNavBundleQuery, type SiteHeaderNavBundleRow } from '@/lib/siteHeaderNavQuery'
import { clientServer } from '@/lib/sanity'

export type { ResolvedSiteHeaderNav, SiteHeaderNavChrome } from '@/lib/resolveSiteHeaderNavData'

/**
 * CMS-backed mega menu: experiencePage + lodgePage lists + optional `siteSettings` header CTAs.
 * Cached per request (same pattern as `getSiteSettingsShell`).
 */
export const getSiteHeaderNav = cache(async () => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return resolveSiteHeaderNavData(null, [], [], [])
  }
  try {
    const row = await clientServer.fetch<SiteHeaderNavBundleRow>(siteHeaderNavBundleQuery)
    return resolveSiteHeaderNavData(
      row?.settings ?? null,
      row?.experiencePages ?? [],
      row?.lodgePages ?? [],
      row?.routeNavDocs ?? [],
    )
  } catch {
    return resolveSiteHeaderNavData(null, [], [], [])
  }
})
