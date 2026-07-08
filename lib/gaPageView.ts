import { GA_MEASUREMENT_ID } from '@/lib/analytics'

declare global {
  interface Window {
    __ecotoneSuppressModalPageViews?: number
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

/** Run a History API mutation without GA4 treating it as a page navigation. */
export function runWithModalHistoryAnalyticsSuppressed(run: () => void): void {
  const release = suppressModalHistoryPageViews()
  try {
    run()
  } finally {
    queueMicrotask(() => {
      window.setTimeout(release, 50)
    })
  }
}

/**
 * Fire a page_view for real route navigations only (Next.js pathname change).
 * Modal query-param History API updates must not call this.
 */
export function trackRoutePageView(pathname: string): void {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return

  const page_path = `${pathname}${window.location.search}`
  window.gtag('event', 'page_view', {
    page_path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

/** Inline script installed before gtag config — filters auto page_view during modal history. */
export function gaModalHistoryGuardScript(): string {
  return `
window.dataLayer = window.dataLayer || [];
window.__ecotoneSuppressModalPageViews = 0;
(function () {
  var originalPush = window.dataLayer.push.bind(window.dataLayer);
  function isAutoPageView(entry) {
    if (!entry) return false;
    if (Array.isArray(entry)) return entry[0] === 'event' && entry[1] === 'page_view';
    if (typeof entry === 'object') return entry.event === 'page_view';
    return false;
  }
  window.dataLayer.push = function () {
    if ((window.__ecotoneSuppressModalPageViews || 0) > 0) {
      for (var i = 0; i < arguments.length; i++) {
        if (isAutoPageView(arguments[i])) return arguments.length;
      }
    }
    return originalPush.apply(window.dataLayer, arguments);
  };
})();
`.trim()
}
