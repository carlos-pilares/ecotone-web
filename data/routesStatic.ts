/**
 * Contenido estático de `/routes` (sin CMS).
 * Alineado con `ecotone-routes_2.html`.
 */

import type { ReviewDoc } from '@/lib/queries'

export type RoutesHeroStatic = {
  imageSrc: string
  imageAlt: string
  eyebrow: string
  titleLine1: string
  titleLine2: string
  tagline: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
}

export type RoutesSnapshotStat = { value: string; label: string }

export type RoutesTerritoryStripChip = {
  id: string
  name: string
  meta: string
  /** Visual: primera ruta “destacada” en el HTML de referencia */
  variant: 'active' | 'neutral'
}

export type RoutesTerritoryStatic = {
  sectionId: string
  eyebrow: string
  h2: string
  body: string
  strip: RoutesTerritoryStripChip[]
}

export type RoutesCardBadge = {
  label: string
  /** 'amber' | 'neutral' | 'custom' — custom usa clases pill del design system */
  tone: 'amber' | 'neutral' | 'custom'
  /** Solo si tone === 'custom' */
  customClassName?: string
}

export type RoutesCardStatic = {
  id: string
  variant: 'featured' | 'default'
  imageSrc: string
  imageAlt: string
  numLabel: string
  altitudeLine: string
  badges: RoutesCardBadge[]
  name: string
  description: string
  chips: string[]
  footPriceHtml: string
  cta: { label: string; href: string; buttonVariant: 'primary' | 'secondary' }
}

export const routesHero: RoutesHeroStatic = {
  imageSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=85',
  imageAlt: 'Andes to Amazon — Ecotone territories',
  eyebrow: 'Manu Biosphere Reserve & Camanti · Cusco, Perú',
  titleLine1: 'Three territories.',
  titleLine2: 'One commitment.',
  tagline:
    'From cloud forest to deep Amazon — three distinct routes, each with its own ecosystem, lodge, and character. All departure from Cusco.',
  primaryCta: { label: 'Explore the routes ↓', href: '#routes' },
  secondaryCta: { label: 'See all experiences', href: '/experiences' },
}

export const routesSnapshotStats: RoutesSnapshotStat[] = [
  { value: '3', label: 'Routes' },
  { value: '~10', label: 'Experiences' },
  { value: '4', label: 'Lodges' },
  { value: '300 km', label: 'Cusco → Manu Core' },
]

export const routesTerritory: RoutesTerritoryStatic = {
  sectionId: 'territory',
  eyebrow: 'The territory',
  h2: 'Andes to Amazon from Cusco',
  body:
    'Three corridors departing from Cusco into the most biodiverse zones on Earth. The altitude gradient defines the ecosystem — and the experience. The further you go, the deeper the jungle.',
  strip: [
    { id: 'camanti', name: '① Camanti', meta: '~2.5h from Cusco', variant: 'active' },
    { id: 'manu-road', name: '② Manu Road', meta: '~5h from Cusco', variant: 'neutral' },
    { id: 'manu-core', name: '③ Manu Core', meta: '~8h from Cusco', variant: 'neutral' },
  ],
}

