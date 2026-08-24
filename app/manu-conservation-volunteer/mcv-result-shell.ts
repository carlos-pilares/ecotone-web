/**
 * Configurable shell data for `/manu-conservation-volunteer/result`.
 *
 * PLACEHOLDER — not live WeTravel / inventory logic.
 * Replace promotional date ranges in `MCV_RESULT_DEPARTURES` when real 2026
 * field dates are confirmed.
 */

/** sessionStorage key written by the qualification modal, read by the result page. */
export const MCV_QUALIFICATION_STORAGE_KEY = 'mcv-qualification'

export const MCV_RESULT_SHELL = {
  discountPercent: 30,
  discountLabel: '30% OFF',
  voucherCode: 'MANU30',
  durationLabel: '4 weeks',
  availabilityLabel: 'Limited places',
  originalPrice: 'US$ 1,250',
  promoPrice: 'US$ 875',
  programmeName: '4-week conservation volunteer',
  programmeHeadline: '4 weeks in the Peruvian Amazon',
  programmeSupport:
    "Work alongside conservation teams in one of the world's most biodiverse landscapes.",
  inclusionsLine: 'Accommodation · Meals · Field activities · Programme support',
  placesNote: 'Limited places per departure',
  offerScopeLine:
    'Your 30% field offer applies to the selected fixed 2026 Manu Field Crew departures below.',
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
  duration: string
  /** Whether this option receives the 30% field offer. */
  hasPromoOffer: boolean
  /** Optional supporting copy (used by Other dates). */
  supportText?: string
}

/**
 * Fixed promotional departures + flexible “Other dates”.
 * Exact start/end dates TBD — edit this array only when dates are confirmed.
 */
export const MCV_RESULT_DEPARTURES: McvResultDeparture[] = [
  {
    key: 'dep-01',
    kind: 'promotional',
    departureLabel: 'Departure 01',
    dateRange: '13 September – 10 October 2026',
    duration: '4 weeks',
    hasPromoOffer: true,
  },
  {
    key: 'dep-02',
    kind: 'promotional',
    departureLabel: 'Departure 02',
    dateRange: '8 November – 5 December 2026',
    duration: '4 weeks',
    hasPromoOffer: true,
  },
  {
    key: 'dep-03',
    kind: 'promotional',
    departureLabel: 'Departure 03',
    dateRange: 'Dates TBC — December 2026',
    duration: '4 weeks',
    hasPromoOffer: true,
  },
  {
    key: 'other-dates',
    kind: 'other',
    departureLabel: 'Other dates',
    dateRange: 'Flexible',
    duration: '4 weeks',
    hasPromoOffer: false,
    supportText:
      'Prefer a different time? We may be able to arrange alternative dates subject to availability.',
  },
]

/**
 * Maps modal preferred timing → closest fixed departure (or Other dates).
 * Update when promotional windows change.
 */
export const MCV_TIMING_TO_DEPARTURE_KEY: Record<McvTimingKey, string> = {
  'September 2026': 'dep-01',
  'October 2026': 'dep-01',
  'November 2026': 'dep-02',
  'December 2026': 'dep-03',
  'Early 2027': 'other-dates',
}

export type McvQualificationData = {
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
