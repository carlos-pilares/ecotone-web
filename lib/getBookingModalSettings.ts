import { cache } from 'react'

import {
  DEFAULT_BOOKING_MODAL_COPY,
  type BookingModalCopy,
  resolveBookingModalCopy,
} from '@/lib/bookingModalCopy'
import { fetchBookingModalSettingsCached } from '@/lib/cachedSanityQueries'
/**
 * Singleton booking modal copy (Plan + Experience). Merges CMS over code defaults.
 * Cached per request (same pattern as `getSiteSettingsShell`).
 */
export const getBookingModalSettings = cache(async (): Promise<BookingModalCopy> => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return DEFAULT_BOOKING_MODAL_COPY
  }
  try {
    const row = await fetchBookingModalSettingsCached()
    if (!row) return DEFAULT_BOOKING_MODAL_COPY
    return resolveBookingModalCopy(row)
  } catch {
    return DEFAULT_BOOKING_MODAL_COPY
  }
})
