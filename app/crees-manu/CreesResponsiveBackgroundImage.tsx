import {
  buildResponsiveSrcSet,
  type ResponsiveImageManifest,
} from './crees-manu-images'

type CreesResponsiveBackgroundImageProps = {
  manifest: ResponsiveImageManifest
  className?: string
  pictureClassName?: string
  priority?: boolean
}

export function CreesResponsiveBackgroundImage({
  manifest,
  className = 'crees-media',
  pictureClassName = 'crees-responsive-media',
  priority = false,
}: CreesResponsiveBackgroundImageProps) {
  const avifSrcSet = buildResponsiveSrcSet(manifest, 'avif')
  const webpSrcSet = buildResponsiveSrcSet(manifest, 'webp')
  const fallbackSrc = `${manifest.basePath}/mobile.webp`

  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={avifSrcSet} sizes="100vw" />
      <source type="image/webp" srcSet={webpSrcSet} sizes="100vw" />
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
