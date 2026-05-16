/**
 * Soqtapata Pristine Immersion — local data (unified former phase1–phase6).
 * Reusable module wiring lives in `soqtapataExperienceModules`.
 */

import type { CSSProperties } from 'react'
import type { ReviewDoc, TechnologyProductDoc } from '@/lib/queries'

export type SoqtapataPhase1GalleryCell = {
  kind: 'main' | 'thumb'
  dataExpLb: string
  ariaLabel: string
  imageSrc: string
  imageAlt: string
  /** Second thumb: show “+N more” pill with this data-exp-lb (HTML uses "0" for +more) */
  galleryLabel?: string
  moreBadge?: { text: string; dataExpLb: string; ariaLabel: string }
  stylePositionRelative?: boolean
}

export type SoqtapataPhase1BreadcrumbItem =
  | { type: 'link'; href: string; text: string }
  | { type: 'span-muted'; text: string }
  | { type: 'current'; text: string }

export type SoqtapataPhase1Hero = {
  gallery: SoqtapataPhase1GalleryCell[]
  breadcrumb: SoqtapataPhase1BreadcrumbItem[]
  badges: string[]
  h1: string
  tagline: string
  ratingScore: string
  ratingReviews: string
  ratingDivider: boolean
  lodgeName: string
  price: string
  priceSub: string
  bookUrl: string
  bookLabel: string
}

export type SoqtapataPhase1Stat = { n: string; l: string }

export type SoqtapataPhase1NavLink = {
  href: string
  label: string
  className: string
  dataActiveWhen?: string
}

export type SoqtapataPhase1PageNav = {
  leadName: string
  leadDays: string
  fromAriaLabel: string
  fromLabel: string
  fromNum: string
  fromSub: string
  bookHref: string
  bookLabel: string
  /** Si es `false`, oculta el botón Book del nav sticky (CMS Internal menu · `ctaVisible`). */
  bookVisible?: boolean
  links: SoqtapataPhase1NavLink[]
}

export const soqtapataPhase1: { hero: SoqtapataPhase1Hero; stats: SoqtapataPhase1Stat[]; pageNav: SoqtapataPhase1PageNav } = {
  hero: {
    gallery: [
      {
        kind: 'main',
        dataExpLb: '0',
        ariaLabel: 'Open photo gallery, image 1',
        imageSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
        imageAlt: 'Trail',
      },
      {
        kind: 'thumb',
        dataExpLb: '0',
        ariaLabel: 'Open photo gallery, image 1',
        imageSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
        imageAlt: 'Trail',
        galleryLabel: 'Forest canopy',
      },
      {
        kind: 'thumb',
        dataExpLb: '1',
        ariaLabel: 'Open photo gallery, image 2',
        imageSrc: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80',
        imageAlt: 'EcoDroneView',
        stylePositionRelative: true,
        galleryLabel: 'EcoDroneView® · aerial',
        moreBadge: { text: '+6 more', dataExpLb: '0', ariaLabel: 'Open full photo gallery' },
      },
    ],
    breadcrumb: [
      { type: 'link', href: '/', text: 'Home' },
      { type: 'span-muted', text: '›' },
      { type: 'link', href: '#', text: 'Experiences' },
      { type: 'span-muted', text: '›' },
      { type: 'link', href: '#', text: 'Camanti Route' },
      { type: 'span-muted', text: '›' },
      { type: 'current', text: 'Soqtapata 3D/2N' },
    ],
    badges: ['Nature Core', 'Camanti Route', '3D · 2N'],
    h1: 'Soqtapata Pristine Immersion',
    tagline: 'The untouched cloud forest. 10,000 ha reserve. EcoDroneView® · ForestWhisper® · Expert naturalist guide.',
    ratingScore: '5.0',
    ratingReviews: '· 12 reviews',
    ratingDivider: true,
    lodgeName: 'Soqtapata Lodge',
    price: '$986',
    priceSub: 'per person · all inclusive',
    bookUrl: 'https://www.wetravel.com',
    bookLabel: 'Book now',
  },
  stats: [
    { n: '3D · 2N', l: 'Duration' },
    { n: '~2.5h', l: 'From Cusco' },
    { n: '1,200 m', l: 'Altitude' },
    { n: 'Max 8', l: 'Group size' },
    { n: 'All-in', l: 'Inclusive' },
    { n: 'Cloud', l: 'Ecosystem' },
  ],
  pageNav: {
    leadName: 'Soqtapata Pristine Immersion',
    leadDays: '3D/2N',
    fromAriaLabel: 'From 986 US dollars per person',
    fromLabel: 'From',
    fromNum: '$986',
    fromSub: 'per person',
    bookHref: 'https://www.wetravel.com',
    bookLabel: 'Book now',
    links: [
      { href: '#overview', label: 'Overview', className: 'pnav-top pnav-item active' },
      { href: '#itinerary', label: 'Itinerary', className: 'pnav-top pnav-item' },
      { href: '#lodges', label: 'Lodge', className: 'pnav-top pnav-item', dataActiveWhen: 'lodges,wildlife' },
      { href: '#includes', label: 'Included', className: 'pnav-top pnav-item', dataActiveWhen: 'includes,tech' },
      { href: '#media', label: 'Gallery', className: 'pnav-top pnav-item', dataActiveWhen: 'media,when' },
      { href: '#before-you-go', label: 'Good to know', className: 'pnav-top pnav-item', dataActiveWhen: 'before-you-go,reviews,resources' },
      { href: '#terms', label: 'Terms', className: 'pnav-top pnav-item', dataActiveWhen: 'terms' },
      { href: '#faq', label: 'FAQs', className: 'pnav-top pnav-item' },
      { href: '#also-camanti', label: 'More', className: 'pnav-top pnav-item', dataActiveWhen: 'also-camanti,book' },
    ],
  },
}

