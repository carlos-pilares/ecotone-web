'use client'

import Script from 'next/script'
import { useEffect } from 'react'

import { META_PIXEL_ID, trackMetaPageView } from '@/lib/metaPixel'

/**
 * Official Meta Pixel base code via `next/script`.
 * Loads only when `NEXT_PUBLIC_META_PIXEL_ID` is set.
 * Scoped to Wonder Beyond the Wonder — do not mount sitewide.
 *
 * PageView is fired once from a client effect (not in the init string)
 * so React Strict Mode / remounts do not duplicate it.
 */
export function MetaPixel() {
  const pixelId = META_PIXEL_ID
  if (!pixelId) return null

  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
`}
      </Script>
      <MetaPixelPageView />
    </>
  )
}

/** Sends `fbq('track', 'PageView')` once when the WBTW landing mounts. */
function MetaPixelPageView() {
  useEffect(() => {
    trackMetaPageView()
    // If fbq is not ready yet, retry briefly after the stub loads fbevents.js.
    if (typeof window !== 'undefined' && typeof window.fbq !== 'function') {
      const id = window.setInterval(() => {
        if (typeof window.fbq === 'function') {
          trackMetaPageView()
          window.clearInterval(id)
        }
      }, 100)
      const timeout = window.setTimeout(() => window.clearInterval(id), 5000)
      return () => {
        window.clearInterval(id)
        window.clearTimeout(timeout)
      }
    }
    return undefined
  }, [])

  return null
}
