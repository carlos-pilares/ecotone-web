'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const VIDEO_SRC = '/manu-conservation-volunteer/video/arboreal-camera-trapping.mp4'
const POSTER_SRC = '/manu-conservation-volunteer/video/arboreal-camera-trapping-poster.jpg'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function getReducedMotionServerSnapshot() {
  return false
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )
}

/**
 * Cinematic fieldwork loop for the featured “Camera trap work” media.
 * Autoplays when in view; falls back to a static poster for reduced motion.
 */
export function ManuVolunteerFieldworkVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.25),
      { threshold: [0, 0.25, 0.5] },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  useEffect(() => {
    const el = videoRef.current
    if (!el || prefersReducedMotion) return

    if (inView) {
      const play = el.play()
      if (play && typeof play.catch === 'function') {
        play.catch(() => {
          /* Autoplay can be blocked; poster remains visible. */
        })
      }
    } else {
      el.pause()
    }
  }, [inView, prefersReducedMotion])

  if (prefersReducedMotion) {
    return (
      <img
        src={POSTER_SRC}
        alt=""
        className="mcv-fieldwork-img mcv-fieldwork-video"
        loading="lazy"
        decoding="async"
      />
    )
  }

  return (
    <video
      ref={videoRef}
      className="mcv-fieldwork-img mcv-fieldwork-video"
      src={VIDEO_SRC}
      poster={POSTER_SRC}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      controls={false}
      disablePictureInPicture
      aria-hidden
      tabIndex={-1}
    />
  )
}
