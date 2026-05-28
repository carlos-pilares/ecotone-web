import type { SanityImageSource } from '@sanity/image-url'

import { cdnImageUrl } from '@/lib/sanity'

export type HomeHeroMediaMode = 'image' | 'slideshow' | 'video'

export type HomeHeroMediaSource = {
  heroMediaMode?: string | null
  heroImage?: SanityImageSource | null
  heroImages?: SanityImageSource[] | null
  heroVideoUrl?: string | null
  heroVideoPoster?: SanityImageSource | null
  mobileHeroVideoUrl?: string | null
  mobileHeroPosterImage?: SanityImageSource | null
  mobileHeroImageFallback?: SanityImageSource | null
  heroImageFallbackUrl?: string | null
  slideshowAutoplay?: boolean | null
  slideshowIntervalMs?: number | null
}

/** One hero background layer — video OR image, never both. */
export type HeroBackgroundLayer =
  | { kind: 'video'; src: string; poster: string }
  | { kind: 'image'; url: string }

export type ResolvedHomeHeroMedia = {
  mode: HomeHeroMediaMode
  /** Single-image mode (and image-layer fallback URL). */
  imageUrl: string
  slideUrls: string[]
  /** Video mode: resolved desktop background (video or still). */
  videoDesktop: HeroBackgroundLayer
  /** Video mode: resolved mobile background (separate asset priority). */
  videoMobile: HeroBackgroundLayer
  slideshowAutoplay: boolean
  slideshowIntervalMs: number
}

const MODES = new Set<HomeHeroMediaMode>(['image', 'slideshow', 'video'])

export function normalizeHomeHeroMediaMode(raw: string | null | undefined): HomeHeroMediaMode {
  const t = raw?.trim()
  if (t && MODES.has(t as HomeHeroMediaMode)) return t as HomeHeroMediaMode
  return 'image'
}

function imageUrlsFromSources(
  sources: SanityImageSource[] | null | undefined,
  width: number,
): string[] {
  if (!sources?.length) return []
  const out: string[] = []
  for (const src of sources) {
    const url = cdnImageUrl(src, width, '')
    if (url) out.push(url)
  }
  return out
}

function resolveDesktopVideoLayer(
  page: HomeHeroMediaSource,
  imageUrl: string,
  fallbackImageUrl: string,
): HeroBackgroundLayer {
  const videoUrl = page?.heroVideoUrl?.trim() || null
  const posterUrl =
    cdnImageUrl(page?.heroVideoPoster ?? null, 1800, '') || imageUrl || fallbackImageUrl

  if (videoUrl) {
    return { kind: 'video', src: videoUrl, poster: posterUrl }
  }

  return { kind: 'image', url: posterUrl }
}

function resolveMobileVideoLayer(
  page: HomeHeroMediaSource,
  imageUrl: string,
  fallbackImageUrl: string,
  desktop: HeroBackgroundLayer,
): HeroBackgroundLayer {
  const mobileVideoUrl = page?.mobileHeroVideoUrl?.trim() || null
  const mobileImageUrl = cdnImageUrl(page?.mobileHeroImageFallback ?? null, 1200, '')
  const mobilePosterUrl = cdnImageUrl(page?.mobileHeroPosterImage ?? null, 1200, '')
  const desktopPoster =
    desktop.kind === 'video'
      ? desktop.poster
      : cdnImageUrl(page?.heroVideoPoster ?? null, 1800, '') || imageUrl || fallbackImageUrl

  if (mobileVideoUrl) {
    return {
      kind: 'video',
      src: mobileVideoUrl,
      poster: mobilePosterUrl || mobileImageUrl || desktopPoster,
    }
  }

  if (mobileImageUrl) {
    return { kind: 'image', url: mobileImageUrl }
  }

  if (mobilePosterUrl) {
    return { kind: 'image', url: mobilePosterUrl }
  }

  if (desktop.kind === 'video') {
    return desktop
  }

  return { kind: 'image', url: desktop.kind === 'image' ? desktop.url : imageUrl || fallbackImageUrl }
}

/** Resolve hero background media from merged home page fields. */
export function resolveHomeHeroMedia(
  page: HomeHeroMediaSource,
  fallbackImageUrl: string,
): ResolvedHomeHeroMedia {
  const mode = normalizeHomeHeroMediaMode(page?.heroMediaMode ?? null)
  const imageUrl = cdnImageUrl(page?.heroImage ?? null, 1800, fallbackImageUrl) || fallbackImageUrl

  const slideshowAutoplay = page?.slideshowAutoplay !== false
  const intervalRaw = page?.slideshowIntervalMs
  const slideshowIntervalMs =
    typeof intervalRaw === 'number' && Number.isFinite(intervalRaw) && intervalRaw >= 2000
      ? Math.min(30000, Math.round(intervalRaw))
      : 5000

  let slideUrls: string[] = []
  if (mode === 'slideshow') {
    slideUrls = imageUrlsFromSources(page?.heroImages ?? null, 1800)
    if (!slideUrls.length) {
      slideUrls = imageUrl ? [imageUrl] : [fallbackImageUrl]
    }
  }

  const videoDesktop = resolveDesktopVideoLayer(page, imageUrl, fallbackImageUrl)
  const videoMobile = resolveMobileVideoLayer(page, imageUrl, fallbackImageUrl, videoDesktop)

  return {
    mode,
    imageUrl,
    slideUrls,
    videoDesktop,
    videoMobile,
    slideshowAutoplay,
    slideshowIntervalMs,
  }
}
