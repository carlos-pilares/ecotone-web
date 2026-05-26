import type { SoqtapataMedia, SoqtapataMediaThumb } from '@/data/soqtapataExperienceLocal'

function MediaThumb({ t }: { t: SoqtapataMediaThumb }) {
  return (
    <div
      className="media-thumb"
      data-exp-lb={t.dataExpLb}
      role="button"
      tabIndex={0}
      aria-label={t.ariaLabel}
    >
      <img src={t.imageSrc} alt={t.imageAlt} />
      {t.kind === 'video' ? (
        <div className="media-overlay" style={t.overlayStyle} />
      ) : (
        <div className="media-overlay" />
      )}
      {t.kind === 'video' ? (
        <div className="media-play">
          <div className="media-play-btn">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="var(--brown)">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      ) : null}
      <span className="media-label" style={t.labelStyle}>
        {t.label}
      </span>
    </div>
  )
}

/** `section#media` + `#soqtapata-media-grid` — lightbox vía `SoqtapataPhotoLightbox` y `[data-exp-lb]`. */
export function ExperienceMediaSoqtapata({ data }: { data: SoqtapataMedia }) {
  return (
    <section className="content-section fade" id="media">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={data.h2Style}>
          {data.h2}
        </h2>
        {data.lead ? (
          <p className="body" style={{ fontSize: 14, maxWidth: 560, marginBottom: 14, color: 'var(--n700)' }}>
            {data.lead}
          </p>
        ) : null}
        <div className="media-grid" id="soqtapata-media-grid">
          <div
            className="video-hero"
            data-exp-lb={data.video.dataExpLb ?? '0'}
            role="button"
            tabIndex={0}
            aria-label={data.video.imageAlt}
          >
            <img src={data.video.imageSrc} alt={data.video.imageAlt} />
            {data.video.isVideo ? (
              <div className="video-overlay">
                <div className="play-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--brown)">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="media-overlay" />
            )}
            <div className="video-meta">
              <span className="video-meta-pill video-meta-pill--film">{data.video.filmPill}</span>
              <span className="video-meta-pill video-meta-pill--accent">{data.video.officialPill}</span>
            </div>
          </div>
          {data.thumbs.map((t, i) => (
            <MediaThumb key={`${i}-${t.imageAlt}`} t={t} />
          ))}
          {data.moreCount ? (
            <div
              className={['media-count', data.moreCount.imageSrc ? 'media-count--image' : ''].filter(Boolean).join(' ')}
              data-exp-lb={data.moreCount.dataExpLb}
              role="button"
              tabIndex={0}
              aria-label={data.moreCount.ariaLabel}
            >
              {data.moreCount.imageSrc ? (
                <>
                  <img src={data.moreCount.imageSrc} alt={data.moreCount.imageAlt || ''} />
                  <span className="media-count-mask" aria-hidden />
                </>
              ) : null}
              <span className="media-count-label">{data.moreCount.countLabel}</span>
              <span className="media-count-sub">{data.moreCount.subLabel}</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
