import { trackEvent, type GtagEventParams } from '@/lib/analytics'

export const WBTW_PAGE_PATH = '/wonder-beyond-the-wonder'
export const WBTW_CAMPAIGN_PAGE = 'wonder_beyond_the_wonder'
export const WBTW_FLOW_TYPE = 'wonder_beyond_the_wonder'
export const WBTW_FLOW_LABEL = 'Wonder Beyond the Wonder'

export type WbtwCtaLocation =
  | 'hero'
  | 'header'
  | 'how_it_works'
  | 'experience_section'
  | 'benefit_section'
  | 'final_cta'

export type WbtwCloseMethod = 'close_button' | 'backdrop' | 'escape' | 'thank_you_close'

export type WbtwSubmissionChannel = 'form' | 'whatsapp'

export type WbtwCampaignQueryParams = {
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

/** Reset when a new modal session opens so one success = one generate_lead. */
export function resetWbtwLeadConversionGuard(): void {
  leadConversionFired = false
}

export function readWbtwCampaignQueryParams(): WbtwCampaignQueryParams {
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

/** Shared campaign context for every WBTW GA event (no PII). */
export function getWbtwBaseEventParams(): GtagEventParams {
  const campaign = readWbtwCampaignQueryParams()
  return {
    page_path: WBTW_PAGE_PATH,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    campaign_page: WBTW_CAMPAIGN_PAGE,
    flow_type: WBTW_FLOW_TYPE,
    flow_label: WBTW_FLOW_LABEL,
    utm_source: campaign.utm_source || undefined,
    utm_medium: campaign.utm_medium || undefined,
    utm_campaign: campaign.utm_campaign || undefined,
    utm_term: campaign.utm_term || undefined,
    utm_content: campaign.utm_content || undefined,
  }
}

/** Thin wrapper around `trackEvent` with WBTW campaign defaults. */
export function trackWbtwEvent(name: string, params?: GtagEventParams): void {
  if (typeof window === 'undefined') return
  trackEvent(name, { ...getWbtwBaseEventParams(), ...params })
}

export function trackWbtwCtaClick(params: {
  cta_label: string
  cta_location: WbtwCtaLocation
}): void {
  trackWbtwEvent('wbtw_cta_click', {
    cta_label: params.cta_label,
    cta_location: params.cta_location,
  })
}

export function trackWbtwModalOpen(opened_from: WbtwCtaLocation): void {
  resetWbtwLeadConversionGuard()
  trackWbtwEvent('wbtw_modal_open', { opened_from })
}

export function trackWbtwModalClose(params: {
  close_method: WbtwCloseMethod
  opened_from: WbtwCtaLocation | null
  form_started: boolean
}): void {
  trackWbtwEvent('wbtw_modal_close', {
    close_method: params.close_method,
    opened_from: params.opened_from ?? undefined,
    form_started: params.form_started,
  })
}

export function trackWbtwFormStart(params: {
  first_field: string
  opened_from: WbtwCtaLocation | null
}): void {
  trackWbtwEvent('wbtw_form_start', {
    first_field: params.first_field,
    opened_from: params.opened_from ?? undefined,
  })
}

export function trackWbtwFormFieldSelect(params: {
  field_name: 'travelTiming' | 'groupSize' | 'interest'
  field_value: string
}): void {
  if (!params.field_value.trim()) return
  trackWbtwEvent('wbtw_form_field_select', {
    field_name: params.field_name,
    field_value: params.field_value,
  })
}

export function trackWbtwFormValidationError(params: {
  submission_channel: WbtwSubmissionChannel
  missing_fields: string
  invalid_fields: string
}): void {
  trackWbtwEvent('wbtw_form_validation_error', {
    submission_channel: params.submission_channel,
    missing_fields: params.missing_fields || undefined,
    invalid_fields: params.invalid_fields || undefined,
  })
}

export function trackWbtwSubmitAttempt(params: {
  submission_channel: WbtwSubmissionChannel
  travel_timing: string
  group_size: string
  interest: string
}): void {
  trackWbtwEvent('wbtw_submit_attempt', {
    submission_channel: params.submission_channel,
    travel_timing: params.travel_timing,
    group_size: params.group_size,
    interest: params.interest || 'Not sure yet',
  })
}

export function trackWbtwSubmitError(params: {
  submission_channel: WbtwSubmissionChannel
  error_type: 'api_error' | 'network_error' | 'validation_error' | 'unknown_error'
}): void {
  trackWbtwEvent('wbtw_submit_error', {
    submission_channel: params.submission_channel,
    error_type: params.error_type,
  })
}

/**
 * Conversion on successful `/api/enquiry` save.
 * Fires `enquiry_submit` + `generate_lead` once per modal success session.
 */
export function trackWbtwLeadSuccess(params: {
  submission_channel: WbtwSubmissionChannel
  travel_timing: string
  group_size: string
  interest: string
}): void {
  if (typeof window === 'undefined' || leadConversionFired) return
  leadConversionFired = true

  const shared = {
    submission_channel: params.submission_channel,
    travel_timing: params.travel_timing,
    group_size: params.group_size,
    interest: params.interest || 'Not sure yet',
    lead_type: WBTW_FLOW_TYPE,
  }

  trackWbtwEvent('enquiry_submit', shared)
  trackWbtwEvent('generate_lead', shared)
}

export function trackWbtwWhatsappOpen(): void {
  trackWbtwEvent('wbtw_whatsapp_open', {
    submission_channel: 'whatsapp',
  })
}

export function trackWbtwThankYouView(submission_channel: WbtwSubmissionChannel): void {
  trackWbtwEvent('wbtw_thank_you_view', {
    submission_channel,
  })
}
