export type GalleryItem = {
  src: string
  alt: string
  /** Caption title (e.g. room or area name). */
  title?: string
  /** Longer caption below title. */
  description?: string
}

export const GALLERY_OPEN_EVENT = 'ecotone:gallery-open'

export type GalleryOpenDetail = {
  items: GalleryItem[]
  index: number
}

export function openGallery(items: GalleryItem[], index: number) {
  if (typeof window === 'undefined' || items.length === 0) return
  const i = Math.max(0, Math.min(index, items.length - 1))
  window.dispatchEvent(
    new CustomEvent<GalleryOpenDetail>(GALLERY_OPEN_EVENT, { detail: { items, index: i } }),
  )
}
