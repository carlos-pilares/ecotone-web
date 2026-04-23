/**
 * Idempotent seed: creates/replaces the homePage singleton and initial collection docs.
 * Requires SANITY_API_TOKEN in .env.local (Editor permissions).
 */
import type { SanityClient } from '@sanity/client'
import { createClient } from 'next-sanity'
import { config } from 'dotenv'
import { resolve } from 'node:path'

config({ path: resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20'
const token = process.env.SANITY_API_TOKEN

function writeClient(): SanityClient {
  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
  }
  if (!token) {
    throw new Error('Missing SANITY_API_TOKEN. Add it to .env.local and run again.')
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  })
}

const key = (id: string) => ({ _key: id })

const homePageContent = {
  _type: 'homePage' as const,
  _id: 'homePage',

  heroHeadline: 'The forest',
  heroHeadlineLight: 'is waiting for you.',
  heroSubheadline:
    'Immersive all-inclusive experiences in the most biodiverse ecosystems on Earth. All-inclusive from Cusco.',
  heroPills: ['3 Routes', '~10 Experiences', 'Max 8 per group', 'All inclusive'],
  heroCta1Text: 'Explore experiences',
  heroCta1Link: '#experiences',
  heroCta2Text: 'Our routes ↓',
  heroCta2Link: '#routes',
  heroCardPrice: 'from $380',
  heroCardSubprice: 'All inclusive · departure from Cusco',
  heroCardRows: [
    { ...key('h0'), _type: 'heroCardRow' as const, label: 'Routes', value: '3 territories' },
    { ...key('h1'), _type: 'heroCardRow' as const, label: 'Experiences', value: '~10 programs' },
    { ...key('h2'), _type: 'heroCardRow' as const, label: 'Group', value: 'Up to 8 people' },
    { ...key('h3'), _type: 'heroCardRow' as const, label: 'Duration', value: '3 days – 6 weeks' },
  ],
  heroCardCtaText: 'Check availability →',
  heroCardCtaLink: '#book',

  stats: [
    { ...key('s0'), _type: 'homeStat' as const, number: '3', label: 'Routes' },
    { ...key('s1'), _type: 'homeStat' as const, number: '~10', label: 'Experiences' },
    { ...key('s2'), _type: 'homeStat' as const, number: '1,200+', label: 'Species observed' },
    { ...key('s3'), _type: 'homeStat' as const, number: '5.0 ★', label: 'Guest rating' },
  ],

  manifestoEyebrow: 'Our purpose',
  manifestoHeadline: 'Not a tour. An immersion.',
  manifestoBody1:
    'We design all-inclusive journeys where technology deepens your connection with nature — not replaces it. Every trail, every sound, every species encountered becomes part of a story you carry home.',
  manifestoBody2:
    'Three routes through the Manu Biosphere Reserve and Camanti cloud forest. Four ways to travel with purpose. One commitment: protect what matters.',
  manifestoImageCaption: 'Soqtapata · 3,200 m.a.s.l. · Camanti Route',
  manifestoCta1Text: 'Our story',
  manifestoCta1Link: '#about',
  manifestoCta2Text: 'Explore programs',
  manifestoCta2Link: '#experiences',

  explorerEyebrow: 'Find your journey',
  explorerHeadline: 'Choose how you want to go deep',
  explorerSubheadline: '4 ways to travel with purpose. All-inclusive from Cusco. Filter by experience type.',

  reviewsEyebrow: 'What guests say',
  reviewsHeadline: 'Real experiences',
  reviewsScore: '5.0',

  techEyebrow: 'Exclusive technology',
  techHeadline: 'A commitment to preserving pristine nature',
  techBody:
    'Designed for eco-travellers seeking adventure with purpose. We combine immersive technology, sustainable lodging, and direct impact on local communities.',

  missionEyebrow: 'Why travel with us',
  missionHeadline: 'Travel deeper. Protect what matters.',
  missionBody: 'Every booking directly funds conservation in the Manu Biosphere Reserve and Camanti cloud forest.',
  missionItems: [
    {
      ...key('m0'),
      _type: 'missionItem' as const,
      iconType: 'transport' as const,
      title: 'All-inclusive from Cusco',
      subtitle: 'Certified naturalist guides · pickup at your hotel',
    },
    {
      ...key('m1'),
      _type: 'missionItem' as const,
      iconType: 'lodge' as const,
      title: 'Exclusive eco-lodges',
      subtitle: 'Located in high-biodiversity conservation zones',
    },
    {
      ...key('m2'),
      _type: 'missionItem' as const,
      iconType: 'tech' as const,
      title: 'Technology-enhanced immersion',
      subtitle: 'EcoDroneView® · ForestWhisper® · EcoSpeciesExplorer®',
    },
    {
      ...key('m3'),
      _type: 'missionItem' as const,
      iconType: 'group' as const,
      title: 'Max 8 people per group',
      subtitle: 'Always intimate · never a mass tour',
    },
    {
      ...key('m4'),
      _type: 'missionItem' as const,
      iconType: 'conservation' as const,
      title: 'Direct conservation impact',
      subtitle: 'Every booking funds active research and local communities',
    },
  ],
  missionCtaText: 'Read our impact →',
  missionCtaLink: '#',

  partnersLabel: 'Certified by & affiliated with',

  blogEyebrow: 'From the field',
  blogHeadline: 'Latest from Ecotone',

  bookingEyebrow: 'Reserve your spot',
  bookingHeadline: 'Ready to disconnect?',
  bookingBody:
    'Small groups. Fixed departures. Limited spots. Choose from ~10 immersive experiences across 3 routes — or let us design something entirely yours.',
  bookingTrustItems: [
    { ...key('b0'), _type: 'bookingTrustItem' as const, iconType: 'shield' as const, text: 'Secure payment — multiple methods accepted' },
    { ...key('b1'), _type: 'bookingTrustItem' as const, iconType: 'chart' as const, text: 'Free cancellation up to 15 days before departure' },
    { ...key('b2'), _type: 'bookingTrustItem' as const, iconType: 'heart' as const, text: 'Committed to responsible and regenerative tourism' },
    { ...key('b3'), _type: 'bookingTrustItem' as const, iconType: 'clock' as const, text: 'All-inclusive from Cusco — pickup from your hotel' },
  ],
  bookingPrice: 'from $380',
  bookingPriceSubtext: 'All inclusive · departure from Cusco',
  bookingCardRows: [
    { ...key('bc0'), _type: 'labelValue' as const, label: 'Routes', value: 'Camanti · Manu Route · Core' },
    { ...key('bc1'), _type: 'labelValue' as const, label: 'Group size', value: '2 – 8 people' },
    { ...key('bc2'), _type: 'labelValue' as const, label: 'Duration', value: '3 days – 6 weeks' },
    { ...key('bc3'), _type: 'labelValue' as const, label: 'Pickup', value: '4:30–5:00 AM · Cusco' },
  ],
  bookingCta1Text: 'Explore all experiences →',
  bookingCta1Link: 'https://www.ecotone.eco/services-4',
  bookingCta2Text: 'Ask via WhatsApp',
  bookingCta2Link: 'https://wa.me/51974781094?text=I%20want%20information%20about%20Ecotone%20experiences',
}

