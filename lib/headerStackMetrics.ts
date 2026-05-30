/** Fixed top nav + optional announcement bar — shared layout metrics. */

export function parseCssPx(raw: string, fallback = 0): number {
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n >= 0 ? n : fallback
}

export function effectiveMainNavH(): number {
  if (typeof document === 'undefined') return 64
  const v = getComputedStyle(document.documentElement).getPropertyValue('--nav-h').trim()
  const n = parseCssPx(v, 64)
  return n > 20 ? n : 64
}

export function effectiveAnnouncementH(): number {
  if (typeof document === 'undefined') return 0
  const v = getComputedStyle(document.documentElement).getPropertyValue('--announcement-h').trim()
  return parseCssPx(v, 0)
}

export function effectiveHeaderStackH(): number {
  return effectiveMainNavH() + effectiveAnnouncementH()
}
