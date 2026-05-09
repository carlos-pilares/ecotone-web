import { createClient } from 'next-sanity'
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20'

if (!projectId || !dataset) {
  // eslint-disable-next-line no-console
  console.warn(
    '[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET should be set.',
  )
}

const base = {
  projectId: projectId || '',
  dataset: dataset || '',
  apiVersion,
}

export const client = createClient({
  ...base,
  useCdn: true,
})

/** Server: fresher content for SSG/ISR and CMS previews (avoids long CDN cache). */
export const clientServer = createClient({
  ...base,
  useCdn: false,
})

const imageBuilder = createImageUrlBuilder({ projectId: projectId || '', dataset: dataset || '' })

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source)
}

/** Safe URL for Sanity images; returns `fallback` when missing or on error. */
export function cdnImageUrl(
  source: SanityImageSource | null | undefined,
  width: number,
  fallback: string,
): string {
  if (!source) return fallback
  try {
    const u = urlFor(source).width(width).quality(85).url()
    return u || fallback
  } catch {
    return fallback
  }
}

/**
 * Partner logo marks: full uncropped asset, scaled to fit inside a square cap (no hotspot/crop).
 * Layout uses CSS `object-fit: contain` inside fixed cells.
 */
export function partnerLogoCdnUrl(
  source: SanityImageSource | null | undefined,
  fallback: string,
): string {
  if (!source) return fallback
  const cap = 512
  try {
    const u = urlFor(source)
      .ignoreImageParams()
      .width(cap)
      .height(cap)
      .fit('max')
      .quality(85)
      .url()
    return u || fallback
  } catch {
    return fallback
  }
}
