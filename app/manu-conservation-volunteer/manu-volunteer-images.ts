/**
 * Manu Conservation Volunteer campaign imagery.
 *
 * Masters live in `app/manu-conservation-volunteer/assets/`.
 * Public AVIF/WebP derivatives are generated into `public/manu-conservation-volunteer/`.
 */
import type { JourneyCardImage, ResponsiveImageManifest } from '../wonder-beyond-the-wonder/wonder-images'

const FIELD_CARD_SIZES = [
  { name: 'mobile' as const, width: 900 },
  { name: 'tablet' as const, width: 1400 },
  { name: 'desktop' as const, width: 2200 },
]

const FEATURED_SIZES = [
  { name: 'mobile' as const, width: 900 },
  { name: 'tablet' as const, width: 1600 },
  { name: 'desktop' as const, width: 2800 },
]

const WHY_PILLAR_SIZES = [
  { name: 'mobile' as const, width: 800 },
  { name: 'tablet' as const, width: 1200 },
  { name: 'desktop' as const, width: 1200 },
]

/** Hero — field crew at Catarata Shintuya. Derivatives from 6000×4000 local master. */
export const MCV_HERO_IMAGES: ResponsiveImageManifest = {
  basePath: '/manu-conservation-volunteer/hero',
  sizes: [
    { name: 'mobile', width: 900 },
    { name: 'tablet', width: 1600 },
    { name: 'desktop', width: 2800 },
  ],
}

export type McvFieldworkCard = JourneyCardImage & {
  title: string
  caption: string
  /** Visible photographer credit, e.g. "Photo: Javier Farfan" */
  photoCredit?: string
  /** Static PNG path when not using responsive manifest */
  staticSrc?: string
  staticPosition?: string
}

/**
 * Featured fieldwork visual — jaguar camera-trap imagery (Javier Farfan).
 * Label remains “Camera trap work” as the photograph is wildlife-camera output.
 */
export const MCV_FIELDWORK_FEATURED: McvFieldworkCard = {
  basePath: '/manu-conservation-volunteer/jaguar',
  sizes: FEATURED_SIZES,
  width: 2800,
  height: 1860,
  title: 'Camera trap work',
  caption: 'Check, deploy and maintain wildlife cameras.',
  alt: 'Jaguar captured by a camera trap in the Manu rainforest',
  objectPosition: 'center 45%',
  photoCredit: 'Photo: Javier Farfan',
}

/** Supporting fieldwork cards — distinct activities, no repeated assets. */
export const MCV_FIELDWORK_SUPPORT: McvFieldworkCard[] = [
  {
    basePath: '/manu-conservation-volunteer/biodiversity-monitoring',
    sizes: [
      { name: 'mobile', width: 800 },
      { name: 'tablet', width: 1200 },
      { name: 'desktop', width: 1200 },
    ],
    width: 1200,
    height: 800,
    title: 'Biodiversity monitoring',
    caption: 'Observe species and monitor forest ecosystems.',
    alt: 'Biodiversity monitoring work in the Manu rainforest',
    objectPosition: 'center 42%',
  },
  {
    basePath: '/manu-conservation-volunteer/field-data',
    sizes: FIELD_CARD_SIZES,
    width: 2200,
    height: 1467,
    title: 'Field data',
    caption: 'Record observations that support ongoing research.',
    alt: 'Conservation team recording field observations in the rainforest',
    objectPosition: 'center 42%',
    photoCredit: 'Photo: Carlos Gonzales',
  },
  {
    basePath: '/manu-conservation-volunteer/working-with-team',
    sizes: FIELD_CARD_SIZES,
    width: 2200,
    height: 1467,
    title: 'Working with the team',
    caption: 'Learn and work alongside the field crew.',
    alt: 'Volunteers learning alongside researchers in the field',
    objectPosition: 'center 40%',
    photoCredit: 'Photo: Carlos Gonzales',
  },
]

export type McvWhyPillarImage = JourneyCardImage & {
  term: 'Stay' | 'Contribute' | 'Learn'
}

