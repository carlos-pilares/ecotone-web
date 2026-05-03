import { cache } from 'react'

import { defaultHomePageDoc, mergeHomePageWithDefaults, type ResolvedHomePage } from '@/lib/homePageDefaults'
import { getSiteSettingsShell } from '@/lib/getSiteSettingsShell'
import { homePageQuery, type HomePageDoc } from '@/lib/queries'
import { clientServer } from '@/lib/sanity'

export type { ResolvedHomePage }

/**
 * Fetches `homePage` from Sanity (by fixed document id) and merges with approved
 * local defaults when fetch fails, document is missing, or a field is empty.
 * One Content Lake call per request (deduped via `cache()`).
 */
function applyBookingWhatsappFromShell(
  page: ResolvedHomePage,
  shellWhatsapp: string | null | undefined,
): ResolvedHomePage {
  const wa = shellWhatsapp?.trim()
  if (!wa) return page
  if (page.bookingCta2Link?.trim()) return page
  return { ...page, bookingCta2Link: wa }
}

export const getHomePage = cache(async (): Promise<ResolvedHomePage> => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return { ...defaultHomePageDoc }
  }
  try {
    const [cms, shell] = await Promise.all([
      clientServer.fetch<HomePageDoc | null>(homePageQuery),
      getSiteSettingsShell(),
    ])
    const merged = mergeHomePageWithDefaults(cms)
    return applyBookingWhatsappFromShell(merged, shell.defaultWhatsappUrl)
  } catch {
    return mergeHomePageWithDefaults(null)
  }
})
