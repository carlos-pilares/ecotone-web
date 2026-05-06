/**
 * Builds the `routesPage` singleton document for Sanity (aligned with `data/routesStatic.ts`).
 * Used by `seedCmsAll` after URL image cache is ready.
 *
 * Campos top-level del schema `sanity/schemaTypes/routesPage.js` (todos se asignan aquí):
 * internalTitle, slug, seo,
 * heroImage, heroImageAlt, heroEyebrow, heroTitleLine1, heroTitleLine2, heroTagline, heroPrimaryCta, heroSecondaryCta,
 * snapshotStats,
 * territorySectionId, territoryEyebrow, territoryH2, territoryBody, territoryStrip,
 * routeCards,
 * compareSectionId, compareEyebrow, compareH2, compareIntro, compareColumns, compareRows,
 * experiencesSectionId, experiencesEyebrow, experiencesH2, experiencesIntro, experiencesAllLabel, experiencesAllHref,
 * experiencesFilters, experienceCards,
 * reviewsFeaturedQuotes, reviewsRefs, reviewsEyebrow, reviewsHeadline, reviewsSectionLead,
 * reviewsAverageRating, reviewsSourceLabel, reviewsSecondaryRatingLine,
 * finalCtaSectionId, finalCtaEyebrow, finalCtaH2, finalCtaBody, finalCtaWhatsappHref, finalCtaWhatsappLabel,
 * finalCtaSecondaryHref, finalCtaSecondaryLabel, finalCtaTrustItems
 *
 * `linkWithLabel`: label, href, openInNewTab (ver `sanity/schemaTypes/objects/linkWithLabel.js`).
 *
 * Si Studio muestra listas/imagen vacías pero Vision al publicado está bien: suele existir `drafts.routesPage`.
 * `removeRoutesPageDraft` (scripts/seed/removeRoutesPageDraft.ts) se llama antes del `createOrReplace`.
 */
import type { SanityClient } from '@sanity/client'

import { CMS_IDS } from '@/data/cmsApproved/ids'
import {
  routesCompareColumns,
  routesCompareRows,
  routesCompareSection,
  routesExpCards,
  routesExperiencesSection,
  routesExpFilters,
  routesFeaturedQuoteItems,
  routesFinalCta,
  routesHero,
  routesReviewsUiDefaults,
  routesSeoFallback,
  routesSnapshotStats,
  routesTerritory,
  routesCards,
} from '@/data/routesStatic'
import type { RoutesCompareRow } from '@/data/routesStatic'

import { parseWaMeHref } from './parseWaMeHref'
import { createUrlImageCache } from './urlImageCache'

/** Canonical origin for `externalUrl` smart links seeded from relative paths (matches approved nav URLs). */
const SMART_SEED_SITE_ORIGIN = 'https://www.ecotone.eco'

function absUrlForSmartSeed(pathOrUrl: string): string {
  const t = pathOrUrl.trim()
  if (/^https?:\/\//i.test(t)) return t
  return new URL(t, SMART_SEED_SITE_ORIGIN).href
}

type UrlImageCache = ReturnType<typeof createUrlImageCache>

function k(n: string) {
  return { _key: n }
}

/** Evita `undefined` en JSON: Content Lake puede descartar nodos padre si hay valores inválidos. */
function stripUndefinedDeep<T>(input: T): T {
  if (input === undefined || input === null) return input
  if (typeof input !== 'object') return input
  if (Array.isArray(input)) {
    return input
      .map((x) => stripUndefinedDeep(x))
      .filter((x) => x !== undefined) as T
  }
  const out: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(input as Record<string, unknown>)) {
    if (val === undefined) continue
    const next = stripUndefinedDeep(val)
    if (next !== undefined) out[key] = next
  }
  return out as T
}

function mapCompareRow(row: RoutesCompareRow, i: number): Record<string, unknown> {
  const base = { ...k(`cmp-${i}`) }
  if (row.kind === 'text') {
    return {
      ...base,
      _type: 'routesCompareRowText' as const,
      label: row.label,
      altRow: row.alt ?? false,
      col1: row.values[0],
      col2: row.values[1],
      col3: row.values[2],
    }
  }
  if (row.kind === 'dots') {
    return {
      ...base,
      _type: 'routesCompareRowDots' as const,
      label: row.label,
      altRow: row.alt ?? false,
      dots1: row.dots[0],
      dots2: row.dots[1],
      dots3: row.dots[2],
    }
  }
  if (row.kind === 'lodge') {
    const L = row.lodges
    return {
      ...base,
      _type: 'routesCompareRowLodge' as const,
      label: row.label,
      altRow: row.alt ?? false,
      lodge1: {_type: 'routesCompareLodgeCell' as const, title: L[0].title, subtitle: L[0].sub},
      lodge2: {_type: 'routesCompareLodgeCell' as const, title: L[1].title, subtitle: L[1].sub},
      lodge3: {_type: 'routesCompareLodgeCell' as const, title: L[2].title, subtitle: L[2].sub},
    }
  }
  if (row.kind === 'best') {
    return {
      ...base,
      _type: 'routesCompareRowBest' as const,
      label: row.label,
      altRow: row.alt ?? false,
      col1: row.values[0],
      col2: row.values[1],
      col3: row.values[2],
    }
  }
  if (row.kind === 'price') {
    const cells = row.cells
    const cell = (c: (typeof cells)[0]) =>
      c.type === 'price'
        ? {_type: 'routesComparePriceCell' as const, kind: 'price', priceText: c.text}
        : {_type: 'routesComparePriceCell' as const, kind: 'enquire'}
    return {
      ...base,
      _type: 'routesCompareRowPrice' as const,
      label: row.label,
      altRow: row.alt ?? false,
      cell1: cell(cells[0]),
      cell2: cell(cells[1]),
      cell3: cell(cells[2]),
    }
  }
  throw new Error(`[buildRoutesPageDocument] compare row index ${i}: unknown kind ${String((row as { kind?: string }).kind)}`)
}

