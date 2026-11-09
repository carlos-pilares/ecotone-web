/**
 * Manu Field Crew 2027 — centralized commercial + booking config.
 * Change promo values here only; do not scatter across components.
 */

export const MFC2027_CAMPAIGN_NAME = 'Manu Field Crew 2027'
export const MFC2027_PROGRAMME_NAME = 'Manu Field Crew'
export const MFC2027_EXPERIENCE_NAME = 'Volunteer Conservation'
export const MFC2027_LOCATION = 'Manu Learning Centre'
export const MFC2027_DURATION = '4 weeks'
export const MFC2027_DURATION_LABEL = '4 weeks'
export const MFC2027_DURATION_DETAIL = '33 days / 32 nights'
export const MFC2027_SOURCE = 'manu-field-crew-2027-landing'
/** sessionStorage key — isolated from MCV `mcv-qualification`. */
export const MFC2027_SESSION_KEY = 'mfc2027-session'
export const MFC2027_PRIVACY_NOTICE_VERSION = '2026-08-24'

/** Broad timing windows for the lead form (exact dates chosen on Result). */
export const MFC2027_TIMING_OPTIONS = [
  'Jan – Mar 2027',
  'Apr – Jun 2027',
  'Jul – Sep 2027',
  'Oct – Dec 2027',
  'Flexible / Not sure yet',
] as const

export const MFC2027_GROUP_SIZE_OPTIONS = ['Just me', '2', '3–4', '5+'] as const

/** Landing / sticky primary CTA. */
export const MFC2027_CTA_SEE_DEPARTURES = 'See 2027 departures'
/** Result primary booking CTA. */
export const MFC2027_CTA_VIEW_PROGRAMME_BOOK = 'View programme & book'
export const MFC2027_CTA_BOOK_CALL = 'Book a call'

/** Secondary link to the general Conservation Volunteer product page. */
export const MFC2027_EXPLORE_CV_LABEL = 'Explore Conservation Volunteer'
export const MFC2027_EXPLORE_CV_SUPPORT =
  'Looking for another programme length or a different volunteer format?'
export const MFC2027_EXPLORE_CV_SUPPORT_SHORT = 'For other durations and programme options.'

/** Product clarity line for the 4-week campaign offer. */
export const MFC2027_PRODUCT_CLARITY =
  '4 weeks · Manu Learning Centre · 2027 fixed departures'

export const MFC2027_LANDING_PATH = '/manu-field-crew-2027'
export const MFC2027_RESULT_PATH = '/manu-field-crew-2027/result'

/** Canonical general Conservation Volunteer experience (other lengths). */
export const MFC2027_FULL_PROGRAMME_PATH = '/experiences/conservation-volunteer'

/** Existing Ecotone Calendly used by the MCV campaign. */
export const MFC2027_CALENDLY_URL = 'https://calendly.com/ecotone-info/30min'

/**
 * Single WeTravel trip for all 2027 fixed departures.
 * Selected departure is tracked in analytics before outbound navigation.
 */
export const MFC2027_WETRAVEL_TRIP_URL =
  'https://www.wetravel.com/trips/conservation-season-mlc-4w-ecotone-4799330933?_wbc'

/** Provisional promotional offer — edit here to update site-wide. */
export const MFC2027_BASE_PRICE = 2600
export const MFC2027_DISCOUNT_PERCENT = 30
export const MFC2027_OFFER_PRICE = 1820
export const MFC2027_PROMO_CODE = 'CREW30'

export const MFC2027_PRICE_DISPLAY = {
  base: 'US$2,600',
  offer: 'US$1,820',
} as const

/** Raw_Leads PRICE column format. */
export const MFC2027_PRICE_SHEET = 'US$2,600 | 30% off | US$1,820'

export type Mfc2027Departure = {
  key: string
  departureLabel: string
  /** Short month label for scannable lists */
  monthLabel: string
  startDate: string
  endDate: string
  /** Display range, e.g. "25 Jan – 26 Feb 2027" */
  dateRange: string
  /** ISO dates for analytics (YYYY-MM-DD) */
  startIso: string
  endIso: string
}

