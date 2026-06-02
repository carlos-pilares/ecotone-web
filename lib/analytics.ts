/** GA4 measurement ID from `NEXT_PUBLIC_GA_MEASUREMENT_ID` (inlined at build time). */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? ''

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