export type SoqtapataOverview = {
  eyebrow: string
  h2: string
  /** Intro opcional entre H2 y los párrafos largos (presentación CMS). */
  lead?: string
  paragraphs: [string, string]
  highlights: string[]
}

export type SoqtapataTimelineItem = {
  time: string
  title: string
  desc: string
}

export type SoqtapataDayLodgeBadge = {
  name: string
  sub: string
}

export type SoqtapataItineraryDayId =
  | 'day1'
  | 'day2'
  | 'day3'
  | 'day4'
  | 'day5'
  | 'day6'
  | 'day7'
  | 'day8'
  | 'day9'
  | 'day10'

export type SoqtapataItineraryDay = {
  id: SoqtapataItineraryDayId
  photoSrc: string
  photoAlt: string
  caption: string
  dayNum: string
  title: string
  subtitle: string
  timeline: SoqtapataTimelineItem[]
  lodgeBadge?: SoqtapataDayLodgeBadge
}

export type SoqtapataItinerary = {
  eyebrow: string
  h2: string
  /** Intro opcional bajo el H2 (presentación CMS). */
  lead?: string
  days: SoqtapataItineraryDay[]
}

export const soqtapataPhase2: { overview: SoqtapataOverview; itinerary: SoqtapataItinerary } = {
  overview: {
    eyebrow: 'About this experience',
    h2: 'The cloud forest, unfiltered.',
    paragraphs: [
      "Three days inside the Soqtapata Reserve — 10,000 hectares of primary cloud forest from 900 to 4,700 m.a.s.l. You'll track wildlife, fly the canopy with EcoDroneView®, and fall asleep to the forest at Soqtapata Lodge, adjacent to CIDS, our active research centre.",
      "This is not a tour. It's an immersion run by scientists who live in the forest. Every booking directly funds conservation work managed by HERPIRO (B Corp).",
    ],
    highlights: [
      'EcoDroneView® aerial canopy flight included',
      'ForestWhisper® 360° sound immersion at night',
      'Private bungalow at Soqtapata Lodge (max 2)',
      'Access to CIDS research station with resident scientists',
      '300+ bird species · Spectacled bear · Puma · Jaguar territory',
    ],
  },
  itinerary: {
    eyebrow: 'Day by day',
    h2: "What you'll experience",
    days: [
      {
        id: 'day1',
        photoSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=85',
        photoAlt: 'Day 1',
        caption: 'Entering the Soqtapata Reserve via the 45-min trail from the road',
        dayNum: '1',
        title: 'Into the Cloud Forest',
        subtitle: 'Departure · Trek in · First wildlife walk · EcoDroneView®',
        timeline: [
          {
            time: '4:30 AM',
            title: 'Pickup from Cusco',
            desc: 'Hotel pickup or main plaza. Private 4x4 vehicle.',
          },
          {
            time: '~7:30 AM',
            title: 'Arrival at trailhead',
            desc: 'Gear up with rubber boots. 45-min trek into the reserve. First bird and mammal sightings begin.',
          },
          {
            time: '12:00 PM',
            title: 'Lunch at Soqtapata Lodge',
            desc: 'Fresh local ingredients. Meet the resident research team.',
          },
          {
            time: '3:00 PM',
            title: 'EcoDroneView® canopy flight',
            desc: 'Aerial survey of the reserve with your naturalist guide. Identify wildlife from the treetop perspective.',
          },
          {
            time: '6:00 PM',
            title: 'ForestWhisper® night session',
            desc: '360° sound immersion as the forest comes alive — owls, insects, amphibians chorus begins.',
          },
        ],
        lodgeBadge: {
          name: 'Overnight · Soqtapata Lodge',
          sub: 'Private bungalow or double room · full board',
        },
      },
      {
        id: 'day2',
        photoSrc: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=900&q=80',
        photoAlt: 'Day 2',
        caption: 'Full-day trail through primary forest — CIDS research station visit in the afternoon',
        dayNum: '2',
        title: 'Deep in the Reserve',
        subtitle: 'Full-day trail · CIDS research visit · EcoSpeciesExplorer® · Night wildlife',
        timeline: [
          {
            time: '5:30 AM',
            title: 'Dawn birdwatch',
            desc: 'The most active period. Your guide identifies species by call with EcoSpeciesExplorer®.',
          },
          {
            time: '8:00 AM',
            title: 'Breakfast & full-day trail',
            desc: 'Deep into the reserve along the primary forest trails. EcoSpeciesExplorer® in hand.',
          },
          {
            time: '2:00 PM',
            title: 'CIDS research station visit',
            desc: 'Meet the resident biologists. Learn about active conservation projects. See the species monitoring in action.',
          },
          {
            time: '7:00 PM',
            title: 'Night wildlife walk',
            desc: 'Torch-lit walk with your naturalist. Nocturnal amphibians, insects, and occasional mammal encounters.',
          },
        ],
        lodgeBadge: {
          name: 'Overnight · Soqtapata Lodge',
          sub: 'Private bungalow or double room · full board',
        },
      },
      {
        id: 'day3',
        photoSrc: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=900&q=80',
        photoAlt: 'Day 3',
        caption: 'Final dawn birdwatch before the trek out and return to Cusco',
        dayNum: '3',
        title: 'Last Morning · Return to Cusco',
        subtitle: 'Dawn birdwatch · Breakfast · Trek out · Cusco by afternoon',
        timeline: [
          {
            time: '5:30 AM',
            title: 'Final dawn birdwatch',
            desc: 'One last morning with your guide. Cock-of-the-rock lek at sunrise.',
          },
          {
            time: '8:00 AM',
            title: 'Breakfast · Pack & trek out',
            desc: '45-min trek to the trailhead. Private vehicle back to Cusco.',
          },
          {
            time: '~1:00 PM',
            title: 'Arrival in Cusco',
            desc: "Drop-off at your hotel or main plaza. Your experience ends here — but rarely leaves you.",
          },
        ],
      },
    ],
  },
}

export type SoqtapataLodgeChip = string

