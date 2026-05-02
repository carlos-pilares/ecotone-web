'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import {
  GALLERY_OPEN_EVENT,
  type GalleryItem,
  type GalleryOpenDetail,
} from '@/lib/galleryLightboxBus'

/**
 * Full-screen gallery host: subscribes to `openGallery()` / `GALLERY_OPEN_EVENT`.
 * Mount once per page that uses programmatic galleries (Lodge, Experience via `SoqtapataPhotoLightbox`).
 */
export function GalleryLightbox() {
  const [open, setOpen] = useState(false)
  const [ix, setIx] = useState(0)
  const [items, setItems] = useState<GalleryItem[]>([])

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<GalleryOpenDetail>
      const { items: next, index } = ce.detail
      if (!next?.length) return
      setItems(next)
      setIx(index)
      setOpen(true)
    }
    window.addEventListener(GALLERY_OPEN_EVENT, onOpen as EventListener)
    return () => window.removeEventListener(GALLERY_OPEN_EVENT, onOpen as EventListener)
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
  const title = cur?.title?.trim() || cur?.alt || ''
  const desc = cur?.description?.trim() ?? ''

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
              background: 'rgba(10,8,5,.92)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              paddingBottom: 28,
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
                  top: '42%',
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
                  top: '42%',
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
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: 'min(1100px, 100%)',
                gap: 12,
              }}
            >
              <img
                src={cur.src}
                alt={cur.alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: 'min(62vh, 900px)',
                  objectFit: 'contain',
                  borderRadius: 4,
                }}
              />
              {(title || desc) && (
                <div
                  style={{
                    textAlign: 'center',
                    maxWidth: 640,
                    color: 'rgba(236,229,213,.95)',
                  }}
                >
                  {title ? (
                    <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: desc ? 6 : 0 }}>
                      {title}
                    </div>
                  ) : null}
                  {desc ? (
                    <div style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.55, color: 'rgba(236,229,213,.72)' }}>
                      {desc}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )
      : null

  return <>{overlay}</>
}
