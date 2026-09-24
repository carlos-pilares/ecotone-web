import {
  buildResponsiveSanityImage,
  type EcotoneImageRole,
  type EcotoneImageSource,
} from '@/lib/ecotoneImage'

type EcotoneImageProps = {
  image?: EcotoneImageSource['image']
  fallbackUrl?: string | null
  masterWidth?: number | null
  masterHeight?: number | null
  role: EcotoneImageRole
  alt: string
  className?: string
  /** Passed through to the underlying img (design wrappers own aspect/object-fit). */
  loading?: 'eager' | 'lazy'
  decoding?: 'async' | 'auto' | 'sync'
  fetchPriority?: 'high' | 'low' | 'auto'
}

/**
 * Responsive Sanity CMS image. Role drives `sizes` + candidate ladder.
 * Parent CSS continues to control layout (object-fit, radius, aspect-ratio).
 */
export function EcotoneImage({
  image,
  fallbackUrl,
  masterWidth,
  masterHeight,
  role,
  alt,
  className,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
}: EcotoneImageProps) {
  const built = buildResponsiveSanityImage({
    source: { image, fallbackUrl, masterWidth, masterHeight },
    role,
  })

  if (!built?.src) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Sanity CDN srcset; not next/image
    <img
      src={built.src}
      srcSet={built.srcSet || undefined}
      sizes={built.sizes}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      {...(fetchPriority ? { fetchPriority } : {})}
    />
  )
}