export type SoqtapataLodge = {
  eyebrow: string
  h2: string
  h2Style: { marginBottom: number }
  intro: string
  introStyle: { fontSize: number; fontWeight: number; color: string; lineHeight: number; marginBottom: number }
  /** CTA resuelta (experiencePage → lodgePage o fallback local). */
  ctaHref: string
  ctaLabel: string
  card: {
    imageSrc: string
    imageAlt: string
    nightBadge: string
    name: string
    nameStyle: { marginTop: number }
    pillText: string
    pillStyle: { fontSize: number; flexShrink: number; whiteSpace: 'nowrap' }
    meta: string
    metaStyle: { marginTop: number }
    chips: SoqtapataLodgeChip[]
    chipsWrapperStyle: { marginBottom: number }
    ctaHref: string
    ctaLabel: string
  }
}

export type SoqtapataWildlifeSpecies = {
  name: string
  sub: string
  /** 0..6 — fallback glyph in the photo placeholder only when no image. */
  iconId: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Optional species photo (local default or merged from CMS `wildlife[].image`). */
  imageSrc?: string
  imageAlt?: string
  /** Optional label, e.g. Rare · Research focus */
  badge?: string
}

export type SoqtapataWildlife = {
  eyebrow: string
  h2: string
  h2Style: { marginBottom: number }
  intro: string
  introStyle: { fontSize: number; fontWeight: number; color: string; lineHeight: number; marginBottom: number }
  species: SoqtapataWildlifeSpecies[]
}

export type SoqtapataIncludes = {
  eyebrow: string
  h2: string
  h2Style: { marginBottom: number }
  /** Intro opcional bajo el H2 (presentación CMS). */
  lead?: string
  includedTitle: string
  notTitle: string
  yes: string[]
  no: string[]
}

export const soqtapataPhase3: { lodge: SoqtapataLodge; wildlife: SoqtapataWildlife; includes: SoqtapataIncludes } = {
  lodge: {
    eyebrow: "Where you'll stay",
    h2: 'Your base in the forest',
    h2Style: { marginBottom: 6 },
    intro: 'This experience stays at Soqtapata Lodge for both nights — adjacent to the CIDS research centre.',
    introStyle: { fontSize: 14, fontWeight: 300, color: 'var(--n700)', lineHeight: 1.8, marginBottom: 20 },
    card: {
      imageSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
      imageAlt: 'Soqtapata Lodge',
      nightBadge: 'Nights 1 & 2',
      name: 'Soqtapata Lodge',
      nameStyle: { marginTop: 8 },
      pillText: 'Research station',
      pillStyle: { fontSize: 11, flexShrink: 0, whiteSpace: 'nowrap' },
      meta: '1,200 m.a.s.l. · Camanti Route · Max 14 guests · B Corp certified · Adjacent to CIDS research centre',
      metaStyle: { marginTop: 6 },
      chips: [
        'Private bungalow',
        'Hot shower',
        'All meals included',
        'Nature library',
        'Rubber boots provided',
      ],
      chipsWrapperStyle: { marginBottom: 14 },
      ctaHref: '#',
      ctaLabel: 'View full lodge page',
    },
    ctaHref: '#',
    ctaLabel: 'View full lodge page',
  },
  wildlife: {
    eyebrow: 'What you might encounter',
    h2: 'Wildlife in this reserve',
    h2Style: { marginBottom: 6 },
    intro: 'Not guaranteed — this is wild nature. These species are regularly observed in the Soqtapata territory.',
    introStyle: { fontSize: 14, fontWeight: 300, color: 'var(--n700)', lineHeight: 1.8, marginBottom: 16 },
    species: [
      {
        name: 'Cock-of-the-rock',
        sub: 'National bird of Perú',
        iconId: 0,
        imageSrc: 'https://images.unsplash.com/photo-1591824438708-ce405fca2ffa?w=960&q=82',
        imageAlt: 'Andean cock-of-the-rock in cloud forest',
      },
      {
        name: 'Spectacled bear',
        sub: 'Only bear in S. America',
        iconId: 1,
        imageSrc: 'https://images.unsplash.com/photo-1549366021-9f761d45002f?w=960&q=82',
        imageAlt: 'Spectacled bear in montane forest',
      },
      {
        name: 'Puma',
        sub: 'Mountain lion',
        iconId: 2,
        imageSrc: 'https://images.unsplash.com/photo-1611689341207-e6e0f0a08e1a?w=960&q=82',
        imageAlt: 'Puma in natural habitat',
      },
      {
        name: 'Jaguar',
        sub: 'Apex predator',
        iconId: 3,
        imageSrc: 'https://images.unsplash.com/photo-1561731216-c3a4d994860d?w=960&q=82',
        imageAlt: 'Jaguar resting',
      },
      {
        name: '300+ birds',
        sub: 'Including endemics',
        iconId: 4,
        imageSrc: 'https://images.unsplash.com/photo-1444464666168-49d637b00a6d?w=960&q=82',
        imageAlt: 'Tropical birds in forest canopy',
      },
      {
        name: 'Woolly monkey',
        sub: 'Active research project',
        iconId: 5,
        imageSrc: 'https://images.unsplash.com/photo-1540573137085-027dd3678a18?w=960&q=82',
        imageAlt: 'Woolly monkey in trees',
        badge: 'Research',
      },
      {
        name: 'Andean tapir',
        sub: 'Rare sighting',
        iconId: 6,
        imageSrc: 'https://images.unsplash.com/photo-1552410260-0a030e7c8483?w=960&q=82',
        imageAlt: 'Tapir in cloud forest',
        badge: 'Rare',
      },
    ],
  },
  includes: {
    eyebrow: "What's covered",
    h2: 'Includes & not included',
    h2Style: { marginBottom: 20 },
    includedTitle: "What's included",
    notTitle: 'Not included',
    yes: [
      'Private transport from/to Cusco',
      '2 nights at Soqtapata Lodge',
      'All meals — full board (breakfast, lunch, dinner)',
      'Expert certified naturalist guide',
      'EcoDroneView® canopy flight session',
      'ForestWhisper® night immersion session',
      'CIDS research station visit',
      'Rubber boots and rain gear (provided)',
      'Filtered drinking water at all times',
    ],
    no: [
      'International or domestic flights to Cusco',
      'Travel insurance (recommended)',
      'Alcoholic beverages',
      'Tips for guides and staff (discretionary)',
      'Personal medication and first-aid items',
      'Laundry services',
    ],
  },
}

