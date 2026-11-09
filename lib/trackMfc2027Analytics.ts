import {
  MFC2027_CAMPAIGN_NAME,
  MFC2027_DISCOUNT_PERCENT,
  MFC2027_EXPERIENCE_NAME,
  MFC2027_LANDING_PATH,
  MFC2027_OFFER_PRICE,
  type Mfc2027Departure,
} from '@/app/manu-field-crew-2027/mfc2027-campaign'
import { trackEvent, type GtagEventParams } from '@/lib/analytics'

export const MFC2027_CAMPAIGN_PAGE = 'manu_field_crew_2027'
export const MFC2027_FLOW_TYPE = 'manu_field_crew_2027'
export const MFC2027_FLOW_LABEL = 'Manu Field Crew 2027'

export const MFC2027_CTA_LOCATIONS = [
  'header',
  'hero',
  'fieldwork',
  'reasons',
  'enjoy',
  'science',
  'opportunity',
  'how_it_works',
  'final',
  'footer',
] as const

export type Mfc2027CtaLocation = (typeof MFC2027_CTA_LOCATIONS)[number]

let sessionOriginCtaLocation: Mfc2027CtaLocation | null = null
let leadConversionFired = false

function resolvePagePath(): string {
  if (typeof window === 'undefined') return MFC2027_LANDING_PATH
  return window.location.pathname || MFC2027_LANDING_PATH
}

function getBaseParams(): GtagEventParams {
  return {
    campaign_page: MFC2027_CAMPAIGN_PAGE,
    campaign_name: MFC2027_CAMPAIGN_NAME,
    experience_name: MFC2027_EXPERIENCE_NAME,
    flow_type: MFC2027_FLOW_TYPE,
    flow_label: MFC2027_FLOW_LABEL,
    page_path: resolvePagePath(),
    ...(sessionOriginCtaLocation ? { opened_from: sessionOriginCtaLocation } : {}),
  }
}

function trackMfc2027Event(name: string, params?: GtagEventParams): void {
  trackEvent(name, { ...getBaseParams(), ...params })
}

export function isMfc2027CtaLocation(value: unknown): value is Mfc2027CtaLocation {
  return typeof value === 'string' && (MFC2027_CTA_LOCATIONS as readonly string[]).includes(value)
}

export function trackMfc2027CtaClick(params: {
  cta_label: string
  cta_location: Mfc2027CtaLocation
}): void {
  if (!isMfc2027CtaLocation(params.cta_location)) return
  trackMfc2027Event('mfc2027_cta_click', {
    cta_label: params.cta_label,
    cta_location: params.cta_location,
  })
}

export function trackMfc2027ModalOpen(from: Mfc2027CtaLocation): void {
  sessionOriginCtaLocation = from
  leadConversionFired = false
  trackMfc2027Event('mfc2027_modal_open', {
    opened_from: from,
  })
}

export function trackMfc2027FormStart(params: { opened_from: Mfc2027CtaLocation | null }): void {
  trackMfc2027Event('mfc2027_form_start', {
    opened_from: params.opened_from ?? sessionOriginCtaLocation ?? undefined,
  })
}

export function trackMfc2027FormFieldSelect(params: {
  field_name: string
  field_value: string
}): void {
  trackMfc2027Event('mfc2027_form_field_select', {
    field_name: params.field_name,
    field_value: params.field_value,
  })
}

export function trackMfc2027FormValidationError(params: {
  missing_required: string[]
  invalid_email: boolean
  invalid_phone: boolean
}): void {
  trackMfc2027Event('mfc2027_form_validation_error', {
    missing_required: params.missing_required.join(','),
    invalid_email: params.invalid_email,
    invalid_phone: params.invalid_phone,
  })
}

export function trackMfc2027SubmitAttempt(params: {
  travel_timing: string
  group_size: string
  opened_from: Mfc2027CtaLocation | null
}): void {
  trackMfc2027Event('mfc2027_submit_attempt', {
    travel_timing: params.travel_timing,
    group_size: params.group_size,
    opened_from: params.opened_from ?? sessionOriginCtaLocation ?? undefined,
  })
}

export function trackMfc2027SubmitError(params: {
  error_type: 'api_error' | 'network_error' | 'validation_error' | 'unknown_error'
}): void {
  trackMfc2027Event('mfc2027_submit_error', {
    error_type: params.error_type,
  })
}

/**
 * Conversion on successful `/api/enquiry` save.
 * Fires `enquiry_submit` + `generate_lead` once per modal success session.
 */
export function trackMfc2027LeadSuccess(params: {
  travel_timing: string
  group_size: string
  opened_from: Mfc2027CtaLocation | null
}): void {
  if (typeof window === 'undefined' || leadConversionFired) return
  leadConversionFired = true

  const shared = {
    submission_channel: 'web_form',
    travel_timing: params.travel_timing,
    group_size: params.group_size,
    opened_from: params.opened_from ?? sessionOriginCtaLocation ?? undefined,
    lead_type: 'Campaign',
    campaign_name: MFC2027_CAMPAIGN_NAME,
    experience_name: MFC2027_EXPERIENCE_NAME,
    flow_type: MFC2027_FLOW_TYPE,
  }

  trackMfc2027Event('enquiry_submit', shared)
  trackMfc2027Event('generate_lead', shared)
}

export function trackMfc2027ResultView(params?: {
  travel_timing?: string
  group_size?: string
}): void {
  trackMfc2027Event('mfc2027_result_view', {
    offer_price: MFC2027_OFFER_PRICE,
    discount_percent: MFC2027_DISCOUNT_PERCENT,
    travel_timing: params?.travel_timing || undefined,
    group_size: params?.group_size || undefined,
  })
}

function departureParams(departure: Mfc2027Departure): GtagEventParams {
  return {
    departure_key: departure.key,
    departure_start: departure.startIso,
    departure_end: departure.endIso,
    offer_price: MFC2027_OFFER_PRICE,
    discount_percent: MFC2027_DISCOUNT_PERCENT,
  }
}

export function trackMfc2027DepartureSelect(departure: Mfc2027Departure): void {
  trackMfc2027Event('mfc2027_departure_select', departureParams(departure))
}

export function trackMfc2027WetravelClick(departure?: Mfc2027Departure | null): void {
  trackMfc2027Event('mfc2027_wetravel_click', {
    booking_provider: 'wetravel',
    offer_price: MFC2027_OFFER_PRICE,
    discount_percent: MFC2027_DISCOUNT_PERCENT,
    ...(departure ? departureParams(departure) : {}),
  })
}

export function trackMfc2027BookCallClick(): void {
  trackMfc2027Event('mfc2027_book_call_click', {
    cta_location: 'result_assistance',
  })
}

export function trackMfc2027FullProgrammeClick(params: { cta_location: string }): void {
  trackMfc2027Event('mfc2027_full_programme_click', {
    cta_location: params.cta_location,
  })
}

/**
 * Central booking outbound: analytics then open WeTravel.
 * Swap the navigation strategy here later for an embedded widget without redesigning the page.
 */
export function openMfc2027WeTravelBooking(
  departure: Mfc2027Departure | null | undefined,
  url: string,
): void {
  trackMfc2027WetravelClick(departure ?? null)
  window.open(url, '_blank', 'noopener,noreferrer')
}
