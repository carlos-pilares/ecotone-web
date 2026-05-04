import { cache } from 'react'

import {
  formatCommonAreaGalleryAltFallback,
  formatLodgeBookGroupSizeValue,
  formatLodgeBookStartingFromValue,
  formatLodgeRoomMetaLine,
  lodgeSoqtapataExperienceCardDefaults,
  lodgeSoqtapataReviewsSectionDefaults,
  lodgeSoqtapataRoomListDefaults,
  resolveProgramTypeLabel,
  resolveRouteLabel,
} from '@/data/lodgeSoqtapataResolverDefaults'
import {
  lodgeSoqtapataBook,
  type LodgeBookCtaData,
  lodgeSoqtapataExperiences,
  lodgeSoqtapataFacilities,
  lodgeSoqtapataFaq,
  lodgeSoqtapataFeaturedQuotes,
  lodgeSoqtapataHero,
  lodgeSoqtapataLocation,
  lodgeSoqtapataOverview,
  lodgeSoqtapataPageNav,
  lodgeSoqtapataResearch,
  lodgeSoqtapataReviewCards,
  lodgeSoqtapataRooms,
  lodgeSoqtapataSnapshot,
  type LodgeExperienceCard,
  type LodgeFacilitiesData,
  type LodgeGalleryPhoto,
  type LodgePrimaryPhoto,
  type LodgeResearchPillar,
  type LodgeResearchStat,
  type LodgeBookRowKey,
  type LodgeRoomCard,
  type LodgeSnapshotItem,
  type LodgeStripPhoto,
} from '@/data/lodgeSoqtapataStatic'
import { lodgeStructuredPageBySlugQuery } from '@/lib/queries'
import {
  LODGE_SOQTAPATA_PAGE_SLUG,
  lodgeSoqtapataSeoDefault,
  type LodgeCmsExperienceCardRow,
  type LodgeCommonAreaRow,
  type LodgeDocumentRow,
  type LodgeGalleryItemRow,
  type LodgeJourneyStepRow,
  type LodgePageReviewsPresentationRow,
  type LodgePageSectionCopyRow,
  type LodgePageSectionsRow,
  type LodgeRoomGalleryItemRow,
  type LodgeRoomRow,
  type LodgeSnapshotItemRow,
  type LodgeReviewsSectionResolved,
  type LodgeStructuredPageRow,
  type LodgeStaticBundle,
  type LodgePageResolvedPayload,
} from '@/lib/lodgePageCmsTypes'
import {
  createLodgePageCmsSanityClient,
  logLodgePageCmsDiagnosis,
} from '@/lib/lodgePageCmsSanityPerspective'
import { resolveSmartLinkOrLegacy } from '@/lib/resolveSmartLink'
import { cdnImageUrl } from '@/lib/sanity'
import type { ReviewDoc } from '@/lib/queries'

import type { LodgeAmenityIconId, LodgeSectionHeaderFields } from '@/data/lodgeSoqtapataStatic'

const AMENITY_IDS: LodgeAmenityIconId[] = [
  'meals',
  'guide',
  'transport',
  'boots',
  'flask',
  'wifi',
  'shield',
  'book',
  'droplet',
]

const SNAPSHOT_ICONS: LodgeSnapshotItem['iconId'][] = [
  'home',
  'users',
  'clock',
  'compass',
  'shield',
  'bcorp',
]

function normalizeAmenityIcon(raw: string | null | undefined): LodgeAmenityIconId {
  if (raw && (AMENITY_IDS as string[]).includes(raw)) return raw as LodgeAmenityIconId
  return 'meals'
}

function cmsSnapshotToBarItem(item: LodgeSnapshotItemRow, index: number): LodgeSnapshotItem {
  const bcorp =
    item.key?.toLowerCase().includes('bcorp') ||
    item.label?.toLowerCase().includes('b corp') ||
    item.value?.toLowerCase().includes('b corp')
  return {
    snapN: item.value || '',
    snapL: item.label || '',
    iconId: SNAPSHOT_ICONS[index % SNAPSHOT_ICONS.length]!,
    ...(bcorp ? { bcorp: true as const } : {}),
  }
}

