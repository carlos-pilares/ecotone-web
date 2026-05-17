import type { LodgeGalleryItemRow } from '@/lib/lodgePageCmsTypes'
import { cdnImageUrl } from '@/lib/sanity'

export function galleryRowHasImage(g: LodgeGalleryItemRow): boolean {
  return Boolean(g.imageUrl?.trim() || cdnImageUrl(g.image, 1, ''))
}

export function galleryRowImageUrl(g: LodgeGalleryItemRow, width: number): string {
  return g.imageUrl?.trim() || cdnImageUrl(g.image, width, '') || ''
}

export function findGalleryRowByKey(
  gallery: LodgeGalleryItemRow[] | null | undefined,
  key: string,
): LodgeGalleryItemRow | undefined {
  const k = key.trim()
  if (!k) return undefined
  const rows = gallery ?? []
  const direct = rows.find((r) => r._key?.trim() === k)
  if (direct) return direct
  const legacy = /^gallery-(\d+)$/.exec(k)
  if (legacy) {
    const idx = Number(legacy[1])
    if (Number.isFinite(idx) && idx >= 0 && idx < rows.length) return rows[idx]
  }
  return undefined
}

/** All KC gallery rows with an image, in document order. */
export function defaultHeroGalleryRows(gallery: LodgeGalleryItemRow[] | null | undefined): LodgeGalleryItemRow[] {
  return (gallery ?? []).filter(galleryRowHasImage)
}

/**
 * Hero gallery rows for the lodge landing.
 * Non-empty `orderKeys` → selected KC `_key`s in editor order; empty → full KC gallery order.
 */
export function resolveHeroGalleryRows(
  gallery: LodgeGalleryItemRow[] | null | undefined,
  orderKeys: string[] | null | undefined,
): LodgeGalleryItemRow[] {
  const keys = orderKeys?.map((k) => (typeof k === 'string' ? k.trim() : '')).filter(Boolean)
  if (keys?.length) {
    const picked: LodgeGalleryItemRow[] = []
    const seen = new Set<string>()
    for (const key of keys) {
      const row = findGalleryRowByKey(gallery, key)
      if (!row || !galleryRowHasImage(row)) continue
      const dk = row._key?.trim() || key
      if (seen.has(dk)) continue
      seen.add(dk)
      picked.push(row)
    }
    if (picked.length) return picked
  }
  return defaultHeroGalleryRows(gallery)
}

/**
 * Menu / card thumbnail URL priority:
 * 1. `menuThumbnailImage` (_key into KC gallery)
 * 2. first hero-selected image
 * 3. first KC gallery image
 * 4. null (frontend placeholder UI)
 */
export function resolveMenuThumbnailUrl(
  menuThumbnailKey: string | null | undefined,
  gallery: LodgeGalleryItemRow[] | null | undefined,
  heroRows: LodgeGalleryItemRow[] | null | undefined,
): string | null {
  const key = menuThumbnailKey?.trim()
  if (key) {
    const row = findGalleryRowByKey(gallery, key)
    const url = row ? galleryRowImageUrl(row, 600) : ''
    if (url) return url
  }
  const firstHero = heroRows?.[0]
  if (firstHero) {
    const url = galleryRowImageUrl(firstHero, 600)
    if (url) return url
  }
  const first = defaultHeroGalleryRows(gallery)[0]
  if (first) return galleryRowImageUrl(first, 600)
  return null
}