const DEFAULT_EXPERIENCE_DESCRIPTION =
  'This experience includes EcoDroneView® and ForestWhisper® in your pack. EcoSpeciesExplorer® is available free on your device.'

export const soqtapataPhase4TechProducts: TechnologyProductDoc[] = [
  {
    _id: 'dtech1',
    name: 'EcoDroneView®',
    number: '01',
    description:
      'A journey beyond the trails, soaring above the canopy and exploring remote landscapes inaccessible by foot.',
    badgeText: 'Only at Ecotone',
    image: null,
  },
  {
    _id: 'dtech2',
    name: 'ForestWhisper®',
    number: '02',
    description:
      "Immerse yourself in the rainforest's enchanting sounds through premium 360° microphones and high-fidelity headphones.",
    badgeText: 'Only at Ecotone',
    image: null,
  },
  {
    _id: 'dtech3',
    name: 'EcoSpeciesExplorer®',
    number: '03',
    description:
      'This comprehensive platform reveals all kinds of incredible species found in our conservation destinations. Live on iOS.',
    badgeText: 'Only at Ecotone',
    badgeTextWhenExcluded: 'Download free on iOS',
    image: null,
  },
]

/** Incluidos on-site; EcoSpecies® queda con badge “free” (no incluido en pack físico). */
export const soqtapataPhase4IncludedProductIds: string[] = ['dtech1', 'dtech2']

export type SoqtapataMediaThumb =
  | {
      kind: 'image'
      dataExpLb: string
      ariaLabel: string
      imageSrc: string
      imageAlt: string
      overlayStyle?: CSSProperties
      label: string
      labelStyle: CSSProperties
    }
  | {
      kind: 'video'
      dataExpLb: string
      ariaLabel: string
      imageSrc: string
      imageAlt: string
      overlayStyle: CSSProperties
      label: string
      labelStyle: CSSProperties
    }

export type SoqtapataMedia = {
  eyebrow: string
  h2: string
  h2Style: CSSProperties
  /** Intro opcional bajo el H2 (presentación CMS). */
  lead?: string
  video: {
    imageSrc: string
    imageAlt: string
    filmPill: string
    officialPill: string
    /** Main tile is a KC video item (show play chrome). */
    isVideo?: boolean
    videoUrl?: string
  }
  thumbs: SoqtapataMediaThumb[]
  /** Omitted when every gallery image is already visible in the thumb grid. */
  moreCount?: { dataExpLb: string; countLabel: string; subLabel: string; ariaLabel: string }
}

export const soqtapataPhase4Media: SoqtapataMedia = {
  eyebrow: 'See it before you go',
  h2: 'The experience, unfiltered',
  h2Style: { marginBottom: 14 },
  video: {
    imageSrc: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=85',
    imageAlt: 'Soqtapata experience film',
    filmPill: 'Soqtapata Pristine Immersion',
    officialPill: 'Official film',
  },
  thumbs: [
    {
      kind: 'image',
      dataExpLb: '0',
      ariaLabel: 'Open photo, Trail',
      imageSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
      imageAlt: 'Trail',
      label: 'Trail',
      labelStyle: { background: 'rgba(0,0,0,.55)' },
    },
    {
      kind: 'video',
      dataExpLb: '1',
      ariaLabel: 'Open photo, EcoDroneView',
      imageSrc: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80',
      imageAlt: 'EcoDroneView',
      overlayStyle: { background: 'rgba(0,0,0,.35)' },
      label: 'EcoDroneView®',
      labelStyle: { background: 'rgba(144,103,48,.75)' },
    },
    {
      kind: 'image',
      dataExpLb: '2',
      ariaLabel: 'Open photo, Canopy',
      imageSrc: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&q=80',
      imageAlt: 'Canopy',
      label: 'Canopy',
      labelStyle: { background: 'rgba(0,0,0,.55)' },
    },
    {
      kind: 'image',
      dataExpLb: '3',
      ariaLabel: 'Open photo, Wildlife',
      imageSrc: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80',
      imageAlt: 'Wildlife',
      label: 'Wildlife',
      labelStyle: { background: 'rgba(0,0,0,.55)' },
    },
    {
      kind: 'video',
      dataExpLb: '4',
      ariaLabel: 'Open photo, ForestWhisper',
      imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      imageAlt: 'ForestWhisper',
      overlayStyle: { background: 'rgba(0,0,0,.35)' },
      label: 'ForestWhisper®',
      labelStyle: { background: 'rgba(144,103,48,.75)' },
    },
  ],
  moreCount: {
    dataExpLb: '0',
    countLabel: '+8',
    subLabel: 'See all',
    ariaLabel: 'Open full photo gallery',
  },
}

export type SoqtapataWhenMonth = {
  cardClass: 'default' | 'good' | 'peak'
  barStyle: string
  name: string
  stars: null | { level: 1 | 2; aria: string }
  highlight: string
}

export type SoqtapataWhen = {
  eyebrow: string
  h2: string
  h2Style: CSSProperties
  intro: string
  introStyle: CSSProperties
  months: SoqtapataWhenMonth[]
  legend: {
    eyebrow: string
    items: { swatchStyle: CSSProperties; strong: string; rest: string }[]
  }
}

