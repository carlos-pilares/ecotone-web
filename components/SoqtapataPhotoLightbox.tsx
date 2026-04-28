'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Item = { src: string; alt: string }

function readGalleryItems(): Item[] {
  const grid = document.getElementById('soqtapata-media-grid')
  const q = grid
    ? '#soqtapata-media-grid .media-thumb > img'
    : '#media .media-grid .media-thumb > img'
  const imgs = document.querySelectorAll<HTMLImageElement>(q)
  return Array.from(imgs).map((img) => ({ src: img.getAttribute('src') || img.src, alt: img.alt || '' }))
}

const FALLBACK: Item[] = [
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85', alt: 'Trail' },
  { src: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=85', alt: 'EcoDroneView' },
  { src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80', alt: 'Canopy' },
  { src: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80', alt: 'Wildlife' },
  { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80', alt: 'ForestWhisper' },
]

/**
 * Reuses the same image list as #media .media-grid. Elements with [data-exp-lb] open at that index.
 */
export function SoqtapataPhotoLightbox() {
  const [open, setOpen] = useState(false)
  const [ix, setIx] = useState(0)
  const [items, setItems] = useState<Item[]>([])

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
      setItems(list)
      setIx(i)
      setOpen(true)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowLeft') setIx((i) => (i - 1 + items.length) % Math.max(1, items.length))
      if (e.key === 'ArrowRight') setIx((i) => (i + 1) % Math.max(1, items.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, items.length])

  if (typeof document === 'undefined') return null

  const n = items.length
  const cur = n > 0 ? items[Math.max(0, Math.min(ix, n - 1))]! : null

  const overlay =
    open && cur
      ? createPortal(
          <div
            role="dialog"
            aria-modal
            aria-label="Photo gallery"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 500,
              background: 'rgba(10,8,5,.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              aria-label="Close gallery"
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
              }}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,.25)',
                background: 'rgba(0,0,0,.35)',
                color: '#fff',
                fontSize: 22,
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
            {n > 1 && (
              <div style={{ position: 'absolute', top: 16, left: 16, color: 'rgba(255,255,255,.7)', fontSize: 13 }}>
                {ix + 1} / {n}
              </div>
            )}
            {n > 1 && (
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation()
                  setIx((i) => (i - 1 + n) % n)
                }}
                style={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,.2)',
                  background: 'rgba(0,0,0,.4)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                ‹
              </button>
            )}
            {n > 1 && (
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation()
                  setIx((i) => (i + 1) % n)
                }}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,.2)',
                  background: 'rgba(0,0,0,.4)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                ›
              </button>
            )}
            <img
              src={cur.src}
              alt={cur.alt}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '100%',
                maxHeight: 'min(86vh, 1000px)',
                objectFit: 'contain',
                borderRadius: 4,
              }}
            />
          </div>,
          document.body
        )
      : null

  return <>{overlay}</>
}
