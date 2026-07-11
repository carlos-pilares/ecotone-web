/** GA4 measurement ID from `NEXT_PUBLIC_GA_MEASUREMENT_ID` (inlined at build time). */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? ''

/**
 * Google Ads ID (`AW-…`) added as an extra destination on the existing Google tag.
 * Conversions are imported from GA4 key events (e.g. `generate_lead`), so no
 * standalone Google Ads event snippets or synthetic page_view are used here.
 *
 * Resolution:
 * - `NEXT_PUBLIC_GOOGLE_ADS_ID` set (any value, incl. `""`) always wins — `""` disables.
 * - Otherwise the default `AW-16757365006` applies in Vercel **production only**.
 * - Preview/staging/development get no Ads tag unless the env var is set explicitly.
 */
const EXPLICIT_GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const IS_VERCEL_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

export const GOOGLE_ADS_ID =
  EXPLICIT_GOOGLE_ADS_ID !== undefined
    ? EXPLICIT_GOOGLE_ADS_ID.trim()
    : IS_VERCEL_PRODUCTION
      ? 'AW-16757365006'
      : ''

/** Custom event parameters sent to GA4 (`gtag('event', …)`). */
export type GtagEventParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function compactParams(params?: GtagEventParams): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined
  const out: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) out[key] = value
  }
  return Object.keys(out).length > 0 ? out : undefined
}

/** True when gtag is callable in the browser (GA script loaded). */
export function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

/**
 * Send a GA4 custom event. No-op in SSR, without a measurement ID, or if gtag is not loaded.
 *
 * @example
 * trackEvent('book_now_click', {
 *   experience: 'Soqtapata Pristine Immersion',
 *   location: 'hero',
 * })
 */
export function trackEvent(name: string, params?: GtagEventParams): void {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return

  const eventName = name.trim()
  if (!eventName) return

  const payload = compactParams(params)
  if (payload) {
    window.gtag('event', eventName, payload)
  } else {
    window.gtag('event', eventName)
  }
}