const reviews = [
  {
    _id: 'seed-review-1',
    _type: 'review' as const,
    quote:
      'Breathtaking place with amazing people that changed my way of travelling and understanding nature.',
    authorName: 'Vanessa',
    authorCity: 'London',
    authorCountry: 'UK',
    experienceName: 'Soqtapata 3D/2N',
    rating: 5,
    isFeatured: true,
  },
  {
    _id: 'seed-review-2',
    _type: 'review' as const,
    quote: 'Absolutely out of this world experience. Will definitely make the trip back someday.',
    authorName: 'Morgan',
    authorCity: 'New York',
    authorCountry: 'US',
    experienceName: 'Manu Gradient',
    rating: 5,
    isFeatured: true,
  },
  {
    _id: 'seed-review-3',
    _type: 'review' as const,
    quote: 'Super comfortable place. There are no words to describe the beauty of this place.',
    authorName: 'Richard',
    authorCity: 'California',
    authorCountry: 'US',
    experienceName: 'Soqtapata 3D/2N',
    rating: 5,
    isFeatured: false,
  },
  {
    _id: 'seed-review-4',
    _type: 'review' as const,
    quote: 'The ForestWhisper experience at night — I still get goosebumps thinking about it.',
    authorName: 'Lucas',
    authorCity: 'São Paulo',
    authorCountry: 'BR',
    experienceName: 'Family Quest',
    rating: 5,
    isFeatured: false,
  },
  {
    _id: 'seed-review-5',
    _type: 'review' as const,
    quote: 'Birdwatching at 5 AM — over 20 species before breakfast. Life-changing morning.',
    authorName: 'Sofia',
    authorCity: 'Barcelona',
    authorCountry: 'ES',
    experienceName: 'Soqtapata 3D/2N',
    rating: 5,
    isFeatured: false,
  },
] as const

