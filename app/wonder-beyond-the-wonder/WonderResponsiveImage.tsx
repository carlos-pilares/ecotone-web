import {
  buildResponsiveSrcSet,
  type JourneyCardImage,
  type ResponsiveImageManifest,
} from './wonder-images'

type Props = {
  manifest: ResponsiveImageManifest
  className?: string
  pictureClassName?: string
  priority?: boolean
  sizes?: string
}

export function WonderResponsiveImage({
  manifest,
  className = 'wbtw-media',
  pictureClassName = 'wbtw-responsive-media',
  priority = false,
  sizes = '100vw',
}: Props) {
  const avifSrcSet = buildResponsiveSrcSet(manifest, 'avif')
  const webpSrcSet = buildResponsiveSrcSet(manifest, 'webp')
  const fallbackSrc = `${manifest.basePath}/mobile.webp`

  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={fallbackSrc}
        alt=""
        className={className}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  )
}

/** Responsive journey card image (AVIF → WebP fallback). */
export function WonderJourneyCardImage({
  image,
  className = 'wbtw-journey-img',
}: {
  image: JourneyCardImage
  className?: string
}) {
  const avifSrcSet = buildResponsiveSrcSet(image, 'avif')
  const webpSrcSet = buildResponsiveSrcSet(image, 'webp')
  const sizes = '(min-width: 900px) 420px, (min-width: 768px) 33vw, 100vw'

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={`${image.basePath}/mobile.webp`}
        alt={image.alt}
        className={className}
        width={image.width ?? 749}
        height={image.height ?? 1024}
        style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}

type JourneyImageProps = {
  basePath: string
  className?: string
}

/** Single-width journey card image (AVIF → WebP fallback). */
export function WonderJourneyImage({ basePath, className = 'wbtw-journey-img' }: JourneyImageProps) {
  return (
    <picture>
      <source type="image/avif" srcSet={`${basePath}.avif`} />
      <source type="image/webp" srcSet={`${basePath}.webp`} />
      <img src={`${basePath}.webp`} alt="" className={className} loading="lazy" decoding="async" />
    </picture>
  )
}
