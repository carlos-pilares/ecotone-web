import { GA_MEASUREMENT_ID, trackEvent } from '@/lib/analytics'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import type { CtaId } from '@/lib/ctaIds'
import { getAnalyticsPageContext } from '@/lib/trackWhatsappClick'

export type ConversionIntent = 'plan_journey' | 'book_experience'

export type ConversionChannel = 'email' | 'whatsapp'

export type EmailConversionParams = {
  conversion_intent: ConversionIntent
  channel?: ConversionChannel
  cta_id?: CtaId
  source?: string
  experienceSummary?: ExperienceBookingSummary
}

export type StandardConversionPayload = {
  conversion_intent: ConversionIntent
  channel: ConversionChannel
  page_path: string
  page_url: string
  cta_id?: string
  source?: string
  experience_slug?: string
  programme_type?: string
  lodge_slug?: string
}

function experienceSlugFromRoute(route: string | undefined): string | undefined {
  if (!route?.trim()) return undefined
  const match = route.trim().match(/\/experiences\/([^/?#]+)/i)
  return match?.[1]
}

/** Build the canonical conversion payload shared by all ad/analytics platforms. */
export function buildStandardConversionPayload(
  params: EmailConversionParams,
): StandardConversionPayload {
  if (typeof window === 'undefined') {
    return {
      conversion_intent: params.conversion_intent,
      channel: params.channel ?? 'email',
      page_path: '/',
      page_url: '/',
    }
  }

  const pathname = window.location.pathname
  const page_path = `${pathname}${window.location.search}`
  const page_url = window.location.href
  const context = getAnalyticsPageContext(pathname)

  const payload: StandardConversionPayload = {
    conversion_intent: params.conversion_intent,
    channel: params.channel ?? 'email',
    page_path,
    page_url,
  }

  if (params.cta_id) payload.cta_id = params.cta_id
  if (params.source) payload.source = params.source

  if (context.page_type === 'experience') {
    payload.experience_slug = context.page_slug
  } else {
    const slug = experienceSlugFromRoute(params.experienceSummary?.route)
    if (slug) payload.experience_slug = slug
  }

  if (context.page_type === 'lodge') {
    payload.lodge_slug = context.page_slug
  }

  const programmeType = params.experienceSummary?.programType?.trim()
  if (programmeType) payload.programme_type = programmeType

  return payload
}

function trackVirtualConversionPageView(payload: StandardConversionPayload): void {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return

  window.gtag('event', 'page_view', {
    page_path: payload.page_path,
    page_location: payload.page_url,
    page_title: document.title,
  })
}

/**
 * Canonical email conversion helper — the only place that fires success signals:
 * virtual page_view, enquiry_submit, and generate_lead.
 */
export function trackEmailConversionSuccess(params: EmailConversionParams): void {
  if (typeof window === 'undefined') return

  const payload = buildStandardConversionPayload(params)
  const eventPayload: Record<string, string> = { ...payload }

  trackVirtualConversionPageView(payload)
  trackEvent('enquiry_submit', eventPayload)
  trackEvent('generate_lead', {
    ...eventPayload,
    lead_type: params.conversion_intent,
  })
}
