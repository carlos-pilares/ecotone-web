'use client'

import type { LodgeGalleryPhoto, LodgeRoomsData } from '@/data/lodgeSoqtapataStatic'

import { LodgeSectionHeading } from '@/components/lodge/LodgeSectionHeading'
import { openGallery } from '@/lib/galleryLightboxBus'

type LodgeRoomsProps = {
  data: LodgeRoomsData
}

const roomsBodyStyle = {
  fontSize: 14,
  fontWeight: 300,
  color: 'var(--n700)',
  lineHeight: 1.8,
  marginBottom: 22,
} as const

function toGalleryItems(photos: readonly LodgeGalleryPhoto[]) {
  return photos.map((p) => ({
    src: p.src,
    alt: p.alt,
    title: p.title,
    description: p.description,
  }))
}

function RoomPhotosCta({ label, photos }: { label: string; photos: readonly LodgeGalleryPhoto[] }) {
  return (
    <button
      type="button"
      className="room-photos-cta room-photos-cta--btn"
      onClick={() => openGallery(toGalleryItems(photos), 0)}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="2" aria-hidden>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
      {label}
    </button>
  )
}

/**
 * Rooms — layout horizontal + `featured` como `ecotone-lodge_11.html`.
 */
export function LodgeRooms({ data }: LodgeRoomsProps) {
  return (
    <section id="rooms" className="content-section">
      <div className="content-inner">
        <LodgeSectionHeading
          eyebrow={data.eyebrow}
          title={data.title}
          body={data.body}
          titleStyle={{ marginBottom: 6 }}
          bodyStyle={roomsBodyStyle}
        />

        <div className="lodge-rooms-stack">
          {data.rooms.map((room) => (
            <div className={room.featured ? 'room-card featured' : 'room-card'} key={room.name}>
              <div className="room-img">
                <img src={room.image} alt={room.imageAlt} width={500} height={375} loading="lazy" />
              </div>
              <div className="room-body">
                <div>
                  {room.featured ? (
                    <div className="room-name-row">
                      <div className="room-name">{room.name}</div>
                      {room.badge ? (
                        <span className="pill pill-brown" style={{ fontSize: 11, flexShrink: 0 }}>
                          {room.badge}
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <div className="room-name" style={{ marginBottom: 5 }}>
                      {room.name}
                    </div>
                  )}
                  <div className="room-meta">{room.meta}</div>
                </div>
                <div>
                  <div className="room-chips">
                    {room.chips.map((chip, j) => (
                      <span className="room-chip" key={`${room.name}-c-${j}`}>
                        {chip}
                      </span>
                    ))}
                  </div>
                  {room.photosCta && room.galleryPhotos?.length ? (
                    <RoomPhotosCta label={room.photosCta} photos={room.galleryPhotos} />
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.note ? (
          <div className="lodge-rooms-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{data.note}</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}
