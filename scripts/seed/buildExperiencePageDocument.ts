/**
 * Lodge CTA fragment for `experiencePage` seed (Soqtapata landing).
 * Keeps `lodgePageLink` + `lodgeCtaLabel` for legacy fallback; adds `lodgeCtaSmartLink` (internal → lodge page).
 */
import { CMS_IDS } from '@/data/cmsApproved/ids'

export const experiencePageLodgeCtaSeed = {
  lodgePageLink: { _type: 'reference' as const, _ref: CMS_IDS.lodgePageSoqtapata },
  lodgeCtaLabel: 'View full lodge page',
  lodgeCtaSmartLink: {
    _type: 'smartLink' as const,
    label: 'View full lodge page',
    linkType: 'internalPage' as const,
    internalPage: 'lodgePage',
    lodgePageRef: { _type: 'reference' as const, _ref: CMS_IDS.lodgePageSoqtapata },
    openInNewTab: false,
  },
} as const
