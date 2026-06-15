/**
 * Mapea `RoutesPageSanityDoc` (campos planos del schema `routesPage`, ver `sanity/schemaTypes/routesPage.js`)
 * al shape que consumen `app/routes/page.tsx` y `getRoutesPage` (objetos anidados tipo `RoutesTerritoryStatic`).
 */
import type { ReserveCtaCardProps } from '@/components/shared/ReserveCtaSection'
import { homePageTextFields } from '@/data/cmsApproved/homePageFields'
import type { ReviewDoc } from '@/lib/queries'
import { buildRotatingQuoteItemsFromReviews } from '@/lib/reviewQuoteItems'
import { normalizeReviewsRatingSummary, type ReviewsRatingSummary } from '@/lib/reviewsRatingSummary'
import {
  buildRouteFootPriceHtmlByRouteRef,
  buildRouteFootPriceHtmlByStableId,
  formatRouteCardFootPriceHtml,
} from '@/lib/routeCardFootPrice'
import {
  resolveRoutesPageSectionVisibility,
  type RoutesPageSectionVisibility,
} from '@/lib/routesPageSectionVisibility'
import { getLowestActiveExperiencePrice, buildReserveRowsForHome } from '@/lib/reserveCtaPricing'
import { resolveReserveCtaCard } from '@/lib/resolveReserveCtaCard'
import { resolveSmartLinkOrLegacy } from '@/lib/resolveSmartLink'
import { optimizeSanityImageDelivery, SANITY_IMG } from '@/lib/sanity'
import {
  buildRoutesExpCardsFromListedExperiencePages,
  buildRoutesExpFiltersFromPublishedRoutes,
  orderPublishedRoutes,
  type RoutesPageListedExperiencePageRow,
} from '@/lib/routesPageExperiencesSection'
import { learningProgrammeToRoutesListedRow } from '@/lib/mergeExperienceListingRows'
import type { RoutesPageSanityDoc, RoutesPageSanityRouteCard } from '@/lib/routesPageQuery'
import {
  routesCards as fallbackRoutesCards,
  routesCompareColumns as fallbackCompareColumns,
  routesCompareRows as fallbackCompareRows,
  routesCompareSection as fallbackCompareSection,
  routesExperiencesSection as fallbackExperiencesSection,
  routesFeaturedQuoteItems as fallbackFeaturedQuotes,
  routesFinalCta as fallbackFinalCta,
  routesHero as fallbackHero,
  routesReviewDocs as fallbackReviewDocs,
  routesReviewsUiDefaults,
  routesSeoFallback,
  routesSnapshotStats as fallbackSnapshotStats,
  routesTerritory as fallbackTerritory,
  type RoutesCardBadge,
  type RoutesCardStatic,
  type RoutesCompareColumn,
  type RoutesCompareRow,
  type RoutesExpCardStatic,
  type RoutesExpFilterPill,
  type RoutesHeroStatic,
  type RoutesSnapshotStat,
  type RoutesTerritoryStatic,
} from '@/data/routesStatic'

function trimOr(fallback: string, v?: string | null) {
  const t = v?.trim()
  return t ? t : fallback
}

