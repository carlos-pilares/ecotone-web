/**
 * Configurable shell data for `/manu-conservation-volunteer/result`.
 *
 * Shared promotional offer (all fixed departures): price, 30% discount, CREW30.
 * Per departure: dates + optional bookingUrl.
 * `Other dates` is separate — no discount, no CREW30.
 */

import {
  MCV_DISCOUNT_PERCENT,
  MCV_DURATION,
  MCV_PRICE_DISPLAY,
} from './mcv-campaign'

/** sessionStorage key written by the qualification modal, read by the result page. */
export const MCV_QUALIFICATION_STORAGE_KEY = 'mcv-qualification'

export const MCV_RESULT_SHELL = {
  discountPercent: MCV_DISCOUNT_PERCENT,
  discountLabel: `${MCV_DISCOUNT_PERCENT}% OFF`,
  voucherCode: 'CREW30',
  durationLabel: MCV_DURATION,
  availabilityLabel: 'Limited places',
  originalPrice: MCV_PRICE_DISPLAY.base,
  promoPrice: MCV_PRICE_DISPLAY.offer,
  programmeName: '4-week conservation volunteer',
  programmeHeadline: '4 weeks in the Peruvian Amazon',
  programmeSupport:
    "Work alongside conservation teams in one of the world's most biodiverse landscapes.",
  inclusionsLine: 'Accommodation · Meals · Field activities · Programme support',
  placesNote: 'Limited places per departure',
  offerScopeLine:
    'Your 30% field offer applies only to the selected fixed 2026 Manu Field Crew departures below.',
} as const

/** Matches modal timing option strings exactly (`travelTiming` in mcv-qualification). */
export type McvTimingKey =
  | 'September 2026'
  | 'October 2026'
  | 'November 2026'
  | 'December 2026'
  | 'Early 2027'

export type McvResultDeparture = {
  key: string
  kind: 'promotional' | 'other'
  departureLabel: string
  /** Primary fixed date range shown on the card */
  dateRange: string
  /**
   * True when the departure has exact confirmed dates that may be written to Raw_Leads.
   * TBC / placeholder dates must remain false.
   */
  datesConfirmed: boolean
  /**
   * Per-departure WeTravel booking URL.
   * Leave unset until the real URL is supplied for that departure.
   */
  bookingUrl?: string
  /** Optional supporting copy (used by Other dates). */
  supportText?: string
}

/**
 * Fixed promotional departures + flexible “Other dates”.
 * Shared offer (price / CREW30 / duration) lives on MCV_RESULT_SHELL.
 * Add each departure's `bookingUrl` when WeTravel links are confirmed.
 */
export const MCV_RESULT_DEPARTURES: McvResultDeparture[] = [
  {
    key: 'dep-01',
    kind: 'promotional',
    departureLabel: 'Departure 01',
    dateRange: '30 Sep – 31 Oct 2026',
    datesConfirmed: true,
    bookingUrl:
      'https://www.wetravel.com/trips/volunteer-program-4-weeks-sep-oct-ecotone-8890177620',
  },
  {
    key: 'dep-02',
    kind: 'promotional',
    departureLabel: 'Departure 02',
    dateRange: '2 Nov – 4 Dec 2026',
    datesConfirmed: true,
    bookingUrl:
      'https://www.wetravel.com/trips/volunteer-program-4-weeks-ecotone-6488939184#overview',
  },
  {
    key: 'other-dates',
    kind: 'other',
    departureLabel: 'Other dates',
    dateRange: 'Flexible',
    datesConfirmed: false,
    supportText:
      'Prefer a different time? Standard rate applies. We may be able to arrange alternative dates subject to availability.',
  },
]

/** Confirmed fixed departure date ranges allowed in Raw_Leads TRAVEL DATE. */
export const MCV_CONFIRMED_FIXED_TRAVEL_DATES = MCV_RESULT_DEPARTURES.filter(
  (d) => d.kind === 'promotional' && d.datesConfirmed,
).map((d) => d.dateRange.trim())

/** Whether this departure may persist TRAVEL DATE / open booking. */
export function canPersistFixedTravelDate(departure: McvResultDeparture): boolean {
  return departure.kind === 'promotional' && departure.datesConfirmed
}

/** Departure keys still awaiting real WeTravel booking URLs. */
export const MCV_DEPARTURES_AWAITING_BOOKING_URL = MCV_RESULT_DEPARTURES.filter(
  (d) => d.kind === 'promotional' && !d.bookingUrl?.trim(),
).map((d) => d.key)

/**
 * Maps modal preferred timing → closest fixed departure (or Other dates).
 * Update when promotional windows change.
 */
export const MCV_TIMING_TO_DEPARTURE_KEY: Record<McvTimingKey, string> = {
  'September 2026': 'dep-01',
  'October 2026': 'dep-01',
  'November 2026': 'dep-02',
  'December 2026': 'dep-02',
  'Early 2027': 'other-dates',
}

export type McvQualificationData = {
  leadId?: string
  travelTiming: string
  groupSize: string
}

/** Closest fixed departure (or Other dates) for a modal timing preference. */
export function matchDepartureForTiming(
  travelTiming: string | undefined,
  departures: McvResultDeparture[] = MCV_RESULT_DEPARTURES,
): McvResultDeparture | undefined {
  const timing = travelTiming?.trim() as McvTimingKey | undefined
  if (!timing) return undefined
  const key = MCV_TIMING_TO_DEPARTURE_KEY[timing]
  if (!key) return undefined
  return departures.find((d) => d.key === key)
}

/**
 * Preselect the closest match when available.
 * Unknown / missing timing → first promotional departure (not Other dates).
 */
export function defaultSelectedDepartureKey(
  travelTiming: string | undefined,
  departures: McvResultDeparture[] = MCV_RESULT_DEPARTURES,
): string {
  const matched = matchDepartureForTiming(travelTiming, departures)
  if (matched) return matched.key
  return departures.find((d) => d.kind === 'promotional')?.key ?? departures[0]?.key ?? ''
}