export const routesCards: RoutesCardStatic[] = [
  {
    id: 'camanti',
    variant: 'featured',
    imageSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=85',
    imageAlt: 'Camanti Valley — cloud forest',
    numLabel: '① Camanti',
    altitudeLine: '1,200 m · ~2.5h from Cusco',
    badges: [
      { label: 'Cloud forest', tone: 'amber' },
      { label: 'Own lodge', tone: 'custom', customClassName: 'routes-pill-outline' },
      { label: 'Research station', tone: 'custom', customClassName: 'routes-pill-outline' },
    ],
    name: 'Camanti Valley',
    description:
      'Primary cloud forest from 900 to 4,700 m.a.s.l. Home to CIDS, our active research centre, and Soqtapata Lodge. The closest route to Cusco — and the most biodiverse per km². A 45-minute walk from the road takes you into the reserve.',
    chips: ['Soqtapata Lodge', 'CIDS research', '300+ birds', 'Spectacled bear'],
    footPriceHtml: '3 experiences · from <strong>$986</strong>',
    cta: { label: 'See Camanti experiences →', href: '/experiences?route=camanti', buttonVariant: 'primary' },
  },
  {
    id: 'manu-road',
    variant: 'default',
    imageSrc: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&q=85',
    imageAlt: 'Manu Road — gradient ecosystem',
    numLabel: '② Manu Road',
    altitudeLine: '800–3,000 m · ~5h from Cusco',
    badges: [
      { label: 'Gradient', tone: 'amber' },
      { label: 'Alliance lodges', tone: 'neutral' },
    ],
    name: 'Manu Road',
    description:
      'The transition route — descending from high cloud forest at Wayqecha (3,000 m) through the gradient all the way down to Manu Bio-Lodge (800 m). Two lodges, two ecosystems, one dramatic journey through the altitudinal gradient.',
    chips: ['Wayqecha · 3,000 m', 'Manu Bio-Lodge', 'Cloud gradient'],
    footPriceHtml: '2 experiences · <span class="routes-price-enquire">Enquire</span>',
    cta: { label: 'See Manu Road experiences →', href: '/experiences?route=manu-road', buttonVariant: 'secondary' },
  },
  {
    id: 'manu-core',
    variant: 'default',
    imageSrc: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=85',
    imageAlt: 'Manu Core — deep Amazon',
    numLabel: '③ Manu Core',
    altitudeLine: '300–500 m · ~8h from Cusco',
    badges: [
      { label: 'Deep Amazon', tone: 'amber' },
      { label: 'Own lodge', tone: 'custom', customClassName: 'routes-pill-outline' },
    ],
    name: 'Manu Core Zone',
    description:
      'Inside Manu National Park — the most biodiverse protected area on Earth. Romero Lodge sits at 400 m, surrounded by primary Amazon jungle. The most remote route, requiring the most commitment — and offering the most extraordinary wildlife encounters.',
    chips: ['Romero Lodge', 'Inside national park', 'Jaguar territory'],
    footPriceHtml: '2 experiences · <span class="routes-price-enquire">Enquire</span>',
    cta: { label: 'See Manu Core experiences →', href: '/experiences?route=manu-core', buttonVariant: 'secondary' },
  },
]

/* ── Comparison (Fase 2) ── */

export type RoutesCompareColumn = {
  title: string
  subtitle: string
  /** Primera columna resaltada en el HTML de referencia */
  tone: 'featured' | 'default'
}

export const routesCompareColumns: RoutesCompareColumn[] = [
  { title: 'Camanti', subtitle: '~2.5h from Cusco', tone: 'featured' },
  { title: 'Manu Road', subtitle: '~5h from Cusco', tone: 'default' },
  { title: 'Manu Core', subtitle: '~8h from Cusco', tone: 'default' },
]

export type RoutesCompareRow =
  | { kind: 'text'; label: string; alt?: boolean; values: [string, string, string] }
  | { kind: 'dots'; label: string; alt?: boolean; dots: [0 | 1 | 2 | 3, 0 | 1 | 2 | 3, 0 | 1 | 2 | 3] }
  | {
      kind: 'lodge'
      label: string
      alt?: boolean
      lodges: [{ title: string; sub: string }, { title: string; sub: string }, { title: string; sub: string }]
    }
  | { kind: 'best'; label: string; alt?: boolean; values: [string, string, string] }
  | {
      kind: 'price'
      label: string
      alt?: boolean
      cells: [{ type: 'price'; text: string } | { type: 'enquire' }, { type: 'price'; text: string } | { type: 'enquire' }, { type: 'price'; text: string } | { type: 'enquire' }]
    }

export const routesCompareSection = {
  sectionId: 'compare',
  eyebrow: 'Compare routes',
  h2: 'Find your match',
  intro: 'Not sure which route fits? This table shows the key differences at a glance.',
}