export const MFC2027_DEPARTURES: Mfc2027Departure[] = [
  {
    key: 'dep-01',
    departureLabel: 'Departure 01',
    monthLabel: 'January',
    startDate: '25 Jan 2027',
    endDate: '26 Feb 2027',
    dateRange: '25 Jan – 26 Feb 2027',
    startIso: '2027-01-25',
    endIso: '2027-02-26',
  },
  {
    key: 'dep-02',
    departureLabel: 'Departure 02',
    monthLabel: 'February',
    startDate: '22 Feb 2027',
    endDate: '26 Mar 2027',
    dateRange: '22 Feb – 26 Mar 2027',
    startIso: '2027-02-22',
    endIso: '2027-03-26',
  },
  {
    key: 'dep-03',
    departureLabel: 'Departure 03',
    monthLabel: 'March',
    startDate: '22 Mar 2027',
    endDate: '23 Apr 2027',
    dateRange: '22 Mar – 23 Apr 2027',
    startIso: '2027-03-22',
    endIso: '2027-04-23',
  },
  {
    key: 'dep-04',
    departureLabel: 'Departure 04',
    monthLabel: 'April',
    startDate: '19 Apr 2027',
    endDate: '21 May 2027',
    dateRange: '19 Apr – 21 May 2027',
    startIso: '2027-04-19',
    endIso: '2027-05-21',
  },
  {
    key: 'dep-05',
    departureLabel: 'Departure 05',
    monthLabel: 'May',
    startDate: '17 May 2027',
    endDate: '18 Jun 2027',
    dateRange: '17 May – 18 Jun 2027',
    startIso: '2027-05-17',
    endIso: '2027-06-18',
  },
  {
    key: 'dep-06',
    departureLabel: 'Departure 06',
    monthLabel: 'June',
    startDate: '14 Jun 2027',
    endDate: '16 Jul 2027',
    dateRange: '14 Jun – 16 Jul 2027',
    startIso: '2027-06-14',
    endIso: '2027-07-16',
  },
  {
    key: 'dep-07',
    departureLabel: 'Departure 07',
    monthLabel: 'July',
    startDate: '12 Jul 2027',
    endDate: '13 Aug 2027',
    dateRange: '12 Jul – 13 Aug 2027',
    startIso: '2027-07-12',
    endIso: '2027-08-13',
  },
  {
    key: 'dep-08',
    departureLabel: 'Departure 08',
    monthLabel: 'August',
    startDate: '9 Aug 2027',
    endDate: '10 Sep 2027',
    dateRange: '9 Aug – 10 Sep 2027',
    startIso: '2027-08-09',
    endIso: '2027-09-10',
  },
  {
    key: 'dep-09',
    departureLabel: 'Departure 09',
    monthLabel: 'September',
    startDate: '6 Sep 2027',
    endDate: '8 Oct 2027',
    dateRange: '6 Sep – 8 Oct 2027',
    startIso: '2027-09-06',
    endIso: '2027-10-08',
  },
  {
    key: 'dep-10',
    departureLabel: 'Departure 10',
    monthLabel: 'October',
    startDate: '4 Oct 2027',
    endDate: '5 Nov 2027',
    dateRange: '4 Oct – 5 Nov 2027',
    startIso: '2027-10-04',
    endIso: '2027-11-05',
  },
  {
    key: 'dep-11',
    departureLabel: 'Departure 11',
    monthLabel: 'November',
    startDate: '1 Nov 2027',
    endDate: '3 Dec 2027',
    dateRange: '1 Nov – 3 Dec 2027',
    startIso: '2027-11-01',
    endIso: '2027-12-03',
  },
  {
    key: 'dep-12',
    departureLabel: 'Departure 12',
    monthLabel: 'November',
    startDate: '29 Nov 2027',
    endDate: '31 Dec 2027',
    dateRange: '29 Nov – 31 Dec 2027',
    startIso: '2027-11-29',
    endIso: '2027-12-31',
  },
  {
    key: 'dep-13',
    departureLabel: 'Departure 13',
    monthLabel: 'December',
    startDate: '27 Dec 2027',
    endDate: '28 Jan 2028',
    dateRange: '27 Dec 2027 – 28 Jan 2028',
    startIso: '2027-12-27',
    endIso: '2028-01-28',
  },
]

/** Compact result selector: next four fixed departures only. */
export const MFC2027_FEATURED_DEPARTURE_COUNT = 4

export function getMfc2027FeaturedDepartures(): Mfc2027Departure[] {
  return MFC2027_DEPARTURES.slice(0, MFC2027_FEATURED_DEPARTURE_COUNT)
}

export function getMfc2027RemainingDepartures(): Mfc2027Departure[] {
  return MFC2027_DEPARTURES.slice(MFC2027_FEATURED_DEPARTURE_COUNT)
}

/** Compact card date line, e.g. "25 Jan → 26 Feb 2027". */
export function formatMfc2027CompactDateLine(departure: Mfc2027Departure): string {
  const startParts = departure.startDate.split(' ')
  const endParts = departure.endDate.split(' ')
  const startShort = startParts.slice(0, 2).join(' ')
  const endHasYear = endParts.length >= 3
  const endDisplay = endHasYear ? departure.endDate : `${departure.endDate} ${startParts[2] ?? ''}`.trim()
  return `${startShort} → ${endDisplay}`
}

/**
 * Central WeTravel outbound URL builder.
 * Kept in one place so an embedded WeTravel widget can replace direct navigation later.
 */
export function getMfc2027WeTravelUrl(_departure?: Mfc2027Departure): string {
  return MFC2027_WETRAVEL_TRIP_URL
}

export function findMfc2027Departure(key: string): Mfc2027Departure | undefined {
  return MFC2027_DEPARTURES.find((d) => d.key === key)
}

/** Confirmed fixed ranges allowed in Raw_Leads TRAVEL DATE for this campaign. */
export const MFC2027_CONFIRMED_TRAVEL_DATES = MFC2027_DEPARTURES.map((d) => d.dateRange.trim())

export type Mfc2027SessionData = {
  leadId: string
  travelTiming: string
  groupSize: string
}