function resolveSnapshotBar(
  staticSnap: readonly LodgeSnapshotItem[],
  lodge: LodgeDocumentRow | undefined,
  selectionKeys: NonNullable<LodgeStructuredPageRow>['snapshotSelection'],
): LodgeSnapshotItem[] {
  const items = lodge?.snapshotItems
  if (!items?.length) return [...staticSnap]
  const byKey = new Map(items.filter((i) => i.key).map((i) => [i.key as string, i]))
  if (selectionKeys?.length) {
    const out: LodgeSnapshotItem[] = []
    for (const p of selectionKeys) {
      const k = p?.key
      if (!k) continue
      const row = byKey.get(k)
      if (row) out.push(cmsSnapshotToBarItem(row, out.length))
      if (out.length >= 6) break
    }
    if (out.length) return out
  }
  return items.map((it, i) => cmsSnapshotToBarItem(it, i)).slice(0, 6)
}

function galleryItemToPhoto(g: LodgeGalleryItemRow, width: number, fallback: string): LodgeGalleryPhoto {
  return {
    src: g.imageUrl || cdnImageUrl(g.image, width, fallback),
    alt: g.title || '',
    title: g.title || '',
    description: g.description || '',
  }
}

function roomGalleryItem(
  g: LodgeRoomGalleryItemRow,
  width: number,
  fallback: string,
): LodgeGalleryPhoto {
  return {
    src: g.imageUrl || cdnImageUrl(g.image, width, fallback),
    alt: g.title || '',
    title: g.title || '',
    description: g.description || '',
  }
}

function commonAreaToPrimary(p: LodgeCommonAreaRow, w: number): LodgePrimaryPhoto {
  return {
    image: p.imageUrl || cdnImageUrl(p.image, w, ''),
    imageAlt: p.title || '',
    label: p.title || '',
    sub: p.description || undefined,
  }
}

function commonAreaToStrip(p: LodgeCommonAreaRow): LodgeStripPhoto {
  return {
    image: p.imageUrl || cdnImageUrl(p.image, 400, ''),
    imageAlt: p.title || '',
    label: p.title || '',
  }
}

function mapRoomsFromLodge(
  rooms: LodgeRoomRow[] | undefined,
  featuredStableId: string | null | undefined,
): LodgeRoomCard[] | null {
  if (!rooms?.length) return null
  return rooms.map((r, idx) => {
    const first = r.gallery?.[0]
    const img = first?.imageUrl || cdnImageUrl(first?.image, 500, '')
    const galleryPhotos =
      r.gallery?.map((g, j) => roomGalleryItem(g, 1200, img || `https://placehold.co/1200?text=${j}`)) ?? []
    const units = r.numberOfRooms ?? 1
    const cap = r.capacity != null ? String(r.capacity) : '?'
    const featured =
      !!(featuredStableId && r.stableId === featuredStableId) || (idx === 0 && !featuredStableId)
    const name = r.name?.trim() || lodgeSoqtapataRoomListDefaults.imageAltFallback
    return {
      image: img || `https://placehold.co/500?text=${encodeURIComponent(name)}`,
      imageAlt: name,
      name,
      featured,
      ...(featured ? { badge: lodgeSoqtapataRoomListDefaults.featuredBadge } : {}),
      meta: formatLodgeRoomMetaLine(units, cap),
      chips: [...(r.highlights || [])],
      photosCta: lodgeSoqtapataRoomListDefaults.photosCta,
      galleryPhotos,
    }
  })
}