export const routesCompareRows: RoutesCompareRow[] = [
  { kind: 'text', label: 'Altitude', values: ['1,200 m', '800–3,000 m', '300–500 m'] },
  { kind: 'text', label: 'Ecosystem', alt: true, values: ['Cloud forest', 'Gradient', 'Deep Amazon'] },
  { kind: 'dots', label: 'Remoteness', dots: [1, 2, 3] },
  { kind: 'text', label: 'Fitness req.', alt: true, values: ['Moderate', 'Low–moderate', 'Low'] },
  {
    kind: 'lodge',
    label: 'Lodge',
    lodges: [
      { title: 'Soqtapata', sub: 'Own · research station' },
      { title: 'Wayqecha + Bio-Lodge', sub: 'Alliance' },
      { title: 'Romero Lodge', sub: 'Own · inside NP' },
    ],
  },
  {
    kind: 'best',
    label: 'Best for',
    alt: true,
    values: ['Wildlife & science', 'First-timers & variety', 'Serious naturalists'],
  },
  {
    kind: 'price',
    label: 'From price',
    cells: [{ type: 'price', text: '$986' }, { type: 'enquire' }, { type: 'enquire' }],
  },
]

/* ── Experiences grid + filtros (Fase 2) ── */

export type RoutesExpRouteFilter = 'all' | 'camanti' | 'manu-road' | 'manu-core'

export type RoutesExpFilterPill = { id: RoutesExpRouteFilter; label: string }

export const routesExperiencesSection = {
  sectionId: 'experiences',
  eyebrow: 'Available experiences',
  h2: 'Start with a program',
  intro: 'All experiences are all-inclusive from Cusco — transport, lodge, meals, guide, and tech pack included.',
  allExperiencesHref: '/experiences',
  allExperiencesLabel: 'See all ~10 experiences →',
}

export type RoutesExpCardStatic = {
  href: string
  route: Exclude<RoutesExpRouteFilter, 'all'>
  imageSrc: string
  imageAlt: string
  typePill: string
  duration: string
  routeLine: string
  name: string
  description: string
  /** 'amount' muestra priceText como precio; 'enquire' | 'custom' estilos secundarios */
  priceKind: 'amount' | 'enquire' | 'custom'
  priceText?: string
}

export const routesExpFilters: RoutesExpFilterPill[] = [
  { id: 'all', label: 'All routes' },
  { id: 'camanti', label: 'Camanti' },
  { id: 'manu-road', label: 'Manu Road' },
  { id: 'manu-core', label: 'Manu Core' },
]

export const routesExpCards: RoutesExpCardStatic[] = [
  {
    href: '/experiences/soqtapata-pristine-immersion',
    route: 'camanti',
    imageSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
    imageAlt: 'Soqtapata Pristine Immersion',
    typePill: 'Nature Core',
    duration: '3D · 2N',
    routeLine: 'Camanti Route',
    name: 'Soqtapata Pristine Immersion',
    description: 'EcoDroneView® · ForestWhisper® · CIDS visit · Expert naturalist guide',
    priceKind: 'amount',
    priceText: '$986',
  },
  {
    href: '/experiences/andean-cloud-forest',
    route: 'camanti',
    imageSrc: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500&q=80',
    imageAlt: 'Andean Cloud Forest',
    typePill: 'Nature Core',
    duration: '4D · 3N',
    routeLine: 'Camanti Route',
    name: 'Andean Cloud Forest',
    description: 'Extended trails · Night walks · Full reserve access · All tech products',
    priceKind: 'amount',
    priceText: '$1,200+',
  },
  {
    href: '/experiences/manu-gradient',
    route: 'manu-road',
    imageSrc: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=500&q=80',
    imageAlt: 'Manu Gradient',
    typePill: 'Nature Core',
    duration: '3D · 2N',
    routeLine: 'Manu Road',
    name: 'Manu Gradient',
    description: 'Cloud forest to Amazon transition · Wayqecha · Manu Bio-Lodge',
    priceKind: 'enquire',
  },
  {
    href: '/experiences/manu-core-frontier',
    route: 'manu-core',
    imageSrc: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500&q=80',
    imageAlt: 'Manu Core Frontier',
    typePill: 'Signature',
    duration: '6D · 5N',
    routeLine: 'Manu Core',
    name: 'Manu Core Frontier',
    description: 'Inside Manu National Park · Primary jungle · Romero Lodge',
    priceKind: 'enquire',
  },
  {
    href: '/experiences/family-discovery',
    route: 'manu-core',
    imageSrc: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80',
    imageAlt: 'Family Discovery Quest',
    typePill: 'Signature',
    duration: '5D · 4N',
    routeLine: 'Manu Core',
    name: 'Family Discovery Quest',
    description: 'Designed for families · Active but accessible · Romero Lodge',
    priceKind: 'enquire',
  },
  {
    href: '/experiences/schools',
    route: 'camanti',
    imageSrc: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&q=80',
    imageAlt: 'Schools & Universities',
    typePill: 'Exp. Learning',
    duration: '2–6 weeks',
    routeLine: 'Camanti Route',
    name: 'Schools & Universities',
    description: 'Custom academic curriculum · Research participation · Groups',
    priceKind: 'custom',
    priceText: 'Custom',
  },
]

