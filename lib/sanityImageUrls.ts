import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

/** Default JPEG/WebP quality for responsive Sanity CDN delivery. */
export const SANITY_IMAGE_QUALITY = 80

/** Display-oriented width caps (2× retina where noted in comments). */
export const SANITY_IMG = {
  /** Header mega menu experience thumb (~160×112 CSS, 2×). */
  NAV_THUMB: 320,
  /** Header mega menu lodge panel (~260×180 CSS, 2×). */
  NAV_LODGE: 520,
  /** Header tailor-made / program type promo panel. */
  NAV_PROGRAM: 600,
  /** Experience / lodge cards (~600×400 CSS). */
  CARD: 600,
  /** Home explorer / large listing cards. */
  CARD_LARGE: 900,
  /** Lodge room card thumbnail. */
  LODGE_ROOM: 500,
  /** Lodge room gallery lightbox. */
  LODGE_ROOM_LB: 1200,
  /** Lodge facilities strip. */
  LODGE_FACILITY: 400,
  /** Lodge identity / cross-link cards. */
  LODGE_IDENTITY: 800,
  /** Lodge hero main image. */
  LODGE_HERO: 1600,
  /** Full-width homepage / routes hero. */
  HERO: 1800,
  /** Mobile hero / poster frames. */
  HERO_MOBILE: 1200,
  /** Experience media grid thumb cells. */
  MEDIA_THUMB: 480,
  /** Experience hero main / media primary tile. */
  MEDIA_MAIN: 1200,
  /** Gallery lightbox full view. */
  MEDIA_LIGHTBOX: 1600,
  /** Itinerary day photo. */
  ITINERARY: 960,
  /** Wildlife species grid cell. */
  WILDLIFE: 640,
  /** About / learning programme section images. */
  SECTION: 1200,
  /** Journal listing / inline article image. */
  JOURNAL: 900,
  /** Technology product card (~small grid cell). */
  TECH: 400,
  /** Booking modal banner. */
  BOOKING_MODAL: 400,
  /** Site header / footer logos. */
  LOGO: 720,
  /** Routes territory map sidebar image. */
  ROUTES_TERRITORY: 800,
  /** Routes card thumbnail. */
  ROUTES_CARD: 500,
  /** About people portrait. */
  ABOUT_PORTRAIT: 600,
} as const

const imageBuilder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
})

function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source)
}

export type SanityImageFit = 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'

export type SanityImageUrlOptions = {
  width: number
  height?: number
  quality?: number
  fit?: SanityImageFit
  autoFormat?: boolean
}

export function isSanityCdnImageUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.hostname === 'cdn.sanity.io' && u.pathname.includes('/images/')
  } catch {
    return false
  }
}

/** Adds or replaces Sanity CDN transform params on an existing asset URL. */
export function optimizeSanityCdnUrl(url: string, opts: SanityImageUrlOptions): string {
  const { width, height, quality = SANITY_IMAGE_QUALITY, fit = 'max', autoFormat = true } = opts
  if (!url?.trim()) return url
  const trimmed = url.trim()
  if (!isSanityCdnImageUrl(trimmed)) return trimmed

  try {
    const u = new URL(trimmed)
    u.searchParams.set('w', String(Math.round(width)))
    if (height) u.searchParams.set('h', String(Math.round(height)))
    u.searchParams.set('q', String(Math.round(quality)))
    u.searchParams.set('fit', fit)
    if (autoFormat) u.searchParams.set('auto', 'format')
    return u.toString()
  } catch {
    return trimmed
  }
}

/** Resize an existing URL when it is a Sanity CDN asset; pass through external URLs unchanged. */
export function optimizeSanityImageDelivery(
  url: string | null | undefined,
  width: number,
  opts?: Omit<SanityImageUrlOptions, 'width'>,
): string {
  const trimmed = url?.trim()
  if (!trimmed) return ''
  return optimizeSanityCdnUrl(trimmed, { width, ...opts })
}

export type SanityImageUrlInput = {
  url?: string | null
  image?: SanityImageSource | null
  width: number
  height?: number
  quality?: number
  fit?: SanityImageFit
  fallback?: string
}

/**
 * Builds an optimized Sanity CDN URL from either a raw asset URL (GROQ `asset->url`)
 * or a Sanity image source reference.
 */
export function sanityImageUrl(input: SanityImageUrlInput): string {
  const {
    width,
    height,
    quality = SANITY_IMAGE_QUALITY,
    fit = 'max',
    fallback = '',
  } = input

  const direct = input.url?.trim()
  if (direct) {
    if (isSanityCdnImageUrl(direct)) {
      return optimizeSanityCdnUrl(direct, { width, height, quality, fit })
    }
    return direct
  }

  if (input.image) {
    try {
      let builder = urlForImage(input.image).auto('format').fit(fit).width(width).quality(quality)
      if (height) builder = builder.height(height)
      return builder.url() || fallback
    } catch {
      return fallback
    }
  }

  return fallback
}
