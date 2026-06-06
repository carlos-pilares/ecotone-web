import { trackEvent } from '@/lib/analytics'

export type ExperienceCardClickSourceSection =
  | 'home'
  | 'routes'
  | 'lodge'
  | 'related_experiences'
  | 'mega_menu'

export type ExperienceAnalyticsFields = {
  experience_name: string
  experience_slug: string
  route?: string
  program_type?: string
}

let lastExperienceViewKey = ''

/** Public `/experiences/{slug}` segment, or null when href is not an experience landing. */
export function parseExperienceSlugFromHref(href: string): string | null {
  const trimmed = href.trim()
  if (!trimmed || /^https?:\/\//i.test(trimmed) || trimmed.startsWith('//')) return null

  try {
    const path = new URL(trimmed, 'https://www.ecotoneperu.com').pathname.replace(/\/$/, '')
    if (!path.startsWith('/experiences/')) return null
    const slug = path.slice('/experiences/'.length).split('/')[0]?.trim()
    return slug || null
  } catch {
    return null
  }
}

function compactExperienceFields(fields: ExperienceAnalyticsFields): Record<string, string> {
  const out: Record<string, string> = {
    experience_name: fields.experience_name,
    experience_slug: fields.experience_slug,
  }
  if (fields.route?.trim()) out.route = fields.route.trim()
  if (fields.program_type?.trim()) out.program_type = fields.program_type.trim()
  return out
}

/** Fire GA4 `experience_view` once per experience page load (deduped for Strict Mode). */
export function trackExperienceView(fields: ExperienceAnalyticsFields): void {
  if (typeof window === 'undefined') return

  const viewKey = `${fields.experience_slug}:${window.location.pathname}`
  if (lastExperienceViewKey === viewKey) return
  lastExperienceViewKey = viewKey

  trackEvent('experience_view', compactExperienceFields(fields))
}

export type ExperienceCardClickParams = ExperienceAnalyticsFields & {
  source_section: ExperienceCardClickSourceSection
}

/** Fire GA4 `experience_card_click` when navigating to an experience landing. */
export function trackExperienceCardClick(params: ExperienceCardClickParams): void {
  if (typeof window === 'undefined') return
  trackEvent('experience_card_click', {
    ...compactExperienceFields(params),
    source_section: params.source_section,
  })
}

/** Resolve slug from href and fire `experience_card_click`; no-op for non-experience links. */
export function trackExperienceCardClickFromHref(
  href: string,
  params: Omit<ExperienceCardClickParams, 'experience_slug'>,
): void {
  const experience_slug = parseExperienceSlugFromHref(href)
  if (!experience_slug) return
  trackExperienceCardClick({ ...params, experience_slug })
}
