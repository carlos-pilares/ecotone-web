import Script from 'next/script'

import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from '@/lib/analytics'
import { consentModeDefaultScript } from '@/lib/consent'
import { gaModalHistoryGuardScript } from '@/lib/gaPageView'

const GA_DEBUG =
  process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_GA_DEBUG === 'true'

/**
 * Loads a single Google tag (gtag.js) when GA4 and/or Google Ads is configured.
 * No Google Tag Manager, and no second standalone gtag.js — Google Ads is added
 * as an extra `gtag('config', …)` destination on the same tag.
 *
 * Both destinations use `send_page_view: false`. GA4 page_view is fired manually
 * per real route change (`GaRoutePageView`), and Google Ads never receives a
 * synthetic page_view. Google Ads conversions are imported from GA4 key events.
 */
export function GoogleAnalytics() {
  const gaId = GA_MEASUREMENT_ID
  const adsId = GOOGLE_ADS_ID
  if (!gaId && !adsId) return null

  const scriptId = gaId || adsId

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${scriptId}`} strategy="afterInteractive" />
      <Script id="ga4-gtag-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
${consentModeDefaultScript()}
${gaModalHistoryGuardScript(GA_DEBUG)}
gtag('js', new Date());
${gaId ? `gtag('config', '${gaId}', { send_page_view: false });` : ''}
${adsId ? `gtag('config', '${adsId}', { send_page_view: false });` : ''}
${GA_DEBUG ? `
var __ecotoneGtag = gtag;
gtag = function () {
  console.log('[GA4 gtag]', Array.prototype.slice.call(arguments));
  return __ecotoneGtag.apply(this, arguments);
};
window.gtag = gtag;
` : ''}
`}
      </Script>
    </>
  )
}