export async function buildRoutesPageDocument(client: SanityClient, imageCache?: UrlImageCache) {
  const cache = imageCache ?? createUrlImageCache(client)

  const heroImage = await cache.get(routesHero.imageSrc, 'routes-hero.jpg')

  const routeCardImages = await Promise.all(
    routesCards.map((c, i) => cache.get(c.imageSrc, `routes-card-${i + 1}.jpg`)),
  )

  const expCardImages = await Promise.all(
    routesExpCards.map((c, i) => cache.get(c.imageSrc, `routes-exp-${i + 1}.jpg`)),
  )

  const routeCards = routesCards.map((c, i) => ({
    ...k(`rc-${c.id}`),
    _type: 'routesPageRouteCard' as const,
    stableId: c.id,
    variant: c.variant,
    image: routeCardImages[i],
    imageAlt: c.imageAlt,
    numLabel: c.numLabel,
    altitudeLine: c.altitudeLine,
    badges: c.badges.map((b, j) => ({
      ...k(`rc-${c.id}-bd${j}`),
      _type: 'routesPageRouteBadge' as const,
      label: b.label,
      tone: b.tone,
      customClassName: b.customClassName,
    })),
    name: c.name,
    description: c.description,
    chips: c.chips,
    footPriceHtml: c.footPriceHtml,
    ctaSmartLink: {
      _type: 'smartLink' as const,
      label: c.cta.label,
      linkType: 'externalUrl' as const,
      externalUrl: absUrlForSmartSeed(c.cta.href),
      openInNewTab: false,
    },
    cta: {
      label: c.cta.label,
      href: c.cta.href,
      openInNewTab: false,
    },
    ctaButtonVariant: c.cta.buttonVariant,
  }))

  const experienceCards = routesExpCards.map((c, i) => ({
    ...k(`ex-${i}`),
    _type: 'routesPageExpCard' as const,
    routeKey: c.route,
    hrefSmartLink: {
      _type: 'smartLink' as const,
      label: c.name,
      linkType: 'externalUrl' as const,
      externalUrl: absUrlForSmartSeed(c.href),
      openInNewTab: false,
    },
    href: c.href,
    image: expCardImages[i],
    imageAlt: c.imageAlt,
    typePill: c.typePill,
    duration: c.duration,
    routeLine: c.routeLine,
    name: c.name,
    description: c.description,
    priceKind: c.priceKind,
    priceText: c.priceText,
  }))

  const compareColumns = routesCompareColumns.map((col, i) => ({
    ...k(`cc-${i}`),
    _type: 'routesPageCompareColumn' as const,
    title: col.title,
    subtitle: col.subtitle,
    tone: col.tone,
  }))

  const compareRows = routesCompareRows.map((row, i) => mapCompareRow(row, i))

  const reviewsFeaturedQuotes = routesFeaturedQuoteItems.map((q, i) => ({
    ...k(`fq-${i}`),
    _type: 'routesPageFeaturedQuote' as const,
    quoteHtml: q.text,
    attribution: q.attr,
  }))

  /** Mismo trío que el seed de experience page (Vanessa, Richard, Sofia). */
  const reviewsRefs = [
    {_type: 'reference' as const, _ref: CMS_IDS.review1, _key: 'rv1'},
    {_type: 'reference' as const, _ref: CMS_IDS.review3, _key: 'rv3'},
    {_type: 'reference' as const, _ref: CMS_IDS.review5, _key: 'rv5'},
  ]

  const finalCtaTrustItems = routesFinalCta.trustItems.map((t, i) => ({
    ...k(`tr-${i}`),
    _type: 'routesPageTrustItem' as const,
    icon: t.icon,
    label: t.label,
  }))

  const experiencesFilters = routesExpFilters.map((f, i) => ({
    ...k(`pf-${i}`),
    _type: 'routesPageExpFilterPill' as const,
    filterId: f.id,
    label: f.label,
  }))

  const snapshotStats = routesSnapshotStats.map((s, i) => ({
    ...k(`st-${i}`),
    _type: 'routesPageStatLine' as const,
    value: s.value,
    label: s.label,
  }))

  const waFromHref = parseWaMeHref(routesFinalCta.whatsappHref)

  const territoryStrip = routesTerritory.strip.map((chip, i) => ({
    ...k(`ts-${i}`),
    _type: 'routesPageTerritoryStripChip' as const,
    id: chip.id,
    name: chip.name,
    meta: chip.meta,
    variant: chip.variant,
  }))

  const doc = {
    _id: CMS_IDS.routesPage,
    _type: 'routesPage' as const,
    internalTitle: 'Routes (landing)',
    slug: {_type: 'slug' as const, current: 'routes'},
    seo: {
      _type: 'seo' as const,
      title: routesSeoFallback.title,
      description: routesSeoFallback.description,
      noIndex: false,
    },
    heroImage,
    heroImageAlt: routesHero.imageAlt,
    heroEyebrow: routesHero.eyebrow,
    heroTitleLine1: routesHero.titleLine1,
    heroTitleLine2: routesHero.titleLine2,
    heroTagline: routesHero.tagline,
    heroPrimaryCta: {
      _type: 'linkWithLabel' as const,
      label: routesHero.primaryCta!.label,
      href: routesHero.primaryCta!.href,
      openInNewTab: false,
    },
    heroSecondaryCta: {
      _type: 'linkWithLabel' as const,
      label: routesHero.secondaryCta!.label,
      href: routesHero.secondaryCta!.href,
      openInNewTab: false,
    },
    /** Pilot: same targets as legacy (`#routes` → `/routes#routes`, `/experiences`). */
    heroPrimarySmartLink: {
      _type: 'smartLink' as const,
      label: routesHero.primaryCta!.label,
      linkType: 'pageSection' as const,
      internalPage: 'routesPage',
      sectionId: 'routes',
      openInNewTab: false,
    },
    heroSecondarySmartLink: {
      _type: 'smartLink' as const,
      label: routesHero.secondaryCta!.label,
      linkType: 'internalPage' as const,
      internalPage: 'experiencesIndex',
      openInNewTab: false,
    },
    snapshotStats,
    territorySectionId: routesTerritory.sectionId,
    territoryEyebrow: routesTerritory.eyebrow,
    territoryH2: routesTerritory.h2,
    territoryBody: routesTerritory.body,
    territoryStrip,
    routeCards,
    compareSectionId: routesCompareSection.sectionId,
    compareEyebrow: routesCompareSection.eyebrow,
    compareH2: routesCompareSection.h2,
    compareIntro: routesCompareSection.intro,
    compareColumns,
    compareRows,
    experiencesSectionId: routesExperiencesSection.sectionId,
    experiencesEyebrow: routesExperiencesSection.eyebrow,
    experiencesH2: routesExperiencesSection.h2,
    experiencesIntro: routesExperiencesSection.intro,
    experiencesAllLabel: routesExperiencesSection.allExperiencesLabel,
    experiencesAllHref: routesExperiencesSection.allExperiencesHref,
    experiencesAllSmartLink: {
      _type: 'smartLink' as const,
      label: routesExperiencesSection.allExperiencesLabel,
      linkType: 'internalPage' as const,
      internalPage: 'experiencesIndex' as const,
      openInNewTab: false,
    },
    selectedExperiences: [],
    fallbackToAllExperiences: true,
    experiencesFilters,
    experienceCards,
    reviewsFeaturedQuotes,
    reviewsRefs,
    reviewsEyebrow: routesReviewsUiDefaults.eyebrow,
    reviewsHeadline: routesReviewsUiDefaults.headline,
    reviewsSectionLead: routesReviewsUiDefaults.sectionLead,
    reviewsAverageRating: routesReviewsUiDefaults.averageRating,
    reviewsSourceLabel: routesReviewsUiDefaults.sourceLabel,
    reviewsSecondaryRatingLine: routesReviewsUiDefaults.secondaryRatingLine,
    finalCtaSectionId: routesFinalCta.sectionId,
    finalCtaEyebrow: routesFinalCta.eyebrow,
    finalCtaH2: routesFinalCta.h2,
    finalCtaBody: routesFinalCta.body,
    finalCtaWhatsappHref: routesFinalCta.whatsappHref,
    finalCtaWhatsappLabel: routesFinalCta.whatsappLabel,
    finalCtaSecondaryHref: routesFinalCta.secondaryHref,
    finalCtaSecondaryLabel: routesFinalCta.secondaryLabel,
    finalCtaWhatsappSmartLink: {
      _type: 'smartLink' as const,
      label: routesFinalCta.whatsappLabel,
      linkType: 'whatsapp' as const,
      whatsappNumber: waFromHref.number,
      ...(waFromHref.message ? { whatsappMessage: waFromHref.message } : {}),
      openInNewTab: true,
    },
    finalCtaSecondarySmartLink: {
      _type: 'smartLink' as const,
      label: routesFinalCta.secondaryLabel,
      linkType: 'internalPage' as const,
      internalPage: 'experiencesIndex',
      openInNewTab: false,
    },
    finalCtaTrustItems,
  }

  return stripUndefinedDeep(doc)
}
