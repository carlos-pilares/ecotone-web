import { CMS_IDS } from '@/data/cmsApproved/ids'

/** GROQ for singleton `bookingModalSettings` (see `sanity/schemaTypes/bookingModalSettings.js`). */
export const bookingModalSettingsQuery = /* groq */ `
*[_id == "${CMS_IDS.bookingModalSettings}"][0]{
  generalModal,
  experienceModal,
  planJourney,
  experienceBooking
}
`
