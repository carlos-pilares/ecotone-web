import { cache } from 'react'

import { fetchSiteHeaderNavBundleCached } from '@/lib/cachedSanityQueries'
import { getActivePromotions } from '@/lib/getPromotions'
import {
  hasHeaderSettingsDoc,
  mergeHeaderNavSettings,
  type HeaderSettingsDocumentRow,
  type LegacySiteSettingsHeaderRow,
} from '@/lib/mergeHeaderSettings'
import { resolveSiteHeaderNavFromNavTabs } from '@/lib/resolveHeaderNavTabs'
import { resolveSiteHeaderNavData } from '@/lib/resolveSiteHeaderNavData'

export type { ResolvedSiteHeaderNav, ResolvedSiteHeaderNavTab } from '@/lib/resolveSiteHeaderNavData'

/**
 * CMS-backed mega menu: published `headerSettings` only when present; else legacy `siteSettings.header`.
 */
export const getSiteHeaderNav = cache(async () => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return resolveSiteHeaderNavData(null, [], [], [])
  }
  try {
    const [row, promotions] = await Promise.all([
      fetchSiteHeaderNavBundleCached(),
      getActivePromotions(),
    ])
    const headerDoc = (row?.headerSettings ?? null) as HeaderSettingsDocumentRow
    const headerFound = hasHeaderSettingsDoc(headerDoc)
    const navTabsRaw = headerDoc?.navTabs

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[HEADER CMS RAW]', {
        _id: headerDoc?._id ?? null,
        headerSettingsFound: headerFound,
        navTabsLength: Array.isArray(navTabsRaw) ? navTabsRaw.length : 0,
        navTabs: (navTabsRaw ?? []).map((t) => ({
          label: t?.label ?? null,
          showInHeader: t?.showInHeader ?? null,
          hasDropdown: t?.hasDropdown ?? null,
          dropdownType: t?.dropdownType ?? null,
          smartLink: t?.smartLink
            ? {
                enabled: t.smartLink.enabled,
                linkType: t.smartLink.linkType,
                internalPage: t.smartLink.internalPage,
                label: t.smartLink.label,
              }
            : null,
          programGroupsLength: t?.experiencesDropdown?.programGroups?.length ?? 0,
          lodgesDropdown: t?.lodgesDropdown ? { sideMenuTitle: t.lodgesDropdown.sideMenuTitle } : null,
        })),
        mainCta: {
          show: headerDoc?.mainCtaShowInHeader ?? null,
          label: headerDoc?.mainCtaLabel ?? null,
        },
      })
    }

    const nav = headerFound
      ? resolveSiteHeaderNavFromNavTabs(
          headerDoc!,
          row?.experiencePages ?? [],
          row?.lodgePages ?? [],
          row?.routeNavDocs ?? [],
          promotions,
          row?.learningProgrammes ?? [],
        )
      : resolveSiteHeaderNavData(
          mergeHeaderNavSettings(
            headerDoc,
            (row?.legacyHeader ?? null) as LegacySiteSettingsHeaderRow,
          ),
          row?.experiencePages ?? [],
          row?.lodgePages ?? [],
          row?.routeNavDocs ?? [],
          promotions,
          row?.learningProgrammes ?? [],
        )

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[HEADER RESOLVED NAV]', {
        tabsLength: nav.tabs.length,
        tabs: nav.tabs.map((t) => ({
          label: t.label,
          kind: t.hasDropdown ? t.dropdownType : 'link',
          href: t.simpleLink?.href ?? null,
          megaExperiences: Boolean(t.experiences),
          megaLodges: Boolean(t.lodges),
        })),
      })
    }

    return nav
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(
        '[getSiteHeaderNav] siteHeaderNavBundleQuery failed — nav falls back to empty legacy nav. Check GROQ (e.g. coalesce/select syntax).',
        err,
      )
    }
    return resolveSiteHeaderNavData(null, [], [], [])
  }
})
