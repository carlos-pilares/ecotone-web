import { trackEvent } from '@/lib/analytics'
import type { CtaId } from '@/lib/ctaIds'

export type WhatsappClickButtonLocation =
  | 'floating_whatsapp'
  | 'hero'
  | 'reserve_section'
  | 'footer'
  | 'announcement_bar'
  | 'booking_modal'

export type WhatsappClickParams = {
  button_location: WhatsappClickButtonLocation
  cta_id?: CtaId
  page_type?: string
  page_slug?: string
  experience_name?: string
  route?: string
  program_type?: string
}

export function isWhatsappHref(href: string | null | undefined): boolean {
  const h = (href ?? '').trim().toLowerCase()
  if (!h) return false
  return h.includes('wa.me') || h.includes('whatsapp.com') || h.startsWith('whatsapp:')
}

export function getAnalyticsPageContext(pathname: string): { page_type: string; page_slug: string } {
  const path = (pathname.split('?')[0] ?? '/').replace(/\/$/, '') || '/'

  if (path === '/') return { page_type: 'home', page_slug: 'home' }
  if (path === '/about') return { page_type: 'about', page_slug: 'about' }
  if (path === '/routes') return { page_type: 'routes', page_slug: 'routes' }
  if (path === '/journal') return { page_type: 'journal', page_slug: 'journal' }
  if (path.startsWith('/journal/')) {
    return { page_type: 'journal', page_slug: path.slice('/journal/'.length) || 'journal' }
  }
  if (path === '/experiences') return { page_type: 'experiences', page_slug: 'experiences' }
  if (path.startsWith('/experiences/')) {
    return { page_type: 'experience', page_slug: path.slice('/experiences/'.length) || 'experience' }
  }
  if (path.startsWith('/lodges/')) {
    return { page_type: 'lodge', page_slug: path.slice('/lodges/'.length) || 'lodge' }
  }

  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) return { page_type: 'home', page_slug: 'home' }
  if (segments.length === 1) return { page_type: segments[0]!, page_slug: segments[0]! }
  return { page_type: segments[0]!, page_slug: segments[1]! }
}

/** Fire GA4 `whatsapp_click` immediately before the browser opens WhatsApp. */
export function trackWhatsappClick(params: WhatsappClickParams): void {
  if (typeof window === 'undefined') return

  const { button_location, cta_id, page_type, page_slug, experience_name, route, program_type } = params
  const context = getAnalyticsPageContext(window.location.pathname)

  trackEvent('whatsapp_click', {
    page_type: page_type ?? context.page_type,
    page_slug: page_slug ?? context.page_slug,
    button_location,
    ...(cta_id ? { cta_id } : {}),
    ...(experience_name ? { experience_name } : {}),
    ...(route ? { route } : {}),
    ...(program_type ? { program_type } : {}),
  })
}
