/**
 * Google Consent Mode v2 (advanced mode).
 *
 * Storage defaults to granted (US/Canada opt-out model) and is denied for
 * EEA + UK visitors until they grant consent via the first-party banner.
 * In advanced mode the Google tag still loads and sends cookieless pings while
 * denied, so Google conversion modeling can recover EEA/UK measurement.
 */

/** First-party cookie storing the visitor's explicit consent choice. */
export const CONSENT_COOKIE = 'ecotone_consent'

/** Consent cookie lifetime (180 days). */
export const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 180

export type ConsentChoice = 'granted' | 'denied'

/**
 * EEA + UK regions where ad/analytics storage defaults to denied
 * (ISO 3166-1 alpha-2). Everywhere else defaults to granted.
 */
export const CONSENT_DENIED_REGIONS = [
  // EU member states
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
  // EEA (non-EU)
  'IS', 'LI', 'NO',
  // United Kingdom
  'GB',
] as const

/**
 * Inline Consent Mode v2 default signals (advanced mode). Must run before
 * `gtag('js')` and any `gtag('config', …)`. Expects a `gtag` function already
 * defined in scope (the Google tag init script).
 */
export function consentModeDefaultScript(): string {
  const regionList = JSON.stringify(CONSENT_DENIED_REGIONS)
  return `
gtag('consent', 'default', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
});
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  region: ${regionList},
  wait_for_update: 500,
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
`.trim()
}

/** Read the stored consent choice from the first-party cookie. */
export function readStoredConsent(): ConsentChoice | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)ecotone_consent=(granted|denied)/)
  return (match?.[1] as ConsentChoice | undefined) ?? null
}

/** Persist the visitor's consent choice in the first-party cookie. */
export function writeStoredConsent(choice: ConsentChoice): void {
  if (typeof document === 'undefined') return
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=${CONSENT_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`
}

/** Push a Consent Mode v2 update reflecting the visitor's explicit choice. */
export function applyConsent(choice: ConsentChoice): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('consent', 'update', {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  })
}
