import Script from 'next/script'

import { GA_MEASUREMENT_ID } from '@/lib/analytics'

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
gtag('js', new Date());
gtag('config', '${id}');
`}
      </Script>
    </>
  )
}
