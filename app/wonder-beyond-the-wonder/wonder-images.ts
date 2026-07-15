export type ResponsiveImageSize = {
  name: 'mobile' | 'tablet' | 'desktop'
  width: number
}

export type ResponsiveImageManifest = {
  basePath: string
  sizes: ResponsiveImageSize[]
}

export const WBTW_HERO_IMAGES: ResponsiveImageManifest = {
  basePath: '/wonder-beyond-the-wonder/hero',
  sizes: [
    { name: 'mobile', width: 900 },
    { name: 'tablet', width: 1400 },
    { name: 'desktop', width: 2400 },
  ],
}

export const WBTW_EDITORIAL_IMAGES: ResponsiveImageManifest = {
  basePath: '/wonder-beyond-the-wonder/editorial',
  sizes: [
    { name: 'mobile', width: 900 },
    { name: 'tablet', width: 1400 },
    { name: 'desktop', width: 2000 },
  ],
}

/** 50% benefit section — canopy / Tropical Andes mountain. */
export const WBTW_BENEFIT_IMAGES: ResponsiveImageManifest = {
  basePath: '/wonder-beyond-the-wonder/benefit',
  sizes: [
    { name: 'mobile', width: 900 },
    { name: 'tablet', width: 1024 },
    { name: 'desktop', width: 1024 },
  ],
}

/** Final CTA section — river approaching a forested peak. */
export const WBTW_CLOSE_IMAGES: ResponsiveImageManifest = {
  basePath: '/wonder-beyond-the-wonder/close',
  sizes: [
    { name: 'mobile', width: 900 },
    { name: 'tablet', width: 1024 },
    { name: 'desktop', width: 1024 },
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

export const WBTW_JOURNEY_IMAGES = {
  wonder: '/wonder-beyond-the-wonder/journeys/wonder',
  family: '/wonder-beyond-the-wonder/journeys/family',
  wildlife: '/wonder-beyond-the-wonder/journeys/wildlife',
} as const

const JOURNEY_CARD_SIZES: ResponsiveImageSize[] = [
  { name: 'mobile', width: 600 },
  { name: 'tablet', width: 800 },
  { name: 'desktop', width: 1200 },
]

export type JourneyCardImage = ResponsiveImageManifest & {
  alt: string
  objectPosition?: string
  width?: number
  height?: number
}

export const WBTW_JOURNEY_CARD_IMAGES = {
  wonder: {
    basePath: '/wonder-beyond-the-wonder/journeys/wonder-beyond-the-wonder-card',
    sizes: JOURNEY_CARD_SIZES,
    alt: 'Cloud forest landscape for Ecotone travellers beyond Machu Picchu',
  },
  family: {
    basePath: '/wonder-beyond-the-wonder/journeys/family-quest-beyond-machu-picchu-card',
    sizes: JOURNEY_CARD_SIZES,
    alt: 'Family nature experience in the forest with Ecotone',
  },
  wildlife: {
    basePath: '/wonder-beyond-the-wonder/journeys/wildlife-photography-card',
    sizes: JOURNEY_CARD_SIZES,
    alt: "Wildlife and photography experience in Peru's biodiversity landscapes",
  },
} as const satisfies Record<string, JourneyCardImage>

const WHY_CARD_SIZES: ResponsiveImageSize[] = [
  { name: 'mobile', width: 600 },
  { name: 'tablet', width: 850 },
  { name: 'desktop', width: 964 },
]

export const WBTW_WHY_CARD_IMAGES = {
  connection: {
    basePath: '/wonder-beyond-the-wonder/why/why-deeper-connection',
    sizes: WHY_CARD_SIZES,
    alt: 'Travellers connecting with the cloud forest landscape beyond Machu Picchu',
    objectPosition: 'center 42%',
    width: 964,
    height: 1024,
  },
  impact: {
    basePath: '/wonder-beyond-the-wonder/why/why-meaningful-impact',
    sizes: WHY_CARD_SIZES,
    alt: 'Conservation-led experience supporting nature and local communities in Peru',
    objectPosition: 'center 55%',
    width: 964,
    height: 1024,
  },
  perspective: {
    basePath: '/wonder-beyond-the-wonder/why/why-richer-perspective',
    sizes: WHY_CARD_SIZES,
    alt: 'Wide Tropical Andes landscape showing a deeper perspective of Peru',
    objectPosition: 'center 40%',
    width: 964,
    height: 1024,
  },
} as const satisfies Record<string, JourneyCardImage>