function mapExperienceToCard(e: LodgeCmsExperienceCardRow, lodge: LodgeDocumentRow): LodgeExperienceCard {
  const slug = e.slug || ''
  const href = slug
    ? `/experiences/${slug}`
    : lodgeSoqtapataExperienceCardDefaults.defaultExperienceHref
  const pricePrefix =
    sectionFieldTrim(lodge.experienceCardPricePrefix) ?? lodgeSoqtapataExperienceCardDefaults.priceCurrencyPrefix
  const priceSuffix =
    sectionFieldTrim(lodge.experienceCardPriceSuffix) ?? lodgeSoqtapataExperienceCardDefaults.perPersonLabel
  const footPrimary =
    e.priceLabel?.trim() ||
    (e.price != null && e.price > 0 ? `${pricePrefix}${e.price}` : lodgeSoqtapataExperienceCardDefaults.enquireLabel)
  return {
    image: e.mainImageUrl || cdnImageUrl(e.mainImage, 600, ''),
    imageAlt: e.name || '',
    typeLabel: resolveProgramTypeLabel(e.programType),
    duration: e.duration || '',
    route: resolveRouteLabel(e.route),
    name: e.name || '',
    description: e.shortDescription || e.tagline || '',
    footPrimary,
    footSecondary: e.price != null && e.price > 0 ? priceSuffix : undefined,
    href,
  }
}

/** Normaliza strings de Sanity (text/string) para overrides de sección. */
function sectionFieldTrim(v: unknown): string | undefined {
  if (v == null) return undefined
  const s = typeof v === 'string' ? v : typeof v === 'number' ? String(v) : ''
  const t = s.trim()
  return t || undefined
}

function applySectionCopy<T extends LodgeSectionHeaderFields & Record<string, unknown>>(
  base: T,
  o: LodgePageSectionCopyRow | null | undefined,
): T {
  if (!o) return base
  const eyebrow = sectionFieldTrim(o.eyebrow)
  const title = sectionFieldTrim(o.title)
  const body = sectionFieldTrim(o.body)
  return {
    ...base,
    ...(eyebrow ? { eyebrow } : {}),
    ...(title ? { title } : {}),
    ...(body ? { body } : {}),
  }
}

function resolveReviewsSection(
  sec: LodgePageSectionsRow | null | undefined,
  presentation: LodgePageReviewsPresentationRow | null | undefined,
): LodgeReviewsSectionResolved {
  const d = lodgeSoqtapataReviewsSectionDefaults
  const p = presentation && typeof presentation === 'object' ? presentation : null
  return {
    ...d,
    eyebrow: sectionFieldTrim(sec?.reviews?.eyebrow) ?? d.eyebrow,
    headline: sectionFieldTrim(sec?.reviews?.title) ?? d.headline,
    sectionLead: sectionFieldTrim(sec?.reviews?.body) ?? d.sectionLead,
    secondaryRatingLine: sectionFieldTrim(p?.secondaryRatingLine) ?? d.secondaryRatingLine,
    averageRating: sectionFieldTrim(p?.averageRating) ?? d.averageRating,
    sourceLabel: sectionFieldTrim(p?.sourceLabel) ?? d.sourceLabel,
    carouselEndLabel: sectionFieldTrim(p?.carouselEndLabel) ?? d.carouselEndLabel,
    carouselEndHref: sectionFieldTrim(p?.carouselEndHref) ?? d.carouselEndHref,
    emptyMessage: sectionFieldTrim(p?.emptyMessage) ?? d.emptyMessage,
  }
}

function resolveSeo(
  row: LodgeStructuredPageRow | null | undefined,
  lodge: LodgeDocumentRow,
): { title: string; description: string } {
  const d = lodgeSoqtapataSeoDefault
  if (row?.seo?.title?.trim()) {
    return {
      title: row.seo.title.trim(),
      description: (row.seo.description?.trim() || d.description).slice(0, 200),
    }
  }
  if (lodge.seo?.title?.trim()) {
    return {
      title: lodge.seo.title.trim(),
      description: (lodge.seo.description?.trim() || d.description).slice(0, 200),
    }
  }
  if (lodge.seoTitle?.trim()) {
    return {
      title: lodge.seoTitle.trim(),
      description: (lodge.seoDescription?.trim() || d.description).slice(0, 200),
    }
  }
  if (lodge.name?.trim()) {
    return {
      title: `${lodge.name} — Ecotone`,
      description: (lodge.shortDescription?.trim() || d.description).slice(0, 200),
    }
  }
  return { ...d }
}

