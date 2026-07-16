/**
 * Meta (Facebook) Pixel helpers — mirrors the GA4 `trackEvent` pattern.
 * No-op when `NEXT_PUBLIC_META_PIXEL_ID` is missing or `fbq` is not loaded.
 * Never send PII.
 */

/** Pixel ID from `NEXT_PUBLIC_META_PIXEL_ID` (inlined at build time). */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? ''

/** Custom event parameters sent to Meta Pixel (`fbq('track' | 'trackCustom', …)`). */
export type MetaPixelParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void
      queue?: unknown[]
      push?: (...args: unknown[]) => void
      loaded?: boolean
      version?: string
    }
    _fbq?: Window['fbq']
    __ecotoneMetaPageViewSent?: boolean
  }
}

function compactParams(params?: MetaPixelParams): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined
  const out: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) out[key] = value
  }
  return Object.keys(out).length > 0 ? out : undefined
}

/** True when the Meta Pixel ID is configured and `fbq` is callable. */
export function isMetaPixelAvailable(): boolean {
  return Boolean(META_PIXEL_ID) && typeof window !== 'undefined' && typeof window.fbq === 'function'
}

/**
 * Fire a standard Meta Pixel event (`fbq('track', …)`).
 * No-op without a Pixel ID or before the script loads.
 */
export function trackMetaEvent(name: string, params?: MetaPixelParams): void {
  if (!META_PIXEL_ID || typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return

  const eventName = name.trim()
  if (!eventName) return

  const payload = compactParams(params)
  if (payload) {
    window.fbq('track', eventName, payload)
  } else {
    window.fbq('track', eventName)
  }
}

/**
 * Fire a custom Meta Pixel event (`fbq('trackCustom', …)`).
 * No-op without a Pixel ID or before the script loads.
 */
export function trackMetaCustomEvent(name: string, params?: MetaPixelParams): void {
  if (!META_PIXEL_ID || typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return

  const eventName = name.trim()
  if (!eventName) return

  const payload = compactParams(params)
  if (payload) {
    window.fbq('trackCustom', eventName, payload)
  } else {
    window.fbq('trackCustom', eventName)
  }
}

/** Standard Meta `PageView` — once per WBTW landing load. */
export function trackMetaPageView(): void {
  if (!isMetaPixelAvailable()) return
  if (window.__ecotoneMetaPageViewSent) return
  window.__ecotoneMetaPageViewSent = true
  trackMetaEvent('PageView')
}

/** Standard Meta `Lead` conversion (maps from GA `generate_lead`). */
export function trackMetaLead(params?: MetaPixelParams): void {
  trackMetaEvent('Lead', params)
}
