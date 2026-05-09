'use client'

import type { ReactNode } from 'react'

import './experience-wildlife-grid.css'

export type ExperienceWildlifeGridItem = {
  name: string
  subtitle?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  badge?: string | null
  /** Used only inside the no-photo placeholder (large, low-contrast). */
  iconType?: string | null
}

function PlaceholderGlyph({ iconType }: { iconType?: string | null }): ReactNode {
  const stroke = 'currentColor'
  const sw = 1.2
  const props = { viewBox: '0 0 24 24', fill: 'none' as const, stroke, strokeWidth: sw, 'aria-hidden': true as const }
  switch (iconType) {
    case 'bird':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2.5v2.8m0 13.4v2.8M4.4 4.4l1.9 1.9m11.4 11.4 1.9 1.9M2.5 12h2.8m13.4 0h2.8M4.4 19.6l1.9-1.9M17.7 6.3l1.9-1.9" />
        </svg>
      )
    case 'bear':
      return (
        <svg {...props}>
          <circle cx="12" cy="8.5" r="5.2" />
          <path d="M7.5 13.2c-2.8 1-4.6 3.6-4.6 6.8h17.2c0-3.2-1.8-5.8-4.6-6.8" />
        </svg>
      )
    case 'cat':
      return (
        <svg {...props}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      )
    case 'jaguar':
      return (
        <svg {...props}>
          <path d="M12 2.2l3 6.8h6.8l-5.4 3.8 2 6.8L12 15.8l-6.4 4.8 2-6.8L2.2 9h6.8z" />
        </svg>
      )
    case 'monkey':
      return (
        <svg {...props}>
          <circle cx="12" cy="8.5" r="5" />
          <path d="M7.5 13.2c-2.8 1-4.6 3.6-4.6 6.8h17.2c0-3.2-1.8-5.8-4.6-6.8" />
        </svg>
      )
    case 'otter':
    case 'reptile':
    case 'fish':
    case 'plant':
    case 'insect':
    case 'generic':
    default:
      return (
        <svg {...props}>
          <path d="M3.2 9.2L12 2.8l8.8 6.4v11.6a1.8 1.8 0 0 1-1.8 1.8H5a1.8 1.8 0 0 1-1.8-1.8V9.2z" />
        </svg>
      )
  }
}

export function ExperienceWildlifeGrid({ items }: { items: ExperienceWildlifeGridItem[] }) {
  if (!items.length) return null

  return (
    <ul className="exp-wildlife-grid">
      {items.map((item, i) => {
        const key = item.name ? `${item.name}-${i}` : `wildlife-${i}`
        const sub = item.subtitle?.trim() || null
        const src = item.imageUrl?.trim() || null
        const alt = (item.imageAlt?.trim() || item.name || 'Species').trim()
        const badge = item.badge?.trim() || null
        return (
          <li className="exp-wildlife-card" key={key}>
            <div className="exp-wildlife-media">
              {src ? (
                <img src={src} alt={alt} loading="lazy" decoding="async" sizes="(max-width: 479px) 100vw, (max-width: 899px) 50vw, (max-width: 1199px) 33vw, 25vw" />
              ) : (
                <div className="exp-wildlife-ph" aria-hidden>
                  <div className="exp-wildlife-ph-inner">
                    <PlaceholderGlyph iconType={item.iconType} />
                  </div>
                </div>
              )}
            </div>
            <div className="exp-wildlife-body">
              {badge ? <span className="exp-wildlife-badge">{badge}</span> : null}
              <div className="exp-wildlife-title">{item.name}</div>
              {sub ? <p className="exp-wildlife-sub">{sub}</p> : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