function mergeLocationMapLabels(loc: LodgeStaticBundle['location'], lodge: LodgeDocumentRow): LodgeStaticBundle['location'] {
  const m = lodge.locationMapLabels
  if (!m) return loc
  const b = loc.mapLabels
  return {
    ...loc,
    mapLabels: {
      cuscoTitle: sectionFieldTrim(m.cuscoTitle) ?? b.cuscoTitle,
      cuscoSubtitle: sectionFieldTrim(m.cuscoSubtitle) ?? b.cuscoSubtitle,
      trailheadLabel: sectionFieldTrim(m.trailheadLabel) ?? b.trailheadLabel,
      walkHint: sectionFieldTrim(m.walkHint) ?? b.walkHint,
      lodgeTitle: sectionFieldTrim(m.lodgeTitle) ?? b.lodgeTitle,
      lodgeSubtitle: sectionFieldTrim(m.lodgeSubtitle) ?? b.lodgeSubtitle,
    },
  }
}

function applyBookingRowLabelsFromLodge(book: LodgeBookCtaData, lodge: LodgeDocumentRow): LodgeBookCtaData {
  const l = lodge.bookingDetailRowLabels
  if (!l) return book
  const byKey: Partial<Record<LodgeBookRowKey, string | undefined>> = {
    shortestProgram: sectionFieldTrim(l.shortestProgram),
    startingFrom: sectionFieldTrim(l.startingFrom),
    groupSize: sectionFieldTrim(l.groupSize),
    availability: sectionFieldTrim(l.availability),
  }
  return {
    ...book,
    rows: book.rows.map((row) => {
      const rk = row.rowKey
      if (!rk) return row
      const nl = byKey[rk]
      return nl ? { ...row, label: nl } : row
    }),
  }
}

function mergeFacilitiesFromCms(base: LodgeFacilitiesData, lodge: LodgeDocumentRow): LodgeFacilitiesData {
  const ca = lodge.commonAreas
  let primaryPhotos = [...base.primaryPhotos] as LodgePrimaryPhoto[]
  let stripPhotos = [...base.stripPhotos] as LodgeStripPhoto[]
  let commonAreasGallery = [...base.commonAreasGallery] as LodgeGalleryPhoto[]

  if (ca?.length) {
    commonAreasGallery = ca.map((c, i) => ({
      src: c.imageUrl || cdnImageUrl(c.image, 1200, ''),
      alt: c.title || formatCommonAreaGalleryAltFallback(i),
      title: c.title || '',
      description: c.description || '',
    }))
    if (ca.length >= 3) {
      primaryPhotos = ca.slice(0, 3).map((c) => commonAreaToPrimary(c, 800))
    }
    if (ca.length >= 6) {
      stripPhotos = ca.slice(3, 6).map(commonAreaToStrip)
    } else if (ca.length > 3) {
      const rest = ca.slice(3).map(commonAreaToStrip)
      stripPhotos = [...rest, ...stripPhotos].slice(0, 3)
    }
  }

  let amenities = [...base.amenities]
  if (lodge.amenities?.length) {
    amenities = lodge.amenities.map((a) => ({
      iconId: normalizeAmenityIcon(a.icon),
      title: a.title || '',
      sub: a.description || '',
    }))
  }

  if (stripPhotos.length >= 3) {
    const last = stripPhotos[2]!
    const fb = base.stripPhotos[2]
    if (fb && (last.moreCount == null || last.moreLabel == null)) {
      stripPhotos[2] = {
        ...last,
        moreCount: last.moreCount ?? fb.moreCount,
        moreLabel: last.moreLabel ?? fb.moreLabel,
      }
    }
  }

  if (stripPhotos.length >= 3) {
    const mCount = sectionFieldTrim(lodge.facilitiesStripMoreCount)
    const mLabel = sectionFieldTrim(lodge.facilitiesStripMoreLabel)
    if (mCount || mLabel) {
      const t = stripPhotos[2]!
      stripPhotos[2] = {
        ...t,
        ...(mCount ? { moreCount: mCount } : {}),
        ...(mLabel ? { moreLabel: mLabel } : {}),
      }
    }
  }

  return {
    ...base,
    primaryPhotos,
    stripPhotos,
    commonAreasGallery,
    amenities,
    amenitiesEyebrow: sectionFieldTrim(lodge.facilitiesAmenitiesEyebrow) ?? base.amenitiesEyebrow,
    galleryTileAriaLabelPrefix:
      sectionFieldTrim(lodge.facilitiesGalleryTileAriaPrefix) ?? base.galleryTileAriaLabelPrefix,
    galleryStripMoreAriaLabel:
      sectionFieldTrim(lodge.facilitiesGalleryStripMoreAriaLabel) ?? base.galleryStripMoreAriaLabel,
  }
}

