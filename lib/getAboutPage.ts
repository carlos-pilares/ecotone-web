import { cache } from 'react'

import { aboutPageQuery, type AboutPageSanityDoc } from '@/lib/aboutPageQuery'
import { experiencesQuery } from '@/lib/queries'
import { resolveAboutPageData, type AboutPageResolved } from '@/lib/resolveAboutPageData'
import { clientServer } from '@/lib/sanity'

export type { AboutPageResolved }

/**
 * Singleton `aboutPage` from Sanity (`_id == "aboutPage"`).
 * Merges with `data/aboutStatic.ts` when fetch fails or fields are empty.
 */
export const getAboutPage = cache(async (): Promise<AboutPageResolved> => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return resolveAboutPageData(null, [])
  }
  let doc: AboutPageSanityDoc | null = null
  let experiences: { price?: number | null; status?: string | null }[] = []
  try {
    ;[doc, experiences] = await Promise.all([
      clientServer.fetch<AboutPageSanityDoc | null>(aboutPageQuery),
      clientServer.fetch<{ price?: number | null; status?: string | null }[]>(experiencesQuery),
    ])
  } catch {
    doc = null
    experiences = []
  }
  return resolveAboutPageData(
    doc && doc._id ? doc : null,
    Array.isArray(experiences) ? experiences : [],
  )
})
