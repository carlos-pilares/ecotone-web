/**
 * One-shot seed: siteSettings, homePage (full text + images), aboutPage, routesPage, Soqtapata experience + experiencePage,
 * library docs (tech, reviews, partners, blog), shared routes/lodge. No `payloadV1`.
 * Requires SANITY_API_TOKEN and env project/dataset. Does not touch the Next.js app — Studio only.
 */
import type { SanityClient } from '@sanity/client'

import { CMS_IDS } from '@/data/cmsApproved/ids'
import { experiencePageLodgeCtaSeed } from './seed/buildExperiencePageDocument'
import {
  blogPostSeeds,
  partnerSeeds,
  reviewSeedsLinked,
  technologyProductSeeds,
} from '@/data/cmsApproved/librarySeeds'
import { SOQTAPATA_MAIN_HERO_URL, collectSoqtapataGalleryRows } from '@/data/cmsApproved/soqtapataGalleryUrls'
import { BLOG_TEASER_IMAGE_URLS } from '@/data/cmsApproved/homeImageUrls'
import { soqtapataPristineSeoDefault } from '@/lib/soqtapataCmsV1'
import {
  soqtapataPhase1,
  soqtapataPhase2,
  soqtapataPhase3,
  soqtapataPhase4When,
  soqtapataPhase5,
  soqtapataPhase6Faq,
  soqtapataExperienceReviewsLayout,
} from '@/data/soqtapataExperienceLocal'
import { buildBookingModalSettingsDocument } from './seed/buildBookingModalSettingsDocument'
import { buildSiteSettingsDocument, removeSiteSettingsDraft } from './seed/buildSiteSettingsDocument'
import { buildHomePageDocument } from './seed/buildHomePageDocument'
import { buildAboutPageDocument } from './seed/buildAboutPageDocument'
import { buildRoutesPageDocument } from './seed/buildRoutesPageDocument'
import { removeAboutPageDraft } from './seed/removeAboutPageDraft'
import { removeRoutesPageDraft } from './seed/removeRoutesPageDraft'
import { createUrlImageCache } from './seed/urlImageCache'
import { writeClient } from './seed/sanityWriteClient.js'

const MONTH_TO_SLUG: Record<string, string> = {
  January: 'january',
  February: 'february',
  March: 'march',
  April: 'april',
  May: 'may',
  June: 'june',
  July: 'july',
  August: 'august',
  September: 'september',
  October: 'october',
  November: 'november',
  December: 'december',
}

const ICON_BY_ICON_ID: Record<number, string> = {
  0: 'bird',
  1: 'bear',
  2: 'cat',
  3: 'jaguar',
  4: 'bird',
  5: 'monkey',
  6: 'generic',
}

const CARD_TO_LEVEL: Record<string, 'always-good' | 'good' | 'peak'> = {
  default: 'always-good',
  good: 'good',
  peak: 'peak',
}

function key(n: string) {
  return { _key: n }
}

function buildBestTimeByMonth() {
  return soqtapataPhase4When.months.map((m, i) => ({
    ...key(`m${i}`),
    _type: 'bestMonth' as const,
    month: MONTH_TO_SLUG[m.name] || 'january',
    highlight: m.highlight,
    level: CARD_TO_LEVEL[m.cardClass] || 'always-good',
  }))
}

async function buildItineraryWithImages(cache: ReturnType<typeof createUrlImageCache>) {
  return Promise.all(
    soqtapataPhase2.itinerary.days.map(async (d, i) => ({
      ...key(`day${i}`),
      _type: 'itineraryDay' as const,
      dayNumber: Number.parseInt(d.dayNum, 10) || i + 1,
      title: d.title,
      subtitle: d.subtitle,
      image: await cache.get(d.photoSrc, `soqtapata-itinerary-day-${i + 1}.jpg`),
      photoCaption: d.caption,
      timeline: d.timeline.map((t, j) => ({
        ...key(`t${i}-${j}`),
        _type: 'timeBlock' as const,
        time: t.time,
        title: t.title,
        description: t.desc,
      })),
      lodgeOvernight: d.lodgeBadge?.name,
      lodgeSub: d.lodgeBadge?.sub,
    })),
  )
}

async function buildExperienceGalleryFromApprovedUrls(cache: ReturnType<typeof createUrlImageCache>) {
  const rows = collectSoqtapataGalleryRows()
  const items = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!
    const image = await cache.get(row.url, `soqtapata-gal-${i}.jpg`)
    items.push({
      ...key(`g${i}`),
      _type: 'galleryItem' as const,
      image,
      caption: row.caption.slice(0, 80),
      category: row.category,
    })
  }
  return items
}

