/**
 * Legacy lodge `altitude` may be number, digits-as-string, or free text (e.g. "1,200 m.a.s.l.").
 * Used for nav / subtitles; returns null when absent or blank so nothing is appended.
 * GROQ exposes a single `altitude` via `coalesce(altitudeLegacy, altitude)`; values may be number or string.
 */
export function formatLodgeAltitudeForSubtitle(alt: unknown): string | null {
  if (alt == null) return null
  if (typeof alt === 'number' && Number.isFinite(alt)) return `${alt} m`
  const t = String(alt).trim()
  if (!t) return null
  if (/\bm\b|m\.?\s*a\.?\s*s\.?\s*l\.?/i.test(t)) return t
  const n = Number(t.replace(/,/g, ''))
  if (Number.isFinite(n) && n >= 0) return `${n} m`
  return t
}
