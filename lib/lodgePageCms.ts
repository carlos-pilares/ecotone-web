import { cache } from 'react'

import {
  LODGE_NAV_ID_TO_VISIBILITY_KEY,
  LODGE_PAGE_SECTION_VISIBILITY_DEFAULT,
  resolveLodgePageSectionVisibility,
  type LodgePageSectionVisibility,
} from '@/lib/lodgePageSectionVisibility'

import { toExperienceCardData, type ExperienceCardData } from '@/lib/experienceCardData'
import { resolveTailorMadeBand } from '@/lib/tailorMadeBand'
import { DEFAULT_WHATSAPP_URL } from '@/data/cmsApproved/siteSettingsApprovedContent'
import {
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
  type LodgeBreadcrumbItem,
  type LodgeExperienceCard,
  type LodgeExperiencesTailor,
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
import { lodgeStructuredPageBySlugQuery, lodgePageSlugsQuery } from '@/lib/queries'
import {
  LODGE_SOQTAPATA_PAGE_SLUG,
  lodgeSoqtapataSeoDefault,
  type LodgeCmsExperienceCardRow,
  type LodgeDocumentRow,
  type LodgeFacilitiesAmenitySelectionPickRow,
  type LodgeFacilitiesGallerySelectionPickRow,
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
import {
  enrichSmartLinkWithLabelFallback,
  resolveExperiencePublicHref,
} from '@/lib/resolveExperiencePublicHref'
import { getLodgeReserveLowestUsd, buildReserveRowsForLodge } from '@/lib/reserveCtaPricing'
import { formatLodgeAltitudeForSubtitle } from '@/lib/lodgeAltitudeDisplay'
import { resolveReserveCtaCard } from '@/lib/resolveReserveCtaCard'
import { resolveSmartLinkOrLegacy, smartLinkIsDisabled } from '@/lib/resolveSmartLink'
import { resolveHeroGalleryRows } from '@/lib/lodgeGalleryResolve'
import { cdnImageUrl } from '@/lib/sanity'
import type { ReviewDoc } from '@/lib/queries'
import { buildRotatingQuoteItemsFromReviews } from '@/lib/reviewQuoteItems'
import { normalizeReviewsRatingSummary } from '@/lib/reviewsRatingSummary'

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

function resolveHeroHighlightBadges(
  highlights: Array<{ text?: string | null; key?: string | null } | null> | null | undefined,
  lodge: LodgeDocumentRow,
): string[] | null {
  if (!highlights?.length) return null
  const out: string[] = []
  for (const h of highlights) {
    if (!h) continue
    const text = typeof h.text === 'string' ? h.text.trim() : ''
    if (text) {
      out.push(text)
      if (out.length >= 3) break
      continue
    }
    const legacyKey = typeof h.key === 'string' ? h.key.trim() : ''
    if (!legacyKey) continue
    const snap = lodge.snapshotItems?.find((s) => (s.key ?? '').trim() === legacyKey)
    if (snap) {
      const line = [snap.value?.trim(), snap.label?.trim()].filter(Boolean).join(' · ')
      out.push(line || legacyKey)
    } else {
      out.push(legacyKey)
    }
    if (out.length >= 3) break
  }
  const sliced = out.filter(Boolean).slice(0, 3)
  return sliced.length ? sliced : null
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
  highlightLines: NonNullable<LodgeStructuredPageRow>['highlightLines'],
): LodgeSnapshotItem[] {
  if (highlightLines?.length) {
    const out: LodgeSnapshotItem[] = []
    for (const line of highlightLines) {
      const title = sectionFieldTrim(line?.title)
      if (!title) continue
      const subtitle = sectionFieldTrim(line?.subtitle) ?? ''
      out.push({
        snapN: title,
        snapL: subtitle,
        iconId: SNAPSHOT_ICONS[out.length % SNAPSHOT_ICONS.length]!,
      })
      if (out.length >= 6) break
    }
    if (out.length) return out
  }
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

function gallerySection(g: LodgeGalleryItemRow): 'hero' | 'accommodation' | 'commonAreas' | '' {
  const pc = g.photoCategory?.trim()
  if (pc === 'hero' || pc === 'accommodation' || pc === 'commonAreasAmenities' || pc === 'other') {
    if (pc === 'other') return ''
    return pc === 'commonAreasAmenities' ? 'commonAreas' : pc
  }
  const usage = g.usageSection?.trim()
  if (usage === 'hero' || usage === 'accommodation' || usage === 'commonAreas' || usage === 'commonAreasAmenities') {
    return usage === 'commonAreasAmenities' ? 'commonAreas' : usage
  }
  if (usage === 'other') return ''
  const legacy = g.category?.trim()
  if (legacy === 'room' || legacy === 'accommodation') return 'accommodation'
  if (legacy === 'common' || legacy === 'commonArea') return 'commonAreas'
  if (legacy === 'hero') return 'hero'
  return ''
}

/** @internal Dedupe merged accommodation pools (stable-key row vs keyed row). */
function galleryRowDedupeKey(g: LodgeGalleryItemRow): string {
  const sk = g.stableKey?.trim()
  if (sk) return `sk:${sk}`
  const rowKey = g._key?.trim()
  if (rowKey) return `row:${rowKey}`
  const assetRef =
    g.image && typeof g.image === 'object' && 'asset' in g.image && g.image.asset && typeof g.image.asset === 'object'
      ? (g.image.asset as { _ref?: string })._ref
      : undefined
  if (assetRef) return `asset:${assetRef}`
  return `u:${g.imageUrl ?? ''}:${g.title ?? ''}`
}

function buildGalleryByStableKey(gallery: LodgeGalleryItemRow[] | null | undefined): Map<string, LodgeGalleryItemRow> {
  const m = new Map<string, LodgeGalleryItemRow>()
  for (const g of gallery ?? []) {
    const k = g.stableKey?.trim()
    if (k) m.set(k, g)
  }
  return m
}

function roomIdForGalleryItem(g: LodgeGalleryItemRow): string {
  return g.roomStableId?.trim() || g.relatedRoomStableId?.trim() || ''
}

function galleryItemToPhoto(g: LodgeGalleryItemRow, width: number, fallback: string): LodgeGalleryPhoto {
  const alt = (g.altText ?? g.alt ?? g.title ?? '').trim()
  const caption = (g.caption ?? g.description ?? '').trim()
  return {
    src: g.imageUrl || cdnImageUrl(g.image, width, fallback),
    alt: alt || g.title || '',
    title: g.title || '',
    description: caption,
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

function mapRoomsFromLodge(
  rooms: LodgeRoomRow[] | undefined,
  featuredStableId: string | null | undefined,
  masterGallery: LodgeGalleryItemRow[] | null | undefined,
): LodgeRoomCard[] | null {
  if (!rooms?.length) return null
  const byKey = buildGalleryByStableKey(masterGallery)
  const accommodationPool = (masterGallery ?? []).filter((g) => gallerySection(g) === 'accommodation')
  return rooms.map((r, idx) => {
    let galleryPhotos: LodgeGalleryPhoto[] = []
    const roomStableId = r.stableId?.trim() || ''

    const roomKey = r._key?.trim() || ''

    // Global gallery: accommodation photos linked by `accommodationRoomKey` (row `_key`) and/or legacy stable IDs on the photo.
    if (roomStableId || roomKey) {
      const dedupe = new Set<string>()
      const matched: LodgeGalleryItemRow[] = []
      for (const g of accommodationPool) {
        const matchByRoomKey = Boolean(roomKey) && g.accommodationRoomKey?.trim() === roomKey
        const matchByStable = Boolean(roomStableId) && roomIdForGalleryItem(g) === roomStableId
        if (!matchByRoomKey && !matchByStable) continue
        const dk = galleryRowDedupeKey(g)
        if (dedupe.has(dk)) continue
        dedupe.add(dk)
        matched.push(g)
      }
      let firstSrc = ''
      for (const g of matched) {
        if (!firstSrc) firstSrc = g.imageUrl || cdnImageUrl(g.image, 500, '') || ''
        galleryPhotos.push(
          galleryItemToPhoto(g, 1200, firstSrc || `https://placehold.co/1200?text=${galleryPhotos.length}`),
        )
      }
    }

    // Legacy fallback 1: explicit picks by stable key.
    if (!galleryPhotos.length) {
      const picks = r.galleryItemKeys
      if (Array.isArray(picks) && picks.length > 0) {
        let firstSrc = ''
        for (const p of picks) {
          const key = p?.galleryStableKey?.trim()
          if (!key) continue
          const g = byKey.get(key)
          if (!g) continue
          if (!firstSrc) firstSrc = g.imageUrl || cdnImageUrl(g.image, 500, '') || ''
          galleryPhotos.push(
            galleryItemToPhoto(g, 1200, firstSrc || `https://placehold.co/1200?text=${galleryPhotos.length}`),
          )
        }
      }
    }

    // Legacy fallback 2: room-local uploaded gallery.
    if (!galleryPhotos.length && r.gallery?.length) {
      const firstLegacy = r.gallery[0]
      const legImg = firstLegacy?.imageUrl || cdnImageUrl(firstLegacy?.image, 500, '')
      galleryPhotos = r.gallery.map((g, j) =>
        roomGalleryItem(g, 1200, legImg || `https://placehold.co/1200?text=${j}`),
      )
    }
    const coverSrc =
      galleryPhotos[0]?.src ||
      (() => {
        const fr = r.gallery?.[0]
        return fr ? fr.imageUrl || cdnImageUrl(fr.image, 500, '') || '' : ''
      })()
    const units = r.numberOfRooms ?? 1
    const cap = r.capacity != null ? String(r.capacity) : '?'
    const featured =
      !!(featuredStableId && r.stableId === featuredStableId) || (idx === 0 && !featuredStableId)
    const name = r.name?.trim() || lodgeSoqtapataRoomListDefaults.imageAltFallback
    return {
      image: coverSrc || `https://placehold.co/500?text=${encodeURIComponent(name)}`,
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

function waDigitsFromDefaultSiteWhatsapp(): string {
  const m = DEFAULT_WHATSAPP_URL.match(/wa\.me\/(\d+)/)
  return m?.[1] ?? '51974781094'
}

function buildLodgeExperienceEnquireFallbackHref(lodge: LodgeDocumentRow, experienceName: string): string {
  const num = waDigitsFromDefaultSiteWhatsapp()
  const lodgeLine = lodge.name?.trim() || 'Ecotone'
  const expLine = experienceName.trim() || 'an experience'
  const text = `Hi! I'm interested in "${expLine}" at ${lodgeLine}. Could you share more information?`
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`
}

/** Banda Tailor Made en lodgePage — solo si `showTailorMade` / `enabled`; copy y CTA desde CMS. */
function resolveExperiencesTailorCta(
  row: LodgeStructuredPageRow | null | undefined,
): LodgeExperiencesTailor | undefined {
  if (!row) return undefined
  const fb = lodgeSoqtapataExperiences.tailor
  const resolved = resolveTailorMadeBand(
    row.experiencesTailorCta,
    {
      eyebrow: fb.kicker,
      title: fb.title,
      subtitle: fb.description,
      ctaLabel: fb.ctaLabel,
      href: lodgeSoqtapataBook.secondaryCta.href,
      openInNewTab: true,
    },
    {
      strict: true,
      ctaFallback: {
        ctaLabel: fb.ctaLabel,
        href: lodgeSoqtapataBook.secondaryCta.href,
        openInNewTab: true,
      },
    },
  )
  if (!resolved) return undefined
  return {
    kicker: resolved.eyebrow,
    title: resolved.title,
    description: resolved.subtitle,
    ctaLabel: resolved.ctaLabel,
    href: resolved.href,
    openInNewTab: resolved.openInNewTab,
    rel: resolved.rel,
    bookingModal: resolved.bookingModal,
    bookingSummary: resolved.bookingSummary,
  }
}

/** Lodge page lists `active` and `coming-soon` experiences linked to this lodge. */
function experienceDisplayableOnLodgePage(status: string | null | undefined): boolean {
  const s = typeof status === 'string' ? status.trim() : ''
  return s === 'active' || s === 'coming-soon' || s === ''
}

function pickDisplayableExperiences(
  rows: (LodgeCmsExperienceCardRow | null | undefined)[] | null | undefined,
): LodgeCmsExperienceCardRow[] {
  const seen = new Set<string>()
  const out: LodgeCmsExperienceCardRow[] = []
  for (const e of rows ?? []) {
    if (!e?._id || !experienceDisplayableOnLodgePage(e.status)) continue
    if (seen.has(e._id)) continue
    seen.add(e._id)
    out.push(e)
  }
  return out
}

/** Experiences for the lodge landing: KC → Lodges → `lodgePresentationRows[].lodge` only. */
function pickLinkedDisplayableExperiences(
  row: NonNullable<LodgeStructuredPageRow>,
): LodgeCmsExperienceCardRow[] {
  return pickDisplayableExperiences(row.linkedExperiencesFromPresentation)
}

function computeLodgeHeroReviewStats(reviews: ReviewDoc[] | null | undefined): {
  ratingScore: string
  reviewCountLabel: string
} {
  const list = reviews ?? []
  const n = list.length
  const ratings = list
    .map((r) => r.rating)
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0)
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null
  return {
    ratingScore: avg != null ? avg.toFixed(1) : '—',
    reviewCountLabel: `${n} ${n === 1 ? 'review' : 'reviews'}`,
  }
}

function buildLodgeHeroBreadcrumbs(lodge: LodgeDocumentRow): LodgeBreadcrumbItem[] {
  const crumbs: LodgeBreadcrumbItem[] = [{ href: '', label: 'Lodges' }]
  if (lodge.route?.trim()) {
    crumbs.push({ href: '', label: resolveRouteLabel(lodge.route) })
  }
  return crumbs
}

/** When CMS hero pills are empty, derive up to three labels from this lodge only (no static bundle). */
function resolveLodgeHeroBadgesFallback(lodge: LodgeDocumentRow): string[] {
  const out: string[] = []
  if (lodge.route?.trim()) {
    out.push(resolveRouteLabel(lodge.route))
  }
  for (const h of lodge.highlights ?? []) {
    const t = h?.title?.trim()
    if (t) {
      out.push(t)
      if (out.length >= 3) break
    }
  }
  for (const si of lodge.snapshotItems ?? []) {
    if (out.length >= 3) break
    const line = [si.value?.trim(), si.label?.trim()].filter(Boolean).join(' · ')
    if (line) out.push(line)
  }
  return out.slice(0, 3)
}

function mapExperienceToCard(
  e: LodgeCmsExperienceCardRow,
  lodge: LodgeDocumentRow,
): LodgeExperienceCard | null {
  const hasSellingPrice = e.price != null && e.price > 0
  const priceLabelRaw = e.priceLabel?.trim() ?? ''
  const priceLabelLooksPriced = /\d/.test(priceLabelRaw)
  const useExperienceHref = hasSellingPrice || priceLabelLooksPriced

  const experienceHref =
    resolveExperiencePublicHref({
      experienceLandingSlug: e.experienceLandingSlug,
      slug: e.slug,
    }) ?? lodgeSoqtapataExperienceCardDefaults.defaultExperienceHref
  const waFallback = buildLodgeExperienceEnquireFallbackHref(lodge, e.name || '')
  const enquireLabel = priceLabelRaw || (hasSellingPrice ? String(e.price) : 'Enquire')
  const enquireSmart = enrichSmartLinkWithLabelFallback(e.lodgeEnquireSmartLink, enquireLabel)
  const enquireDisabled = smartLinkIsDisabled(e.lodgeEnquireSmartLink)
  const href = useExperienceHref
    ? experienceHref
    : enquireDisabled
      ? experienceHref
      : enquireSmart
        ? (resolveSmartLinkOrLegacy(enquireSmart, undefined, {
            label: enquireLabel,
            href: waFallback,
            openInNewTab: true,
          })?.href ?? waFallback)
        : waFallback

  return toExperienceCardData(
    {
      name: e.name,
      mainImageUrl: e.mainImageUrl || cdnImageUrl(e.mainImage, 600, ''),
      programType: e.programType,
      route: e.route,
      routeSlug: e.routeSlug,
      routeLabel: e.routeLabel,
      shortDescription: e.shortDescription,
      price: e.price,
      priceLabel: e.priceLabel,
      experienceId: e._id,
      experienceLandingSlug: e.experienceLandingSlug,
      experienceSlug: e.slug,
    },
    { href },
  )
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
  pageRs: { eyebrow?: string | null; title?: string | null; body?: string | null } | null | undefined,
  presentation: LodgePageReviewsPresentationRow | null | undefined,
): LodgeReviewsSectionResolved {
  const d = lodgeSoqtapataReviewsSectionDefaults
  const pr = pageRs && typeof pageRs === 'object' ? pageRs : null
  const p = presentation && typeof presentation === 'object' ? presentation : null
  const eyebrow = sectionFieldTrim(pr?.eyebrow) ?? sectionFieldTrim(sec?.reviews?.eyebrow) ?? d.eyebrow
  const headline = sectionFieldTrim(pr?.title) ?? sectionFieldTrim(sec?.reviews?.title) ?? d.headline
  const sectionLead =
    sectionFieldTrim(pr?.body) ?? sectionFieldTrim(sec?.reviews?.body) ?? d.sectionLead ?? null
  return {
    eyebrow,
    headline,
    sectionLead,
    emptyMessage: sectionFieldTrim(p?.emptyMessage) ?? String(d.emptyMessage ?? ''),
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

/** Curated facilities gallery order from lodge page picks only (missing rows skipped). */
function resolveFacilitiesGalleryFromSelection(
  lodge: LodgeDocumentRow,
  selection: LodgeFacilitiesGallerySelectionPickRow[] | null | undefined,
): LodgeGalleryItemRow[] {
  const picks = (selection ?? []).filter(
    (p): p is LodgeFacilitiesGallerySelectionPickRow =>
      Boolean(p && (p.galleryRowKey?.trim() || p.galleryStableKey?.trim())),
  )
  if (!picks.length) return []
  const gallery = lodge.gallery ?? []
  const byRowKey = new Map(
    gallery
      .map((g) => {
        const k = g._key?.trim()
        return k ? ([k, g] as const) : null
      })
      .filter((e): e is [string, LodgeGalleryItemRow] => Boolean(e)),
  )
  const byStable = buildGalleryByStableKey(gallery)
  const out: LodgeGalleryItemRow[] = []
  for (const p of picks) {
    const rk = p.galleryRowKey?.trim()
    if (rk) {
      const g = byRowKey.get(rk)
      if (g) out.push(g)
      continue
    }
    const sk = p.galleryStableKey?.trim()
    if (sk) {
      const g = byStable.get(sk)
      if (g) out.push(g)
    }
  }
  return out
}

function galleryRowToPrimaryPhoto(g: LodgeGalleryItemRow): LodgePrimaryPhoto {
  const image = g.imageUrl || cdnImageUrl(g.image, 800, '')
  return {
    image,
    imageAlt: (g.altText ?? g.alt ?? g.title ?? '').trim(),
    label: g.title || '',
    sub: undefined,
  }
}

function galleryRowToStripPhoto(g: LodgeGalleryItemRow): LodgeStripPhoto {
  return {
    image: g.imageUrl || cdnImageUrl(g.image, 400, ''),
    imageAlt: (g.altText ?? g.alt ?? g.title ?? '').trim(),
    label: g.title || '',
  }
}

function mergeFacilitiesFromCms(
  base: LodgeFacilitiesData,
  lodge: LodgeDocumentRow,
  amenitiesSelection?: LodgeFacilitiesAmenitySelectionPickRow[] | null,
  gallerySelection?: LodgeFacilitiesGallerySelectionPickRow[] | null,
): LodgeFacilitiesData {
  const curated = resolveFacilitiesGalleryFromSelection(lodge, gallerySelection)
  let primaryPhotos = [...base.primaryPhotos] as LodgePrimaryPhoto[]
  let stripPhotos = [...base.stripPhotos] as LodgeStripPhoto[]
  let commonAreasGallery = [...base.commonAreasGallery] as LodgeGalleryPhoto[]

  // Lodge Page CMS: facilities visuals come only from explicit gallery row picks on the linked lodge.
  if (curated.length > 0) {
    commonAreasGallery = curated.map((g, i) =>
      galleryItemToPhoto(g, 1200, `https://placehold.co/1200?text=common-${i}`),
    )
    primaryPhotos = curated.slice(0, 3).map(galleryRowToPrimaryPhoto)
    const n = curated.length
    stripPhotos = []
    if (n > 3 && n <= 6) {
      stripPhotos = curated.slice(3, n).map(galleryRowToStripPhoto)
    } else if (n > 6) {
      const g3 = curated[3]!
      const g4 = curated[4]!
      const g5 = curated[5]!
      const extraPastSix = Math.max(0, n - 6)
      const defaultMore = extraPastSix > 0 ? `+${extraPastSix}` : undefined
      stripPhotos = [
        galleryRowToStripPhoto(g3),
        galleryRowToStripPhoto(g4),
        {
          ...galleryRowToStripPhoto(g5),
          moreCount: sectionFieldTrim(lodge.facilitiesStripMoreCount) ?? defaultMore,
          moreLabel:
            sectionFieldTrim(lodge.facilitiesStripMoreLabel) ??
            (defaultMore ? 'View all photos' : undefined),
        },
      ]
    }
  } else {
    primaryPhotos = []
    stripPhotos = []
    commonAreasGallery = []
  }

  let amenities = [...base.amenities]
  const lodgeAmenities = lodge.amenities ?? []
  if (lodgeAmenities.length) {
    const toItem = (a: (typeof lodgeAmenities)[number]) => ({
      iconId: normalizeAmenityIcon(a.icon),
      title: a.title || '',
      sub: a.description || '',
    })
    const allMapped = lodgeAmenities.map(toItem)
    const picks = (amenitiesSelection ?? []).filter(
      (p): p is LodgeFacilitiesAmenitySelectionPickRow =>
        Boolean(p && (p.amenityRowKey?.trim() || p.amenityIcon?.trim())),
    )

    if (picks.length > 0) {
      const byKey = new Map(
        lodgeAmenities
          .map((a) => {
            const k = a._key?.trim()
            return k ? ([k, a] as const) : null
          })
          .filter((e): e is [string, NonNullable<(typeof lodgeAmenities)[number]>] => Boolean(e)),
      )
      const ordered: typeof allMapped = []
      const usedLegacyIndices = new Set<number>()

      for (const pick of picks) {
        const rowKey = pick?.amenityRowKey?.trim()
        if (rowKey) {
          const row = byKey.get(rowKey)
          if (row) ordered.push(toItem(row))
          continue
        }
        const iconNeedle = pick?.amenityIcon?.trim()
        if (!iconNeedle) continue
        const needleNorm = normalizeAmenityIcon(iconNeedle)
        const idx = lodgeAmenities.findIndex(
          (a, i) => !usedLegacyIndices.has(i) && normalizeAmenityIcon(a.icon) === needleNorm,
        )
        if (idx >= 0) {
          usedLegacyIndices.add(idx)
          ordered.push(toItem(lodgeAmenities[idx]!))
        }
      }
      amenities = ordered.length > 0 ? ordered : allMapped
    } else {
      amenities = allMapped
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

function filterLodgePageNavByVisibility(
  bundle: LodgeStaticBundle,
  visibility: LodgePageSectionVisibility,
): void {
  bundle.pageNav = {
    ...bundle.pageNav,
    items: bundle.pageNav.items.filter((item) => {
      const key = LODGE_NAV_ID_TO_VISIBILITY_KEY[item.id]
      return !key || visibility[key]
    }),
  }
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
  const sectionVisibility = row
    ? resolveLodgePageSectionVisibility(row)
    : LODGE_PAGE_SECTION_VISIBILITY_DEFAULT

  if (!row?.lodge) {
    filterLodgePageNavByVisibility(out, sectionVisibility)
    return {
      sectionVisibility,
      source: 'fallback',
      cmsError,
      pageSlug,
      doc: null,
      seo: { ...lodgeSoqtapataSeoDefault },
      ...out,
      reviewsSection: resolveReviewsSection(
        row?.sections ?? null,
        row?.reviewsSection ?? null,
        row?.reviewsPresentation ?? null,
      ),
      reviewsRatingSummary: normalizeReviewsRatingSummary(row?.reviewsSettings ?? null),
      meta: {
        featuredRoomStableId: null,
        usedCmsExperiences: false,
        usedCmsReviews: false,
      },
    }
  }

  const lodge = row.lodge
  const seo = resolveSeo(row, lodge)
  const resolvedExperienceRows = pickLinkedDisplayableExperiences(row)

  const heroBadgePills = resolveHeroHighlightBadges(row.heroHighlights, lodge)

  // Hero — `mergeLodgePageWithFallback` starts from the Soqtapata static bundle; overwrite hero fields
  // so other lodge pages never inherit Soqtapata breadcrumbs, tagline, ratings, or dummy gallery.
  const heroRows = resolveHeroGalleryRows(lodge.gallery, row.heroGalleryOrderKeys)
  const galleryPhotos: LodgeGalleryPhoto[] = heroRows.map((g) => galleryItemToPhoto(g, 1400, ''))
  const heroBaseSrc =
    galleryPhotos[0]?.src?.trim() || cdnImageUrl(lodge.mainImage, 1600, '') || lodge.mainImageUrl?.trim() || ''
  const heroTitle = sectionFieldTrim(row.heroTitle) ?? lodge.name?.trim() ?? ''
  const heroTagline =
    sectionFieldTrim(row.heroShortDescription) ?? lodge.shortDescription?.trim() ?? ''
  const currentCrumbLabel = heroTitle || lodge.name?.trim() || 'Lodge'
  const reviewStats = computeLodgeHeroReviewStats(lodge.reviews)
  const expCount = resolvedExperienceRows.length
  const secondaryMeta = `${expCount} ${expCount === 1 ? 'experience' : 'experiences'}`

  const badgeList = heroBadgePills?.length
    ? heroBadgePills
    : lodge.certifications?.length
      ? lodge.certifications.map((c) => c.label!).filter(Boolean)
      : resolveLodgeHeroBadgesFallback(lodge)

  const heroCtaResolved = (() => {
    const fb = out.hero.primaryCta
    const leg = row.heroCTA
    const hasLeg = Boolean(leg?.label?.trim() && leg?.href?.trim())
    const hasSmart = Boolean(row.heroCtaSmartLink?.label?.trim())
    if (!hasSmart && !hasLeg) {
      return { primaryCta: { label: '', href: '' } }
    }
    if (smartLinkIsDisabled(row.heroCtaSmartLink)) {
      return { primaryCta: { label: '', href: '' } }
    }
    const r = resolveSmartLinkOrLegacy(
      row.heroCtaSmartLink,
      hasLeg ? leg : undefined,
      { label: fb.label, href: fb.href, openInNewTab: leg?.openInNewTab === true },
    )
    if (!r?.href?.trim()) return { primaryCta: { label: '', href: '' } }
    return { primaryCta: { label: r.label, href: r.href } }
  })()

  const photoCountLabel =
    galleryPhotos.length > 0 ? `+${galleryPhotos.length} photos` : '+0 photos'

  out.hero = {
    ...out.hero,
    breadcrumbs: buildLodgeHeroBreadcrumbs(lodge),
    currentCrumbLabel,
    title: heroTitle,
    tagline: heroTagline,
    imageSrc: heroBaseSrc,
    imageAlt: (heroTitle || lodge.name?.trim() || '').trim() || out.hero.imageAlt,
    badges: badgeList,
    gallery: galleryPhotos,
    photoCountLabel,
    ratingScore: reviewStats.ratingScore,
    reviewCountLabel: reviewStats.reviewCountLabel,
    secondaryMeta,
    ...heroCtaResolved,
  } as unknown as LodgeStaticBundle['hero']
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
      : lodge.location || formatLodgeAltitudeForSubtitle(lodge.altitude)
        ? {
            subtitle: [lodge.location, formatLodgeAltitudeForSubtitle(lodge.altitude)].filter(Boolean).join(' · '),
          }
        : {}),
    ...(() => {
      const fb = out.pageNav.cta
      const leg = row.navCTA
      const hasLeg = Boolean(leg?.label?.trim() && leg?.href?.trim())
      const hasSmart = Boolean(row.navCtaSmartLink?.label?.trim())
      if (!hasSmart && !hasLeg) return {}
      if (smartLinkIsDisabled(row.navCtaSmartLink)) {
        return { cta: { label: '', href: '' } }
      }
      const r = resolveSmartLinkOrLegacy(
        row.navCtaSmartLink,
        hasLeg ? leg : undefined,
        { label: fb.label, href: fb.href, openInNewTab: leg?.openInNewTab === true },
      )
      if (!r) return {}
      return { cta: { label: r.label, href: r.href } }
    })(),
  }

  out.snapshot = resolveSnapshotBar(out.snapshot, lodge, row.snapshotSelection, row.highlightLines)

  // Overview
  out.overview = {
    ...out.overview,
    ...(lodge.longDescription?.trim() ? { body: lodge.longDescription.trim() } : {}),
    ...(lodge.keyElements?.length ? { highlights: lodge.keyElements } : {}),
  }
  if (row.overviewHighlights?.length) {
    out.overview = {
      ...out.overview,
      highlights: row.overviewHighlights
        .map((h) => h?.trim())
        .filter((h): h is string => Boolean(h)),
    }
  }

  // Rooms
  const mappedRooms = mapRoomsFromLodge(lodge.rooms ?? undefined, row.featuredRoomStableId, lodge.gallery)
  if (mappedRooms) {
    out.rooms = { ...out.rooms, rooms: mappedRooms }
  }
  const accommodationNote = sectionFieldTrim(lodge.accommodationSpecialMessage)
  if (accommodationNote) {
    out.rooms = { ...out.rooms, note: accommodationNote }
  }

  // Facilities
  out.facilities = mergeFacilitiesFromCms(
    out.facilities,
    lodge,
    row.facilitiesAmenitiesSelection,
    row.facilitiesGallerySelection,
  )
  const pageFacilitiesEyebrow = sectionFieldTrim(row.facilitiesAmenitiesEyebrow)
  if (pageFacilitiesEyebrow) {
    out.facilities = { ...out.facilities, amenitiesEyebrow: pageFacilitiesEyebrow }
  }

  // Location / Getting here — lodge page CMS wins when set; otherwise lodge KC steps + static map
  const cmsGettingHere = (row.gettingHereIndications ?? [])
    .filter((x): x is { title?: string | null; text?: string | null } => Boolean(x))
    .map((x) => ({
      title: sectionFieldTrim(x.title) ?? '',
      text: sectionFieldTrim(x.text) ?? '',
    }))
    .filter((x) => Boolean(x.title || x.text))

  if (cmsGettingHere.length > 0) {
    out.location = {
      ...out.location,
      journeySteps: cmsGettingHere.map((s, i) => ({
        time: s.title || `Step ${i + 1}`,
        text: s.text,
        highlight: i === cmsGettingHere.length - 1,
      })),
    }
  } else if (lodge.journeySteps?.length) {
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

  const cmsMapUrl = sectionFieldTrim(row.gettingHereImageUrl)
  const cmsMapAlt = sectionFieldTrim(row.gettingHereImageAlt)
  out.location = {
    ...out.location,
    ...(cmsMapUrl
      ? {
          mapAccessImage: {
            src: cmsMapUrl,
            alt: cmsMapAlt ?? `${lodge.name?.trim() || 'Lodge'} — map and access`,
          },
        }
      : {}),
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
  if (row.scienceHighlights?.length) {
    stats = row.scienceHighlights.map((h) => ({
      value: h?.title?.trim() || '',
      label: h?.subtitle?.trim() || '',
    }))
  }
  if (row.scienceProjects?.length) {
    pillars = row.scienceProjects.map((p) => ({
      title: p?.title?.trim() || '',
      body: p?.subtitle?.trim() || '',
    }))
  }
  const scienceNote = sectionFieldTrim(row.scienceSpecialText?.text)
  if (scienceNote) footnote = scienceNote
  out.research = { ...out.research, stats, pillars, footnote }

  // Experiences — only experiences linked to this lodge in CMS; no static Soqtapata dummy cards.
  const usedCmsExperiences = resolvedExperienceRows.length > 0
  const { tailor: _omitTailor, ...experiencesWithoutTailor } = out.experiences
  out.experiences = {
    ...experiencesWithoutTailor,
    cards:
      resolvedExperienceRows.length > 0
        ? resolvedExperienceRows
            .map((e) => mapExperienceToCard(e, lodge))
            .filter((c): c is LodgeExperienceCard => c != null)
        : [],
  }
  const exCta = sectionFieldTrim(lodge.experienceCardCtaLabel)
  if (exCta) {
    out.experiences = { ...out.experiences, programCardCtaLabel: exCta }
  }

  // Reviews
  let reviews: ReviewDoc[] = out.reviews
  let usedCmsReviews = false
  const pageReviewCards = row.reviewsSection?.reviewCards
  if (pageReviewCards?.length) {
    reviews = pageReviewCards.map((r) => ({ ...r, _id: r._id || 'rev' }))
    usedCmsReviews = true
  } else if (row.reviewsSelection?.length) {
    reviews = row.reviewsSelection.map((r) => ({ ...r, _id: r._id || 'rev' }))
    usedCmsReviews = true
  } else if (lodge.reviews?.length) {
    reviews = lodge.reviews.map((r) => ({ ...r, _id: r._id || 'rev' }))
    usedCmsReviews = true
  }
  out.reviews = reviews
  const rotatingLodge = buildRotatingQuoteItemsFromReviews(row.reviewsSection?.rotatingReviews ?? [])
  if (rotatingLodge.length > 0) {
    out.featuredQuotes = rotatingLodge
  }

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
  if (row.faqItems?.length) {
    out.faq = {
      ...out.faq,
      items: row.faqItems.map((f, i) => ({
        id: `lodge-page-faq-${i}`,
        question: f?.title?.trim() || '',
        answer: f?.text?.trim() || '',
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
  /** Reserve #book: do not apply `lodgePage.bookingCta` or lodge marketing trust strip — only `reserveCtaSettings` + approved static (`lodgeSoqtapataBook`). */
  out.book = applyBookingRowLabelsFromLodge(out.book, lodge)

  // Section copy overrides (lodgePage)
  const sec = row.sections
  const overviewCopy = row.overviewSectionCopy ?? sec?.overview
  const accommodationCopy = row.accommodationSectionCopy ?? sec?.accommodation
  const facilitiesCopy = row.facilitiesSectionCopy ?? sec?.facilities
  const locationCopy = row.locationSectionCopy ?? sec?.location
  const researchCopy = row.researchSectionCopy ?? sec?.research
  const experiencesCopy = row.experiencesSectionCopy ?? sec?.experiences
  const faqCopy = row.faqSectionCopy ?? sec?.faq
  if (
    overviewCopy ||
    accommodationCopy ||
    facilitiesCopy ||
    locationCopy ||
    researchCopy ||
    experiencesCopy ||
    faqCopy
  ) {
    out.overview = applySectionCopy(out.overview, overviewCopy)
    out.rooms = applySectionCopy(out.rooms, accommodationCopy)
    out.facilities = applySectionCopy(out.facilities, facilitiesCopy)
    out.location = applySectionCopy(out.location, locationCopy)
    out.research = applySectionCopy(out.research, researchCopy)
    out.experiences = applySectionCopy(out.experiences, experiencesCopy)
    const faqEyebrow = sectionFieldTrim(faqCopy?.eyebrow)
    const faqTitle = sectionFieldTrim(faqCopy?.title)
    const faqBody = sectionFieldTrim(faqCopy?.body)
    out.faq = {
      ...out.faq,
      ...(faqEyebrow ? { eyebrow: faqEyebrow } : {}),
      ...(faqTitle ? { h2: faqTitle } : {}),
      ...(faqBody ? { lead: faqBody } : {}),
    } as unknown as LodgeStaticBundle['faq']
  }

  const expForLodgePrice = resolvedExperienceRows
  const lowestLodgeUsd = getLodgeReserveLowestUsd(expForLodgePrice, lodge.startingPrice)
  const rowByBookKey = (k: LodgeBookRowKey) => out.book.rows.find((r) => r.rowKey === k)
  const lodgeReserveRows = buildReserveRowsForLodge({
    shortestProgramLabel: rowByBookKey('shortestProgram')?.label,
    shortestProgramValue: rowByBookKey('shortestProgram')?.value,
    startingFromLabel: rowByBookKey('startingFrom')?.label,
    startingFromValue: rowByBookKey('startingFrom')?.value,
    groupSizeLabel: rowByBookKey('groupSize')?.label,
    groupSizeValue: rowByBookKey('groupSize')?.value,
    availabilityLabel: rowByBookKey('availability')?.label,
    availabilityValue: rowByBookKey('availability')?.value,
  })
  const rsLodge = row.reserveCtaSettings
  const reserveFallback = lodgeSoqtapataBook
  const nameLine = out.book.cardTitle
  const tagLine = out.book.cardSubtitle
  const lodgeReserveCard = resolveReserveCtaCard({
    settings: rsLodge,
    lowestUsd: lowestLodgeUsd,
    legacyPriceLine: null,
    legacyPriceSuffix: null,
    legacySubline: tagLine,
    defaultSubline: [nameLine, tagLine].filter(Boolean).join(' · '),
    defaultRows: lodgeReserveRows,
    /** CTAs: `reserveCtaSettings` smart links only; fall back to approved static — not `lodgePage.bookingCta`. */
    legacyCtas: {
      primaryLabel: reserveFallback.primaryCta.label,
      primaryHref: reserveFallback.primaryCta.href,
      secondaryLabel: reserveFallback.secondaryCta.label,
      secondaryHref: reserveFallback.secondaryCta.href,
    },
    defaultTermsHref: '/experiences/soqtapata-pristine-immersion#terms',
  })
  const prevRowsByLabel = new Map(out.book.rows.map((r) => [r.label, r]))
  const lp = lodgeReserveCard.ctas.find((c) => c.variant === 'primary')
  const ls = lodgeReserveCard.ctas.find((c) => c.variant === 'secondary')
  const staticTrust = reserveFallback.trustItems.map((t) => ({ icon: t.icon, text: t.text }))
  /**
   * Body: if `reserveCtaSettings` exists on the page doc, use only CMS `body` (trimmed).
   * Empty / omitted → no lead on the site (no static or legacy fallback).
   * If the whole `reserveCtaSettings` object is absent, keep approved static copy.
   */
  const reserveBodyFromCms =
    rsLodge != null && typeof rsLodge === 'object' ? String(rsLodge.body ?? '').trim() : null
  out.book = {
    ...out.book,
    eyebrow: rsLodge?.eyebrow?.trim() || reserveFallback.eyebrow,
    title: rsLodge?.title?.trim() || reserveFallback.title,
    body: reserveBodyFromCms !== null ? reserveBodyFromCms : reserveFallback.body,
    cardTitle: lodgeReserveCard.priceLine,
    cardPriceSuffix: lodgeReserveCard.priceSuffix,
    cardSubtitle: lodgeReserveCard.subline,
    rows: lodgeReserveCard.rows.map((r) => {
      const prev = prevRowsByLabel.get(r.label)
      return {
        label: r.label,
        value: r.value,
        rowKey: prev?.rowKey,
        valueAccent: prev?.valueAccent,
      }
    }),
    primaryCta: {
      label: lp?.label ?? reserveFallback.primaryCta.label,
      href: lp?.href ?? reserveFallback.primaryCta.href,
    },
    secondaryCta: {
      label: ls?.label ?? reserveFallback.secondaryCta.label,
      href: ls?.href ?? reserveFallback.secondaryCta.href,
    },
    trustItems: lodgeReserveCard.trustItems?.length
      ? lodgeReserveCard.trustItems.map((t) => {
          const k = (t.iconKey || 'shield').toLowerCase()
          const icon: (typeof out.book.trustItems)[number]['icon'] =
            k === 'heart' ? 'heart' : k === 'check' ? 'check' : 'shield'
          return { icon, text: t.text }
        })
      : staticTrust,
    termsHref: lodgeReserveCard.termsHref,
    termsPrefixText: lodgeReserveCard.termsPrefixText,
    termsLinkLabel: lodgeReserveCard.termsLinkLabel,
    termsSuffixText: lodgeReserveCard.termsSuffixText,
    termsOpenInNewTab: lodgeReserveCard.termsOpenInNewTab,
    termsRel: lodgeReserveCard.termsRel,
  }

  {
    const tailorResolved = resolveExperiencesTailorCta(row)
    if (tailorResolved) {
      out.experiences = { ...out.experiences, tailor: tailorResolved }
    } else {
      const { tailor: _omitTailor, ...experiencesRest } = out.experiences
      out.experiences = experiencesRest as LodgeStaticBundle['experiences']
    }
  }

  const reviewsSectionResolved = resolveReviewsSection(
    sec,
    row.reviewsSection ?? null,
    row.reviewsPresentation ?? null,
  )

  filterLodgePageNavByVisibility(out, sectionVisibility)

  return {
    sectionVisibility,
    source: 'cms',
    cmsError,
    pageSlug,
    doc: {
      lodgePageId: row._id,
      lodgeId: lodge._id,
    },
    seo,
    ...out,
    reviewsSection: reviewsSectionResolved,
    reviewsRatingSummary: normalizeReviewsRatingSummary(row.reviewsSettings ?? null),
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

/** Slugs for `/lodges/[slug]` static paths (published `lodgePage` + `lodge` ref). */
export const getLodgePageSlugsForStaticParams = cache(async (): Promise<{ slug: string }[]> => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return [{ slug: LODGE_SOQTAPATA_PAGE_SLUG }]
  }
  const { client } = createLodgePageCmsSanityClient()
  try {
    const rows = await client.fetch<Array<{ slug: string | null }>>(lodgePageSlugsQuery)
    const out = (rows ?? [])
      .map((r) => (typeof r.slug === 'string' ? r.slug.trim() : ''))
      .filter(Boolean)
      .map((slug) => ({ slug }))
    return out.length ? out : [{ slug: LODGE_SOQTAPATA_PAGE_SLUG }]
  } catch {
    return [{ slug: LODGE_SOQTAPATA_PAGE_SLUG }]
  }
})

/** Atajo para la única landing lodge implementada hoy. */
export const getSoqtapataLodgePageCms = cache(async () =>
  getLodgePageCms(LODGE_SOQTAPATA_PAGE_SLUG),
)
