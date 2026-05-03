'use client'

import type { ReactNode } from 'react'

import type { LodgeAmenityIconId, LodgeFacilitiesData, LodgeGalleryPhoto } from '@/data/lodgeSoqtapataStatic'

import { LodgeSectionHeading } from '@/components/lodge/LodgeSectionHeading'
import { openGallery } from '@/lib/galleryLightboxBus'

type LodgeFacilitiesProps = {
  data: LodgeFacilitiesData
}

/** Iconos amenidades (15×15) alineados al HTML de referencia. */
const AMENITY_SVGS: Record<LodgeAmenityIconId, ReactNode> = {
  meals: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8" aria-hidden>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  guide: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="8" r="5" />
      <path d="M8 13c-3 1-5 4-5 7h18c0-3-2-6-5-7" />
    </svg>
  ),
  transport: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8" aria-hidden>
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  boots: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8" aria-hidden>
      <path d="M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v3a8 8 0 0 0 16 0V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z" />
    </svg>
  ),
  flask: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8" aria-hidden>
      <path d="M10 2v7.31" />
      <path d="M14 9.3V1.99" />
      <path d="M8.5 2h7" />
      <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
    </svg>
  ),
  wifi: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8" aria-hidden>
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  shield: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  book: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8" aria-hidden>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  droplet: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
    </svg>
  ),
}

function AmenityCard({ iconId, title, sub }: { iconId: LodgeAmenityIconId; title: string; sub: string }) {
  return (
    <div className="amenity-card">
      <div className="amenity-icon">{AMENITY_SVGS[iconId]}</div>
      <div className="amenity-text">
        <div className="amenity-title">{title}</div>
        <div className="amenity-sub">{sub}</div>
      </div>
    </div>
  )
}

function toGalleryItems(photos: readonly LodgeGalleryPhoto[]) {
  return photos.map((p) => ({
    src: p.src,
    alt: p.alt,
    title: p.title,
    description: p.description,
  }))
}

/** Facilities — rejilla hero + strip + amenidades como `ecotone-lodge_11.html`. */
export function LodgeFacilities({ data }: LodgeFacilitiesProps) {
  const [hero, tile1, tile2] = data.primaryPhotos
  const [stripA, stripB, stripMore] = data.stripPhotos
  const gallery = data.commonAreasGallery

  const openAt = (index: number) => {
    openGallery(toGalleryItems(gallery), Math.max(0, Math.min(index, gallery.length - 1)))
  }

  const facilitiesBodyStyle = {
    fontSize: 14,
    fontWeight: 300,
    color: 'var(--n700)',
    lineHeight: 1.8,
    marginBottom: 20,
  } as const

  return (
    <section id="facilities" className="content-section bg-warm">
      <div className="content-inner">
        <LodgeSectionHeading
          eyebrow={data.eyebrow}
          title={data.title}
          body={data.body}
          titleStyle={{ marginBottom: 6 }}
          bodyStyle={facilitiesBodyStyle}
        />

        <div className="common-areas-grid common-areas-grid--hero">
          <button
            type="button"
            className="common-photo common-photo--tall common-photo--clickable"
            onClick={() => openAt(0)}
            aria-label={`${data.galleryTileAriaLabelPrefix} ${hero.label}`}
          >
            <img src={hero.image} alt={hero.imageAlt} width={800} height={680} loading="lazy" />
            <div className="common-photo-overlay" aria-hidden />
            <span className="common-photo-label">{hero.label}</span>
            {hero.sub ? <span className="common-photo-sub">{hero.sub}</span> : null}
          </button>
          <button
            type="button"
            className="common-photo common-photo--short common-photo--clickable"
            onClick={() => openAt(1)}
            aria-label={`${data.galleryTileAriaLabelPrefix} ${tile1.label}`}
          >
            <img src={tile1.image} alt={tile1.imageAlt} width={600} height={336} loading="lazy" />
            <div className="common-photo-overlay" aria-hidden />
            <span className="common-photo-label">{tile1.label}</span>
          </button>
          <button
            type="button"
            className="common-photo common-photo--short common-photo--clickable"
            onClick={() => openAt(2)}
            aria-label={`${data.galleryTileAriaLabelPrefix} ${tile2.label}`}
          >
            <img src={tile2.image} alt={tile2.imageAlt} width={600} height={336} loading="lazy" />
            <div className="common-photo-overlay" aria-hidden />
            <span className="common-photo-label">{tile2.label}</span>
          </button>
        </div>

        <div className="common-areas-strip">
          <button
            type="button"
            className="common-photo common-photo--strip common-photo--clickable"
            onClick={() => openAt(3)}
            aria-label={`${data.galleryTileAriaLabelPrefix} ${stripA.label}`}
          >
            <img src={stripA.image} alt={stripA.imageAlt} width={400} height={120} loading="lazy" />
            <div className="common-photo-overlay" aria-hidden />
            <span className="common-photo-label common-photo-label--sm">{stripA.label}</span>
          </button>
          <button
            type="button"
            className="common-photo common-photo--strip common-photo--clickable"
            onClick={() => openAt(4)}
            aria-label={`${data.galleryTileAriaLabelPrefix} ${stripB.label}`}
          >
            <img src={stripB.image} alt={stripB.imageAlt} width={400} height={120} loading="lazy" />
            <div className="common-photo-overlay" aria-hidden />
            <span className="common-photo-label common-photo-label--sm">{stripB.label}</span>
          </button>
          <button
            type="button"
            className="common-photo common-photo--strip common-photo--more common-photo--clickable"
            onClick={() => openAt(5)}
            aria-label={data.galleryStripMoreAriaLabel}
          >
            <img src={stripMore.image} alt={stripMore.imageAlt} width={400} height={120} loading="lazy" />
            <div className="common-photo-more-overlay" aria-hidden>
              <span className="common-photo-more-n">{stripMore.moreCount}</span>
              <span className="common-photo-more-txt">{stripMore.moreLabel}</span>
            </div>
          </button>
        </div>

        <div className="eyebrow lodge-facilities-amenity-eyebrow">{data.amenitiesEyebrow}</div>
        <div className="amenity-grid">
          {data.amenities.map((a) => (
            <AmenityCard key={a.title} iconId={a.iconId} title={a.title} sub={a.sub} />
          ))}
        </div>
      </div>
    </section>
  )
}
