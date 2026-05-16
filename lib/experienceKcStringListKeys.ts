function normalizePlainStringList(raw: unknown[] | null | undefined): string[] {
  if (!raw?.length) return []
  return raw
    .map((x) => (typeof x === 'string' ? x.trim() : x != null ? String(x).trim() : ''))
    .filter(Boolean)
}

/** Plain-string KC list kinds with deterministic index keys (`{kind}-{index}`). */
export type PlainStringKcListKind = 'include' | 'not-include' | 'highlight'

export const INCLUDE_LIST_KEY_PREFIX = 'include' satisfies PlainStringKcListKind
export const NOT_INCLUDE_LIST_KEY_PREFIX = 'not-include' satisfies PlainStringKcListKind
export const HIGHLIGHT_LIST_KEY_PREFIX = 'highlight' satisfies PlainStringKcListKind

export function kcPlainStringKeyAt(kind: PlainStringKcListKind, index: number): string {
  return `${kind}-${index}`
}

export function includeListKeyAt(index: number): string {
  return kcPlainStringKeyAt(INCLUDE_LIST_KEY_PREFIX, index)
}

export function notIncludeListKeyAt(index: number): string {
  return kcPlainStringKeyAt(NOT_INCLUDE_LIST_KEY_PREFIX, index)
}

export function highlightListKeyAt(index: number): string {
  return kcPlainStringKeyAt(HIGHLIGHT_LIST_KEY_PREFIX, index)
}

/** Legacy Studio picker keys before unified `{kind}-{index}` format. */
function legacyPickerKey(kind: PlainStringKcListKind, index: number): string {
  switch (kind) {
    case 'include':
      return `Included-${index}`
    case 'not-include':
      return `Not included-${index}`
    case 'highlight':
      return `Highlight-${index}`
  }
}

function warnCurateKeyMiss(context: string, key: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[experiencePage CMS] ${context}: could not resolve curated key "${key}"`)
  }
}

export function buildPlainStringKcKeyMap(flat: string[], kind: PlainStringKcListKind): Map<string, string> {
  const map = new Map<string, string>()
  flat.forEach((raw, i) => {
    const text = String(raw ?? '').trim()
    if (!text) return
    map.set(kcPlainStringKeyAt(kind, i), text)
    map.set(`legacy-str:${i}`, text)
    map.set(legacyPickerKey(kind, i), text)
  })
  return map
}

function resolveKeyToText(key: string, byKey: Map<string, string>, kind: PlainStringKcListKind): string {
  const direct = byKey.get(key)
  if (direct) return direct

  const legacyStr = /^legacy-str:(\d+)$/.exec(key)
  if (legacyStr) {
    return byKey.get(kcPlainStringKeyAt(kind, Number(legacyStr[1]))) ?? ''
  }

  const patterns: Record<PlainStringKcListKind, RegExp> = {
    include: /^Included-(\d+)$/,
    'not-include': /^Not included-(\d+)$/,
    highlight: /^Highlight-(\d+)$/,
  }
  const match = patterns[kind].exec(key)
  if (match) {
    return byKey.get(kcPlainStringKeyAt(kind, Number(match[1]))) ?? ''
  }

  return ''
}

/**
 * Curate a plain-string KC list from page `orderKeys`.
 * Empty orderKeys → full KC list (optional legacy index order).
 */
export function resolvePlainStringKcList(
  legacyFlat: unknown[] | null | undefined,
  orderKeys: string[] | null | undefined,
  legacyIdx: number[] | null | undefined,
  kind: PlainStringKcListKind,
  context: string,
  pickByIndices: (source: string[], order: number[]) => string[] | null,
): string[] {
  const flat = normalizePlainStringList(legacyFlat)
  const hasSelection = (orderKeys?.length ?? 0) > 0

  if (!hasSelection) {
    if (legacyIdx?.length && flat.length) {
      const p = pickByIndices([...flat], legacyIdx)
      if (p?.length) return p
    }
    return flat
  }

  const byKey = buildPlainStringKcKeyMap(flat, kind)
  const out: string[] = []
  for (const rawKey of orderKeys!) {
    const key = String(rawKey).trim()
    if (!key) continue
    const text = resolveKeyToText(key, byKey, kind)
    if (text) {
      out.push(text)
    } else {
      warnCurateKeyMiss(context, key)
    }
  }
  return out
}
