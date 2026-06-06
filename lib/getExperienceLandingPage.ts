import { cache } from 'react'

import { getSoqtapataPageCms, type SoqtapataPageCmsPayload } from '@/lib/soqtapataCmsV1'

export type ExperienceLandingPageResult = SoqtapataPageCmsPayload

/**
 * Resolves `/experiences/[slug]` from `experiencePage` only (tourism or experiential learning source).
 */
export const getExperienceLandingPage = cache(async (slug: string): Promise<ExperienceLandingPageResult | null> => {
  return getSoqtapataPageCms(slug)
})
