/** Static copy for `/lodges/soqtapata-lodge` (Phase 1 — no CMS). */

import type { SoqtapataFaq } from '@/data/soqtapataExperienceLocal'
import type { ReviewDoc } from '@/lib/queries'

export type LodgeBreadcrumbItem = { href: string; label: string }

/** Full-screen gallery slide (hero, rooms, common areas). */
export type LodgeGalleryPhoto = {
  src: string
  alt: string
  title: string
  description: string
}

/** CMS-oriented header block shared by lodge sections (mirrors long-form Experience rhythm). */
export type LodgeSectionHeaderFields = {
  eyebrow?: string
  title: string
  body?: string
}

const lodgeHeroGallery = [
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=85',
    alt: 'Cloud forest canopy from the lodge',
    title: 'Arrival view',
    description: 'Primary cloud forest facing the lodge clearing — your first glimpse of the reserve.',
  },
  {
    src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1400&q=85',
    alt: 'Terrace at dusk',
    title: 'Main terrace',
    description: 'Evening light on the dining terrace; forest sounds carry from the valley.',
  },
  {
    src: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1400&q=85',
    alt: 'Mist in the trees',
    title: 'Morning mist',
    description: 'Typical dawn cloud layer at 1,200 m — ideal for bird activity.',
  },
  {
    src: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1400&q=85',
    alt: 'Trail into primary forest',
    title: 'Reserve trail',
    description: 'Guided walks start directly from the lodge — no vehicle access inside the forest.',
  },
  {
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=85',
    alt: 'Lounge interior',
    title: 'Reading lounge',
    description: 'Quiet space for field guides, maps, and downtime between excursions.',
  },
  {
    src: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1400&q=85',
    alt: 'Wooden walkway',
    title: 'Boardwalk',
    description: 'Raised paths connect common areas while limiting impact on the forest floor.',
  },
  {
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=85',
    alt: 'Ridge line above treeline',
    title: 'High forest',
    description: 'Day hikes reach higher elevations within the 10,000 ha Soqtapata Reserve.',
  },
  {
    src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=85',
    alt: 'Dense green canopy',
    title: 'Canopy layer',
    description: 'Epiphytes and moss characterize this cloud-forest band.',
  },
  {
    src: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1400&q=85',
    alt: 'Stream in the forest',
    title: 'Forest stream',
    description: 'Clean mountain water — part of the watershed the reserve protects.',
  },
  {
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&q=85',
    alt: 'Sun through trees',
    title: 'Filtered light',
    description: 'Mid-morning sun through oak and podocarp canopy.',
  },
  {
    src: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1400&q=85',
    alt: 'Lodge exterior detail',
    title: 'Low-impact build',
    description: 'Structures designed to sit lightly on the site, adjacent to CIDS station.',
  },
  {
    src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1400&q=85',
    alt: 'Night sky over forest',
    title: 'Night at 1,200 m',
    description: 'Minimal light pollution — clear nights for stars and nocturnal soundscapes.',
  },
  {
    src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f58f8?w=1400&q=85',
    alt: 'Guests with binoculars on terrace',
    title: 'Terrace birding',
    description: 'Many species are visible from the lodge without leaving the deck.',
  },
] as const satisfies readonly LodgeGalleryPhoto[]

export const lodgeSoqtapataHero = {
  imageSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=85',
  imageAlt: 'Soqtapata Lodge — cloud forest',
  /** A11y — mismo origen que copy visible (CMS vía merge cuando exista campo en `lodge` / `lodgePage`). */
  galleryOpenAriaLabel: 'Open photo gallery',
  photoCountLabel: '+12 photos',
  gallery: lodgeHeroGallery,
  breadcrumbs: [
    { href: '/', label: 'Lodges' },
    { href: '/experiences/soqtapata-pristine-immersion', label: 'Camanti Route' },
  ] satisfies LodgeBreadcrumbItem[],
  currentCrumbLabel: 'Soqtapata Lodge',
  badges: ['Camanti Route', 'Research station', 'B Corp'],
  title: 'Soqtapata Lodge',
  tagline:
    'The only lodge inside the Soqtapata Reserve. Adjacent to CIDS, our active research centre. Maximum 14 guests.',
  ratingScore: '5.0',
  reviewCountLabel: '12 reviews',
  secondaryMeta: '3 experiences',
  primaryCta: {
    href: '/experiences/soqtapata-pristine-immersion',
    label: 'See experiences',
  },
} as const

