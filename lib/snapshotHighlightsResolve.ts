import type { SoqtapataPhase1Stat } from '@/data/soqtapataExperienceLocal'

export type CmsSnapshotHighlightRow = {
  _key?: string | null
  title?: string | null
  subtitle?: string | null
}

const MAX_SNAPSHOT_HIGHLIGHTS_ON_PAGE = 6

function warnCurateKeyMiss(context: string, key: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[experiencePage CMS] ${context}: could not resolve snapshot highlight key "${key}"`)
  }
}

function snapshotHighlightKeyAt(index: number): string {
  return `snapshot-${index}`
}

/**
 * Experience page stats bar from KC `snapshotHighlights[]` + page `snapshotHighlightOrderKeys`.
 * Empty page selection → first 6 KC rows in order. No logistics slots or local fallback.
 */
export function buildSnapshotHighlightsBarFromCms(
  highlights: CmsSnapshotHighlightRow[] | null | undefined,
  orderKeys: string[] | null | undefined,
): SoqtapataPhase1Stat[] {
  const rows = (highlights ?? []).filter(
    (h) => h && (String(h.title ?? '').trim() || String(h.subtitle ?? '').trim()),
  )
  if (!rows.length) return []

  const hasSelection = (orderKeys?.length ?? 0) > 0
  let ordered: CmsSnapshotHighlightRow[]

  if (!hasSelection) {
    ordered = rows.slice(0, MAX_SNAPSHOT_HIGHLIGHTS_ON_PAGE)
  } else {
    const keyed = rows.map((r, i) => ({
      ...r,
      _key: (r._key && String(r._key).trim()) || snapshotHighlightKeyAt(i),
    }))
    const m = new Map<string, CmsSnapshotHighlightRow>()
    keyed.forEach((r, i) => {
      m.set(r._key!, r)
      m.set(snapshotHighlightKeyAt(i), r)
    })
    ordered = []
    for (const rawKey of orderKeys!) {
      const key = String(rawKey).trim()
      if (!key) continue
      let row = m.get(key)
      if (!row) {
        const legacy = /^snapshot-(\d+)$/.exec(key)
        if (legacy) row = m.get(snapshotHighlightKeyAt(Number(legacy[1])))
      }
      if (row) {
        ordered.push(row)
      } else {
        warnCurateKeyMiss('snapshot highlights', key)
      }
    }
    ordered = ordered.slice(0, MAX_SNAPSHOT_HIGHLIGHTS_ON_PAGE)
  }

  return ordered.map((h) => ({
    n: String(h.title ?? '').trim() || '—',
    l: String(h.subtitle ?? '').trim() || '',
  }))
}