function mapCompareRowsFromCms(rows: NonNullable<RoutesPageSanityDoc['compareRows']> | null | undefined): RoutesCompareRow[] | null {
  if (!Array.isArray(rows) || rows.length === 0) return null
  const out: RoutesCompareRow[] = []
  for (const raw of rows) {
    const t = raw && typeof raw === 'object' ? (raw as { _type?: string })._type : undefined
    if (t === 'routesCompareRowText') {
      const r = raw as {
        label?: string | null
        altRow?: boolean | null
        col1?: string | null
        col2?: string | null
        col3?: string | null
      }
      const label = r.label?.trim()
      const c1 = r.col1?.trim()
      const c2 = r.col2?.trim()
      const c3 = r.col3?.trim()
      if (!label || c1 == null || c2 == null || c3 == null) continue
      out.push({
        kind: 'text',
        label,
        alt: r.altRow === true,
        values: [c1, c2, c3],
      })
      continue
    }
    if (t === 'routesCompareRowDots') {
      const r = raw as { label?: string | null; altRow?: boolean | null; dots1?: number | null; dots2?: number | null; dots3?: number | null }
      const label = r.label?.trim()
      if (!label) continue
      const d1 = clampDot(r.dots1)
      const d2 = clampDot(r.dots2)
      const d3 = clampDot(r.dots3)
      out.push({ kind: 'dots', label, alt: r.altRow === true, dots: [d1, d2, d3] })
      continue
    }
    if (t === 'routesCompareRowLodge') {
      const r = raw as {
        label?: string | null
        altRow?: boolean | null
        lodge1?: { title?: string | null; subtitle?: string | null } | null
        lodge2?: { title?: string | null; subtitle?: string | null } | null
        lodge3?: { title?: string | null; subtitle?: string | null } | null
      }
      const label = r.label?.trim()
      if (!label) continue
      const L = [r.lodge1, r.lodge2, r.lodge3]
      const t0 = L[0]?.title?.trim()
      const t1 = L[1]?.title?.trim()
      const t2 = L[2]?.title?.trim()
      if (!t0 || !t1 || !t2) continue
      out.push({
        kind: 'lodge',
        label,
        alt: r.altRow === true,
        lodges: [
          { title: t0, sub: L[0]?.subtitle?.trim() ?? '' },
          { title: t1, sub: L[1]?.subtitle?.trim() ?? '' },
          { title: t2, sub: L[2]?.subtitle?.trim() ?? '' },
        ],
      })
      continue
    }
    if (t === 'routesCompareRowBest') {
      const r = raw as {
        label?: string | null
        altRow?: boolean | null
        col1?: string | null
        col2?: string | null
        col3?: string | null
      }
      const label = r.label?.trim()
      const c1 = r.col1?.trim()
      const c2 = r.col2?.trim()
      const c3 = r.col3?.trim()
      if (!label || c1 == null || c2 == null || c3 == null) continue
      out.push({
        kind: 'best',
        label,
        alt: r.altRow === true,
        values: [c1, c2, c3],
      })
      continue
    }
    if (t === 'routesCompareRowPrice') {
      const r = raw as {
        label?: string | null
        altRow?: boolean | null
        cell1?: { kind?: string | null; priceText?: string | null } | null
        cell2?: { kind?: string | null; priceText?: string | null } | null
        cell3?: { kind?: string | null; priceText?: string | null } | null
      }
      const label = r.label?.trim()
      if (!label) continue
      const cells = [r.cell1, r.cell2, r.cell3].map(mapPriceCell)
      if (cells.some((c) => !c)) continue
      out.push({
        kind: 'price',
        label,
        alt: r.altRow === true,
        cells: cells as [
          { type: 'price'; text: string } | { type: 'enquire' },
          { type: 'price'; text: string } | { type: 'enquire' },
          { type: 'price'; text: string } | { type: 'enquire' },
        ],
      })
    }
  }
  return out.length ? out : null
}

function clampDot(n: number | null | undefined): 0 | 1 | 2 | 3 {
  const v = typeof n === 'number' && !Number.isNaN(n) ? Math.round(n) : 0
  if (v < 0) return 0
  if (v > 3) return 3
  return v as 0 | 1 | 2 | 3
}

function mapPriceCell(
  cell: { kind?: string | null; priceText?: string | null } | null | undefined,
): { type: 'price'; text: string } | { type: 'enquire' } | null {
  if (!cell?.kind) return null
  if (cell.kind === 'price') {
    const text = cell.priceText?.trim()
    if (!text) return null
    return { type: 'price', text }
  }
  if (cell.kind === 'enquire') return { type: 'enquire' }
  return null
}

function isBadgeTone(s: string | null | undefined): s is RoutesCardBadge['tone'] {
  return s === 'amber' || s === 'neutral' || s === 'custom'
}

