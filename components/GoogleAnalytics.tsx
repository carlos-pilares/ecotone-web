import Script from 'next/script'

import { GA_MEASUREMENT_ID } from '@/lib/analytics'
import { gaModalHistoryGuardScript } from '@/lib/gaPageView'

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
${gaModalHistoryGuardScript()}
gtag('js', new Date());
gtag('config', '${id}', { send_page_view: false });
`}
      </Script>
    </>
  )
}
