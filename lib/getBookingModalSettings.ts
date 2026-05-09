import { cache } from 'react'

import {
  DEFAULT_BOOKING_MODAL_COPY,
  type BookingModalCopy,
  type BookingModalSettingsRow,
  resolveBookingModalCopy,
} from '@/lib/bookingModalCopy'
import { bookingModalSettingsQuery } from '@/lib/bookingModalSettingsQuery'
import { clientServer } from '@/lib/sanity'
/**
 * Singleton booking modal copy (Plan + Experience). Merges CMS over code defaults.
 * Cached per request (same pattern as `getSiteSettingsShell`).
 */
export const getBookingModalSettings = cache(async (): Promise<BookingModalCopy> => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return DEFAULT_BOOKING_MODAL_COPY
  }
  try {
    const row = await clientServer.fetch<BookingModalSettingsRow>(bookingModalSettingsQuery)
    if (!row) return DEFAULT_BOOKING_MODAL_COPY
    return resolveBookingModalCopy(row)
  } catch {
    return DEFAULT_BOOKING_MODAL_COPY
  }
})
