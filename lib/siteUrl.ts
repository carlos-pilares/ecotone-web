/**
 * Public site origin for SEO absolute URLs (canonical, Open Graph, JSON-LD, sitemap).
 * Never use mutable preview/deployment hosts (`VERCEL_URL`) — those must not become canonicals.
 */
export const PUBLIC_SITE_ORIGIN = 'https://www.ecotone.eco'

function normalizeOrigin(raw: string): string {
  return raw.trim().replace(/\/$/, '')
}

/**
 * Base URL for canonical and OG tags (no trailing slash).
 *
 * Resolution:
 * 1. `NEXT_PUBLIC_SITE_URL` when explicitly set (escape hatch for intentional overrides)
 * 2. Otherwise always `https://www.ecotone.eco`
 *
 * Preview / local builds therefore emit production SEO hosts unless overridden —
 * which is the correct anti-leak behaviour for canonicals.
 */
export function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return normalizeOrigin(fromEnv)
  return PUBLIC_SITE_ORIGIN
}

export function absoluteUrl(path: string): string {
  if (!path || path === '/') return siteOrigin()
  const p = path.startsWith('/') ? path : `/${path}`
  return `${siteOrigin()}${p}`
}
