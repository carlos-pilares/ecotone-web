import type { JourneyCardImage } from './wonder-images'
import { WBTW_JOURNEY_CARD_IMAGES } from './wonder-images'

/**
 * Temporary visual-shell values for the WBTW result overlay.
 * Replace with the benefit engine — do not treat as live offer logic.
 */
export const WBTW_RESULT_SHELL = {
  discountPercent: 30,
  discountLabel: '30% OFF',
  voucherCode: 'BEYOND30',
} as const

export type WbtwResultOffer = typeof WBTW_RESULT_SHELL

/** Dev preview defaults for `/wonder-beyond-the-wonder/result`. */
export const WBTW_RESULT_SHELL_PERSONALIZATION = {
  travelTiming: 'November 2026',
  partySize: '3–4',
} as const

/** Presentational only — not recommendation logic. */
export const WBTW_RESULT_PRESENTATIONAL_FEATURED_KEY = 'family-discovery-quest' as const

/** Presentational badge until recommendation logic exists. */
export const WBTW_RESULT_FEATURED_BADGE = 'Featured journey'

export type WbtwResultShellExperience = {
  key: string
  title: string
  duration: string
  /** Presentational positioning signal, e.g. "First Manu experience". */
  bestFor: string
  /** Route or experience proposition — one scannable line. */
  proposition: string
  originalPrice: string
  promoPrice: string
  ctaLabel: string
  href: string
  image: JourneyCardImage
}

export const WBTW_RESULT_SHELL_EXPERIENCES: WbtwResultShellExperience[] = [
  {
    key: 'manu-gradient-expedition',
    title: 'Manu Gradient Expedition',
    duration: '4 DAYS · 3 NIGHTS',
    bestFor: 'First Manu experience',
    proposition: 'Andes → Cloud Forest → Amazon',
    originalPrice: 'US$ 1,250',
    promoPrice: 'US$ 875',
    ctaLabel: 'Explore Manu Gradient',
    href: '/experiences/manu-gradient-expedition-4d-3n',
    image: WBTW_JOURNEY_CARD_IMAGES.wonder,
  },
  {
    key: 'family-discovery-quest',
    title: 'Family Discovery Quest',
    duration: '5 DAYS · 4 NIGHTS',
    bestFor: 'Families & shared discovery',
    proposition: 'Wildlife · hands-on exploration · family-friendly pace',
    originalPrice: 'US$ 1,250',
    promoPrice: 'US$ 875',
    ctaLabel: 'Explore Family Discovery',
    href: '/experiences/family-discovery-quest-5d-4n',
    image: WBTW_JOURNEY_CARD_IMAGES.family,
  },
  {
    key: 'amazon-signature-expedition',
    title: 'Amazon Signature Expedition',
    duration: '6 DAYS · 5 NIGHTS',
    bestFor: 'Deeper immersion',
    proposition: 'More time in Manu · wildlife · remote Amazon',
    originalPrice: 'US$ 1,250',
    promoPrice: 'US$ 875',
    ctaLabel: 'Explore Amazon Signature',
    href: '/routes',
    image: WBTW_JOURNEY_CARD_IMAGES.wildlife,
  },
]

export const WBTW_JOURNEY_ALL_INCLUSIVE_FOOTNOTE =
  '*Core accommodation, meals, transport and guided activities are included according to each journey itinerary. Exact inclusions vary by experience.'

export const WBTW_JOURNEY_ALL_INCLUSIVE_DETAIL =
  'Accommodation · meals · transport · guided experiences'

export function splitPresentationalJourneys(experiences: WbtwResultShellExperience[]) {
  const featured =
    experiences.find((item) => item.key === WBTW_RESULT_PRESENTATIONAL_FEATURED_KEY) ??
    experiences[0]
  const alternatives = experiences.filter((item) => item.key !== featured.key)

  return { featured, alternatives }
}