async function buildBlogPostsWithTeaserImages(cache: ReturnType<typeof createUrlImageCache>) {
  return Promise.all(
    blogPostSeeds.map(async (b, i) => {
      const url = BLOG_TEASER_IMAGE_URLS[i]
      if (!url) return { ...b }
      const image = await cache.get(url, `blog-teaser-${i + 1}.jpg`)
      return { ...b, image }
    }),
  )
}

function buildWildlife() {
  return soqtapataPhase3.wildlife.species.map((s, i) => ({
    ...key(`w${i}`),
    _type: 'wildlifeItem' as const,
    name: s.name,
    description: s.sub,
    iconType: ICON_BY_ICON_ID[s.iconId] ?? 'generic',
  }))
}

function buildFaqs() {
  return soqtapataPhase6Faq.items.map((f, i) => ({
    ...key(`faq${i}`),
    _type: 'faq' as const,
    question: f.question,
    answer: f.answer,
  }))
}

function buildEntryFromBeforeYouGo() {
  const card = soqtapataPhase5.beforeYouGo.cards[0] as { items: { title: string; body: string }[] }
  if (!card.items?.length) return []
  return card.items.map((x, i) => ({
    ...key(`e${i}`),
    _type: 'entryBlock' as const,
    title: x.title,
    description: x.body,
  }))
}

function buildPacking() {
  const card = soqtapataPhase5.beforeYouGo.cards[1] as { packItems: string[] }
  return card.packItems
}

function buildGettingHere() {
  const card = soqtapataPhase5.beforeYouGo.cards[2] as { items: { title: string; body: string }[] }
  return card.items.map((x, i) => ({
    ...key(`g${i}`),
    _type: 'gettingBlock' as const,
    title: x.title,
    description: x.body,
  }))
}

const SECTION_ORDER = [
  'overview',
  'itinerary',
  'lodge',
  'wildlife',
  'includes',
  'tech',
  'media',
  'whenToVisit',
  'beforeYouGo',
  'reviews',
  'terms',
  'resources',
  'faq',
  'related',
  'reserve',
] as const

function buildPageModules() {
  return SECTION_ORDER.map((k, i) => ({
    ...key(`pm${i}`),
    _type: 'pageModule' as const,
    key: k,
    visible: true,
  }))
}

