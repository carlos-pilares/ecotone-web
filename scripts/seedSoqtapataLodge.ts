/**
 * Seed Soqtapata Lodge CMS (`lodge` + `lodgePage`) from `data/lodgeSoqtapataStatic.ts`.
 * Idempotent: uses createOrReplace with stable _ids.
 *
 * Requires: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN in .env.local
 * Env: el primer import debe ser `./loadEnvLocal` (carga `.env.local` antes del resto de dependencias).
 * Safety: pass `--confirm` (or set SEED_SOQTAPATA_LODGE=1) to execute.
 *
 * Run: npx tsx scripts/seedSoqtapataLodge.ts --confirm
 *   or: npm run seed:soqtapata-lodge
 */
import './loadEnvLocal'
import { createClient, type SanityClient } from 'next-sanity'
import { createHash } from 'node:crypto'

import {
  lodgeSoqtapataBook,
  lodgeSoqtapataExperiences,
  lodgeSoqtapataFacilities,
  lodgeSoqtapataFaq,
  lodgeSoqtapataHero,
  lodgeSoqtapataLocation,
  lodgeSoqtapataOverview,
  lodgeSoqtapataPageNav,
  lodgeSoqtapataResearch,
  lodgeSoqtapataRooms,
  lodgeSoqtapataSnapshot,
} from '@/data/lodgeSoqtapataStatic'
import { lodgeSoqtapataExperienceCardDefaults, lodgeSoqtapataReviewsSectionDefaults } from '@/data/lodgeSoqtapataResolverDefaults'
import { lodgeSoqtapataSeoDefault } from '@/lib/lodgePageCmsTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20'
const token = process.env.SANITY_API_TOKEN

/** Same id as `scripts/seedExperience.ts` so `experience.lodge` keeps working. */
const LODGE_DOCUMENT_ID = 'lodge-soqtapata'
const LODGE_PAGE_DOCUMENT_ID = 'lodgePage-soqtapata-lodge'
const EXPERIENCE_SOQTAPATA_ID = 'experience-soqtapata-3d2n'

const GALLERY_CATS = ['common', 'room', 'wildlife', 'research', 'journey'] as const

type UploadedSanityImage = { _type: 'image'; asset: { _type: 'reference'; _ref: string } }

function writeClient(): SanityClient {
  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
  }
  if (!token || String(token).trim() === '') {
    throw new Error(
      'Falta SANITY_API_TOKEN: añade en la raíz del proyecto el archivo `.env.local` una línea como:\n' +
        '  SANITY_API_TOKEN=tu_token_con_permiso_de_escritura\n' +
        'Crea el token en https://www.sanity.io/manage → tu proyecto → API → Tokens (Editor o Administrator). ' +
        'Sin este token el seed no puede subir imágenes ni escribir documentos.',
    )
  }
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false })
}

function shortKey(s: string) {
  return createHash('sha1').update(s).digest('hex').slice(0, 12)
}

