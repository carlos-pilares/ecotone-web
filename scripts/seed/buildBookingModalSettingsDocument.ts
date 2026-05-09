import { CMS_IDS } from '@/data/cmsApproved/ids'

/** Minimal singleton so Studio + GROQ resolve; all fields optional — app uses code fallbacks. */
export function buildBookingModalSettingsDocument() {
  return {
    _id: CMS_IDS.bookingModalSettings,
    _type: 'bookingModalSettings' as const,
  }
}
