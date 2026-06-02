import { trackEvent } from '@/lib/analytics'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import { getAnalyticsPageContext } from '@/lib/trackWhatsappClick'

export type BookNowClickButtonLocation =
  | 'header'
  | 'hero'
  | 'sticky_nav'
  | 'reserve_section'
  | 'experience_card'
  | 'booking_modal'

export type BookNowOpenSource = {
  button_location: BookNowClickButtonLocation
  price?: string
  promo_label?: string
}

export type BookNowClickParams = BookNowOpenSource & {
  page_type?: string
  page_slug?: string
  experience_name?: string
  route?: string
  program_type?: string
}

export type BookingModalOpenParams = {
  button_location: BookNowClickButtonLocation
  page_type?: string
  page_slug?: string
  experience_name?: string
  route?: string
  program_type?: string
}

/** Normalize CMS labels so “Book now” variants still count as book intent. */
export function isBookIntentLabel(raw: string): boolean {
  const n = raw
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[.!…]+$/u, '')
    .trim()
  if (!n) return false
  if (n.includes('whatsapp')) return false
  return n === 'book now' || n.startsWith('book ')
}

export function bookNowContextFromSummary(
  summary: ExperienceBookingSummary,
  source: BookNowOpenSource,
): BookNowClickParams {
  return {
    button_location: source.button_location,
    experience_name: summary.experienceName,
    route: summary.route,
    program_type: summary.programType,
    price: source.price ?? summary.priceLine,
    ...(source.promo_label ? { promo_label: source.promo_label } : {}),
  }
}

function withPageContext(params: BookNowClickParams | BookingModalOpenParams) {
  const context = getAnalyticsPageContext(
    typeof window !== 'undefined' ? window.location.pathname : '/',
  )
  return {
    page_type: params.page_type ?? context.page_type,
    page_slug: params.page_slug ?? context.page_slug,
    button_location: params.button_location,
    ...('experience_name' in params && params.experience_name
      ? { experience_name: params.experience_name }
      : {}),
    ...('route' in params && params.route ? { route: params.route } : {}),
    ...('program_type' in params && params.program_type ? { program_type: params.program_type } : {}),
    ...('price' in params && params.price ? { price: params.price } : {}),
    ...('promo_label' in params && params.promo_label ? { promo_label: params.promo_label } : {}),
  }
}

/** Fire GA4 `book_now_click` immediately on book-intent CTA click. */
export function trackBookNowClick(params: BookNowClickParams): void {
  if (typeof window === 'undefined') return
  trackEvent('book_now_click', withPageContext(params))
}

/** Fire GA4 `booking_modal_open` when a booking modal becomes visible. */
export function trackBookingModalOpen(params: BookingModalOpenParams): void {
  if (typeof window === 'undefined') return
  trackEvent('booking_modal_open', withPageContext(params))
}