export const soqtapataPhase4When: SoqtapataWhen = {
  eyebrow: 'When to visit',
  h2: 'Every month has something extraordinary',
  h2Style: { marginBottom: 10 },
  intro:
    'Camanti is alive year-round. Wildlife shifts with the season — not better or worse, just different. Every month is visible below.',
  introStyle: {
    fontSize: 15,
    fontWeight: 300,
    color: 'var(--n700)',
    lineHeight: 1.75,
    maxWidth: 560,
  },
  months: [
    {
      cardClass: 'default',
      barStyle: 'linear-gradient(90deg,#5a8a3a,#4a7a2a)',
      name: 'January',
      stars: null,
      highlight: 'Reptiles & amphibians. Lush, wet “green” season.',
    },
    {
      cardClass: 'default',
      barStyle: 'linear-gradient(90deg,#5a8a3a,#4a7a2a)',
      name: 'February',
      stars: null,
      highlight: 'Wild orchids. Forest colour at eye level on the trails.',
    },
    {
      cardClass: 'default',
      barStyle: 'linear-gradient(90deg,#4a7a2a,#3a6020)',
      name: 'March',
      stars: null,
      highlight: 'Migrants arrive. Early nesting activity and song.',
    },
    {
      cardClass: 'good',
      barStyle: 'linear-gradient(90deg,var(--brown),var(--brown-dk))',
      name: 'April',
      stars: { level: 1, aria: 'Great season' },
      highlight: 'Cock-of-the-rock leks. Quieter visitor numbers.',
    },
    {
      cardClass: 'good',
      barStyle: 'linear-gradient(90deg,var(--brown),var(--brown-dk))',
      name: 'May',
      stars: { level: 1, aria: 'Great season' },
      highlight: 'Drier underfoot, clearer light — great for images.',
    },
    {
      cardClass: 'peak',
      barStyle: 'linear-gradient(90deg,var(--brown-dk),var(--brown-xdk))',
      name: 'June',
      stars: { level: 2, aria: 'Peak season' },
      highlight: 'Top window for spectacled bear. Stable dry weather.',
    },
    {
      cardClass: 'peak',
      barStyle: 'linear-gradient(90deg,var(--brown-dk),var(--brown-xdk))',
      name: 'July',
      stars: { level: 2, aria: 'Peak season' },
      highlight: 'Exceptional birding — forest activity is very high.',
    },
    {
      cardClass: 'peak',
      barStyle: 'linear-gradient(90deg,var(--brown-dk),var(--brown-xdk))',
      name: 'August',
      stars: { level: 2, aria: 'Peak season' },
      highlight: 'Peak dry season. Fresh puma and carnivore sign.',
    },
    {
      cardClass: 'good',
      barStyle: 'linear-gradient(90deg,var(--brown),var(--brown-dk))',
      name: 'September',
      stars: { level: 1, aria: 'Great season' },
      highlight: 'Shifting light and young animals on the move.',
    },
    {
      cardClass: 'default',
      barStyle: 'linear-gradient(90deg,#4a7a2a,#3a6020)',
      name: 'October',
      stars: null,
      highlight: 'Rains build. Waterfalls in full flow; frogs and streams.',
    },
    {
      cardClass: 'default',
      barStyle: 'linear-gradient(90deg,#5a8a3a,#4a7a2a)',
      name: 'November',
      stars: null,
      highlight: 'Butterflies in numbers. A quieter, softer forest.',
    },
    {
      cardClass: 'default',
      barStyle: 'linear-gradient(90deg,#5a8a3a,#4a7a2a)',
      name: 'December',
      stars: null,
      highlight: 'Orchids and bromeliads. Lush, vivid green close.',
    },
  ],
  legend: {
    eyebrow: 'Season key',
    items: [
      {
        swatchStyle: {
          border: '2.5px solid var(--brown)',
          background: 'linear-gradient(180deg, var(--b50), #fff9f0)',
          boxShadow: '0 1px 4px rgba(144,103,48,.12)',
        },
        strong: '★★ Peak',
        rest: ' — strongest wildlife & weather window',
      },
      {
        swatchStyle: {
          border: '1.5px solid var(--b200)',
          background: 'var(--b50)',
        },
        strong: '★ Great',
        rest: ' — excellent; often fewer guests',
      },
      {
        swatchStyle: { border: '1px solid var(--n200)', background: 'var(--w)' },
        strong: 'Always worthwhile',
        rest: ' — rewarding year-round (softer top bar)',
      },
    ],
  },
}

export const soqtapataPhase4 = {
  techDescription: DEFAULT_EXPERIENCE_DESCRIPTION,
  techProducts: soqtapataPhase4TechProducts,
  includedProductIds: soqtapataPhase4IncludedProductIds,
  media: soqtapataPhase4Media,
  when: soqtapataPhase4When,
}

/** Sin CMS: sin tarjetas inventadas; el bloque reseñas usa emptyMessage del resolver. */
export const soqtapataPhase5Reviews: ReviewDoc[] = []

export type BfygEntryItem = { title: string; body: string; iconKey?: string }

export type BfygFlexCard = {
  kind: 'flex'
  flexLayout: 'qa' | 'checklist'
  id: string
  defaultOpen: boolean
  title: string
  headerIcon: 'entry' | 'luggage' | 'phone'
  items: BfygEntryItem[]
  checklistItems?: { label: string; iconKey?: string }[]
}

export type BfygCard =
  | {
      id: 'bfyg1'
      defaultOpen: true
      title: string
      headerIcon: 'entry'
      items: BfygEntryItem[]
    }
  | {
      id: 'bfyg2'
      defaultOpen: false
      title: string
      headerIcon: 'luggage'
      lead: string
      packItems: string[]
    }
  | {
      id: 'bfyg3'
      defaultOpen: false
      title: string
      headerIcon: 'phone'
      items: BfygEntryItem[]
    }
  | BfygFlexCard

export type SoqtapataBeforeYouGo = {
  eyebrow: string
  h2: string
  h2MarginBottom: number
  lead: string
  leadStyle: { fontSize: number; fontWeight: number; color: string; lineHeight: number; marginBottom: number }
  cards: BfygCard[]
}

