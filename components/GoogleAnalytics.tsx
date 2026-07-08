import Script from 'next/script'

import { GA_MEASUREMENT_ID } from '@/lib/analytics'
import { gaModalHistoryGuardScript } from '@/lib/gaPageView'

const GA_DEBUG =
  process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_GA_DEBUG === 'true'

/** Loads GA4 gtag.js when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. No Google Tag Manager. */
export function GoogleAnalytics() {
  const id = GA_MEASUREMENT_ID
  if (!id) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-gtag-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
${gaModalHistoryGuardScript(GA_DEBUG)}
gtag('js', new Date());
gtag('config', '${id}', { send_page_view: false });
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
