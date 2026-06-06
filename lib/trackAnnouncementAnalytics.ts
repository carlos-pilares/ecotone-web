import { trackEvent } from '@/lib/analytics'
import { getAnalyticsPageContext } from '@/lib/trackWhatsappClick'

export type AnnouncementAnalyticsParams = {
  announcement_name: string
  page_type?: string
  page_slug?: string
}

function withPageContext(params: AnnouncementAnalyticsParams) {
  const context = getAnalyticsPageContext(
    typeof window !== 'undefined' ? window.location.pathname : '/',
  )
  return {
    announcement_name: params.announcement_name.trim(),
    page_type: params.page_type ?? context.page_type,
    page_slug: params.page_slug ?? context.page_slug,
  }
}

/** Fire GA4 `announcement_click` when the announcement CTA is clicked. */
export function trackAnnouncementClick(params: AnnouncementAnalyticsParams): void {
  if (typeof window === 'undefined') return
  const name = params.announcement_name.trim()
  if (!name) return
  trackEvent('announcement_click', withPageContext({ ...params, announcement_name: name }))
}

/** Fire GA4 `announcement_dismiss` when the dismiss control is clicked. */
export function trackAnnouncementDismiss(params: AnnouncementAnalyticsParams): void {
  if (typeof window === 'undefined') return
  const name = params.announcement_name.trim()
  if (!name) return
  trackEvent('announcement_dismiss', withPageContext({ ...params, announcement_name: name }))
}

/** Stable announcement identifier for analytics (CMS has no dedicated name field yet). */
export function announcementNameFromMessage(message: string): string {
  return message.trim().slice(0, 120)
}
