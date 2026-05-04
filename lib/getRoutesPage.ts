import { cache } from 'react'

import { resolveRoutesPageData, type RoutesPageResolved } from '@/lib/resolveRoutesPageData'
import { routesPageQuery, type RoutesPageSanityDoc } from '@/lib/routesPageQuery'
import { clientServer } from '@/lib/sanity'

export type { RoutesPageResolved }

/**
 * Singleton `routesPage` from Sanity (`_id == "routesPage"`).
 * Merges with `data/routesStatic.ts` when fetch fails or lists are empty.
 */
export const getRoutesPage = cache(async (): Promise<RoutesPageResolved> => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return resolveRoutesPageData(null)
  }
  try {
    const doc = await clientServer.fetch<RoutesPageSanityDoc | null>(routesPageQuery)
    return resolveRoutesPageData(doc && doc._id ? doc : null)
  } catch {
    return resolveRoutesPageData(null)
  }
})
