import type { SanityImageSource } from '@sanity/image-url'

import type { LodgeGalleryItemRow } from '@/lib/lodgePageCmsTypes'
import { cdnImageUrl, sanityImageUrl } from '@/lib/sanity'

export function galleryRowHasImage(g: LodgeGalleryItemRow): boolean {
  return Boolean(g.imageUrl?.trim() || cdnImageUrl(g.image, 1, ''))
}

export function galleryRowImageUrl(g: LodgeGalleryItemRow, width: number): string {
  if (g.image) {
    const built = cdnImageUrl(g.image, width, '')
    if (built) return built
  }
  return sanityImageUrl({ url: g.imageUrl, width, fallback: '' }) || ''
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
/**
 * Canonical lodge identity image for cards (Experience → Lodges section, etc.).
 * 1. Lodge Page hero main (`heroGalleryOrderKeys[0]` or first hero gallery row)
 * 2. Lodge Page menu/thumbnail pick
 * 3. First gallery image (library + legacy)
 * 4. Lodge `mainImage`
 */
export function resolveLodgeIdentityImageUrl(opts: {
  gallery: LodgeGalleryItemRow[] | null | undefined
  heroGalleryOrderKeys?: string[] | null
  menuThumbnailKey?: string | null
  mainImage?: SanityImageSource | null
  mainImageUrl?: string | null
  width?: number
}): string {
  const width = opts.width ?? 800
  const gallery = opts.gallery ?? []

  const heroRows = resolveHeroGalleryRows(gallery, opts.heroGalleryOrderKeys)
  const heroMain = heroRows[0] ? galleryRowImageUrl(heroRows[0], width) : ''
  if (heroMain) return heroMain

  const menuKey = opts.menuThumbnailKey?.trim()
  if (menuKey) {
    const menuRow = findGalleryRowByKey(gallery, menuKey)
    const menuUrl = menuRow ? galleryRowImageUrl(menuRow, width) : ''
    if (menuUrl) return menuUrl
  }

  const firstGallery = defaultHeroGalleryRows(gallery)[0]
  if (firstGallery) {
    const galleryUrl = galleryRowImageUrl(firstGallery, width)
    if (galleryUrl) return galleryUrl
  }

  return (
    sanityImageUrl({
      url: opts.mainImageUrl,
      image: opts.mainImage,
      width,
      fallback: '',
    }) || ''
  )
}

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
