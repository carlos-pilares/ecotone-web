import { GA_MEASUREMENT_ID } from '@/lib/analytics'

/** Delay before releasing per-operation suppression (EM may fire page_view asynchronously). */
export const MODAL_HISTORY_SUPPRESS_MS = 500

declare global {
  interface Window {
    __ecotoneSuppressModalPageViews?: number
    __ecotoneAllowRoutePageView?: boolean
    __ecotoneGaDebug?: boolean
  }
}

/** Suppress GA4 auto page_view events triggered by modal History API updates. */
export function suppressModalHistoryPageViews(): () => void {
  if (typeof window === 'undefined') return () => {}
  window.__ecotoneSuppressModalPageViews = (window.__ecotoneSuppressModalPageViews ?? 0) + 1
  return () => {
    window.__ecotoneSuppressModalPageViews = Math.max(0, (window.__ecotoneSuppressModalPageViews ?? 0) - 1)
  }
}

function releaseModalHistorySuppressionAfterDelay(release: () => void): void {
  queueMicrotask(() => {
    window.setTimeout(release, MODAL_HISTORY_SUPPRESS_MS)
  })
}

/** Run a History API mutation without GA4 treating it as a page navigation. */
export function runWithModalHistoryAnalyticsSuppressed(run: () => void): void {
  const release = suppressModalHistoryPageViews()
  try {
    run()
  } finally {
    releaseModalHistorySuppressionAfterDelay(release)
  }
}

export { releaseModalHistorySuppressionAfterDelay }

/**
 * Fire a page_view for real route navigations only (Next.js pathname change).
 * Modal query-param History API updates must not call this.
 */
export function trackRoutePageView(pathname: string): void {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return

  const page_path = `${pathname}${window.location.search}`
  window.__ecotoneAllowRoutePageView = true
  try {
    window.gtag('event', 'page_view', {
      page_path,
      page_location: window.location.href,
      page_title: document.title,
    })
  } finally {
    window.__ecotoneAllowRoutePageView = false
  }
}

/** Inline script installed before gtag config — filters auto page_view during modal history. */
export function gaModalHistoryGuardScript(gaDebug: boolean): string {
  return `
window.dataLayer = window.dataLayer || [];
window.__ecotoneSuppressModalPageViews = 0;
window.__ecotoneAllowRoutePageView = false;
window.__ecotoneGaDebug = ${gaDebug ? 'true' : 'false'};
(function () {
  var originalPush = window.dataLayer.push.bind(window.dataLayer);
  function isPageViewEntry(entry) {
    if (!entry) return false;
    // gtag pushes dataLayer.push(arguments) — array-like, not Array.isArray
    if (entry[0] === 'event' && entry[1] === 'page_view') return true;
    if (Array.isArray(entry) && entry[0] === 'event' && entry[1] === 'page_view') return true;
    if (typeof entry === 'object' && entry.event === 'page_view') return true;
    return false;
  }
  window.dataLayer.push = function () {
    var suppress = window.__ecotoneSuppressModalPageViews || 0;
    var allowRoute = window.__ecotoneAllowRoutePageView || false;
    if (window.__ecotoneGaDebug) {
      for (var d = 0; d < arguments.length; d++) {
        console.log('[GA4 dataLayer]', arguments[d]);
      }
    }
    if (suppress > 0 && !allowRoute) {
      for (var i = 0; i < arguments.length; i++) {
        if (isPageViewEntry(arguments[i])) {
          if (window.__ecotoneGaDebug) {
            console.log('[GA4] blocked page_view (modal history suppression active)');
          }
          return arguments.length;
        }
      }
    }
    return originalPush.apply(window.dataLayer, arguments);
  };
})();
`.trim()
}