function mapRouteCards(
  cards: RoutesPageSanityRouteCard[] | null | undefined,
  footPriceByRouteRef: Map<string, string>,
  footPriceByStableId: Map<string, string>,
): RoutesCardStatic[] | null {
  if (!Array.isArray(cards) || cards.length === 0) return null
  const out: RoutesCardStatic[] = []
  for (const c of cards) {
    const id = c.stableId?.trim()
    const imageSrcRaw = c.imageUrl?.trim()
    if (!id || !imageSrcRaw || !c.name?.trim()) continue
    const imageSrc = optimizeSanityImageDelivery(imageSrcRaw, SANITY_IMG.ROUTES_CARD)
    const staticCard = fallbackRoutesCards.find((x) => x.id === id)
    const fbCta = staticCard?.cta ?? { label: '', href: '', buttonVariant: 'secondary' as const }
    const resolved = resolveSmartLinkOrLegacy(
      c.ctaSmartLink,
      { label: c.cta?.label, href: c.cta?.href, openInNewTab: c.cta?.openInNewTab },
      { label: fbCta.label, href: fbCta.href, openInNewTab: false },
    )
    if (!resolved) continue
    const href = resolved.href?.trim()
    const label = resolved.label?.trim()
    if (!href || !label) continue
    const variant = c.variant === 'featured' ? 'featured' : 'default'
    const badges: RoutesCardBadge[] = (c.badges ?? [])
      .map((b) => {
        const tone = isBadgeTone(b.tone) ? b.tone : 'neutral'
        const lab = b.label?.trim()
        if (!lab) return null
        if (tone === 'custom' && b.customClassName?.trim()) {
          return { label: lab, tone: 'custom', customClassName: b.customClassName.trim() } as RoutesCardBadge
        }
        return { label: lab, tone } as RoutesCardBadge
      })
      .filter(Boolean) as RoutesCardBadge[]
    const btn = c.ctaButtonVariant === 'primary' ? 'primary' : 'secondary'
    const routeRefId = c.routeRef?._id?.trim()
    let footPriceHtml = ''
    if (routeRefId) {
      footPriceHtml =
        footPriceByRouteRef.get(routeRefId) ?? formatRouteCardFootPriceHtml(0, null)
    } else if (id) {
      footPriceHtml = footPriceByStableId.get(id) ?? ''
    }
    out.push({
      id,
      variant,
      imageSrc,
      imageAlt: trimOr(id, c.imageAlt),
      numLabel: c.numLabel?.trim() ?? '',
      altitudeLine: c.altitudeLine?.trim() ?? '',
      badges,
      name: c.name.trim(),
      description: c.description?.trim() ?? '',
      chips: (c.chips ?? []).map((x) => x.trim()).filter(Boolean),
      footPriceHtml,
      cta: { label, href, buttonVariant: btn },
    })
  }
  return out.length ? out : null
}

function mapCompareColumns(
  cols: RoutesPageSanityDoc['compareColumns'],
): RoutesCompareColumn[] | null {
  if (!Array.isArray(cols) || cols.length !== 3) return null
  const out: RoutesCompareColumn[] = []
  for (const c of cols) {
    const title = c.title?.trim()
    if (!title) return null
    const tone = c.tone === 'featured' ? 'featured' : 'default'
    out.push({ title, subtitle: c.subtitle?.trim() ?? '', tone })
  }
  return out
}

export type RoutesPageResolved = {
  sectionVisibility: RoutesPageSectionVisibility
  seo: {
    title: string
    description: string
    noIndex: boolean
    ogImageUrl: string | null
  }
  hero: RoutesHeroStatic
  snapshotStats: RoutesSnapshotStat[]
  territory: RoutesTerritoryStatic
  routesCards: RoutesCardStatic[]
  compareSection: typeof fallbackCompareSection
  compareColumns: RoutesCompareColumn[]
  compareRows: RoutesCompareRow[]
  experiencesSection: typeof fallbackExperiencesSection
  expFilters: RoutesExpFilterPill[]
  expCards: RoutesExpCardStatic[]
  featuredQuotes: { text: string; attr: string }[]
  reviews: ReviewDoc[]
  reviewsRatingSummary: ReviewsRatingSummary
  reviewsEyebrow: string
  reviewsHeadline: string
  reviewsSectionLead: string
  finalCta: typeof fallbackFinalCta & {
    reserveCard: ReserveCtaCardProps
  }
}

