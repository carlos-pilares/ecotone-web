import { CMS_IDS } from '@/data/cmsApproved/ids'

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[®'']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)

const expRef = () =>
  ({ _type: 'reference' as const, _ref: CMS_IDS.experienceSoqtapata })

const REVIEW_BASE = [
  {
    _id: CMS_IDS.review1,
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
    _id: CMS_IDS.review2,
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
    _id: CMS_IDS.review3,
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
    _id: CMS_IDS.review4,
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
    _id: CMS_IDS.review5,
    _type: 'review' as const,
    quote: 'Birdwatching at 5 AM — over 20 species before breakfast. Life-changing morning.',
    authorName: 'Sofia',
    authorCity: 'Barcelona',
    authorCountry: 'ES',
    experienceName: 'Soqtapata 3D/2N',
    rating: 5,
    isFeatured: false,
  },
]

const LINKED_INDEX = new Set([0, 2, 4])

/** `npm run seed` — no product refs (safe before experience doc exists). */
export const reviewSeedsUnlinked = REVIEW_BASE

/** `npm run seed:cms` — link Soqtapata reviews to the experience product. */
export const reviewSeedsLinked = REVIEW_BASE.map((r, i) =>
  LINKED_INDEX.has(i) ? { ...r, experience: expRef() } : r,
)

/**
 * Reusable collection docs: same as prior `seedHomePage.ts` seed list.
 */
export const technologyProductSeeds = [
  {
    _id: CMS_IDS.tech1,
    _type: 'technologyProduct' as const,
    name: 'EcoDroneView®',
    slug: { _type: 'slug' as const, current: 'ecodroneview' },
    number: '01',
    description:
      'A journey beyond the trails, soaring above the canopy and exploring remote landscapes inaccessible by foot.',
    badgeText: 'Only at Ecotone',
    stableId: 'dtech1',
    order: 1,
  },
  {
    _id: CMS_IDS.tech2,
    _type: 'technologyProduct' as const,
    name: 'ForestWhisper®',
    slug: { _type: 'slug' as const, current: 'forestwhisper' },
    number: '02',
    description:
      "Immerse yourself in the rainforest's enchanting sounds through premium 360° microphones and high-fidelity headphones.",
    badgeText: 'Only at Ecotone',
    stableId: 'dtech2',
    order: 2,
  },
  {
    _id: CMS_IDS.tech3,
    _type: 'technologyProduct' as const,
    name: 'EcoSpeciesExplorer®',
    slug: { _type: 'slug' as const, current: 'ecospeciesexplorer' },
    number: '03',
    description:
      'This comprehensive platform reveals all kinds of incredible species found in our conservation destinations. Live on iOS.',
    badgeText: 'Only at Ecotone',
    badgeTextWhenExcluded: 'Download free on iOS',
    stableId: 'dtech3',
    order: 3,
  },
]

export const partnerSeeds = [
  { _id: CMS_IDS.partner1, _type: 'partner' as const, name: 'B Corp', order: 1 },
  { _id: CMS_IDS.partner2, _type: 'partner' as const, name: 'Adventure Travel Trade Association', order: 2 },
  { _id: CMS_IDS.partner3, _type: 'partner' as const, name: 'Rainforest Alliance', order: 3 },
  { _id: CMS_IDS.partner4, _type: 'partner' as const, name: 'GSTC', order: 4 },
  { _id: CMS_IDS.partner5, _type: 'partner' as const, name: 'IUCN Partner', order: 5 },
  { _id: CMS_IDS.partner6, _type: 'partner' as const, name: 'UN Tourism', order: 6 },
] as const

export const blogPostSeeds = [
  {
    _id: CMS_IDS.blog1,
    _type: 'blogPost' as const,
    title: '5 birds you can only see in the Manu Reserve',
    slug: { _type: 'slug' as const, current: slugify('5 birds you can only see in the Manu Reserve') },
    category: 'Birds',
    readingMinutes: 3,
    externalLink: 'https://www.ecotone.eco/blog' as const,
    publishedAt: '2024-01-15T12:00:00.000Z',
  },
  {
    _id: CMS_IDS.blog2,
    _type: 'blogPost' as const,
    title: "How ForestWhisper® changes the way you hear the jungle",
    slug: { _type: 'slug' as const, current: slugify('How ForestWhisper changes the way you hear the jungle') },
    category: 'Technology',
    readingMinutes: 4,
    externalLink: 'https://www.ecotone.eco/blog' as const,
    publishedAt: '2024-02-01T12:00:00.000Z',
  },
  {
    _id: CMS_IDS.blog3,
    _type: 'blogPost' as const,
    title: "Why we choose Camanti: the last cloud forest nobody talks about",
    slug: { _type: 'slug' as const, current: slugify('Why we choose Camanti the last cloud forest nobody talks about') },
    category: 'Conservation',
    readingMinutes: 5,
    externalLink: 'https://www.ecotone.eco/blog' as const,
    publishedAt: '2024-03-10T12:00:00.000Z',
  },
] as const
