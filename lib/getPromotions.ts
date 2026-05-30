import { cache } from 'react'

import type { AnnouncementBarDoc, PromotionDoc } from '@/lib/promotionTypes'
import { activePromotionsQuery, announcementBarSettingsQuery } from '@/lib/promotionsQuery'
import { clientServer } from '@/lib/sanity'

export const getActivePromotions = cache(async (): Promise<PromotionDoc[]> => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return []
  }
  try {
    const rows = await clientServer.fetch<PromotionDoc[] | null>(activePromotionsQuery)
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
    return await clientServer.fetch<AnnouncementBarDoc | null>(announcementBarSettingsQuery)
  } catch {
    return null
  }
})
