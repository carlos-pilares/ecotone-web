import { cache } from 'react'

import { defaultHomePageDoc, mergeHomePageWithDefaults, type ResolvedHomePage } from '@/lib/homePageDefaults'
import { homePageQuery, type HomePageDoc } from '@/lib/queries'
import { clientServer } from '@/lib/sanity'

export type { ResolvedHomePage }

/**
 * Fetches `homePage` from Sanity (by fixed document id) and merges with approved
 * local defaults when fetch fails, document is missing, or a field is empty.
 * One Content Lake call per request (deduped via `cache()`).
 */
export const getHomePage = cache(async (): Promise<ResolvedHomePage> => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return { ...defaultHomePageDoc }
  }
  try {
    const cms = await clientServer.fetch<HomePageDoc | null>(homePageQuery)
    return mergeHomePageWithDefaults(cms)
  } catch {
    return mergeHomePageWithDefaults(null)
  }
})
