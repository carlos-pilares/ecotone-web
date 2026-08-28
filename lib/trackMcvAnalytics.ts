import {
  MCV_CAMPAIGN_NAME,
  MCV_EXPERIENCE_NAME,
  MCV_LANDING_PATH,
} from '@/app/manu-conservation-volunteer/mcv-campaign'
import { trackEvent, type GtagEventParams } from '@/lib/analytics'

export const MCV_PAGE_PATH = MCV_LANDING_PATH
export const MCV_RESULT_PATH = '/manu-conservation-volunteer/result'
export const MCV_CAMPAIGN_PAGE = 'manu_conservation_volunteer'
export const MCV_FLOW_TYPE = 'manu_conservation_volunteer'
export const MCV_FLOW_LABEL = 'Manu Conservation Volunteer'

export const MCV_CTA_LOCATIONS = [
  'header',
  'hero',
  'fieldwork',
  'reasons',
  'enjoy',
  'science',
  'opportunity',
  'how_it_works',
  'footer',
] as const

export type McvCtaLocation = (typeof MCV_CTA_LOCATIONS)[number]

export type McvCampaignQueryParams = {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_term: string
  utm_content: string
  gclid: string
  gbraid: string
  wbraid: string
}

let leadConversionFired = false
let sessionOriginCtaLocation: McvCtaLocation | null = null

export function isMcvCtaLocation(value: unknown): value is McvCtaLocation {
  return typeof value === 'string' && (MCV_CTA_LOCATIONS as readonly string[]).includes(value)
}

export function resetMcvLeadConversionGuard(): void {
  leadConversionFired = false
}

export function getMcvOriginCtaLocation(): McvCtaLocation | null {
  return sessionOriginCtaLocation
}

export function beginMcvModalSession(origin: McvCtaLocation): boolean {
  if (!isMcvCtaLocation(origin)) return false
  sessionOriginCtaLocation = origin
  resetMcvLeadConversionGuard()
  return true
}

export function clearMcvModalSession(): void {
  sessionOriginCtaLocation = null
}

/** Same URL-param reader as WBTW — read at event/submit time from `window.location.search`. */
export function readMcvCampaignQueryParams(): McvCampaignQueryParams {
  if (typeof window === 'undefined') {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
      gclid: '',
      gbraid: '',
      wbraid: '',
    }
  }
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source') ?? '',
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
    utm_term: params.get('utm_term') ?? '',
    utm_content: params.get('utm_content') ?? '',
    gclid: params.get('gclid') ?? '',
    gbraid: params.get('gbraid') ?? '',
    wbraid: params.get('wbraid') ?? '',
  }
}

function resolvePagePath(): string {
  if (typeof window === 'undefined') return MCV_PAGE_PATH
  return window.location.pathname || MCV_PAGE_PATH
}

/** Shared campaign context for every MCV GA event (no PII). */
export function getMcvBaseEventParams(): GtagEventParams {
  const campaign = readMcvCampaignQueryParams()
  return {
    page_path: resolvePagePath(),
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    campaign_page: MCV_CAMPAIGN_PAGE,
    campaign_name: MCV_CAMPAIGN_NAME,
    experience_name: MCV_EXPERIENCE_NAME,
    flow_type: MCV_FLOW_TYPE,
    flow_label: MCV_FLOW_LABEL,
    utm_source: campaign.utm_source || undefined,
    utm_medium: campaign.utm_medium || undefined,
    utm_campaign: campaign.utm_campaign || undefined,
    utm_term: campaign.utm_term || undefined,
    utm_content: campaign.utm_content || undefined,
    gclid: campaign.gclid || undefined,
    ...(sessionOriginCtaLocation ? { opened_from: sessionOriginCtaLocation } : {}),
  }
}

export function trackMcvEvent(name: string, params?: GtagEventParams): void {
  if (typeof window === 'undefined') return
  trackEvent(name, { ...getMcvBaseEventParams(), ...params })
}

export function trackMcvCtaClick(params: {
  cta_label: string
  cta_location: McvCtaLocation
}): void {
  trackMcvEvent('mcv_cta_click', {
    cta_label: params.cta_label,
    cta_location: params.cta_location,
  })
}

export function trackMcvModalOpen(opened_from: McvCtaLocation): void {
  if (!beginMcvModalSession(opened_from)) return
  trackMcvEvent('mcv_modal_open', {
    opened_from,
  })
}

