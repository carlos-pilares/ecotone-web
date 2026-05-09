import type { PartnerDoc } from '@/lib/queries'

/**
 * Preserve CMS order; omit only null / broken dereferences (no type filter, no dedupe).
 */
export function filterPublishedPartnerDocs<T extends Pick<PartnerDoc, '_id'>>(
  list: (T | null | undefined)[] | null | undefined,
): T[] {
  if (!Array.isArray(list)) return []
  const out: T[] = []
  for (const p of list) {
    if (!p || typeof p !== 'object') continue
    const id = p._id
    if (typeof id !== 'string' || !id.trim()) continue
    out.push(p)
  }
  return out
}