export async function seedCmsAll() {
  const client = writeClient() as SanityClient
  const siteSettingsDoc = await buildSiteSettingsDocument(client)
  const homePageDoc = await buildHomePageDocument(client)
  const cache = createUrlImageCache(client)
  const mainImage = await cache.get(SOQTAPATA_MAIN_HERO_URL, 'soqtapata-hero.jpg')
  const galleryItems = await buildExperienceGalleryFromApprovedUrls(cache)
  const itineraryDays = await buildItineraryWithImages(cache)
  const blogDocsWithImages = await buildBlogPostsWithTeaserImages(cache)
  const routesPageDoc = await buildRoutesPageDocument(client, cache)
  const aboutPageDoc = await buildAboutPageDocument(client, cache)

  const { overview } = soqtapataPhase2
  const ovPara = overview.paragraphs
  const shortDescription =
    ovPara[0].length > 160 ? `${ovPara[0].slice(0, 157)}…` : ovPara[0]
  const fullDescription = `${ovPara[0]}\n\n${ovPara[1]}`

  const terms = soqtapataPhase5.terms
  const termsFull = [terms.lead, ...terms.cards.map((c) => `${c.title}: ${c.body}`)].join('\n\n')
  const cancellation = terms.cards[0]?.body ?? ''
  const importantNotes = [
    'Summary only — the WeTravel contract is legally binding for payments and changes.',
    'No guarantee of any species; guides adjust routes for safety and conservation.',
    'See Resources for the full PDF; keep a copy for travel insurance claims.',
  ]

  const resourcesCardsSeed = [
    {
      _type: 'experienceResourceCard' as const,
      _key: 'seed-res-map',
      title: 'Route map',
      subtitle: 'Soqtapata · Trail overview · PDF · 2.4 MB',
      resourceType: 'map' as const,
      visualPreset: 'map' as const,
      ctaLabel: 'Download PDF',
      /** Mismo comportamiento que el fallback local (`downloadHref: '#'`): sin URL en CMS el enlace queda `#`. */
      visible: true,
      order: 0,
    },
    {
      _type: 'experienceResourceCard' as const,
      _key: 'seed-res-brochure',
      title: 'Experience brochure',
      subtitle: 'Full itinerary · Photos · Packing · PDF · 5.1 MB',
      resourceType: 'brochure' as const,
      visualPreset: 'brochure' as const,
      ctaLabel: 'Download PDF',
      visible: true,
      order: 1,
    },
    {
      _type: 'experienceResourceCard' as const,
      _key: 'seed-res-terms',
      title: 'Terms & Conditions',
      subtitle: 'Legal · Full text · PDF',
      resourceType: 'terms' as const,
      visualPreset: 'terms' as const,
      fileUrl: '/ecotone-terms-conditions.pdf',
      ctaLabel: 'Download full terms (PDF)',
      visible: true,
      order: 2,
    },
  ]

  const routeDoc = {
    _id: CMS_IDS.routeCamanti,
    _type: 'route' as const,
    name: 'Camanti Route',
    slug: { _type: 'slug' as const, current: 'camanti' },
    tagline: 'Cloud forest to lowland Amazon transition',
    shortDescription: 'The Camanti road connects Cusco to some of the last intact cloud-forest basins in the Peruvian Amazon.',
  }

  const lodgeDoc = {
    _id: CMS_IDS.lodgeSoqtapata,
    _type: 'lodge' as const,
    name: 'Soqtapata Lodge',
    slug: { _type: 'slug' as const, current: 'soqtapata-lodge' },
    route: 'camanti',
    altitude: '1,200 m',
    shortDescription: soqtapataPhase3.lodge.card.meta,
  }

  const h = soqtapataPhase1.hero
  const st = soqtapataPhase1.stats
  const experienceDoc = {
    _id: CMS_IDS.experienceSoqtapata,
    _type: 'experience' as const,
    name: h.h1,
    slug: { _type: 'slug' as const, current: 'soqtapata-pristine-immersion' },
    programType: 'nature-core' as const,
    route: 'camanti' as const,
    status: 'active' as const,
    duration: '3D · 2N',
    price: 986,
    priceLabel: 'USD 986',
    tagline: h.tagline,
    shortDescription,
    fullDescription: fullDescription.slice(0, 600),
    mainImage,
    gallery: galleryItems,
    highlights: overview.highlights,
    itinerary: itineraryDays,
    includes: soqtapataPhase3.includes.yes,
    notIncludes: soqtapataPhase3.includes.no,
    lodge: { _type: 'reference' as const, _ref: CMS_IDS.lodgeSoqtapata },
    lodgeNightLabel: 'Nights 1 & 2',
    groupSizeMin: 2,
    groupSizeMax: 8,
    altitude: st[2]?.n || '1,200 m',
    distanceFromCusco: st[1]?.n || '~2.5h',
    ecosystem: st[5]?.n || 'Cloud forest',
    wildlife: buildWildlife(),
    includedTechProducts: [
      { _type: 'reference' as const, _ref: CMS_IDS.tech1, _key: 'tp1' },
      { _type: 'reference' as const, _ref: CMS_IDS.tech2, _key: 'tp2' },
      { _type: 'reference' as const, _ref: CMS_IDS.tech3, _key: 'tp3' },
    ],
    bestTimeByMonth: buildBestTimeByMonth(),
    entryRequirements: buildEntryFromBeforeYouGo(),
    packingList: buildPacking(),
    gettingHereInfo: buildGettingHere(),
    cancellationPolicy: cancellation,
    termsAndConditions: termsFull.slice(0, 800),
    importantNotes,
    resources: resourcesCardsSeed,
    faqs: buildFaqs(),
    seo: {
      _type: 'seo' as const,
      title: soqtapataPristineSeoDefault.title,
      description: soqtapataPristineSeoDefault.description,
    },
  }

  /** Only fields on `sanity/schemaTypes/experiencePage` — no `payloadV1`. */
  const experiencePageDoc = {
    _id: CMS_IDS.experiencePageSoqtapata,
    _type: 'experiencePage' as const,
    internalTitle: 'Soqtapata Pristine Immersion (landing)',
    slug: { _type: 'slug' as const, current: 'soqtapata-pristine-immersion' },
    experience: { _type: 'reference' as const, _ref: CMS_IDS.experienceSoqtapata },
    seo: {
      _type: 'seo' as const,
      title: soqtapataPristineSeoDefault.title,
      description: soqtapataPristineSeoDefault.description,
    },
    pageHero: {
      _type: 'landingHero' as const,
      headline: h.h1,
      headlineSub: h.tagline,
      pills: h.badges,
      priceLine: h.price,
      priceSub: h.priceSub,
      useProductPrice: true,
      bookCta: { _type: 'cta' as const, label: h.bookLabel, href: h.bookUrl, style: 'primary' },
    },
    reviewsLayout: {
      _type: 'reviewsLayoutBlock' as const,
      eyebrow: soqtapataExperienceReviewsLayout.eyebrow,
      headline: soqtapataExperienceReviewsLayout.headline,
      averageRating: soqtapataExperienceReviewsLayout.averageRating,
      sectionClassName: soqtapataExperienceReviewsLayout.sectionClassName,
      contentInnerClassName: soqtapataExperienceReviewsLayout.contentInnerClassName,
      useHomepageSampleReviewsIfEmpty: soqtapataExperienceReviewsLayout.useHomepageSampleReviewsIfEmpty,
      sourceLabel: soqtapataExperienceReviewsLayout.sourceLabel,
      secondaryRatingLine: '',
      emptyMessage: '',
    },
    reserveBlock: {
      _type: 'landingReserveBlock' as const,
      termsLinkLabel: 'Terms & Conditions',
      trustStripItems: [
        { _key: 'ts1', _type: 'reserveTrustStripLine' as const, text: 'Secure payment' },
        { _key: 'ts2', _type: 'reserveTrustStripLine' as const, text: 'Free cancellation · 15 days' },
        { _key: 'ts3', _type: 'reserveTrustStripLine' as const, text: 'B Corp certified' },
      ],
    },
    resources: {
      _type: 'experiencePageResources' as const,
      mapPreviewTitle: 'Soqtapata',
      mapPreviewSubtitle: '1,200 m',
      brochurePreviewBadge: 'Soqtapata · 3D/2N',
      cards: resourcesCardsSeed,
    },
    reviewRefs: [
      { _type: 'reference' as const, _ref: 'seed-review-1', _key: 'rv1' },
      { _type: 'reference' as const, _ref: 'seed-review-3', _key: 'rv3' },
      { _type: 'reference' as const, _ref: 'seed-review-5', _key: 'rv5' },
    ],
    techProductRefs: [
      { _type: 'reference' as const, _ref: CMS_IDS.tech1, _key: 'k1' },
      { _type: 'reference' as const, _ref: CMS_IDS.tech2, _key: 'k2' },
      { _type: 'reference' as const, _ref: CMS_IDS.tech3, _key: 'k3' },
    ],
    includedTechProductIds: ['dtech1', 'dtech2'],
    /** Tras `npm run seed:soqtapata-lodge` el destino existe; si no, Studio permite corregir la ref. */
    ...experiencePageLodgeCtaSeed,
    sectionModules: buildPageModules(),
  }

  await removeSiteSettingsDraft(client)

  const journalPageDoc = {
    _id: 'journalPage',
    _type: 'journalPage' as const,
    heroEyebrow: 'Field notes',
    heroTitle: 'Journal',
    heroIntro:
      'Dispatch from the field — conservation context, expedition craft, and the science behind how we move through cloud forest and lowland Amazon.',
    showTagFilter: true,
  }

  const tx = client.transaction()
  for (const t of technologyProductSeeds) {
    tx.createOrReplace(t as any)
  }
  tx.createOrReplace(routeDoc as any)
  tx.createOrReplace(lodgeDoc as any)
  tx.createOrReplace(experienceDoc as any)
  for (const r of reviewSeedsLinked) {
    tx.createOrReplace(r as any)
  }
  tx.createOrReplace(experiencePageDoc as any)
  tx.createOrReplace(siteSettingsDoc as any)
  tx.createOrReplace(buildBookingModalSettingsDocument() as any)
  tx.createOrReplace(homePageDoc as any)
  for (const p of partnerSeeds) {
    tx.createOrReplace(p as any)
  }
  for (const b of blogDocsWithImages) {
    tx.createOrReplace(b as any)
  }
  /** Evita borradores vacíos tapando el publicado en Studio. */
  await removeAboutPageDraft(client)
  await removeRoutesPageDraft(client)
  /** `aboutPage` referencia `partner`; `routesPage` referencia `review` (creados arriba). */
  tx.createOrReplace(aboutPageDoc as any)
  tx.createOrReplace(routesPageDoc as any)
  tx.createOrReplace(journalPageDoc as any)
  await tx.commit()
}

