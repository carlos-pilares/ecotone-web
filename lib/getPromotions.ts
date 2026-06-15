import { cache } from 'react'

import {
  fetchActivePromotionsCached,
  fetchAnnouncementBarSettingsCached,
} from '@/lib/cachedSanityQueries'
import type { AnnouncementBarDoc, PromotionDoc } from '@/lib/promotionTypes'

export const getActivePromotions = cache(async (): Promise<PromotionDoc[]> => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return []
  }
  try {
    const rows = await fetchActivePromotionsCached()
    return Array.isArray(rows) ? rows.filter((r) => r?._id) : []
  } catch {
    return []
  }
})

export const getAnnouncementBarSettings = cache(async (): Promise<AnnouncementBarDoc | null> => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return null
  }
  try {
    return await fetchAnnouncementBarSettingsCached()
  } catch {
    return null
  }
})