const technologyProducts = [
  {
    _id: 'seed-tech-01',
    _type: 'technologyProduct' as const,
    name: 'EcoDroneView®',
    slug: { _type: 'slug' as const, current: 'ecodroneview' },
    number: '01',
    description:
      'A journey beyond the trails, soaring above the canopy and exploring remote landscapes inaccessible by foot.',
    badgeText: 'Only at Ecotone',
    order: 1,
  },
  {
    _id: 'seed-tech-02',
    _type: 'technologyProduct' as const,
    name: 'ForestWhisper®',
    slug: { _type: 'slug' as const, current: 'forestwhisper' },
    number: '02',
    description:
      "Immerse yourself in the rainforest's enchanting sounds through premium 360° microphones and high-fidelity headphones.",
    badgeText: 'Only at Ecotone',
    order: 2,
  },
  {
    _id: 'seed-tech-03',
    _type: 'technologyProduct' as const,
    name: 'EcoSpeciesExplorer®',
    slug: { _type: 'slug' as const, current: 'ecospeciesexplorer' },
    number: '03',
    description:
      'This comprehensive platform reveals all kinds of incredible species found in our conservation destinations. Live on iOS.',
    badgeText: 'Only at Ecotone',
    order: 3,
  },
] as const

const partners = [
  { _id: 'seed-partner-1', _type: 'partner' as const, name: 'B Corp', order: 1 },
  { _id: 'seed-partner-2', _type: 'partner' as const, name: 'Adventure Travel Trade Association', order: 2 },
  { _id: 'seed-partner-3', _type: 'partner' as const, name: 'Rainforest Alliance', order: 3 },
  { _id: 'seed-partner-4', _type: 'partner' as const, name: 'GSTC', order: 4 },
  { _id: 'seed-partner-5', _type: 'partner' as const, name: 'IUCN Partner', order: 5 },
  { _id: 'seed-partner-6', _type: 'partner' as const, name: 'UN Tourism', order: 6 },
] as const

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[®'']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

const blogPosts = [
  {
    _id: 'seed-blog-1',
    _type: 'blogPost' as const,
    title: '5 birds you can only see in the Manu Reserve',
    slug: { _type: 'slug' as const, current: slugify('5 birds you can only see in the Manu Reserve') },
    category: 'Birds',
    readingMinutes: 3,
    externalLink: 'https://www.ecotone.eco/blog' as const,
    publishedAt: '2024-01-15T12:00:00.000Z',
  },
  {
    _id: 'seed-blog-2',
    _type: 'blogPost' as const,
    title: "How ForestWhisper® changes the way you hear the jungle",
    slug: { _type: 'slug' as const, current: slugify('How ForestWhisper changes the way you hear the jungle') },
    category: 'Technology',
    readingMinutes: 4,
    externalLink: 'https://www.ecotone.eco/blog' as const,
    publishedAt: '2024-02-01T12:00:00.000Z',
  },
  {
    _id: 'seed-blog-3',
    _type: 'blogPost' as const,
    title: "Why we choose Camanti: the last cloud forest nobody talks about",
    slug: { _type: 'slug' as const, current: slugify('Why we choose Camanti the last cloud forest nobody talks about') },
    category: 'Conservation',
    readingMinutes: 5,
    externalLink: 'https://www.ecotone.eco/blog' as const,
    publishedAt: '2024-03-10T12:00:00.000Z',
  },
] as const

type SeedDoc = Record<string, unknown> & { _id: string; _type: string }

async function main() {
  const client = writeClient()

  const tx = client.transaction()
  tx.createOrReplace(homePageContent as SeedDoc)
  for (const r of reviews) {
    tx.createOrReplace(r as SeedDoc)
  }
  for (const t of technologyProducts) {
    tx.createOrReplace(t as SeedDoc)
  }
  for (const p of partners) {
    tx.createOrReplace(p as SeedDoc)
  }
  for (const b of blogPosts) {
    tx.createOrReplace(b as SeedDoc)
  }

  await tx.commit()
  console.log('Seed complete: homePage + reviews + technologyProduct + partner + blogPost')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