export const soqtapataPhase5BeforeYouGo: SoqtapataBeforeYouGo = {
  eyebrow: 'Traveller guide',
  h2: 'Before you go',
  h2MarginBottom: 6,
  lead: 'Everything international visitors need to know.',
  leadStyle: { fontSize: 14, fontWeight: 300, color: 'var(--n700)', lineHeight: 1.8, marginBottom: 20 },
  cards: [
    {
      id: 'bfyg1',
      defaultOpen: true,
      title: 'Entry requirements for Perú',
      headerIcon: 'entry',
      items: [
        {
          title: 'Passport',
          body: 'Valid for at least 6 months beyond your travel dates. Keep a physical and digital copy.',
        },
        {
          title: 'Visa',
          body: 'Most nationalities receive a free tourist visa on arrival for up to 90 days. Check with your embassy for current requirements.',
        },
        {
          title: 'Vaccinations',
          body: 'Yellow fever recommended. Hepatitis A & B, Typhoid, and Rabies advisable for jungle areas. Consult a travel health clinic at least 4 weeks before departure.',
        },
        {
          title: 'Travel insurance',
          body: 'Strongly recommended. Ensure your policy covers jungle activities, altitude, and medical evacuation from remote areas.',
        },
      ],
    },
    {
      id: 'bfyg2',
      defaultOpen: false,
      title: 'Packing list · Camanti cloud forest',
      headerIcon: 'luggage',
      lead: 'Rubber boots and rain gear are provided at the lodge. Focus on layers — temperatures can drop significantly at night at 1,200 m.a.s.l.',
      packItems: [
        'Quick-dry trousers',
        'Warm mid-layer fleece',
        'Waterproof jacket',
        'Long-sleeve shirts',
        'Insect repellent (DEET)',
        'Sunscreen SPF 50+',
        'Binoculars (8x42+)',
        'Headlamp + spare batteries',
        'Small daypack',
        'Camera + extra memory',
      ],
    },
    {
      id: 'bfyg3',
      defaultOpen: false,
      title: 'Getting to Cusco · Flights & acclimatisation',
      headerIcon: 'phone',
      items: [
        {
          title: 'Flights to Cusco',
          body: 'Fly into Alejandro Velasco Astete International Airport (CUZ). Direct flights from Lima (LIM) with LATAM and Avianca, ~1.5 hours. Lima connects to major international hubs.',
        },
        {
          title: 'Acclimatisation — important',
          body: 'Cusco sits at 3,400 m.a.s.l. We strongly recommend arriving 1–2 days before your experience starts. Rest, drink coca tea, avoid alcohol. Your departure at 4:30 AM means resting the day before is especially important.',
        },
        {
          title: 'Our pickup',
          body: "We pick you up at 4:30–5:00 AM from your hotel or the main plaza in Cusco. Share your hotel name after booking and we'll confirm the exact time.",
        },
      ],
    },
  ],
}

export type SoqtapataTermCard = {
  id: string
  title: string
  body: string
}

export type SoqtapataTerms = {
  introEyebrow: string
  h2: string
  lead: string
  pdfHref: string
  /** Accesibilidad del acordeón (`#terms-accordion`). */
  accordionAriaLabel: string
  /** Texto visible del CTA PDF bajo el acordeón. */
  pdfDownloadLabel: string
  cards: SoqtapataTermCard[]
}

export const soqtapataPhase5Terms: SoqtapataTerms = {
  introEyebrow: 'Before you book',
  h2: 'Terms',
  lead: 'Key things to know. For the complete legal text, use the full PDF. These bullets do not replace your booking agreement.',
  pdfHref: '/ecotone-terms-conditions.pdf',
  accordionAriaLabel: 'Terms summary',
  pdfDownloadLabel: 'Download full terms (PDF)',
  cards: [
    {
      id: 'tcard1',
      title: 'Cancellation policy',
      body: 'Cancellations more than 15 days before the departure date from Cusco are eligible for a full refund of amounts paid to Ecotone, per the schedule on your WeTravel booking. Cancellations inside 15 days may be non-refundable or partially refundable depending on the program — see your confirmation and the full terms. No-shows are not refunded. We process refunds to the original payment method where possible.',
    },
    {
      id: 'tcard2',
      title: 'Changes & flexibility',
      body: 'Date or guest-name changes are subject to availability and may carry an administrative fee. We’ll always try to help if you notify us early. Major changes to the itinerary (route, length, group size) may be treated as a new booking — our team will confirm in writing.',
    },
    {
      id: 'tcard3',
      title: 'What’s included / not included',
      body: 'Inclusions and exclusions for this program are listed in the “Includes & not included” section above. International flights, personal insurance, and discretionary tips are generally not included unless stated. Technology (EcoDroneView®, etc.) is included only where the programme says so.',
    },
    {
      id: 'tcard4',
      title: 'Weather & nature conditions',
      body: 'Cloud-forest conditions vary: rain, mist, and mud are normal. We may adjust daily timings or activities for your safety and for wildlife. Rare species are wild — sightings cannot be guaranteed. By joining, you accept that nature and weather shape the real experience.',
    },
    {
      id: 'tcard5',
      title: 'Safety & liability basics',
      body: 'You must follow your guide’s instructions, stay on designated paths where required, and declare relevant health issues before departure. Remote travel has inherent risk. To the extent permitted by law, Ecotone limits liability as set out in the full terms. Adequate travel insurance is your responsibility.',
    },
    {
      id: 'tcard6',
      title: 'Payment terms',
      body: 'Payments are collected via our authorised booking partner (WeTravel) under their checkout terms. You may be asked for a deposit with balance by a stated date. Prices are per person in the published currency unless otherwise stated. If we must cancel a departure for our reasons, you’ll be offered a refund or reschedule per the full policy.',
    },
  ],
}

