/** GA4 measurement ID from `NEXT_PUBLIC_GA_MEASUREMENT_ID` (inlined at build time). */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? ''

export type GtagEventParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** Send a GA4 custom event when gtag is loaded. No-op without a measurement ID or in SSR. */
export function trackEvent(eventName: string, params?: GtagEventParams): void {
  const id = GA_MEASUREMENT_ID
  if (!id || typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params ?? {})
}