/** `galleryOpenAriaLabel` es `string` para permitir override CMS; el resto sigue el literal del const. */
export type LodgeHeroData = Omit<typeof lodgeSoqtapataHero, 'galleryOpenAriaLabel'> & {
  galleryOpenAriaLabel: string
}

/** Sticky in-page nav — labels/structure alineados a `reference/ecotone-lodge_11.html`. */
export type LodgeInPageNavItem = { readonly id: string; readonly label: string }

export type LodgeInPageNavData = {
  readonly title: string
  readonly subtitle: string
  readonly items: readonly LodgeInPageNavItem[]
  readonly cta: { readonly label: string; readonly href: string }
}

export const lodgeSoqtapataPageNav = {
  title: 'Soqtapata Lodge',
  subtitle: 'Camanti Route · 1,200 m',
  items: [
    { id: 'overview', label: 'Overview' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'location', label: 'Location' },
    { id: 'research', label: 'Research' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
    { id: 'book', label: 'Book' },
  ],
  cta: {
    label: 'Explore experiences',
    href: '#experiences',
  },
} as const satisfies LodgeInPageNavData

/** Lodge overview — header fields + highlight list. */
export type LodgeOverviewData = LodgeSectionHeaderFields & {
  highlights: readonly string[]
}

export const lodgeSoqtapataOverview = {
  eyebrow: 'About this lodge',
  title: 'The forest, your home.',
  body:
    'Soqtapata Lodge is the only accommodation inside the Soqtapata Reserve — 10,000 hectares of primary cloud forest from 900 to 4,700 m.a.s.l. Accessible only on foot, a 45-minute guided walk from the road. Adjacent to CIDS, our active Conservation, Investigation & Development Station, the lodge is run by resident biologists and naturalists who live in the forest year-round. Every booking directly funds conservation work managed by HERPIRO (B Corp).',
  highlights: [
    'Inside the reserve — 10,000 ha of primary forest',
    'CIDS adjacent — Active research station',
    'Resident biologists — Not a tour operator',
    '300+ bird species — From the lodge terrace',
    'Every stay funds conservation — HERPIRO B Corp certified',
  ],
} as const satisfies LodgeOverviewData

/** Misma forma que `SoqtapataFaq` (`ExperienceFaqSoqtapata` / `soqtapataPhase6Faq`). */
export const lodgeSoqtapataFaq = {
  eyebrow: 'Common questions',
  h2: 'About Soqtapata Lodge',
  h2Style: { marginBottom: 6 },
  lead: 'Everything you need to know before arriving.',
  leadStyle: { fontSize: 14, fontWeight: 300, color: 'var(--n700)', lineHeight: 1.8, marginBottom: 22 },
  items: [
    {
      id: 'f1',
      question: 'Is there electricity and hot water?',
      answer:
        'Yes — solar-powered electricity with 220V outlets in each room for phone and camera charging. Hot water showers are available all day, heated by solar panels. Evening lighting throughout the lodge and common areas.',
    },
    {
      id: 'f2',
      question: 'Can I visit the lodge without booking an experience?',
      answer:
        'No — the lodge is only accessible through one of our programs. This is to protect the reserve and ensure every guest has a guide. The shortest program is 3 days / 2 nights (Soqtapata Pristine Immersion).',
    },
    {
      id: 'f3',
      question: 'What is the fitness level required?',
      answer:
        'Moderate. The walk from the trailhead to the lodge is 45 minutes over uneven terrain. Daily trails vary — some are gentle, others more demanding. A reasonable level of fitness is expected. Minimum age is 8 years.',
    },
    {
      id: 'f4',
      question: 'Is the lodge suitable for families with children?',
      answer:
        'Yes — from age 8. Families often find the lodge environment extraordinary for children. The guides are experienced with young guests and adapt the pace accordingly. The Soqtapata 3D/2N program is the most popular for families.',
    },
    {
      id: 'f5',
      question: 'What should I pack for the lodge?',
      answer:
        "Rubber boots and rain gear are provided. Bring: quick-dry trousers, warm mid-layer fleece (temperatures drop at night at 1,200 m), waterproof jacket, insect repellent (DEET), sunscreen, binoculars, headlamp, and camera. Pack light — you're walking 45 minutes with your bag.",
    },
  ],
} as const satisfies SoqtapataFaq

export type LodgeFaqData = typeof lodgeSoqtapataFaq

export type LodgeRoomCard = {
  image: string
  imageAlt: string
  name: string
  featured?: boolean
  badge?: string
  meta: string
  chips: readonly string[]
  photosCta?: string
  /** Opens lightbox filtered to this room. */
  galleryPhotos?: readonly LodgeGalleryPhoto[]
}

export type LodgeRoomsData = LodgeSectionHeaderFields & {
  rooms: readonly LodgeRoomCard[]
  note?: string
}

/** Copia de contenido de `ecotone-lodge_11.html` — Rooms. */
export const lodgeSoqtapataRooms = {
  eyebrow: "Where you'll sleep",
  title: 'Accommodation options',
  body: '7 rooms total — 1 private cottage and 6 double rooms. All meals, guides, and transport included in every experience.',
  rooms: [
    {
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
      imageAlt: 'Private Cottage',
      name: 'Private Cottage',
      featured: true,
      badge: 'Most popular',
      meta: '1 cottage · Up to 2 guests · En-suite bathroom · Private terrace',
      chips: ['Private terrace', 'Forest view', 'Hot shower', 'Solar power'],
      photosCta: 'View cottage photos',
      galleryPhotos: [
        {
          src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85',
          alt: 'Private cottage exterior',
          title: 'Private cottage',
          description: 'Standalone cottage with private terrace facing primary forest.',
        },
        {
          src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=85',
          alt: 'Cottage interior bed',
          title: 'Interior',
          description: 'En-suite bathroom, solar power, and hot shower after trail days.',
        },
        {
          src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=85',
          alt: 'Cottage terrace seating',
          title: 'Private terrace',
          description: 'Morning coffee or quiet reading with forest views.',
        },
      ],
    },
    {
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500&q=80',
      imageAlt: 'Double Room',
      name: 'Double Room',
      meta: '6 rooms · Up to 2 guests · Shared bathroom facilities · Garden view',
      chips: ['Garden view', 'Hot shower', 'Reading area'],
      photosCta: 'View room photos',
      galleryPhotos: [
        {
          src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=85',
          alt: 'Double room beds',
          title: 'Double room',
          description: 'Two beds, garden outlook, reading nook — shared bath facilities nearby.',
        },
        {
          src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85',
          alt: 'Room detail textiles',
          title: 'Comfort details',
          description: 'Warm layers for cool mountain nights at 1,200 m.',
        },
        {
          src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=85',
          alt: 'Garden view window',
          title: 'Garden view',
          description: 'Quiet side of the lodge with hummingbird activity.',
        },
      ],
    },
  ],
  note: 'Room type is assigned at booking. Cottage subject to availability — book early. Max 2 guests per room.',
} as const satisfies LodgeRoomsData

export type LodgePrimaryPhoto = {
  image: string
  imageAlt: string
  label: string
  sub?: string
}

export type LodgeStripPhoto = {
  image: string
  imageAlt: string
  label: string
  moreCount?: string
  moreLabel?: string
}

export type LodgeAmenityIconId =
  | 'meals'
  | 'guide'
  | 'transport'
  | 'boots'
  | 'flask'
  | 'wifi'
  | 'shield'
  | 'book'
  | 'droplet'

export type LodgeAmenityRow = {
  iconId: LodgeAmenityIconId
  title: string
  sub: string
}

export type LodgeFacilitiesData = LodgeSectionHeaderFields & {
  primaryPhotos: readonly LodgePrimaryPhoto[]
  stripPhotos: readonly LodgeStripPhoto[]
  amenities: readonly LodgeAmenityRow[]
  /** All common-area slides for the lightbox (order matches on-page tiles where possible). */
  commonAreasGallery: readonly LodgeGalleryPhoto[]
  /** Prefijo aria-label botones mosaico, p. ej. "Open gallery:" → `{prefix} ${label}`. */
  galleryTileAriaLabelPrefix: string
  /** aria-label del tile “+N fotos”. */
  galleryStripMoreAriaLabel: string
  /** Rótulo sobre la rejilla de amenidades. */
  amenitiesEyebrow: string
}

/** Copia de contenido de `ecotone-lodge_11.html` — Facilities. */
export const lodgeSoqtapataFacilities = {
  eyebrow: 'Facilities',
  title: 'Common areas & amenities',
  body:
    'The lodge was designed to blur the boundary between indoors and the forest. Most guests spend their evenings on the main terrace — the forest sounds do the rest.',
  primaryPhotos: [
    {
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=85',
      imageAlt: 'Main terrace',
      label: 'Main terrace & dining',
      sub: 'Forest-facing · 180° views',
    },
    {
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80',
      imageAlt: 'Nature library',
      label: 'Nature library',
    },
    {
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80',
      imageAlt: 'Research common area',
      label: 'Research common area',
    },
  ],
  stripPhotos: [
    {
      image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&q=80',
      imageAlt: 'Trail entrance',
      label: 'Trail entrance',
    },
    {
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      imageAlt: 'ForestWhisper lounge',
      label: 'ForestWhisper® lounge',
    },
    {
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80',
      imageAlt: 'More photos',
      label: '',
      moreCount: '+12',
      moreLabel: 'View all photos',
    },
  ],
  commonAreasGallery: [
    {
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85',
      alt: 'Main terrace',
      title: 'Main terrace & dining',
      description: 'Forest-facing deck — most guests spend evenings here listening to the reserve.',
    },
    {
      src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=85',
      alt: 'Nature library',
      title: 'Nature library',
      description: 'Field guides, maps, and reference collections for self-guided study.',
    },
    {
      src: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=85',
      alt: 'Research common area',
      title: 'Research common area',
      description: 'Shared space adjacent to CIDS — occasional talks with resident researchers.',
    },
    {
      src: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1200&q=85',
      alt: 'Trail entrance',
      title: 'Trail entrance',
      description: 'Start of guided routes into primary forest from the lodge grounds.',
    },
    {
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85',
      alt: 'ForestWhisper lounge',
      title: 'ForestWhisper® lounge',
      description: 'Quiet lounge for playback of forest recordings and briefings.',
    },
    {
      src: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=85',
      alt: 'Aerial forest perspective',
      title: 'Reserve views',
      description: 'Higher vantage points on longer hikes — cloud forest to ridgeline.',
    },
  ],
  amenities: [
    {
      iconId: 'meals',
      title: 'Full board meals',
      sub: 'Breakfast, lunch & dinner. Fresh local ingredients.',
    },
    {
      iconId: 'guide',
      title: 'Expert naturalist guide',
      sub: 'Certified bilingual naturalist all day.',
    },
    {
      iconId: 'transport',
      title: 'Private 4x4 transport',
      sub: 'Pickup & return from Cusco.',
    },
    {
      iconId: 'boots',
      title: 'Rubber boots & rain gear',
      sub: 'Full kit provided at the lodge.',
    },
    {
      iconId: 'flask',
      title: 'CIDS station access',
      sub: 'Visit active conservation research.',
    },
    {
      iconId: 'wifi',
      title: 'Satellite WiFi',
      sub: 'Limited — common area only.',
    },
    {
      iconId: 'shield',
      title: 'Hot showers',
      sub: 'Solar-heated water. 220V outlets.',
    },
    {
      iconId: 'book',
      title: 'Nature library',
      sub: 'Field guides, species books & maps.',
    },
    {
      iconId: 'droplet',
      title: 'Filtered drinking water',
      sub: 'Available throughout the day.',
    },
  ],
  galleryTileAriaLabelPrefix: 'Open gallery:',
  galleryStripMoreAriaLabel: 'Open common areas photo gallery',
  amenitiesEyebrow: "What's included",
} as const satisfies LodgeFacilitiesData

export type LodgeSnapshotIconId = 'home' | 'users' | 'clock' | 'compass' | 'shield' | 'bcorp'

export type LodgeSnapshotItem = {
  snapN: string
  snapL: string
  iconId: LodgeSnapshotIconId
  bcorp?: boolean
}

/** Copia de contenido de `ecotone-lodge_11.html` — Snapshot bar. */
export const lodgeSoqtapataSnapshot = [
  { snapN: '7 rooms', snapL: '1 cottage · 6 double', iconId: 'home' },
  { snapN: 'Max 14', snapL: 'Guests total', iconId: 'users' },
  { snapN: '~2.5h', snapL: 'From Cusco', iconId: 'clock' },
  { snapN: '1,200 m', snapL: 'Altitude', iconId: 'compass' },
  { snapN: 'Cloud forest', snapL: 'Ecosystem', iconId: 'shield' },
  { snapN: 'B Corp', snapL: 'HERPIRO certified', iconId: 'bcorp', bcorp: true },
] as const satisfies readonly LodgeSnapshotItem[]

export type LodgeJourneyStep = {
  time: string
  text: string
  highlight?: boolean
}

export type LodgeLocationMapDiagramLabels = {
  cuscoTitle: string
  cuscoSubtitle: string
  trailheadLabel: string
  walkHint: string
  lodgeTitle: string
  lodgeSubtitle: string
}

export type LodgeLocationData = LodgeSectionHeaderFields & {
  journeySteps: readonly LodgeJourneyStep[]
  mapLabels: LodgeLocationMapDiagramLabels
}

/** `reference/ecotone-lodge_11.html` — Location. */
export const lodgeSoqtapataLocation = {
  eyebrow: 'Getting here',
  title: 'Inside the Soqtapata Reserve',
  body:
    'Accessible only on foot — a 45-minute guided walk from the road. Your guide meets you at the trailhead. Private 4x4 from Cusco included in all experiences.',
  journeySteps: [
    {
      time: '4:30 AM',
      text: 'Private 4x4 pickup from Cusco — hotel or main plaza',
    },
    {
      time: '~7:15 AM',
      text: 'Arrival at trailhead · Gear up with rubber boots',
    },
    {
      time: '~8:00 AM',
      text: '45-minute guided walk into the reserve — first wildlife sightings',
    },
    {
      time: '~8:45 AM',
      text: 'Welcome at Soqtapata Lodge — breakfast served',
      highlight: true,
    },
  ],
  mapLabels: {
    cuscoTitle: 'Cusco',
    cuscoSubtitle: '3,400 m · ~2.5h drive',
    trailheadLabel: 'Trailhead',
    walkHint: '45 min walk',
    lodgeTitle: 'Soqtapata Lodge',
    lodgeSubtitle: '1,200 m.a.s.l.',
  },
} as const satisfies LodgeLocationData

export type LodgeResearchStat = {
  value: string
  label: string
}

export type LodgeResearchPillar = {
  title: string
  body: string
  /** Reference uses 12px on some items; default 13px. */
  detailSmall?: boolean
}

export type LodgeResearchData = LodgeSectionHeaderFields & {
  stats: readonly LodgeResearchStat[]
  pillars: readonly LodgeResearchPillar[]
  footnote: string
}

/** `reference/ecotone-lodge_11.html` — Research. */
export const lodgeSoqtapataResearch = {
  eyebrow: 'CIDS Research Centre',
  title: 'Science is part of the stay',
  body:
    'CIDS — the Conservation, Investigation & Development Station — operates adjacent to the lodge. Guests can visit active research projects, meet resident biologists, and understand the conservation work that their booking funds.',
  stats: [
    { value: '47+', label: 'Active research projects' },
    { value: '10,000', label: 'Hectares protected' },
    { value: 'B Corp', label: 'HERPIRO certified' },
  ],
  pillars: [
    {
      title: 'Wildlife monitoring & tracking',
      body:
        'Camera traps and bioacoustic monitoring of spectacled bear, puma, woolly monkey, and 300+ bird species.',
    },
    {
      title: 'Cloud forest restoration',
      body: 'Active reforestation with native species. Guests can participate in planting sessions.',
      detailSmall: true,
    },
    {
      title: 'Herpetology studies',
      body:
        "Reptile and amphibian surveys — HERPIRO's founding research focus. Night walks include active species ID.",
      detailSmall: true,
    },
  ],
  footnote: 'Every booking at Soqtapata Lodge directly funds ongoing conservation operations at CIDS.',
} as const satisfies LodgeResearchData

/** Featured quotes — must match `EcotoneV2Client` `featuredQuoteItems` on the lodge page (same #quoteText rotation). */
export const lodgeSoqtapataFeaturedQuotes = [
  {
    text: '"Super comfortable place with no words to describe <span>the beauty of this forest."</span>',
    attr: '— Richard · California · Soqtapata 3D/2N',
  },
  {
    text: '"Breathtaking place with amazing people <span>that changed my way of travelling."</span>',
    attr: '— Vanessa · London · Soqtapata 3D/2N',
  },
  {
    text: "\"Waking up to birds I'd never heard before. <span>The CIDS visit with the scientists was extraordinary.</span>\"",
    attr: '— Sofia · Barcelona · Andean Cloud Forest',
  },
] as const satisfies readonly { text: string; attr: string }[]

export type LodgeExperienceCard = {
  image: string
  imageAlt: string
  typeLabel: string
  duration: string
  route: string
  name: string
  description: string
  footPrimary: string
  footSecondary?: string
  href: string
}

export type LodgeExperiencesTailor = {
  kicker: string
  title: string
  description: string
  ctaLabel: string
  href: string
}

export type LodgeExperiencesData = LodgeSectionHeaderFields & {
  cards: readonly LodgeExperienceCard[]
  tailor: LodgeExperiencesTailor
  /** Texto del CTA en cada tarjeta (p. ej. "View"). */
  programCardCtaLabel: string
}

/** `reference/ecotone-lodge_11.html` — Experiences grid + tailor card. */
export const lodgeSoqtapataExperiences = {
  eyebrow: 'Experiences',
  title: 'Experiences at this lodge',
  body:
    'All experiences include transport from Cusco, full board, expert guide, and tech pack. Choose by duration and depth.',
  cards: [
    {
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
      imageAlt: 'Soqtapata Pristine Immersion',
      typeLabel: 'Nature Core',
      duration: '3D · 2N',
      route: 'Camanti Route',
      name: 'Soqtapata Pristine Immersion',
      description: 'EcoDroneView® · ForestWhisper® · CIDS visit · Expert naturalist guide',
      footPrimary: '$986',
      footSecondary: 'per person',
      href: '/experiences/soqtapata-pristine-immersion',
    },
    {
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80',
      imageAlt: 'Andean Cloud Forest',
      typeLabel: 'Nature Core',
      duration: '4D · 3N',
      route: 'Camanti Route',
      name: 'Andean Cloud Forest',
      description: 'Extended trails · Night walks · Full reserve access · All 3 tech products',
      footPrimary: '$1,200+',
      footSecondary: 'per person',
      href: '/experiences/soqtapata-pristine-immersion',
    },
    {
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80',
      imageAlt: 'Schools & Universities',
      typeLabel: 'Exp. Learning',
      duration: '2–6 weeks',
      route: 'Camanti Route',
      name: 'Schools & Universities',
      description: 'Custom academic program · Research participation · Volunteer · Groups',
      footPrimary: 'Enquire',
      footSecondary: 'custom pricing',
      href: '/experiences/soqtapata-pristine-immersion',
    },
  ],
  tailor: {
    kicker: 'Tailor Made',
    title: 'Design your own program',
    description:
      'Any duration · Any group size · Fully custom itinerary · We build it around your goals',
    ctaLabel: 'Enquire →',
    href: '/experiences/soqtapata-pristine-immersion',
  },
  programCardCtaLabel: 'View',
} as const satisfies LodgeExperiencesData

/** Guest review cards — `reference/ecotone-lodge_11.html` (static until CMS). */
export const lodgeSoqtapataReviewCards: ReviewDoc[] = [
  {
    _id: 'lodge-rev-1',
    quote:
      'Super comfortable place. There are no words to describe the beauty of this place.',
    authorName: 'Richard',
    authorCity: 'California',
    authorCountry: 'US',
    experienceName: 'Soqtapata 3D/2N',
    rating: 5,
  },
  {
    _id: 'lodge-rev-2',
    quote: 'Breathtaking place with amazing people that changed my way of travelling.',
    authorName: 'Vanessa',
    authorCity: 'London',
    authorCountry: 'UK',
    experienceName: 'Soqtapata 3D/2N',
    rating: 5,
  },
  {
    _id: 'lodge-rev-3',
    quote:
      "Waking up to birds I'd never heard before. The CIDS visit with the scientists was extraordinary.",
    authorName: 'Sofia',
    authorCity: 'Barcelona',
    authorCountry: 'ES',
    experienceName: 'Andean Cloud Forest',
    rating: 5,
  },
]

export type LodgeBookRowKey = 'shortestProgram' | 'startingFrom' | 'groupSize' | 'availability'

export type LodgeBookDetailRow = {
  label: string
  value: string
  /** Highlight value in brand brown (e.g. starting price). */
  valueAccent?: boolean
  /** Clave estable para `lodge.bookingDetailRowLabels` en CMS. */
  rowKey?: LodgeBookRowKey
}

export type LodgeBookTrustItem = {
  icon: 'shield' | 'check' | 'heart'
  text: string
}

export type LodgeBookCtaData = LodgeSectionHeaderFields & {
  cardTitle: string
  cardSubtitle: string
  rows: readonly LodgeBookDetailRow[]
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  trustItems: readonly LodgeBookTrustItem[]
}

/** Final CTA — `reference/ecotone-lodge_11.html` (`#book`). */
export const lodgeSoqtapataBook = {
  eyebrow: 'Ready to stay here?',
  title: 'Choose your experience',
  body:
    'Compare programs by length and depth — every stay is all-inclusive from Cusco with expert guiding and full board at the lodge.',
  cardTitle: 'Soqtapata Lodge · Camanti Route',
  cardSubtitle: 'All-inclusive · Departure from Cusco · Max 14 guests · Year-round',
  rows: [
    { rowKey: 'shortestProgram', label: 'Shortest program', value: '3 days · 2 nights' },
    { rowKey: 'startingFrom', label: 'Starting from', value: 'USD 986 per person', valueAccent: true },
    { rowKey: 'groupSize', label: 'Group size', value: '2 – 14 people' },
    { rowKey: 'availability', label: 'Availability', value: 'Year-round' },
  ],
  primaryCta: {
    label: 'See all experiences at this lodge',
    href: '#experiences',
  },
  secondaryCta: {
    label: 'Ask on WhatsApp',
    href:
      'https://wa.me/51974781094?text=Hi%21%20I%27m%20interested%20in%20Soqtapata%20Lodge.%20Could%20you%20send%20me%20more%20information%3F',
  },
  trustItems: [
    { icon: 'shield', text: 'Free cancellation · 15 days' },
    { icon: 'check', text: 'All inclusive from Cusco' },
    { icon: 'heart', text: 'B Corp certified' },
  ],
} as const satisfies LodgeBookCtaData