function trustRowsFromCms(
  items: LodgeDocumentRow['trustItems'],
): LodgeBookCtaData['trustItems'] {
  const icons = ['shield', 'check', 'heart'] as const
  if (!items?.length) return [...lodgeSoqtapataBook.trustItems]
  return items.map((t, i) => ({
    icon: icons[i % icons.length]!,
    text: [t?.title, t?.subtitle].filter(Boolean).join(' · '),
  })) as LodgeBookCtaData['trustItems']
}

/** Bundle estático Soqtapata (fallback único por ahora). */
export function buildLodgeStaticFallbackBundle(): LodgeStaticBundle {
  return {
    hero: structuredClone(lodgeSoqtapataHero) as LodgeStaticBundle['hero'],
    pageNav: structuredClone(lodgeSoqtapataPageNav) as LodgeStaticBundle['pageNav'],
    snapshot: [...lodgeSoqtapataSnapshot],
    overview: structuredClone(lodgeSoqtapataOverview) as LodgeStaticBundle['overview'],
    rooms: structuredClone(lodgeSoqtapataRooms) as LodgeStaticBundle['rooms'],
    facilities: structuredClone(lodgeSoqtapataFacilities) as LodgeStaticBundle['facilities'],
    location: structuredClone(lodgeSoqtapataLocation) as LodgeStaticBundle['location'],
    research: structuredClone(lodgeSoqtapataResearch) as LodgeStaticBundle['research'],
    experiences: structuredClone(lodgeSoqtapataExperiences) as LodgeStaticBundle['experiences'],
    reviews: lodgeSoqtapataReviewCards.map((r) => ({ ...r })),
    faq: structuredClone(lodgeSoqtapataFaq) as LodgeStaticBundle['faq'],
    book: structuredClone(lodgeSoqtapataBook) as LodgeStaticBundle['book'],
    featuredQuotes: [...lodgeSoqtapataFeaturedQuotes],
  }
}

/**
 * Fusiona documentos Sanity (`lodge` + `lodgePage`) sobre el bundle estático.
 * Vacíos en CMS no pisan el fallback (salvo arrays sustituidos enteros cuando el CMS define lista).
 */