export function resolveRoutesPageData(
  cms: RoutesPageSanityDoc | null,
  promotions?: import('@/lib/promotionTypes').PromotionDoc[] | null,
): RoutesPageResolved {
  const seoFromCms = cms?.seo
  const seo = {
    title: trimOr(routesSeoFallback.title, seoFromCms?.title),
    description: trimOr(routesSeoFallback.description, seoFromCms?.description),
    noIndex: seoFromCms?.noIndex === true,
    ogImageUrl: seoFromCms?.ogImageUrl?.trim() || null,
  }

  const heroFbPrimary = fallbackHero.primaryCta ?? {
    label: 'Explore the routes ↓',
    href: '#routes',
    openInNewTab: false,
  }
  const heroFbSecondary = fallbackHero.secondaryCta ?? {
    label: 'See all experiences',
    href: '/experiences',
    openInNewTab: false,
  }

  const primaryResolved = resolveSmartLinkOrLegacy(
    cms?.heroPrimarySmartLink,
    cms?.heroPrimaryCta,
    {
      label: heroFbPrimary.label,
      href: heroFbPrimary.href,
      openInNewTab: heroFbPrimary.openInNewTab,
    },
  )
  const secondaryResolved = resolveSmartLinkOrLegacy(
    cms?.heroSecondarySmartLink,
    cms?.heroSecondaryCta,
    {
      label: heroFbSecondary.label,
      href: heroFbSecondary.href,
      openInNewTab: heroFbSecondary.openInNewTab,
    },
  )

  const hero: RoutesHeroStatic = {
    imageSrc: optimizeSanityImageDelivery(
      trimOr(fallbackHero.imageSrc, cms?.heroImageUrl),
      SANITY_IMG.HERO,
    ),
    imageAlt: trimOr(fallbackHero.imageAlt, cms?.heroImageAlt),
    eyebrow: trimOr(fallbackHero.eyebrow, cms?.heroEyebrow),
    titleLine1: trimOr(fallbackHero.titleLine1, cms?.heroTitleLine1),
    titleLine2: trimOr(fallbackHero.titleLine2, cms?.heroTitleLine2),
    tagline: trimOr(fallbackHero.tagline, cms?.heroTagline),
    primaryCta: primaryResolved
      ? {
          label: primaryResolved.label,
          href: primaryResolved.href,
          openInNewTab: primaryResolved.openInNewTab,
          rel: primaryResolved.rel || undefined,
        }
      : null,
    secondaryCta: secondaryResolved
      ? {
          label: secondaryResolved.label,
          href: secondaryResolved.href,
          openInNewTab: secondaryResolved.openInNewTab,
          rel: secondaryResolved.rel || undefined,
        }
      : null,
  }

  const snapshotFromCms = (cms?.snapshotStats ?? [])
    .map((s) => {
      const value = s.value?.trim()
      const label = s.label?.trim()
      if (!value || !label) return null
      return { value, label }
    })
    .filter(Boolean) as RoutesSnapshotStat[]
  const snapshotStats = snapshotFromCms.length ? snapshotFromCms : fallbackSnapshotStats

  const stripFromCms = (cms?.territoryStrip ?? [])
    .map((ch) => {
      const id = ch.id?.trim()
      const name = ch.name?.trim()
      if (!id || !name) return null
      const variant = ch.variant === 'active' ? 'active' : 'neutral'
      return { id, name, meta: ch.meta?.trim() ?? '', variant }
    })
    .filter(Boolean) as RoutesTerritoryStatic['strip']
  const territoryImageUrl = cms?.territoryImageUrl?.trim()
    ? optimizeSanityImageDelivery(cms.territoryImageUrl.trim(), SANITY_IMG.ROUTES_TERRITORY)
    : null
  const territory: RoutesTerritoryStatic = {
    sectionId: trimOr(fallbackTerritory.sectionId, cms?.territorySectionId),
    eyebrow: trimOr(fallbackTerritory.eyebrow, cms?.territoryEyebrow),
    h2: trimOr(fallbackTerritory.h2, cms?.territoryH2),
    body: trimOr(fallbackTerritory.body, cms?.territoryBody),
    imageSrc: territoryImageUrl || fallbackTerritory.imageSrc,
    imageAlt: trimOr(fallbackTerritory.imageAlt, cms?.territoryImageAlt),
    strip: stripFromCms.length ? stripFromCms : fallbackTerritory.strip,
  }

  const publishedForRouteCards = cms?.publishedExperiencePages ?? null
  const footPriceByRouteRef = buildRouteFootPriceHtmlByRouteRef(publishedForRouteCards, promotions)
  const footPriceByStableId = buildRouteFootPriceHtmlByStableId(publishedForRouteCards, promotions)
  const routesCardsFromCms = mapRouteCards(cms?.routeCards ?? null, footPriceByRouteRef, footPriceByStableId)
  const routesCards = routesCardsFromCms ?? fallbackRoutesCards
  const sectionVisibility = resolveRoutesPageSectionVisibility(cms?.sectionModules ?? null)

  const compareSection = {
    sectionId: trimOr(fallbackCompareSection.sectionId, cms?.compareSectionId),
    eyebrow: trimOr(fallbackCompareSection.eyebrow, cms?.compareEyebrow),
    h2: trimOr(fallbackCompareSection.h2, cms?.compareH2),
    intro: trimOr(fallbackCompareSection.intro, cms?.compareIntro),
  }
  const compareColumns = mapCompareColumns(cms?.compareColumns ?? null) ?? fallbackCompareColumns
  const compareRows = mapCompareRowsFromCms(cms?.compareRows ?? null) ?? fallbackCompareRows

  const cardCtaLabel =
    cms?.experienceCardCtaLabel?.trim() ||
    fallbackExperiencesSection.cardCtaLabel ||
    'View program'

  const experiencesSection = {
    sectionId: trimOr(fallbackExperiencesSection.sectionId, cms?.experiencesSectionId),
    eyebrow: trimOr(fallbackExperiencesSection.eyebrow, cms?.experiencesEyebrow),
    h2: trimOr(fallbackExperiencesSection.h2, cms?.experiencesH2),
    intro: trimOr(fallbackExperiencesSection.intro, cms?.experiencesIntro),
    cardCtaLabel,
    ...(() => {
      const resolved = resolveSmartLinkOrLegacy(
        cms?.experiencesAllSmartLink,
        { label: cms?.experiencesAllLabel, href: cms?.experiencesAllHref, openInNewTab: false },
        {
          label: fallbackExperiencesSection.allExperiencesLabel,
          href: fallbackExperiencesSection.allExperiencesHref,
          openInNewTab: false,
        },
      )
      return {
        allExperiencesHref: resolved?.href ?? '',
        allExperiencesLabel: resolved?.label ?? '',
      }
    })(),
  }
  const orderedRoutes = orderPublishedRoutes(cms?.publishedRoutes ?? null, cms?.experiencesRouteOrder ?? null)
  const expFilters = buildRoutesExpFiltersFromPublishedRoutes(orderedRoutes)
  const listedPages: RoutesPageListedExperiencePageRow[] = [...(cms?.listedExperiencePages ?? [])]
  for (const row of cms?.listedLearningProgrammes ?? []) {
    const mapped = learningProgrammeToRoutesListedRow({
      _id: row._id?.trim() || '',
      title: row.title,
      experienceSlug: row.experienceSlug,
      programType: row.programType,
      routeRefId: row.routeRefId,
      routeSlug: row.routeSlug,
      routeLabel: row.routeLabel,
      shortDescription: row.shortDescription,
      price: row.price,
      priceLabel: row.priceLabel,
      status: row.status,
      durationDisplay: row.durationDisplay,
      mainImageUrl: row.mainImageUrl,
    })
    if (mapped) listedPages.push(mapped)
  }
  const expCards = buildRoutesExpCardsFromListedExperiencePages(listedPages, {
    ctaLabel: cardCtaLabel,
  })

  const fqFromCms = (cms?.reviewsFeaturedQuotes ?? [])
    .map((q) => {
      const text = q.quoteHtml?.trim()
      const attr = q.attribution?.trim()
      if (!text || !attr) return null
      return { text, attr }
    })
    .filter(Boolean) as { text: string; attr: string }[]

  const rsBlock = cms?.reviewsSection
  const rotatingFromPage = buildRotatingQuoteItemsFromReviews(rsBlock?.rotatingReviews ?? [])
  const featuredQuotes = rotatingFromPage.length
    ? rotatingFromPage
    : fqFromCms.length
      ? fqFromCms
      : fallbackFeaturedQuotes.map((x) => ({ text: x.text, attr: x.attr }))

  const revFromCms = (cms?.reviewsResolved ?? []).filter((r) => r._id && r.quote)
  const reviews = revFromCms.length ? revFromCms : fallbackReviewDocs

  const reviewsRatingSummary = normalizeReviewsRatingSummary(cms?.reviewsSettings ?? null)

  const reviewsEyebrow = trimOr(routesReviewsUiDefaults.eyebrow, rsBlock?.eyebrow?.trim() || cms?.reviewsEyebrow)
  const reviewsHeadline = trimOr(routesReviewsUiDefaults.headline, rsBlock?.title?.trim() || cms?.reviewsHeadline)
  const reviewsSectionLead = rsBlock?.body?.trim() || cms?.reviewsSectionLead?.trim() || ''

  const trustFromCms = (cms?.finalCtaTrustItems ?? [])
    .map((t) => {
      const label = t.label?.trim()
      const icon = t.icon === 'shield' || t.icon === 'check' || t.icon === 'heart' ? t.icon : 'check'
      if (!label) return null
      return { label, icon }
    })
    .filter(Boolean) as typeof fallbackFinalCta.trustItems
  const waResolved = resolveSmartLinkOrLegacy(
    cms?.finalCtaWhatsappSmartLink,
    {
      label: cms?.finalCtaWhatsappLabel,
      href: cms?.finalCtaWhatsappHref,
      openInNewTab: true,
    },
    {
      label: fallbackFinalCta.whatsappLabel,
      href: fallbackFinalCta.whatsappHref,
      openInNewTab: true,
    },
  )
  const secondaryResolvedFinal = resolveSmartLinkOrLegacy(
    cms?.finalCtaSecondarySmartLink,
    {
      label: cms?.finalCtaSecondaryLabel,
      href: cms?.finalCtaSecondaryHref,
      openInNewTab: false,
    },
    {
      label: fallbackFinalCta.secondaryLabel,
      href: fallbackFinalCta.secondaryHref,
      openInNewTab: false,
    },
  )

  const hb = homePageTextFields
  const lowestRoutesUsd = getLowestActiveExperiencePrice(
    (cms?.listedExperiencePages ?? []).map((p) => ({
      status: p.status,
      price: p.price,
      priceLabel: p.priceLabel,
    })),
  )
  const rs = cms?.reserveCtaSettings
  const reserveCard = resolveReserveCtaCard({
    settings: rs,
    lowestUsd: lowestRoutesUsd,
    legacyPriceLine: hb.bookingPrice,
    legacyPriceSuffix: hb.bookingPriceSuffixSmall,
    legacySubline: hb.bookingPriceSubtext,
    defaultSubline: hb.bookingPriceSubtext ?? '',
    defaultRows: buildReserveRowsForHome(),
    legacyCtas: {
      primarySmart: cms?.finalCtaSecondarySmartLink,
      primaryLabel: secondaryResolvedFinal?.label ?? cms?.finalCtaSecondaryLabel,
      primaryHref: secondaryResolvedFinal?.href ?? cms?.finalCtaSecondaryHref,
      secondarySmart: cms?.finalCtaWhatsappSmartLink,
      secondaryLabel: waResolved?.label ?? cms?.finalCtaWhatsappLabel,
      secondaryHref: waResolved?.href ?? cms?.finalCtaWhatsappHref,
    },
    defaultTermsHref: '/experiences/soqtapata-pristine-immersion#terms',
  })

  const finalCta = {
    sectionId: trimOr(fallbackFinalCta.sectionId, cms?.finalCtaSectionId),
    eyebrow: rs?.eyebrow?.trim() || trimOr(fallbackFinalCta.eyebrow, cms?.finalCtaEyebrow),
    h2: rs?.title?.trim() || trimOr(fallbackFinalCta.h2, cms?.finalCtaH2),
    body: rs?.body?.trim() || trimOr(fallbackFinalCta.body, cms?.finalCtaBody),
    whatsappHref: waResolved?.href ?? '',
    whatsappLabel: waResolved?.label ?? '',
    whatsappRel: waResolved?.rel ?? fallbackFinalCta.whatsappRel,
    secondaryHref: secondaryResolvedFinal?.href ?? '',
    secondaryLabel: secondaryResolvedFinal?.label ?? '',
    secondaryRel: secondaryResolvedFinal?.rel ?? fallbackFinalCta.secondaryRel,
    secondaryOpenInNewTab: secondaryResolvedFinal?.openInNewTab ?? fallbackFinalCta.secondaryOpenInNewTab,
    trustItems: trustFromCms.length ? trustFromCms : fallbackFinalCta.trustItems,
    reserveCard,
  }

  return {
    sectionVisibility,
    seo,
    hero,
    snapshotStats,
    territory,
    routesCards,
    compareSection,
    compareColumns,
    compareRows,
    experiencesSection,
    expFilters,
    expCards,
    featuredQuotes,
    reviews,
    reviewsRatingSummary,
    reviewsEyebrow,
    reviewsHeadline,
    reviewsSectionLead,
    finalCta,
  }
}
