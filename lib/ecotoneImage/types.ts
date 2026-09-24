import type { SanityImageSource } from '@sanity/image-url'

/** Delivery roles — layout-driven, not page-specific. */
export type EcotoneImageRole = 'hero' | 'editorial' | 'portrait' | 'card'

/** Global CDN width ladder (px). Filtered per image against master width. */
export const ECOTONE_IMAGE_WIDTH_LADDER = [
  640, 960, 1200, 1600, 2000, 2400, 2800, 3200, 3840,
] as const

export type EcotoneImageRoleConfig = {
  /** CSS `sizes` attribute for browser candidate selection. */
  sizes: string
  /** Max candidate to consider for this role (before master-width clamp). */
  maxWidth: number
  /** Min candidate (drops ladder steps below this). */
  minWidth: number
  quality: number
}

/**
 * Sanity image field as returned for responsive delivery:
 * full image object (crop/hotspot) + expanded asset metadata.
 */
export type EcotoneSanityImageField = {
  _type?: string
  asset?: {
    _ref?: string
    _id?: string
    url?: string | null
    metadata?: {
      dimensions?: {
        width?: number | null
        height?: number | null
        aspectRatio?: number | null
      } | null
    } | null
  } | null
  crop?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  } | null
  hotspot?: {
    x?: number
    y?: number
    height?: number
    width?: number
  } | null
}

/** Resolved image payload handed to `<EcotoneImage />`. */
export type EcotoneImageSource = {
  /** Full Sanity image (preferred — preserves crop/hotspot). */
  image?: EcotoneSanityImageField | SanityImageSource | null
  /** Plain URL fallback (static / non-Sanity / when image object missing). */
  fallbackUrl?: string | null
  /** Known master dimensions when available (from asset metadata). */
  masterWidth?: number | null
  masterHeight?: number | null
}

export type ResponsiveSanityImageResult = {
  src: string
  srcSet: string
  sizes: string
  /** Candidates actually emitted (after master clamp). */
  widths: number[]
  masterWidth: number | null
  masterHeight: number | null
  quality: number
}
