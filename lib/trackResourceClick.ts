import { trackEvent } from '@/lib/analytics'
import { getAnalyticsPageContext } from '@/lib/trackWhatsappClick'

export type ResourceClickType = 'brochure' | 'pdf' | 'guide' | 'external_resource'

export type ResourceClickParams = {
  resource_name: string
  resource_type: ResourceClickType
  experience_name?: string
  page_type?: string
  page_slug?: string
}

function withPageContext(params: ResourceClickParams) {
  const context = getAnalyticsPageContext(
    typeof window !== 'undefined' ? window.location.pathname : '/',
  )
  return {
    resource_name: params.resource_name.trim(),
    resource_type: params.resource_type,
    page_type: params.page_type ?? context.page_type,
    page_slug: params.page_slug ?? context.page_slug,
    ...(params.experience_name?.trim() ? { experience_name: params.experience_name.trim() } : {}),
  }
}

/** Fire GA4 `resource_click` when a resource download or external link is opened. */
export function trackResourceClick(params: ResourceClickParams): void {
  if (typeof window === 'undefined') return
  if (!params.resource_name.trim()) return
  trackEvent('resource_click', withPageContext(params))
}

export function resourceTypeFromCard(
  kind: 'map' | 'brochure' | 'termsPdf' | 'custom',
  downloadHref: string,
): ResourceClickType {
  switch (kind) {
    case 'brochure':
      return 'brochure'
    case 'termsPdf':
      return 'pdf'
    case 'map':
      return 'guide'
    case 'custom':
    default:
      return /^https?:\/\//i.test(downloadHref.trim()) ? 'external_resource' : 'pdf'
  }
}