export const soqtapataPhase5 = {
  reviews: soqtapataPhase5Reviews,
  beforeYouGo: soqtapataPhase5BeforeYouGo,
  terms: soqtapataPhase5Terms,
}

export type SoqtapataResourceCard = {
  /** Sanity `_key` or stable id for lists */
  id?: string
  /** Editorial / CTA semantics */
  kind: 'map' | 'brochure' | 'termsPdf' | 'custom'
  /** Which built-in preview art to show when there is no image */
  previewKind: 'map' | 'brochure' | 'termsPdf' | 'custom'
  title: string
  meta: string
  downloadHref: string
  downloadLabel: string
  openInNewTab?: boolean
  previewImageSrc?: string
  previewImageAlt?: string
}

export type SoqtapataResources = {
  eyebrow: string
  h2: string
  h2Style: { marginBottom: number }
  /** Intro opcional bajo el H2 (presentación CMS). */
  lead?: string
  /** Preview SVG “mapa” (sin imagen de tarjeta). */
  mapPreviewTitle: string
  mapPreviewSubtitle: string
  /** Preview plantilla brochure (sin imagen). */
  brochurePreviewBadge: string
  cards: SoqtapataResourceCard[]
}

export type SoqtapataFaqItem = { id: string; question: string; answer: string }

export type SoqtapataFaq = {
  eyebrow: string
  h2: string
  h2Style: { marginBottom: number }
  lead: string
  leadStyle: { fontSize: number; fontWeight: number; color: string; lineHeight: number; marginBottom: number }
  items: SoqtapataFaqItem[]
}

export type SoqtapataRelatedCardImage = {
  kind: 'image'
  imageSrc: string
  imageAlt: string
  pillLeft: string
  pillRight: string
  typeLabel: string
  name: string
  meta: string
  price: string
  footRight: string
  /** Related experience page path (`/experiences/{slug}`). */
  ctaHref?: string
}

export type SoqtapataRelatedCardTailor = {
  kind: 'tailor'
  typeLabel: string
  name: string
  meta: string
  footLeft: string
  footRight: string
  imageSrc?: string
  imageAlt?: string
  ctaHref?: string
  ctaOpenInNewTab?: boolean
  ctaRel?: string
  bookingModal?: 'plan' | 'experience'
  bookingSummary?: import('@/components/booking/types').ExperienceBookingSummary
}

export type SoqtapataAlsoCamanti = {
  eyebrow: string
  h2: string
  h2Style: { marginBottom: number }
  /** Intro opcional bajo el H2 (presentación CMS). */
  lead?: string
  cards: (SoqtapataRelatedCardImage | SoqtapataRelatedCardTailor)[]
}

export type SoqtapataBook = {
  eyebrow: string
  h2: string
  h2Style: { marginBottom: number; textAlign: 'center' }
  /** Optional intro under the H2 (`reserveCtaSettings.body` / CMS). */
  lead?: string
  price: string
  priceSmall: string
  sub: string
  rows: { label: string; value: string }[]
  wetravelUrl: string
  wetravelLabel: string
  whatsappUrl: string
  whatsappLabel: string
  termsNote: string
  termsHash: string
  /** Texto del enlace legal junto a `termsNote` (p. ej. Terms & Conditions). */
  termsLinkLabel: string
  /** Hasta 3 líneas bajo CTAs (confianza). */
  trustStripItems: readonly { text: string }[]
  /**
   * Cuando viene de `reserveCtaSettings.trustItems` (CMS), sustituye a `trustStripItems` en #book.
   */
  reserveTrustItems?: ReadonlyArray<{ iconKey: string; text: string }>
  /** Línea legal: desde `reserveCtaSettings` resuelto; si falta, el front usa `termsNote`. */
  termsPrefixText?: string
  termsSuffixText?: string | null
  termsOpenInNewTab?: boolean
  termsRel?: string
  /** When primary reserve CTA is a booking SmartLink. */
  primaryBookingModal?: 'plan' | 'experience'
  primaryBookingSummary?: import('@/components/booking/types').ExperienceBookingSummary
}

export const soqtapataPhase6Resources: SoqtapataResources = {
  eyebrow: 'Resources',
  h2: 'Download & plan',
  h2Style: { marginBottom: 16 },
  mapPreviewTitle: 'Soqtapata',
  mapPreviewSubtitle: '1,200 m',
  brochurePreviewBadge: 'Soqtapata · 3D/2N',
  cards: [
    {
      id: 'local-map',
      kind: 'map',
      previewKind: 'map',
      title: 'Route map',
      meta: 'Soqtapata · Trail overview · PDF · 2.4 MB',
      downloadHref: '#',
      downloadLabel: 'Download PDF',
    },
    {
      id: 'local-brochure',
      kind: 'brochure',
      previewKind: 'brochure',
      title: 'Experience brochure',
      meta: 'Full itinerary · Photos · Packing · PDF · 5.1 MB',
      downloadHref: '#',
      downloadLabel: 'Download PDF',
    },
    {
      id: 'local-terms',
      kind: 'termsPdf',
      previewKind: 'termsPdf',
      title: 'Terms & Conditions',
      meta: 'Legal · Full text · PDF',
      downloadHref: '/ecotone-terms-conditions.pdf',
      downloadLabel: 'Download full terms (PDF)',
    },
  ],
}

