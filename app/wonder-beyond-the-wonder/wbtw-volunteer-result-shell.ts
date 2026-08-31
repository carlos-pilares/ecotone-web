/**
 * Temporary visual-shell values for the WBTW volunteer result prototype.
 * Placeholder only — not live offer / booking logic.
 */
export const WBTW_VOLUNTEER_RESULT_SHELL = {
  discountPercent: 30,
  discountLabel: '30% OFF',
  voucherCode: 'BEYOND30',
  durationLabel: '4 weeks',
  availabilityLabel: 'Limited places',
  originalPrice: 'US$ 1,250',
  promoPrice: 'US$ 875',
  programmeName: '4-week field experience',
} as const

export type WbtwVolunteerDeparture = {
  key: string
  departureLabel: string
  monthYear: string
  dateRange: string
  duration: string
  recommended?: boolean
  recommendReason?: string
}

export const WBTW_VOLUNTEER_DEPARTURES: WbtwVolunteerDeparture[] = [
  {
    key: 'jun-2027',
    departureLabel: 'Departure 01',
    monthYear: 'June 2027',
    dateRange: '08 JUN — 05 JUL',
    duration: '4 weeks',
  },
  {
    key: 'jul-2027',
    departureLabel: 'Departure 02',
    monthYear: 'July 2027',
    dateRange: '08 JUL — 04 AUG',
    duration: '4 weeks',
    recommended: true,
    recommendReason: 'Ideal fieldwork window',
  },
  {
    key: 'aug-2027',
    departureLabel: 'Departure 03',
    monthYear: 'August 2027',
    dateRange: '08 AUG — 04 SEP',
    duration: '4 weeks',
  },
]

