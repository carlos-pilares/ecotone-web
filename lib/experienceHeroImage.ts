import type { SanityImageSource } from '@sanity/image-url'

import {
  mergeExperienceGalleryWithPhotoLibrary,
  type ExperienceGalleryLikeRow,
  type PhotoCollectionDoc,
} from '@/lib/photoLibraryResolve'
import { cdnImageUrl, sanityImageUrl } from '@/lib/sanity'

function pickByKeys<T extends { _key?: string | null }>(
  source: T[] | null | undefined,
  order: string[] | null | undefined,
): T[] | null {
  if (!source?.length || !order?.length) return null
  const m = new Map<string, T>()
  source.forEach((item, i) => {
    if (item == null || typeof item !== 'object') return
    const k = item._key
    if (k && !m.has(k)) m.set(k, item)
    if (!m.has(`legacy-str:${i}`)) m.set(`legacy-str:${i}`, item)
    if (!m.has(String(i))) m.set(String(i), item)
  })
  const out: T[] = []
  const seen = new Set<string>()
  for (const rawKey of order) {
    const key = typeof rawKey === 'string' ? rawKey.trim() : String(rawKey).trim()
    if (!key || seen.has(key)) continue
    let v = m.get(key)
    if (v === undefined) {
      const legacy = /^legacy-str:(\d+)$/.exec(key)
      if (legacy) v = m.get(`legacy-str:${legacy[1]}`) ?? m.get(legacy[1]!)
    }
    if (v !== undefined) {
      seen.add(key)
      out.push(v)
    }
  }
  return out.length ? out : null
}

function galleryPhotoUrl(g: ExperienceGalleryLikeRow, width: number): string | null {
  if (g.image) {
    const built = cdnImageUrl(g.image, width, '')
    if (built?.trim()) return built
  }
  const direct = g.imageUrl?.trim()
  if (direct) {
    return sanityImageUrl({ url: direct, width, fallback: '' }) || null
  }
  return null
}

function galleryVideoThumbnailUrl(g: ExperienceGalleryLikeRow, width: number): string | null {
  if (g.videoThumbnail) {
    const built = cdnImageUrl(g.videoThumbnail, width, '')
    if (built?.trim()) return built
  }
  const direct = g.videoThumbnailUrl?.trim()
  if (direct) {
    return sanityImageUrl({ url: direct, width, fallback: '' }) || null
  }
  return galleryPhotoUrl(g, width)
}

/** Ordered gallery rows for display (matches Experience Page hero/media ordering). */
export function resolveExperienceGalleryRowsForDisplay(opts: {
  gallery?: ExperienceGalleryLikeRow[] | null
  galleryOrderKeys?: string[] | null
  photoCollection?: PhotoCollectionDoc
}): ExperienceGalleryLikeRow[] {
  let items = mergeExperienceGalleryWithPhotoLibrary(opts.photoCollection ?? null, opts.gallery ?? [])
  if (opts.galleryOrderKeys?.length) {
    const picked = pickByKeys(items, opts.galleryOrderKeys)
    if (picked?.length) items = picked
  }
  return items
}

/**
 * Primary hero photo URL for an Experience landing (same source as `buildHeroGalleryFromItems` main cell).
 * 1. First photo after `galleryOrderKeys` curation (or full gallery order)
 * 2. Experience KC `mainImage`
 * 3. Empty string (no static fallback)
 */
export function resolveExperienceHeroImageUrl(opts: {
  gallery?: ExperienceGalleryLikeRow[] | null
  galleryOrderKeys?: string[] | null
  photoCollection?: PhotoCollectionDoc
  mainImage?: SanityImageSource | null
  mainImageUrl?: string | null
  width?: number
}): string {
  const width = opts.width ?? 1200
  const items = resolveExperienceGalleryRowsForDisplay(opts)

  for (let i = 0; i < items.length; i++) {
    const g = items[i]!
    const isVideo = g.mediaType?.trim() === 'video'
    if (isVideo) continue
    const url = galleryPhotoUrl(g, width)
    if (url) return url
  }

  for (let i = 0; i < items.length; i++) {
    const g = items[i]!
    if (g.mediaType?.trim() !== 'video') continue
    const url = galleryVideoThumbnailUrl(g, width)
    if (url) return url
  }

  return (
    sanityImageUrl({ url: opts.mainImageUrl, image: opts.mainImage, width, fallback: '' }) || ''
  )
}