/** Result page — Stay / Contribute / Learn pillar photography. */
export const MCV_WHY_PILLARS: McvWhyPillarImage[] = [
  {
    term: 'Stay',
    basePath: '/manu-conservation-volunteer/why-stay',
    sizes: WHY_PILLAR_SIZES,
    width: 1200,
    height: 800,
    alt: 'Field station accommodation in the Manu rainforest',
    objectPosition: 'center 42%',
  },
  {
    term: 'Contribute',
    basePath: '/manu-conservation-volunteer/why-contribute',
    sizes: WHY_PILLAR_SIZES,
    width: 1200,
    height: 800,
    alt: 'Volunteers contributing to field conservation activities',
    objectPosition: 'center 45%',
  },
  {
    term: 'Learn',
    basePath: '/manu-conservation-volunteer/why-learn',
    sizes: WHY_PILLAR_SIZES,
    width: 1200,
    height: 800,
    alt: 'Learning alongside conservation researchers in the field',
    objectPosition: 'center 40%',
  },
]

export type McvStaticImage = {
  src?: string
  alt: string
  label?: string
  objectPosition?: string
  photoCredit?: string
  /** Prefer responsive picture pipeline when set */
  basePath?: string
  sizes?: { name: 'mobile' | 'tablet' | 'desktop'; width: number }[]
  width?: number
  height?: number
}

const SCIENCE_MAIN_SIZES = [
  { name: 'mobile' as const, width: 900 },
  { name: 'tablet' as const, width: 1400 },
  { name: 'desktop' as const, width: 2400 },
]

/** Science credibility — camera-trap photography + field team. */
export const MCV_SCIENCE_MAIN: McvStaticImage = {
  basePath: '/manu-conservation-volunteer/camera-trap',
  sizes: SCIENCE_MAIN_SIZES,
  width: 2400,
  height: 1600,
  alt: 'Researchers checking a camera trap in the Manu rainforest',
  label: 'Camera trap work',
  objectPosition: 'center 48%',
}

export const MCV_SCIENCE_SUPPORT: McvStaticImage[] = [
  {
    basePath: '/manu-conservation-volunteer/field-station',
    sizes: [
      { name: 'mobile', width: 800 },
      { name: 'tablet', width: 1200 },
      { name: 'desktop', width: 1200 },
    ],
    width: 1200,
    height: 800,
    alt: 'Conservation field station in the Manu rainforest',
    label: 'Field station',
    objectPosition: 'center 42%',
  },
  {
    src: '/crees-manu/mission-long-term-conservation.png',
    alt: 'Long-term conservation monitoring in the Manu rainforest',
    label: 'Monitoring',
    objectPosition: 'center 58%',
  },
]

/** 2026 supported place — people-led, not repeated scenic hero. */
export const MCV_OPPORTUNITY_IMAGE: McvStaticImage = {
  src: '/crees-manu/path-conservation-volunteer.png',
  alt: 'Conservation volunteer programme in the Peruvian Amazon',
  objectPosition: 'center 45%',
}

export type McvCollageImage = JourneyCardImage & {
  label: string
  photoCredit?: string
  staticSrc?: string
  staticPosition?: string
}

const COLLAGE_SIZES = [
  { name: 'mobile' as const, width: 900 },
  { name: 'tablet' as const, width: 1400 },
  { name: 'desktop' as const, width: 2200 },
]

/** Enjoy collage — dedicated Manu Field Crew photography. */
export const MCV_ENJOY_COLLAGE: McvCollageImage[] = [
  {
    basePath: '/manu-conservation-volunteer/be-amazed',
    sizes: [
      { name: 'mobile', width: 800 },
      { name: 'tablet', width: 1200 },
      { name: 'desktop', width: 1200 },
    ],
    label: 'Be amazed',
    alt: 'A moment of wonder in the Manu rainforest',
    objectPosition: 'center 40%',
    width: 1200,
    height: 800,
  },
  {
    basePath: '/manu-conservation-volunteer/explore-rainforest',
    sizes: COLLAGE_SIZES,
    label: 'Rainforest exploration',
    alt: 'Exploring the Manu rainforest on foot',
    objectPosition: 'center 42%',
    width: 2200,
    height: 1650,
  },
  {
    basePath: '/manu-conservation-volunteer/life-at-station',
    sizes: COLLAGE_SIZES,
    label: 'Life at the station',
    alt: 'Everyday life at the conservation field station',
    objectPosition: 'center 40%',
    width: 2200,
    height: 1467,
    photoCredit: 'Photo: Carlos Gonzales',
  },
  {
    basePath: '/manu-conservation-volunteer/your-people',
    sizes: [
      { name: 'mobile', width: 800 },
      { name: 'tablet', width: 1200 },
      { name: 'desktop', width: 1200 },
    ],
    label: 'Find your people',
    alt: 'People sharing the Manu Field Crew experience together',
    objectPosition: 'center 45%',
    width: 1200,
    height: 800,
  },
]