/* ── Reviews (Fase 2) — `ReviewsSection` + `EcotoneV2Client` quotes ── */

export const routesFeaturedQuoteItems: { text: string; attr: string }[] = [
  {
    text: '"Breathtaking place with amazing people that changed <span>my way of travelling and understanding nature.</span>"',
    attr: '— Vanessa · London, UK · Soqtapata 3D/2N',
  },
  {
    text: '"Super comfortable place. No words to describe <span>the beauty of this forest.</span>"',
    attr: '— Richard · California, US · Soqtapata 3D/2N',
  },
  {
    text: '"The CIDS visit with the scientists was extraordinary. <span>Every morning — birds I&#39;d never heard before.</span>"',
    attr: '— Sofia · Barcelona, ES · Andean Cloud Forest',
  },
]

export const routesReviewDocs: ReviewDoc[] = [
  {
    _id: 'routes-static-review-1',
    quote:
      'Breathtaking place with amazing people that changed my way of travelling and understanding nature.',
    authorName: 'Vanessa',
    authorCity: 'London',
    authorCountry: 'UK',
    experienceName: 'Soqtapata 3D/2N · Camanti',
    rating: 5,
  },
  {
    _id: 'routes-static-review-2',
    quote: 'Super comfortable place. There are no words to describe the beauty of this forest — you have to experience it.',
    authorName: 'Richard',
    authorCity: 'California',
    authorCountry: 'US',
    experienceName: 'Soqtapata 3D/2N · Camanti',
    rating: 5,
  },
  {
    _id: 'routes-static-review-3',
    quote: "The CIDS visit with the scientists was extraordinary. Waking up to birds I'd never heard before — every morning.",
    authorName: 'Sofia',
    authorCity: 'Barcelona',
    authorCountry: 'ES',
    experienceName: 'Andean Cloud Forest · Camanti',
    rating: 5,
  },
]

/* ── Final CTA (Fase 2) ── */

export const routesFinalCta = {
  sectionId: 'contact',
  eyebrow: 'Not sure where to start?',
  h2: "We'll help you choose",
  body: "Tell us what you're looking for — duration, ecosystem, group size — and we'll recommend the right route and program.",
  whatsappHref:
    "https://wa.me/51974781094?text=Hi%21%20I'm%20interested%20in%20an%20Ecotone%20experience.%20Could%20you%20help%20me%20choose%20the%20right%20route%3F",
  whatsappLabel: 'Ask on WhatsApp',
  secondaryHref: '/experiences',
  secondaryLabel: 'See all experiences',
  trustItems: [
    {
      label: 'Free cancellation · 15 days',
      icon: 'shield' as const,
    },
    {
      label: 'All inclusive from Cusco',
      icon: 'check' as const,
    },
    {
      label: 'B Corp certified',
      icon: 'heart' as const,
    },
  ],
}
