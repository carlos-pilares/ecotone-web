'use client'

import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

type Props = {
  lightUrl: string
  /** Solid bar: CMS `headerLogoDark` or same-origin `/brand/logo-full-horizontal-906730.svg`. */
  darkUrl: string
  /**
   * Must match whether `#topNav` is rendered with `solid` in the initial HTML (e.g. experience pages),
   * so the first client render matches hydration and the logo is never light-on-light before scroll.
   */
  initialSolid?: boolean
  alt: string
}

/**
 * Hero / transparent: `lightUrl` (claro). Solid bar: `darkUrl` (brown, CMS or local fallback). No mask/filters.
 * If the dark asset fails to load (bad CMS URL, 404, etc.), falls back to `lightUrl` so the image never shows broken.
 */
export function SiteHeaderLogoCms({ lightUrl, darkUrl, initialSolid = false, alt }: Props) {
  const [useSolid, setUseSolid] = useState(initialSolid)
  /** When true, solid bar uses light logo because dark `src` errored. */
  const [solidUseLightFallback, setSolidUseLightFallback] = useState(false)

  const sync = useCallback(() => {
    const nav = document.getElementById('topNav')
    setUseSolid(nav?.classList.contains('solid') ?? false)
  }, [])

  useLayoutEffect(() => {
    sync()
  }, [sync])

  useEffect(() => {
    const nav = document.getElementById('topNav')
    if (!nav) return
    const mo = new MutationObserver(sync)
    mo.observe(nav, { attributes: true, attributeFilter: ['class'] })
    window.addEventListener('scroll', sync, { passive: true })
    return () => {
      mo.disconnect()
      window.removeEventListener('scroll', sync)
    }
  }, [sync])

  useEffect(() => {
    setSolidUseLightFallback(false)
  }, [darkUrl, lightUrl])

  const tryDarkInSolid = useSolid && !solidUseLightFallback
  const resolvedSrc = tryDarkInSolid ? darkUrl : lightUrl

  const onImgError = useCallback(() => {
    if (useSolid && !solidUseLightFallback) {
      setSolidUseLightFallback(true)
    }
  }, [useSolid, solidUseLightFallback])

  const imgKey = `${resolvedSrc}|${solidUseLightFallback ? '1' : '0'}`

  return (
    <span className="nav-logo-full-wrap">
      <img
        id="navLogoFull"
        key={imgKey}
        className="nav-logo-full"
        src={resolvedSrc}
        alt={alt}
        width={184}
        height={57}
        sizes="(max-width: 720px) 52vw, 140px"
        decoding="async"
        onError={onImgError}
      />
    </span>
  )
}