export function mergeLodgePageWithFallback(
  pageSlug: string,
  row: LodgeStructuredPageRow | null | undefined,
  bundle: LodgeStaticBundle,
  cmsError: string | null,
): LodgePageResolvedPayload {
  const out = structuredClone(bundle) as LodgeStaticBundle

  if (!row?.lodge) {
    return {
      source: 'fallback',
      cmsError,
      pageSlug,
      doc: null,
      seo: { ...lodgeSoqtapataSeoDefault },
      ...out,
      reviewsSection: resolveReviewsSection(row?.sections ?? null, row?.reviewsPresentation ?? null),
      meta: {
        featuredRoomStableId: null,
        usedCmsExperiences: false,
        usedCmsReviews: false,
      },
    }
  }

  const lodge = row.lodge
  const seo = resolveSeo(row, lodge)

  // Hero
  const heroImg = row.heroImage || lodge.mainImage
  const heroBaseSrc = cdnImageUrl(heroImg, 1600, lodge.mainImageUrl || out.hero.imageSrc)
  out.hero = {
    ...out.hero,
    ...(lodge.name?.trim() ? { title: lodge.name.trim() } : {}),
    ...(lodge.shortDescription?.trim() ? { tagline: lodge.shortDescription.trim() } : {}),
    imageSrc: heroBaseSrc,
    ...(() => {
      const fb = out.hero.primaryCta
      const leg = row.heroCTA
      const hasLeg = Boolean(leg?.label?.trim() && leg?.href?.trim())
      const hasSmart = Boolean(row.heroCtaSmartLink?.label?.trim())
      if (!hasSmart && !hasLeg) return {}
      const r = resolveSmartLinkOrLegacy(
        row.heroCtaSmartLink,
        hasLeg ? leg : undefined,
        { label: fb.label, href: fb.href, openInNewTab: leg?.openInNewTab === true },
      )
      return { primaryCta: { label: r.label, href: r.href } }
    })(),
    ...(lodge.certifications?.length
      ? { badges: lodge.certifications.map((c) => c.label!).filter(Boolean) }
      : {}),
    ...(lodge.gallery?.length
      ? {
          gallery: lodge.gallery.map((g, i) =>
            galleryItemToPhoto(g, 1400, heroBaseSrc || `https://placehold.co/1400?text=${i}`),
          ),
        }
      : {}),
  } as LodgeStaticBundle['hero']
  const heroAria = sectionFieldTrim(lodge.heroGalleryOpenAriaLabel)
  if (heroAria) {
    out.hero = { ...out.hero, galleryOpenAriaLabel: heroAria }
  }

  // Page nav
  out.pageNav = {
    ...out.pageNav,
    ...(row.navTitle?.trim() ? { title: row.navTitle.trim() } : {}),
    ...(row.navSubtitle?.trim()
      ? { subtitle: row.navSubtitle.trim() }
      : lodge.location || lodge.altitude != null
        ? {
            subtitle: [lodge.location, lodge.altitude != null ? `${lodge.altitude} m` : '']
              .filter(Boolean)
              .join(' · '),
          }
        : {}),
    ...(() => {
      const fb = out.pageNav.cta
      const leg = row.navCTA
      const hasLeg = Boolean(leg?.label?.trim() && leg?.href?.trim())
      const hasSmart = Boolean(row.navCtaSmartLink?.label?.trim())
      if (!hasSmart && !hasLeg) return {}
      const r = resolveSmartLinkOrLegacy(
        row.navCtaSmartLink,
        hasLeg ? leg : undefined,
        { label: fb.label, href: fb.href, openInNewTab: leg?.openInNewTab === true },
      )
      return { cta: { label: r.label, href: r.href } }
    })(),
  }

  out.snapshot = resolveSnapshotBar(out.snapshot, lodge, row.snapshotSelection)

  // Overview
  out.overview = {
    ...out.overview,
    ...(lodge.longDescription?.trim() ? { body: lodge.longDescription.trim() } : {}),
    ...(lodge.keyElements?.length ? { highlights: lodge.keyElements } : {}),
  }

  // Rooms
  const mappedRooms = mapRoomsFromLodge(lodge.rooms ?? undefined, row.featuredRoomStableId)
  if (mappedRooms) {
    out.rooms = { ...out.rooms, rooms: mappedRooms }
  }

  // Facilities
  out.facilities = mergeFacilitiesFromCms(out.facilities, lodge)

  // Location
  if (lodge.journeySteps?.length) {
    out.location = {
      ...out.location,
      journeySteps: lodge.journeySteps.map((s: LodgeJourneyStepRow, i: number) => ({
        time: s.title || `Step ${i + 1}`,
        text: s.description || '',
        highlight: i === lodge.journeySteps!.length - 1,
      })),
    }
  }
  out.location = mergeLocationMapLabels(out.location, lodge)
  if (lodge.bookingMessage?.trim()) {
    out.book = { ...out.book, body: lodge.bookingMessage.trim() }
  }

  // Research
  let stats: LodgeResearchStat[] = [...out.research.stats]
  if (lodge.highlights?.length) {
    stats = lodge.highlights.map((h) => ({
      value: h.title || '',
      label: h.subtitle || '',
    }))
  }
  let pillars: LodgeResearchPillar[] = [...out.research.pillars]
  if (lodge.researchAreas?.length) {
    pillars = lodge.researchAreas.map((a) => ({
      title: a.title || '',
      body: a.description || '',
    }))
  }
  let footnote = out.research.footnote
  if (lodge.specialMessage?.trim()) footnote = lodge.specialMessage.trim()
  out.research = { ...out.research, stats, pillars, footnote }

  // Experiences
  let expRows = row.experiencesSelection
  const useLodgeExp =
    (!expRows || expRows.length === 0) && row.fallbackToLodgeRelations !== false && lodge.experiences?.length
  if (useLodgeExp) expRows = lodge.experiences
  let usedCmsExperiences = false
  if (expRows?.length) {
    out.experiences = {
      ...out.experiences,
      cards: expRows.map((e) => mapExperienceToCard(e, lodge)),
    }
    usedCmsExperiences = true
  }
  const exCta = sectionFieldTrim(lodge.experienceCardCtaLabel)
  if (exCta) {
    out.experiences = { ...out.experiences, programCardCtaLabel: exCta }
  }

  // Reviews
  let reviews: ReviewDoc[] = out.reviews
  let usedCmsReviews = false
  if (row.reviewsSelection?.length) {
    reviews = row.reviewsSelection.map((r) => ({ ...r, _id: r._id || 'rev' }))
    usedCmsReviews = true
  } else if (lodge.reviews?.length) {
    reviews = lodge.reviews.map((r) => ({ ...r, _id: r._id || 'rev' }))
    usedCmsReviews = true
  }
  out.reviews = reviews

  // FAQ
  if (lodge.faqs?.length) {
    out.faq = {
      ...out.faq,
      items: lodge.faqs.map((f, i) => ({
        id: `lodge-cms-faq-${i}`,
        question: f.question || '',
        answer: f.answer || '',
      })),
    } as unknown as LodgeStaticBundle['faq']
  }

  // Booking block
  out.book = { ...out.book }
  if (lodge.startingPrice != null && lodge.startingPrice > 0) {
    const cur = lodge.currency || 'USD'
    out.book.rows = out.book.rows.map((r) =>
      r.rowKey === 'startingFrom'
        ? {
            ...r,
            value: formatLodgeBookStartingFromValue(cur, lodge.startingPrice!),
            valueAccent: true,
          }
        : r,
    )
  }
  if (lodge.maxGroupSize != null) {
    out.book.rows = out.book.rows.map((r) =>
      r.rowKey === 'groupSize' ? { ...r, value: formatLodgeBookGroupSizeValue(lodge.maxGroupSize!) } : r,
    )
  }
  if (lodge.availabilityNote?.trim()) {
    out.book.rows = out.book.rows.map((r) =>
      r.rowKey === 'availability' ? { ...r, value: lodge.availabilityNote!.trim() } : r,
    )
  }
  if (lodge.trustItems?.length) {
    out.book.trustItems = trustRowsFromCms(lodge.trustItems)
  }
  if (row.bookingCta?.title?.trim()) out.book.cardTitle = row.bookingCta.title.trim()
  if (row.bookingCta?.body?.trim()) out.book.body = row.bookingCta.body.trim()
  if (
    row.bookingCta &&
    (row.bookingCta.ctas?.length ||
      row.bookingCta.bookingPrimarySmartLink?.label?.trim() ||
      row.bookingCta.bookingSecondarySmartLink?.label?.trim())
  ) {
    const fbP = out.book.primaryCta
    const fbS = out.book.secondaryCta
    const a = row.bookingCta.ctas?.[0]
    const b = row.bookingCta.ctas?.[1]
    const r1 = resolveSmartLinkOrLegacy(row.bookingCta.bookingPrimarySmartLink, a, {
      label: fbP.label,
      href: fbP.href,
      openInNewTab: a?.openInNewTab === true,
    })
    const r2 = resolveSmartLinkOrLegacy(row.bookingCta.bookingSecondarySmartLink, b, {
      label: fbS.label,
      href: fbS.href,
      openInNewTab: b?.openInNewTab === true,
    })
    out.book.primaryCta = { label: r1.label, href: r1.href }
    out.book.secondaryCta = { label: r2.label, href: r2.href }
  }
  if (row.bookingCta?.trustItemsOverride?.length) {
    out.book.trustItems = trustRowsFromCms(row.bookingCta.trustItemsOverride)
  }
  out.book = applyBookingRowLabelsFromLodge(out.book, lodge)

  // Section copy overrides (lodgePage)
  const sec = row.sections
  if (sec) {
    out.overview = applySectionCopy(out.overview, sec.overview)
    out.rooms = applySectionCopy(out.rooms, sec.accommodation)
    out.facilities = applySectionCopy(out.facilities, sec.facilities)
    out.location = applySectionCopy(out.location, sec.location)
    out.research = applySectionCopy(out.research, sec.research)
    out.experiences = applySectionCopy(out.experiences, sec.experiences)
    const faqEyebrow = sectionFieldTrim(sec.faq?.eyebrow)
    const faqTitle = sectionFieldTrim(sec.faq?.title)
    const faqBody = sectionFieldTrim(sec.faq?.body)
    out.faq = {
      ...out.faq,
      ...(faqEyebrow ? { eyebrow: faqEyebrow } : {}),
      ...(faqTitle ? { h2: faqTitle } : {}),
      ...(faqBody ? { lead: faqBody } : {}),
    } as unknown as LodgeStaticBundle['faq']
    out.book = applySectionCopy(out.book, sec.booking)
  }

  const reviewsSection = resolveReviewsSection(sec, row.reviewsPresentation ?? null)

  return {
    source: 'cms',
    cmsError,
    pageSlug,
    doc: {
      lodgePageId: row._id,
      lodgeId: lodge._id,
    },
    seo,
    ...out,
    reviewsSection,
    meta: {
      featuredRoomStableId: row.featuredRoomStableId,
      usedCmsExperiences,
      usedCmsReviews,
    },
  }
}

/**
 * Carga `lodgePage` por slug y fusiona con fallback estático Soqtapata.
 * Sin variables Sanity, sin documento o con error de red → fallback puro.
 */
export const getLodgePageCms = cache(async (slug: string) => {
  const bundle = buildLodgeStaticFallbackBundle()

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return mergeLodgePageWithFallback(slug, null, bundle, null)
  }

  let row: LodgeStructuredPageRow = null
  let cmsError: string | null = null
  const { client: sanityFetchClient, meta: sanityFetchMeta } = createLodgePageCmsSanityClient()
  try {
    row = await sanityFetchClient.fetch<LodgeStructuredPageRow | null>(lodgeStructuredPageBySlugQuery, { slug })
  } catch (e) {
    cmsError = e instanceof Error ? e.message : 'Sanity fetch failed'
  }

  const merged = mergeLodgePageWithFallback(slug, row, bundle, cmsError)

  logLodgePageCmsDiagnosis({ slug, meta: sanityFetchMeta, row, cmsError, merged })

  return merged
})

/** Atajo para la única landing lodge implementada hoy. */
export const getSoqtapataLodgePageCms = cache(async () =>
  getLodgePageCms(LODGE_SOQTAPATA_PAGE_SLUG),
)
