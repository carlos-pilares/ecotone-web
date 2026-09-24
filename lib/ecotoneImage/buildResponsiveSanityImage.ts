import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import { isSanityCdnImageUrl, optimizeSanityCdnUrl } from '@/lib/sanityImageUrls'

import { ECOTONE_IMAGE_ROLES } from './roles'
import {
  ECOTONE_IMAGE_WIDTH_LADDER,
  type EcotoneImageRole,
  type EcotoneImageSource,
  type EcotoneSanityImageField,
  type ResponsiveSanityImageResult,
} from './types'

const imageBuilder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
})

function asField(image: EcotoneImageSource['image']): EcotoneSanityImageField | null {
  if (!image || typeof image !== 'object') return null
  return image as EcotoneSanityImageField
}

function readMasterDims(source: EcotoneImageSource): {
  width: number | null
  height: number | null
} {
  if (source.masterWidth && source.masterWidth > 0) {
    return {
      width: Math.round(source.masterWidth),
      height:
        source.masterHeight && source.masterHeight > 0
          ? Math.round(source.masterHeight)
          : null,
    }
  }
  const field = asField(source.image)
  const dims = field?.asset?.metadata?.dimensions
  const w = dims?.width
  const h = dims?.height
  return {
    width: typeof w === 'number' && w > 0 ? Math.round(w) : null,
    height: typeof h === 'number' && h > 0 ? Math.round(h) : null,
  }
}

function assetUrl(source: EcotoneImageSource): string {
  const field = asField(source.image)
  const fromAsset = field?.asset?.url?.trim()
  if (fromAsset) return fromAsset
  const fb = source.fallbackUrl?.trim()
  return fb || ''
}

/** Build candidate widths for a role, never above the master when known. */
export function candidateWidthsForRole(
  role: EcotoneImageRole,
  masterWidth: number | null,
): number[] {
  const cfg = ECOTONE_IMAGE_ROLES[role]
  const cap =
    masterWidth && masterWidth > 0
      ? Math.min(cfg.maxWidth, masterWidth)
      : cfg.maxWidth

  const fromLadder = ECOTONE_IMAGE_WIDTH_LADDER.filter(
    (w) => w >= cfg.minWidth && w <= cap,
  )

  // Always include the effective max so Retina can take the largest available master.
  if (cap >= cfg.minWidth && !fromLadder.includes(cap as (typeof ECOTONE_IMAGE_WIDTH_LADDER)[number])) {
    const next = [...fromLadder, cap].sort((a, b) => a - b)
    return Array.from(new Set(next))
  }

  if (fromLadder.length === 0 && cap > 0) {
    return [Math.max(cap, Math.min(cfg.minWidth, cap))]
  }

  return fromLadder
}

function urlAtWidth(
  source: EcotoneImageSource,
  width: number,
  quality: number,
): string {
  const field = asField(source.image)
  if (field?.asset) {
    try {
      // Pass crop/hotspot + asset so Sanity CDN applies focal crop.
      const built = imageBuilder
        .image(field as SanityImageSource)
        .auto('format')
        .fit('max')
        .width(Math.round(width))
        .quality(quality)
        .url()
      if (built) return built
    } catch {
      // fall through
    }
  }

  const raw = assetUrl(source)
  if (!raw) return ''
  if (isSanityCdnImageUrl(raw)) {
    return optimizeSanityCdnUrl(raw, {
      width,
      quality,
      fit: 'max',
      autoFormat: true,
    })
  }
  return raw
}

export type BuildResponsiveSanityImageOptions = {
  source: EcotoneImageSource
  role: EcotoneImageRole
  /** Override role quality. */
  quality?: number
}

/**
 * Builds responsive Sanity CDN `src` + `srcSet` + `sizes` for an Ecotone image role.
 * Does not request widths larger than the original master when metadata is known.
 */
export function buildResponsiveSanityImage(
  opts: BuildResponsiveSanityImageOptions,
): ResponsiveSanityImageResult | null {
  const cfg = ECOTONE_IMAGE_ROLES[opts.role]
  const quality = opts.quality ?? cfg.quality
  const { width: masterWidth, height: masterHeight } = readMasterDims(opts.source)

  const widths = candidateWidthsForRole(opts.role, masterWidth)
  if (widths.length === 0) {
    const raw = assetUrl(opts.source)
    if (!raw) return null
    return {
      src: raw,
      srcSet: '',
      sizes: cfg.sizes,
      widths: [],
      masterWidth,
      masterHeight,
      quality,
    }
  }

  const entries: Array<{ w: number; url: string }> = []
  for (const w of widths) {
    const url = urlAtWidth(opts.source, w, quality)
    if (url) entries.push({ w, url })
  }
  if (entries.length === 0) {
    const raw = assetUrl(opts.source)
    if (!raw) return null
    return {
      src: raw,
      srcSet: '',
      sizes: cfg.sizes,
      widths: [],
      masterWidth,
      masterHeight,
      quality,
    }
  }

  // Prefer a mid/high candidate as default `src` (SSR / no-srcset browsers).
  const preferred =
    entries.find((e) => e.w >= Math.min(1200, entries[entries.length - 1]!.w)) ??
    entries[Math.min(1, entries.length - 1)] ??
    entries[0]!

  return {
    src: preferred.url,
    srcSet: entries.map((e) => `${e.url} ${e.w}w`).join(', '),
    sizes: cfg.sizes,
    widths: entries.map((e) => e.w),
    masterWidth,
    masterHeight,
    quality,
  }
}