async function uploadImageFromUrl(
  client: SanityClient,
  url: string,
  label: string,
  cache: Map<string, UploadedSanityImage>,
): Promise<UploadedSanityImage | null> {
  const cached = cache.get(url)
  if (cached) return cached
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(60_000) })
    if (!res.ok) throw new Error(`${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const ct = res.headers.get('content-type') || ''
    const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg'
    const filename = `seed-soqtapata-${shortKey(url)}.${ext}`
    const asset = await client.assets.upload('image', buf, { filename, label })
    const image = {
      _type: 'image' as const,
      asset: { _type: 'reference' as const, _ref: asset._id },
    }
    cache.set(url, image)
    return image
  } catch (e) {
    console.warn(`[seed] Image upload skipped for ${label}: ${url}`, e instanceof Error ? e.message : e)
    return null
  }
}

function assertConfirm() {
  const ok =
    process.argv.includes('--confirm') ||
    process.env.SEED_SOQTAPATA_LODGE === '1' ||
    process.env.SEED_SOQTAPATA_LODGE === 'true'
  if (!ok) {
    console.error(
      'Refusing to run: pass --confirm or set SEED_SOQTAPATA_LODGE=1 (writes/updates Sanity documents).',
    )
    process.exit(1)
  }
}

function snapshotItemsFromStatic() {
  const keys = ['rooms', 'max-guests', 'from-cusco', 'altitude', 'ecosystem', 'bcorp'] as const
  return lodgeSoqtapataSnapshot.map((row, i) => ({
    _key: `snap-${keys[i]}`,
    _type: 'lodgeSnapshotItem' as const,
    key: keys[i],
    label: row.snapL,
    value: row.snapN,
  }))
}

async function buildLodgeDoc(client: SanityClient, imgCache: Map<string, UploadedSanityImage>, includeExperience: boolean) {
  const mainImage =
    (await uploadImageFromUrl(client, lodgeSoqtapataHero.imageSrc, 'hero-main', imgCache)) ?? undefined

  const gallery: Array<Record<string, unknown>> = []
  let gi = 0
  for (const item of lodgeSoqtapataHero.gallery) {
    const image = await uploadImageFromUrl(client, item.src, `hero-gallery-${gi}`, imgCache)
    if (!image) {
      gi++
      continue
    }
    gallery.push({
      _key: `hg-${gi}`,
      _type: 'lodgeGalleryItem',
      image,
      title: item.title,
      description: item.description,
      category: GALLERY_CATS[gi % GALLERY_CATS.length],
    })
    gi++
  }

  const commonAreas: Array<Record<string, unknown>> = []
  let ci = 0
  for (const a of lodgeSoqtapataFacilities.commonAreasGallery) {
    const image = await uploadImageFromUrl(client, a.src, `common-${ci}`, imgCache)
    if (!image) {
      ci++
      continue
    }
    commonAreas.push({
      _key: `ca-${ci}`,
      _type: 'lodgeCommonArea',
      image,
      title: a.title,
      description: a.description,
    })
    ci++
  }

  const rooms: Array<Record<string, unknown>> = []
  for (let ri = 0; ri < lodgeSoqtapataRooms.rooms.length; ri++) {
    const r = lodgeSoqtapataRooms.rooms[ri]
    const stableId = ri === 0 ? 'private-cottage' : 'double-room'
    const numberOfRooms = ri === 0 ? 1 : 6
    const capacity = 2
    const roomGallery: Array<Record<string, unknown>> = []
    let gk = 0
    for (const ph of r.galleryPhotos ?? []) {
      const image = await uploadImageFromUrl(client, ph.src, `room-${stableId}-${gk}`, imgCache)
      if (!image) {
        gk++
        continue
      }
      roomGallery.push({
        _key: `rg-${stableId}-${gk}`,
        _type: 'lodgeRoomGalleryItem',
        image,
        title: ph.title,
        description: ph.description,
      })
      gk++
    }
    rooms.push({
      _key: `room-${stableId}`,
      _type: 'lodgeRoom',
      stableId,
      name: r.name,
      numberOfRooms,
      capacity,
      highlights: [...r.chips],
      gallery: roomGallery,
    })
  }

  const mapImage =
    (await uploadImageFromUrl(
      client,
      lodgeSoqtapataFacilities.commonAreasGallery[0]?.src ?? lodgeSoqtapataHero.imageSrc,
      'map-placeholder',
      imgCache,
    )) ?? undefined

  const doc: Record<string, unknown> = {
    _type: 'lodge',
    _id: LODGE_DOCUMENT_ID,
    name: lodgeSoqtapataHero.title,
    slug: { _type: 'slug', current: 'soqtapata-lodge' },
    route: 'camanti',
    location: 'Camanti Route, Cusco · Soqtapata Reserve',
    altitude: 1200,
    certifications: lodgeSoqtapataHero.badges.map((label, i) => ({
      _key: `cert-${i}`,
      _type: 'lodgeCertification',
      label,
    })),
    shortDescription: lodgeSoqtapataHero.tagline,
    longDescription: lodgeSoqtapataOverview.body,
    keyElements: [...lodgeSoqtapataOverview.highlights],
    snapshotItems: snapshotItemsFromStatic(),
    gallery,
    rooms,
    commonAreas,
    amenities: lodgeSoqtapataFacilities.amenities.map((a, i) => ({
      _key: `am-${i}`,
      _type: 'lodgeAmenity',
      icon: a.iconId,
      title: a.title,
      description: a.sub,
    })),
    ...(mapImage ? { mapImage } : {}),
    journeySteps: lodgeSoqtapataLocation.journeySteps.map((s, i) => ({
      _key: `js-${i}`,
      _type: 'lodgeJourneyStep',
      title: s.time,
      description: s.text,
    })),
    highlights: lodgeSoqtapataResearch.stats.map((s, i) => ({
      _key: `sh-${i}`,
      _type: 'lodgeScienceHighlight',
      title: s.value,
      subtitle: s.label,
    })),
    researchAreas: lodgeSoqtapataResearch.pillars.map((p, i) => ({
      _key: `ra-${i}`,
      _type: 'lodgeResearchArea',
      title: p.title,
      description: p.body,
    })),
    specialMessage: lodgeSoqtapataResearch.footnote,
    experiences: includeExperience
      ? [{ _key: 'exp-soq', _type: 'reference', _ref: EXPERIENCE_SOQTAPATA_ID }]
      : [],
    reviews: [],
    faqs: lodgeSoqtapataFaq.items.map((f, i) => ({
      _key: f.id || `faq-${i}`,
      _type: 'lodgeFaq',
      question: f.question,
      answer: f.answer,
    })),
    startingPrice: 986,
    currency: 'USD',
    maxGroupSize: 14,
    availabilityNote: 'Year-round',
    bookingMessage: lodgeSoqtapataLocation.body,
    trustItems: lodgeSoqtapataBook.trustItems.map((t, i) => {
      const parts = t.text.split(' · ')
      const title = (parts[0] ?? t.text).trim()
      const subtitle = parts.length > 1 ? parts.slice(1).join(' · ').trim() : undefined
      return {
        _key: `trust-${i}`,
        _type: 'lodgeTrustItem' as const,
        title,
        ...(subtitle ? { subtitle } : {}),
      }
    }),
    seo: {
      _type: 'seo' as const,
      title: lodgeSoqtapataSeoDefault.title,
      description: lodgeSoqtapataSeoDefault.description,
    },
    seoTitle: lodgeSoqtapataSeoDefault.title,
    seoDescription: lodgeSoqtapataSeoDefault.description,
    heroGalleryOpenAriaLabel: lodgeSoqtapataHero.galleryOpenAriaLabel,
    facilitiesAmenitiesEyebrow: lodgeSoqtapataFacilities.amenitiesEyebrow,
    facilitiesGalleryTileAriaPrefix: lodgeSoqtapataFacilities.galleryTileAriaLabelPrefix,
    facilitiesGalleryStripMoreAriaLabel: lodgeSoqtapataFacilities.galleryStripMoreAriaLabel,
    facilitiesStripMoreCount: lodgeSoqtapataFacilities.stripPhotos[2]?.moreCount ?? '+12',
    facilitiesStripMoreLabel: lodgeSoqtapataFacilities.stripPhotos[2]?.moreLabel ?? 'View all photos',
    locationMapLabels: {
      cuscoTitle: lodgeSoqtapataLocation.mapLabels.cuscoTitle,
      cuscoSubtitle: lodgeSoqtapataLocation.mapLabels.cuscoSubtitle,
      trailheadLabel: lodgeSoqtapataLocation.mapLabels.trailheadLabel,
      walkHint: lodgeSoqtapataLocation.mapLabels.walkHint,
      lodgeTitle: lodgeSoqtapataLocation.mapLabels.lodgeTitle,
      lodgeSubtitle: lodgeSoqtapataLocation.mapLabels.lodgeSubtitle,
    },
    experienceCardCtaLabel: lodgeSoqtapataExperiences.programCardCtaLabel,
    experienceCardPricePrefix: lodgeSoqtapataExperienceCardDefaults.priceCurrencyPrefix,
    experienceCardPriceSuffix: lodgeSoqtapataExperienceCardDefaults.perPersonLabel,
    bookingDetailRowLabels: {
      shortestProgram: lodgeSoqtapataBook.rows.find((r) => r.rowKey === 'shortestProgram')?.label,
      startingFrom: lodgeSoqtapataBook.rows.find((r) => r.rowKey === 'startingFrom')?.label,
      groupSize: lodgeSoqtapataBook.rows.find((r) => r.rowKey === 'groupSize')?.label,
      availability: lodgeSoqtapataBook.rows.find((r) => r.rowKey === 'availability')?.label,
    },
  }

  if (mainImage) doc.mainImage = mainImage

  return doc
}

function buildLodgePageDoc(includeExperience: boolean) {
  const snapshotKeys = ['rooms', 'max-guests', 'from-cusco', 'altitude', 'ecosystem', 'bcorp'] as const
  return {
    _type: 'lodgePage',
    _id: LODGE_PAGE_DOCUMENT_ID,
    internalTitle: 'Soqtapata Lodge — landing',
    slug: { _type: 'slug', current: 'soqtapata-lodge' },
    lodge: { _type: 'reference', _ref: LODGE_DOCUMENT_ID },
    seo: {
      _type: 'seo' as const,
      title: lodgeSoqtapataSeoDefault.title,
      description: lodgeSoqtapataSeoDefault.description,
    },
    heroHighlights: [
      { _key: 'hh-1', _type: 'lodgeSnapshotKeyPick', key: 'rooms' },
      { _key: 'hh-2', _type: 'lodgeSnapshotKeyPick', key: 'max-guests' },
      { _key: 'hh-3', _type: 'lodgeSnapshotKeyPick', key: 'from-cusco' },
    ],
    heroCTA: {
      _type: 'linkWithLabel',
      label: lodgeSoqtapataHero.primaryCta.label,
      href: lodgeSoqtapataHero.primaryCta.href,
      openInNewTab: false,
    },
    snapshotSelection: snapshotKeys.map((key, i) => ({
      _key: `ss-${i}`,
      _type: 'lodgeSnapshotKeyPick',
      key,
    })),
    navTitle: lodgeSoqtapataPageNav.title,
    navSubtitle: lodgeSoqtapataPageNav.subtitle,
    navCTA: {
      _type: 'linkWithLabel',
      label: lodgeSoqtapataPageNav.cta.label,
      href: lodgeSoqtapataPageNav.cta.href,
      openInNewTab: false,
    },
    featuredRoomStableId: 'private-cottage',
    experiencesSelection: includeExperience
      ? [{ _key: 'sel-exp-1', _type: 'reference' as const, _ref: EXPERIENCE_SOQTAPATA_ID }]
      : [],
    fallbackToLodgeRelations: true,
    reviewsSelection: [],
    reviewsPresentation: {
      sourceLabel: lodgeSoqtapataReviewsSectionDefaults.sourceLabel,
      averageRating: lodgeSoqtapataReviewsSectionDefaults.averageRating,
      secondaryRatingLine: lodgeSoqtapataReviewsSectionDefaults.secondaryRatingLine,
      carouselEndLabel: lodgeSoqtapataReviewsSectionDefaults.carouselEndLabel,
      carouselEndHref: lodgeSoqtapataReviewsSectionDefaults.carouselEndHref,
      emptyMessage: lodgeSoqtapataReviewsSectionDefaults.emptyMessage,
    },
    bookingCta: {
      _type: 'lodgePageBookingBlock' as const,
      title: lodgeSoqtapataBook.cardTitle,
      body: lodgeSoqtapataBook.body,
      ctas: [
        {
          _key: 'bcta-1',
          _type: 'linkWithLabel',
          label: lodgeSoqtapataBook.primaryCta.label,
          href: lodgeSoqtapataBook.primaryCta.href,
          openInNewTab: false,
        },
        {
          _key: 'bcta-2',
          _type: 'linkWithLabel',
          label: lodgeSoqtapataBook.secondaryCta.label,
          href: lodgeSoqtapataBook.secondaryCta.href,
          openInNewTab: true,
        },
      ],
    },
  }
}

async function main() {
  assertConfirm()
  const client = writeClient()
  const imgCache = new Map<string, UploadedSanityImage>()

  const expOk = await client.fetch<boolean>(`defined(*[_id == $id][0]._id)`, {
    id: EXPERIENCE_SOQTAPATA_ID,
  })
  if (!expOk) {
    console.warn(
      `[seed] Experience ${EXPERIENCE_SOQTAPATA_ID} not found — lodge.experiences and lodgePage.experiencesSelection will be empty (run experience seed first if you need the link).`,
    )
  }

  console.log('Building lodge document (image uploads may take a minute)…')
  const lodgeDoc = await buildLodgeDoc(client, imgCache, expOk)

  console.log('Building lodgePage document…')
  const lodgePageDoc = buildLodgePageDoc(expOk)

  await client.createOrReplace(lodgeDoc as Parameters<SanityClient['createOrReplace']>[0])
  console.log(`createOrReplace OK: lodge _id=${LODGE_DOCUMENT_ID}`)

  await client.createOrReplace(lodgePageDoc as Parameters<SanityClient['createOrReplace']>[0])
  console.log(`createOrReplace OK: lodgePage _id=${LODGE_PAGE_DOCUMENT_ID}`)

  const verify = await client.fetch<{
    name: string | null
    nRooms: number | null
    nFaqs: number | null
    nAmenities: number | null
    nGallery: number | null
    nCommon: number | null
    nSnap: number | null
  }>(
    /* groq */ `*[_id == $id][0]{
      name,
      "nRooms": count(rooms),
      "nFaqs": count(faqs),
      "nAmenities": count(amenities),
      "nGallery": count(gallery),
      "nCommon": count(commonAreas),
      "nSnap": count(snapshotItems)
    }`,
    { id: LODGE_DOCUMENT_ID },
  )
  if (!verify) {
    console.warn('[seed] No se pudo re-leer el lodge tras createOrReplace (revisa dataset / permisos).')
  } else {
    console.log('\nVerificación en dataset (lodge):', verify)
  }

  const pageRef = await client.fetch<{ lodgeRef: string | null } | null>(
    /* groq */ `*[_id == $id][0]{ "lodgeRef": lodge._ref }`,
    { id: LODGE_PAGE_DOCUMENT_ID },
  )
  console.log('Verificación lodgePage → lodge._ref:', pageRef?.lodgeRef ?? '(null)')

  console.log('\nDone. En Studio: Content library → Lodges → Soqtapata Lodge (campos rellenos).')
  console.log('Lodge Page → pestañas Overview / Accommodation → Fuente y Vista previa deben mostrar datos.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