export const soqtapataPhase6Faq: SoqtapataFaq = {
  eyebrow: 'Common questions',
  h2: 'Frequently asked questions',
  h2Style: { marginBottom: 6 },
  lead: 'Everything else you might want to know before booking.',
  leadStyle: { fontSize: 14, fontWeight: 300, color: 'var(--n700)', lineHeight: 1.8, marginBottom: 22 },
  items: [
    {
      id: 'faq1',
      question: 'Is this experience suitable for first-time visitors to the Amazon?',
      answer:
        "Yes. Soqtapata is the most accessible of our routes — just 2.5 hours from Cusco. The terrain is cloud forest, not deep jungle, so it's appropriate for any fitness level. The 45-minute trek to the lodge is gentle. Your naturalist guide is with you at all times.",
    },
    {
      id: 'faq2',
      question: "What's the minimum and maximum group size?",
      answer:
        'Minimum is 2 people. Maximum is 8 per group. This keeps the experience intimate and ensures wildlife isn\'t disturbed. Solo travellers can join a scheduled group departure — contact us via WhatsApp to check upcoming dates.',
    },
    {
      id: 'faq3',
      question: 'What happens if the weather is bad?',
      answer:
        'Cloud forest weather is unpredictable — light rain is common and part of the experience. Rubber boots and rain gear are provided. All activities are designed to work in all weather conditions. The EcoDroneView® flight may be rescheduled within the same trip if winds are too strong.',
    },
    {
      id: 'faq4',
      question: 'Is altitude sickness a concern on this route?',
      answer:
        "The lodge sits at 1,200 m.a.s.l., which is lower than Cusco (3,400 m). Most guests actually feel better once they're at the lodge. The drive from Cusco does pass through higher altitudes — we recommend 1-2 days of acclimatisation in Cusco before your departure.",
    },
    {
      id: 'faq5',
      question: 'Is there WiFi or phone signal at the lodge?',
      answer:
        "There is limited satellite WiFi available in the common area of the lodge — enough for messaging, not streaming. Phone signal is unavailable inside the reserve. Most guests find this a welcome disconnection. We'll provide emergency satellite communication if needed.",
    },
    {
      id: 'faq6',
      question: 'Can I book a private departure for my group?',
      answer:
        'Yes. Private departures are available for groups of 2–8 on any date, subject to lodge availability. Contact us via WhatsApp or email for private booking requests. A custom itinerary is also available through our Tailor Made program.',
    },
    {
      id: 'faq7',
      question: 'What is your cancellation policy?',
      answer:
        'Free cancellation up to 15 days before departure. Cancellations between 7–15 days receive a 50% refund. Cancellations under 7 days are non-refundable. All bookings are managed through WeTravel. We recommend travel insurance for all bookings.',
    },
  ],
}

export const soqtapataPhase6Also: SoqtapataAlsoCamanti = {
  eyebrow: 'Also in Camanti',
  h2: 'You might also like',
  h2Style: { marginBottom: 14 },
  cards: [
    {
      kind: 'image',
      imageSrc: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80',
      imageAlt: 'Andean Cloud Forest',
      pillLeft: 'Nature Core',
      pillRight: '4D · 3N',
      typeLabel: 'Nature Core',
      name: 'Andean Cloud Forest',
      meta: 'Extended trails · Night walks · Deeper forest access',
      price: '$1,200+',
      footRight: 'View →',
    },
    {
      kind: 'tailor',
      typeLabel: 'Tailor Made',
      name: 'Designed around you',
      meta: 'Any duration · Any group size · Fully custom',
      footLeft: 'Custom pricing',
      footRight: 'Enquire →',
    },
  ],
}

export const soqtapataPhase6Book: SoqtapataBook = {
  eyebrow: 'Reserve your spot',
  h2: 'Ready to go deep?',
  h2Style: { marginBottom: 24, textAlign: 'center' },
  price: '$986',
  priceSmall: '/ person',
  sub: 'All inclusive · departure from Cusco · max 8 guests',
  rows: [
    { label: 'Route', value: 'Camanti · Soqtapata Reserve' },
    { label: 'Duration', value: '3 days · 2 nights' },
    { label: 'Group size', value: '2 – 8 people' },
    { label: 'Pickup', value: '4:30–5:00 AM · Cusco' },
    { label: 'Includes', value: 'Transport, lodge, all meals, guides, tech pack' },
  ],
  wetravelUrl: 'https://www.wetravel.com',
  wetravelLabel: 'Book on WeTravel →',
  whatsappUrl: 'https://wa.me/51974781094?text=I%20want%20to%20book%20Soqtapata%203D/2N',
  whatsappLabel: 'Ask via WhatsApp',
  termsNote: 'By booking, you agree to our ',
  termsHash: '#terms',
  termsLinkLabel: 'Terms & Conditions',
  trustStripItems: [
    { text: 'Secure payment' },
    { text: 'Free cancellation · 15 days' },
    { text: 'B Corp certified' },
  ],
}

export const soqtapataPhase6 = {
  resources: soqtapataPhase6Resources,
  faq: soqtapataPhase6Faq,
  also: soqtapataPhase6Also,
  book: soqtapataPhase6Book,
}

/**
 * Contenido de experiencia (hero → book) en un solo árbol; mismos campos que `soqtapataPhase1`…`6` aplanados.
 */
export const soqtapataExperience = {
  ...soqtapataPhase1,
  ...soqtapataPhase2,
  ...soqtapataPhase3,
  ...soqtapataPhase4,
  ...soqtapataPhase5,
  ...soqtapataPhase6,
}

/**
 * Configuración fija de `ReviewsSection` para esta ruta (las reviews vienen de `soqtapataExperience.reviews`).
 */
export const soqtapataExperienceReviewsLayout = {
  eyebrow: 'What guests say',
  headline: 'Real experiences',
  averageRating: '5.0',
  sectionClassName: 'sec bg-cream fade',
  contentInnerClassName: 'sec-inner',
  useHomepageSampleReviewsIfEmpty: false,
  sourceLabel: 'Trustpilot',
  /** Vacío en datos: el resolver rellena desde el conteo de reseñas CMS. */
  secondaryRatingLine: '',
  /** Vacío en datos: el resolver rellena con nombre de programa. */
  emptyMessage: '',
  reviewsRegionAriaLabel: 'Guest reviews',
  reviewTablistAriaLabel: 'Select a review',
  quoteDotAriaLabelPrefix: 'Quote',
  reviewDotAriaLabelPrefix: 'Review',
  guestFallbackName: 'Guest',
} as const
