export type ResponsiveImageSize = {
  name: 'mobile' | 'tablet' | 'desktop'
  width: number
}

export type ResponsiveImageManifest = {
  basePath: string
  sizes: ResponsiveImageSize[]
}

export const CREES_HERO_IMAGES: ResponsiveImageManifest = {
  basePath: '/crees-manu/hero',
  sizes: [
    { name: 'mobile', width: 900 },
    { name: 'tablet', width: 1600 },
    { name: 'desktop', width: 2800 },
  ],
}

export const CREES_CLOSING_IMAGES: ResponsiveImageManifest = {
  basePath: '/crees-manu/closing',
  sizes: [
    { name: 'mobile', width: 800 },
    { name: 'tablet', width: 1400 },
    { name: 'desktop', width: 2400 },
  ],
}

export function buildResponsiveSrcSet(
  manifest: ResponsiveImageManifest,
  format: 'avif' | 'webp',
): string {
  return manifest.sizes
    .map(({ name, width }) => `${manifest.basePath}/${name}.${format} ${width}w`)
    .join(', ')
}
