'use client'

import { useEffect } from 'react'

import { GalleryLightbox } from '@/components/shared/GalleryLightbox'
import { openGallery, type GalleryItem } from '@/lib/galleryLightboxBus'

function readGalleryItems(): GalleryItem[] {
  const grid = document.getElementById('soqtapata-media-grid')
  const q = grid
    ? '#soqtapata-media-grid .media-thumb > img'
    : '#media .media-grid .media-thumb > img'
  const imgs = document.querySelectorAll<HTMLImageElement>(q)
  return Array.from(imgs).map((img) => ({
    src: img.getAttribute('src') || img.src,
    alt: img.alt || '',
    title: img.alt || undefined,
    description: undefined,
  }))
}

const FALLBACK: GalleryItem[] = [
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85', alt: 'Trail', title: 'Trail' },
  { src: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=85', alt: 'EcoDroneView', title: 'EcoDroneView' },
  { src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80', alt: 'Canopy', title: 'Canopy' },
  { src: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80', alt: 'Wildlife', title: 'Wildlife' },
  { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80', alt: 'ForestWhisper', title: 'ForestWhisper' },
]

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
      let list = readGalleryItems()
      if (list.length === 0) list = FALLBACK
      const raw = t.getAttribute('data-exp-lb') || '0'
      const i = Math.max(0, Math.min(parseInt(raw, 10) || 0, list.length - 1))
      openGallery(list, i)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return <GalleryLightbox />
}