export function trackMcvFormStart(params: { opened_from: McvCtaLocation | null }): void {
  const openedFrom = params.opened_from ?? sessionOriginCtaLocation ?? undefined
  trackMcvEvent('mcv_form_start', {
    opened_from: openedFrom,
  })
}

export function trackMcvFormFieldSelect(params: {
  field_name: 'travel_timing' | 'group_size'
  field_value: string
}): void {
  if (!params.field_value.trim()) return
  trackMcvEvent('mcv_form_field_select', {
    field_name: params.field_name,
    field_value: params.field_value,
  })
}

export function trackMcvFormValidationError(params: {
  field_name: string
  error_type: 'missing_required' | 'invalid_format'
}): void {
  trackMcvEvent('mcv_form_validation_error', {
    field_name: params.field_name,
    error_type: params.error_type,
  })
}

export function trackMcvSubmitAttempt(params: {
  travel_timing: string
  group_size: string
  opened_from: McvCtaLocation | null
}): void {
  trackMcvEvent('mcv_submit_attempt', {
    travel_timing: params.travel_timing,
    group_size: params.group_size,
    opened_from: params.opened_from ?? sessionOriginCtaLocation ?? undefined,
  })
}

export function trackMcvSubmitError(params: {
  error_type: 'api_error' | 'network_error' | 'validation_error' | 'unknown_error'
}): void {
  trackMcvEvent('mcv_submit_error', {
    error_type: params.error_type,
  })
}

/**
 * Conversion on successful `/api/enquiry` save.
 * Fires `enquiry_submit` + `generate_lead` once per modal success session.
 */
export function trackMcvLeadSuccess(params: {
  travel_timing: string
  group_size: string
  opened_from: McvCtaLocation | null
}): void {
  if (typeof window === 'undefined' || leadConversionFired) return
  leadConversionFired = true

  const shared = {
    submission_channel: 'web_form',
    travel_timing: params.travel_timing,
    group_size: params.group_size,
    opened_from: params.opened_from ?? sessionOriginCtaLocation ?? undefined,
    lead_type: 'Campaign',
    campaign_name: MCV_CAMPAIGN_NAME,
    experience_name: MCV_EXPERIENCE_NAME,
    flow_type: MCV_FLOW_TYPE,
  }

  trackMcvEvent('enquiry_submit', shared)
  trackMcvEvent('generate_lead', shared)
}

export function trackMcvResultView(params: {
  travel_timing?: string
  group_size?: string
}): void {
  trackMcvEvent('mcv_result_view', {
    travel_timing: params.travel_timing || undefined,
    group_size: params.group_size || undefined,
  })
}

export function trackMcvFixedDepartureSelect(params: {
  departure_key: string
  departure_dates: string
}): void {
  trackMcvEvent('mcv_fixed_departure_select', {
    departure_key: params.departure_key,
    departure_dates: params.departure_dates,
  })
}

export function trackMcvWetravelClick(params: {
  departure_key: string
  departure_dates: string
}): void {
  trackMcvEvent('mcv_wetravel_click', {
    departure_key: params.departure_key,
    departure_dates: params.departure_dates,
    booking_provider: 'wetravel',
  })
}

export function trackMcvOtherDatesSelect(): void {
  trackMcvEvent('mcv_other_dates_select')
}

export function trackMcvOtherDatesSubmit(): void {
  trackMcvEvent('mcv_other_dates_submit')
}

export function trackMcvCalendlyClick(params: { cta_location: string }): void {
  trackMcvEvent('mcv_calendly_click', {
    cta_location: params.cta_location,
  })
}

/** Map form validation keys to safe analytics field names (no values). */
export function mcvAnalyticsFieldName(key: string): string {
  switch (key) {
    case 'travelTiming':
      return 'travel_timing'
    case 'groupSize':
      return 'group_size'
    case 'fullName':
      return 'full_name'
    case 'email':
      return 'email'
    case 'phone':
      return 'phone'
    default:
      return key
  }
}

export function classifyMcvValidationErrors(
  errors: Partial<Record<string, string>>,
): { field_name: string; error_type: 'missing_required' | 'invalid_format' } | null {
  const missing: string[] = []
  const invalid: string[] = []
  for (const [key, message] of Object.entries(errors)) {
    if (!message) continue
    const name = mcvAnalyticsFieldName(key)
    if (message === 'Required') missing.push(name)
    else invalid.push(name)
  }
  if (missing.length > 0) {
    return { field_name: missing.join(','), error_type: 'missing_required' }
  }
  if (invalid.length > 0) {
    return { field_name: invalid.join(','), error_type: 'invalid_format' }
  }
  return null
}
