'use client'

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'

import type { HeroBackgroundLayer, ResolvedHomeHeroMedia } from '@/lib/homeHeroMedia'

const HERO_GRADIENT =
  'linear-gradient(110deg,rgba(0,0,0,.65) 0%,rgba(0,0,0,.15) 52%,rgba(0,0,0,.55) 100%)'

const MOBILE_MEDIA_QUERY = '(max-width: 720px)'

function subscribeMobileMq(onStoreChange: () => void) {
  const mq = window.matchMedia(MOBILE_MEDIA_QUERY)
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function getMobileMqSnapshot() {
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches
}

function getMobileMqServerSnapshot() {
  return false
}

function useIsMobileHeroViewport(): boolean {
  return useSyncExternalStore(subscribeMobileMq, getMobileMqSnapshot, getMobileMqServerSnapshot)
}

function HeroImageLayer({ url, className }: { url: string; className?: string }) {
  return (
    <div
      className={`hero-bg-layer is-active${className ? ` ${className}` : ''}`}
      style={{
        backgroundImage: `${HERO_GRADIENT}, url('${url}')`,
      }}
    />
  )
}

function HeroVideoLayer({ src, poster }: { src: string; poster: string }) {
  return (
    <>
      <video
        key={src}
        className="hero-bg-video"
        src={src}
        poster={poster || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        aria-hidden
      />
      <div
        className="hero-bg-layer hero-bg-layer--shade is-active"
        style={{ backgroundImage: HERO_GRADIENT }}
        aria-hidden
      />
    </>
  )
}

function HeroVideoBackground({ layer }: { layer: HeroBackgroundLayer }) {
  if (layer.kind === 'video') {
    return <HeroVideoLayer src={layer.src} poster={layer.poster} />
  }
  return <HeroImageLayer url={layer.url} />
}

type HeroMediaProps = ResolvedHomeHeroMedia

export function HeroMedia({
  mode,
  imageUrl,
  slideUrls,
  videoDesktop,
  videoMobile,
  slideshowAutoplay,
  slideshowIntervalMs,
}: HeroMediaProps) {
  const isMobile = useIsMobileHeroViewport()
  const slides = useMemo(() => {
    if (mode !== 'slideshow' || !slideUrls.length) return []
    return slideUrls
  }, [mode, slideUrls])

  const [activeIndex, setActiveIndex] = useState(0)
  const slideCount = slides.length

  const goTo = useCallback(
    (index: number) => {
      if (!slideCount) return
      setActiveIndex(((index % slideCount) + slideCount) % slideCount)
    },
    [slideCount],
  )

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

  useEffect(() => {
    setActiveIndex(0)
  }, [slideCount, mode])

  useEffect(() => {
    if (mode !== 'slideshow' || !slideshowAutoplay || slideCount < 2) return
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slideCount)
    }, slideshowIntervalMs)
    return () => window.clearInterval(id)
  }, [mode, slideshowAutoplay, slideshowIntervalMs, slideCount])

  if (mode === 'video') {
    const layer = isMobile ? videoMobile : videoDesktop
    return (
      <div className="hero-bg hero-bg--video" aria-hidden>
        <HeroVideoBackground layer={layer} />
      </div>
    )
  }

  if (mode === 'slideshow' && slideCount > 0) {
    const showControls = slideCount > 1
    return (
      <div className="hero-bg hero-bg--slideshow" aria-hidden>
        {slides.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className={`hero-bg-layer${i === activeIndex ? ' is-active' : ''}`}
            style={{
              backgroundImage: `${HERO_GRADIENT}, url('${url}')`,
            }}
          />
        ))}
        {showControls ? (
          <div className="hero-slideshow-ui">
            <button
              type="button"
              className="hero-slideshow-btn hero-slideshow-btn--prev"
              onClick={goPrev}
              aria-label="Previous slide"
            >
              ‹
            </button>
            <div className="hero-slideshow-dots" role="tablist" aria-label="Hero slideshow">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  className={`hero-slideshow-dot${i === activeIndex ? ' is-active' : ''}`}
                  aria-label={`Slide ${i + 1} of ${slideCount}`}
                  aria-selected={i === activeIndex}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="hero-slideshow-btn hero-slideshow-btn--next"
              onClick={goNext}
              aria-label="Next slide"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div
      className="hero-bg hero-bg--image"
      aria-hidden
      style={{
        background: `${HERO_GRADIENT}, url('${imageUrl}') center/cover no-repeat`,
      }}
    />
  )
}
