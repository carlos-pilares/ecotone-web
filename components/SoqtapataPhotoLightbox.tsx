'use client'

import { useEffect } from 'react'

import { GalleryLightbox } from '@/components/shared/GalleryLightbox'
import { openGallery, type GalleryItem } from '@/lib/galleryLightboxBus'

function readGalleryItems(): GalleryItem[] {
  const heroImgs = document.querySelectorAll<HTMLImageElement>(
    '#ecotone-experience-root .exp-hero .gallery-grid img',
  )
  const mediaImgs = document.querySelectorAll<HTMLImageElement>(
    '#ecotone-experience-root #media .video-hero img, #soqtapata-media-grid .media-thumb > img, #media .media-grid .media-thumb > img',
  )
  const seen = new Set<string>()
  const out: GalleryItem[] = []
  for (const img of [...heroImgs, ...mediaImgs]) {
    const src = img.getAttribute('src') || img.src
    if (!src || seen.has(src)) continue
    seen.add(src)
    out.push({
      src,
      alt: img.alt || '',
      title: img.alt || undefined,
      description: undefined,
    })
  }
  return out
}

/**
 * Experience media grid: `[data-exp-lb]` opens shared `GalleryLightbox` at that index.
 */
export function SoqtapataPhotoLightbox() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-exp-lb]')
      if (!t) return
      e.preventDefault()
      e.stopPropagation()
      const list = readGalleryItems()
      if (list.length === 0) return
      const raw = t.getAttribute('data-exp-lb') || '0'
      const i = Math.max(0, Math.min(parseInt(raw, 10) || 0, list.length - 1))
      openGallery(list, i)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return <GalleryLightbox />
}
