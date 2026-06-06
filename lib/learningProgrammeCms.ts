import {
  soqtapataExperience,
  soqtapataExperienceReviewsLayout,
  type SoqtapataPhase1BreadcrumbItem,
} from '@/data/soqtapataExperienceLocal'
import { buildSoqtapataBookingSummary } from '@/lib/buildSoqtapataBookingSummary'
import {
  applyPageHeroPriceToHero,
  debugPageHeroPriceMicrocopy,
  heroPricePrefixForNav,
  mergePageHeroPriceMicrocopyWithAmount,
  resolvePageHeroPriceMicrocopy,
  resolvePageHeroRating,
} from '@/lib/pageHeroResolve'
import { buildSnapshotHighlightsBarFromCms } from '@/lib/snapshotHighlightsResolve'
import {
  HIGHLIGHT_LIST_KEY_PREFIX,
  resolvePlainStringKcList,
} from '@/lib/experienceKcStringListKeys'
import { centralFaqsForLearningProgramme, type FaqsSettingsRow } from '@/lib/faqsCms'
import { resolveExperienceProgramTypeLabel, resolveExperienceRouteLabel } from '@/lib/experienceCardLabels'
import type { ExperienceLearningContent } from '@/lib/experienceLearningTypes'
import { EXPERIENTIAL_LEARNING_PROGRAM_TYPE } from '@/lib/isExperientialLearningExperience'
import { type LearningProgrammeCmsRow } from '@/lib/learningProgrammeGroq'
import { resolveLearningProgrammeContent } from '@/lib/resolveLearningProgrammeContent'
import type { PromotionDoc } from '@/lib/promotionTypes'
import { resolveSmartLinkOrLegacy, smartLinkIsDisabled, type SmartLinkGroq } from '@/lib/resolveSmartLink'
import { DEFAULT_REVIEWS_RATING_SUMMARY } from '@/lib/reviewsRatingSummary'
import type { SoqtapataExperience, SoqtapataPageCmsPayload } from '@/lib/soqtapataCmsV1'
import { buildExperienceLearningPageNav } from '@/lib/experienceLearningNav'
import {
  alsoBookFromStructuredRow,
  buildHeroGalleryFromItems,
  buildLodgesFromCms,
  buildMediaFromGalleryItems,
  buildWildlifeFromKcList,
  experienceHasMediaSection,
  resolveExperienceResourcesFromPageRow,
  resolveLearningProgrammeLodgePresentationRows,
  reviewsLayoutFromRow,
  seoFromStructuredRow,
  type CmsWildlifeItem,
  type ResolvedExperienceMediaItem,
  type SoqtapataStructuredPageRow,
} from '@/lib/soqtapataStructuredCms'
import { mergeInternalNavIntoPageNav } from '@/lib/soqtapataInternalNav'
import {
  applySoqtapataSectionPresentation,
  type SoqtapataSectionVisibility,
} from '@/lib/soqtapataSectionPresentation'
import { mergeTermsPanelsSource, resolveTermsPdfUrlForExperience, type TermsConditionsSettingsRow } from '@/lib/termsConditionsCms'
import { mergeTravellerGuideSubsectionsSource, type TravellerGuideSettingsRow, type TravellerGuideSubsectionResolved } from '@/lib/travellerGuideCms'

const PROGRAMME_CATEGORY_LABEL: Record<string, string> = {
  volunteering: 'Volunteering',
  'science-field-learning': 'Science field learning',
  'multimedia-learning': 'Multimedia learning',
  'university-programme': 'University programme',
  'custom-learning': 'Custom learning',
}

const EL_SECTION_VISIBILITY: SoqtapataSectionVisibility = {
  hero: true,
  highlights: true,
  internalNav: true,
  overview: true,
  itinerary: false,
  lodge: true,
  wildlife: true,
  includes: true,
  tech: false,
  media: true,
  whenToVisit: false,
  beforeYouGo: true,
  reviews: false,
  terms: true,
  resources: true,
  faq: true,
  related: true,
  reserve: true,
}

function learningProgrammeSectionPresentationFromPage(
  pageRow: NonNullable<SoqtapataStructuredPageRow>,
): { eyebrow?: string; sectionTitle?: string } {
  const module = pageRow.sectionModules?.find((row) => row?.key === 'itinerary')
  return {
    eyebrow: module?.eyebrow?.trim() || undefined,
    sectionTitle: module?.sectionTitle?.trim() || undefined,
  }
}
function pickByIndices<T>(source: T[] | null | undefined, order: number[] | null | undefined): T[] | null {
  if (!source?.length) return null
  if (!order?.length) return null
  const out: T[] = []
  const seen = new Set<number>()
  for (const raw of order) {
    const i = typeof raw === 'number' ? raw : Number(raw)
    if (!Number.isFinite(i) || i < 0 || i >= source.length || seen.has(i)) continue
    seen.add(i)
    out.push(source[i]!)
  }
  return out.length ? out : null
}

function pickByKeys<T extends { _key?: string | null }>(rows: T[], keys: string[]): T[] {
  const out: T[] = []
  const seen = new Set<string>()
  for (const key of keys) {
    const k = key?.trim()
    if (!k || seen.has(k)) continue
    const row = rows.find((r) => r._key?.trim() === k)
    if (row) {
      out.push(row)
      seen.add(k)
    }
  }
  return out
}

function buildLearningBreadcrumb(title: string, routeLabel: string): SoqtapataPhase1BreadcrumbItem[] {
  const route = routeLabel.trim() || 'Route'
  const current = title.trim() || 'Programme'
  return [
    { type: 'span-muted', text: 'Home' },
    { type: 'span-muted', text: '›' },
    { type: 'span-muted', text: 'Experiences' },
    { type: 'span-muted', text: '›' },
    { type: 'span-muted', text: route },
    { type: 'span-muted', text: '›' },
    { type: 'current', text: current },
  ]
}

function resolveGalleryItems(doc: LearningProgrammeCmsRow, title: string): ResolvedExperienceMediaItem[] {
  const out: ResolvedExperienceMediaItem[] = []
  const main = doc.mainImageUrl?.trim()
  if (main) {
    out.push({
      _key: 'main-image',
      kind: 'photo',
      title,
      caption: '',
      alt: title,
      imageSrc: main,
    })
  }
  for (const [i, g] of (doc.gallery ?? []).entries()) {
    const isVideo = g.kind?.trim() === 'video' || Boolean(g.videoUrl?.trim())
    const imageSrc = g.imageUrl?.trim() || g.videoThumbnailUrl?.trim()
    if (!imageSrc) continue
    if (isVideo && g.videoUrl?.trim()) {
      out.push({
        _key: g._key?.trim() || `video-${i}`,
        kind: 'video',
        title: g.title?.trim() || title,
        caption: g.caption?.trim() || '',
        alt: g.alt?.trim() || g.title?.trim() || title,
        imageSrc,
        videoUrl: g.videoUrl.trim(),
      })
    } else {
      out.push({
        _key: g._key?.trim() || `photo-${i}`,
        kind: 'photo',
        title: g.title?.trim() || '',
        caption: g.caption?.trim() || '',
        alt: g.alt?.trim() || g.title?.trim() || title,
        imageSrc,
      })
    }
  }
  return out
}

function formatLearningHeroPriceAmount(price?: number | null, priceLabel?: string | null): string {
  const label = priceLabel?.trim()
  if (label) return label
  if (typeof price === 'number' && price > 0) {
    return `USD ${price.toLocaleString('en-US')}`
  }
  return 'Enquire'
}

function resolveBookCtaFromPage(
  pageRow: NonNullable<SoqtapataStructuredPageRow>,
  local: SoqtapataExperience,
  pageBookingSummary: ReturnType<typeof buildSoqtapataBookingSummary>,
) {
  const ph = pageRow.pageHero
  const bookSmart = ph?.bookCtaSmartLink as SmartLinkGroq | null | undefined
  const labelFallback = ph?.bookCta?.label?.trim() || local.hero.bookLabel
  const hrefFallback = ph?.bookCta?.href?.trim() || local.hero.bookUrl
  const bookResolved = resolveSmartLinkOrLegacy(
    bookSmart,
    ph?.bookCta ? { label: ph.bookCta.label, href: ph.bookCta.href, openInNewTab: ph.bookCta.openInNewTab } : undefined,
    {
      label: labelFallback,
      href: hrefFallback,
      openInNewTab: false,
    },
    { pageBookingSummary },
  )
  const bookHidden = smartLinkIsDisabled(bookSmart)
  const bookUrl = bookHidden ? '' : (bookResolved?.href ?? hrefFallback)
  const bookLabel = bookHidden ? '' : (bookResolved?.label ?? labelFallback)
  return { bookUrl, bookLabel, bookHidden }
}

function buildLearningProgrammeLodges(
  pageRow: NonNullable<SoqtapataStructuredPageRow>,
  programme: LearningProgrammeCmsRow,
  local: SoqtapataExperience,
): SoqtapataExperience['lodge'] {
  const lodge = buildLodgesFromCms(
    { lodgePresentationRows: resolveLearningProgrammeLodgePresentationRows(programme) },
    pageRow,
    local,
  )
  const titleOverride = programme.fieldBaseOverrideTitle?.trim()
  const introOverride = programme.fieldBaseOverrideText?.trim()
  return {
    ...lodge,
    ...(titleOverride ? { h2: titleOverride } : {}),
    ...(introOverride ? { intro: introOverride } : {}),
  }
}

function buildFlexibleGuideCards(
  pageRow: NonNullable<SoqtapataStructuredPageRow>,
  programme: LearningProgrammeCmsRow,
  settings: TravellerGuideSettingsRow,
  local: SoqtapataExperience,
): SoqtapataExperience['beforeYouGo'] {
  let subs = mergeTravellerGuideSubsectionsSource(settings, programme._id, null)
  const orderKeys = pageRow.travellerGuideOrderKeys
  if (orderKeys?.length && subs.length) {
    subs = pickByKeys(subs, orderKeys)
  }
  const flexCards = buildFlexibleTravelerGuideCardsFromSubsections(subs)
  if (!flexCards) return local.beforeYouGo
  return { ...local.beforeYouGo, cards: flexCards }
}

function isTravelerGuideChecklistRow(row: unknown): row is { label?: string | null; iconKey?: string | null } {
  return row != null && typeof row === 'object' && 'label' in row
}

function buildFlexibleTravelerGuideCardsFromSubsections(
  subs: TravellerGuideSubsectionResolved[] | null | undefined,
): SoqtapataExperience['beforeYouGo']['cards'] | null {
  if (!subs?.length) return null
  type BfygCard = SoqtapataExperience['beforeYouGo']['cards'][number]
  const cards: BfygCard[] = []
  for (let i = 0; i < subs.length; i++) {
    const s = subs[i]!
    const layout = s.displayType === 'checklist' ? 'checklist' : 'qa'
    const rawHi = s.headerIcon?.trim()
    const headerIcon = rawHi === 'luggage' || rawHi === 'phone' ? rawHi : 'entry'
    const id = (s._key && `bfyg-${s._key}`) || `bfyg-flex-${i}`
    const title = s.title.trim() || `Section ${cards.length + 1}`
    const defaultOpen = cards.length === 0

    if (layout === 'checklist') {
      const checklistItems = (s.rows ?? [])
        .filter(isTravelerGuideChecklistRow)
        .map((r) => {
          const row = r as { label?: string | null; iconKey?: string | null }
          return {
            label: row.label?.trim() || '',
            ...(row.iconKey?.trim() ? { iconKey: row.iconKey.trim() } : {}),
          }
        })
        .filter((x): x is { label: string; iconKey?: string } => Boolean(x.label))
      if (!checklistItems.length) continue
      cards.push({
        kind: 'flex',
        flexLayout: 'checklist',
        id,
        defaultOpen,
        title,
        headerIcon,
        items: [],
        checklistItems,
      } as BfygCard)
      continue
    }

    const items = (s.rows ?? [])
      .filter((r) => r != null && typeof r === 'object' && !isTravelerGuideChecklistRow(r))
      .map((r) => {
        const row = r as { title?: string; body?: string; iconKey?: string }
        const titleCell = row.title?.trim() || ''
        const body = row.body?.trim() || ''
        const iconKey = row.iconKey?.trim()
        if (!titleCell) return null
        return iconKey ? { title: titleCell, body, iconKey } : { title: titleCell, body }
      })
      .filter(Boolean) as { title: string; body: string; iconKey?: string }[]
    if (!items.length) continue
    cards.push({
      kind: 'flex',
      flexLayout: 'qa',
      id,
      defaultOpen,
      title,
      headerIcon,
      items,
    } as BfygCard)
  }
  return cards.length ? cards : null
}

function buildLearningTerms(
  pageRow: NonNullable<SoqtapataStructuredPageRow>,
  programme: LearningProgrammeCmsRow,
  settings: TermsConditionsSettingsRow,
  local: SoqtapataExperience,
): SoqtapataExperience['terms'] {
  let panels = mergeTermsPanelsSource(settings, programme._id, null)
  const orderKeys = pageRow.termsOrderKeys
  if (orderKeys?.length && panels.length) {
    panels = pickByKeys(panels, orderKeys)
  }
  if (!panels.length) return local.terms
  const pdf = resolveTermsPdfUrlForExperience(settings, programme._id, null)
  return {
    ...local.terms,
    ...(pdf ? { pdfHref: pdf } : {}),
    cards: panels.map((p, i) => ({
      id: p._key ? `terms-panel-${p._key}` : `terms-panel-${i}`,
      title: p.title?.trim() || '',
      body: p.text?.trim() || '',
    })),
  }
}

function buildLearningFaqs(
  pageRow: NonNullable<SoqtapataStructuredPageRow>,
  programme: LearningProgrammeCmsRow,
  settings: FaqsSettingsRow,
  local: SoqtapataExperience,
): SoqtapataExperience['faq'] {
  let faqs = centralFaqsForLearningProgramme(settings, programme._id)
  const orderKeys = pageRow.faqOrderKeys
  if (orderKeys?.length && faqs.length) {
    faqs = pickByKeys(faqs, orderKeys)
  }
  if (!faqs.length) return local.faq
  return {
    ...local.faq,
    items: faqs.map((f, i) => ({
      id: f._key || `faq${i + 1}`,
      question: f.title,
      answer: f.body,
    })),
  }
}

export type LearningProgrammePagePayload = SoqtapataPageCmsPayload & {
  pageKind: 'learning'
  learningContent: ExperienceLearningContent
}

export function buildLearningPagePayloadFromStructuredRow(
  pageRow: NonNullable<SoqtapataStructuredPageRow>,
  programme: LearningProgrammeCmsRow,
  settings: {
    faqs: FaqsSettingsRow | null
    terms: TermsConditionsSettingsRow | null
    travellerGuide: TravellerGuideSettingsRow | null
  },
  promotions?: PromotionDoc[] | null,
): LearningProgrammePagePayload {
  const local = structuredClone(soqtapataExperience) as SoqtapataExperience
  const ph = pageRow.pageHero
  debugPageHeroPriceMicrocopy(pageRow.slug?.current?.trim() || pageRow._id, ph)
  const programmeTitle = programme.title?.trim() || 'Learning programme'
  const title = ph?.headline?.trim() || programmeTitle
  const routeLabel = resolveExperienceRouteLabel({
    routeLabel: programme.routeRef?.shortLabel || programme.routeRef?.name,
    routeSlug: programme.routeRef?.slug,
  })
  const programLabel = resolveExperienceProgramTypeLabel(EXPERIENTIAL_LEARNING_PROGRAM_TYPE)
  const categoryLabel = PROGRAMME_CATEGORY_LABEL[programme.programmeCategory?.trim() ?? ''] ?? 'Experiential Learning'
  const duration = programme.durationDisplay?.trim() || ''
  const priceMicrocopy = resolvePageHeroPriceMicrocopy(ph)
  const heroPrice = mergePageHeroPriceMicrocopyWithAmount(ph, {
    amount: formatLearningHeroPriceAmount(programme.price, programme.priceLabel),
  })
  const navFromLabel = heroPricePrefixForNav(priceMicrocopy.prefix)
  const heroRating = resolvePageHeroRating(ph, local.hero)
  const galleryItems = resolveGalleryItems(programme, title)
  const heroGallery = buildHeroGalleryFromItems(galleryItems)
  const media = buildMediaFromGalleryItems(galleryItems, local.media, title)
  const learningContent = resolveLearningProgrammeContent(programme)
  const lodge = buildLearningProgrammeLodges(pageRow, programme, local)
  const reviewsLayout = reviewsLayoutFromRow(pageRow, soqtapataExperienceReviewsLayout)

  let experience = { ...local, lodge } as SoqtapataExperience
  experience.hero = {
    ...applyPageHeroPriceToHero(local.hero, heroPrice),
    priceFrom: priceMicrocopy.prefix,
    priceSub: priceMicrocopy.suffix,
    ...(priceMicrocopy.footnote ? { priceFootnote: priceMicrocopy.footnote } : {}),
    h1: title,
    tagline: ph?.headlineSub?.trim() || programme.shortDescription?.trim() || local.hero.tagline,
    gallery: heroGallery.length ? heroGallery : local.hero.gallery,
    breadcrumb: buildLearningBreadcrumb(title, routeLabel),
    badges: [programLabel, routeLabel || categoryLabel, duration].filter(Boolean),
    bookUrl: local.hero.bookUrl,
    bookLabel: local.hero.bookLabel,
    ratingDivider: false,
    ratingScore: heroRating.ratingScore,
    ratingReviews: heroRating.ratingReviews,
  }

  let pageBookingSummary = buildSoqtapataBookingSummary(experience.hero, experience.book)
  const { bookUrl, bookLabel, bookHidden } = resolveBookCtaFromPage(pageRow, local, pageBookingSummary)
  experience.hero = {
    ...experience.hero,
    bookUrl,
    bookLabel,
  }
  experience.pageNav = buildExperienceLearningPageNav({
    ...local.pageNav,
    leadName: title,
    leadDays: duration,
    fromLabel: navFromLabel,
    fromNum: heroPrice.amount,
    fromSub: priceMicrocopy.suffix,
    fromAriaLabel: navFromLabel
      ? `${navFromLabel} ${heroPrice.amount}${priceMicrocopy.suffix ? ` ${priceMicrocopy.suffix}` : ''}`
      : heroPrice.amount || title,
    bookHref: bookUrl,
    bookLabel,
    ...(bookHidden ? { bookVisible: false } : {}),
  })
  experience = {
    ...experience,
    stats: buildSnapshotHighlightsBarFromCms(
      programme.snapshotHighlights,
      pageRow.snapshotHighlightOrderKeys,
    ),
    overview: {
      ...local.overview,
      paragraphs: ['', ''] as [string, string],
      highlights: resolvePlainStringKcList(
        programme.overviewHighlights,
        pageRow.overviewHighlightKeys,
        pageRow.overviewHighlightOrder,
        HIGHLIGHT_LIST_KEY_PREFIX,
        'overview highlights',
        pickByIndices,
      ).slice(0, 6),
    },
    includes: {
      ...local.includes,
      yes: programme.includes?.filter((x) => x?.trim()).map((x) => x.trim()) ?? local.includes.yes,
      no: programme.notIncludes?.filter((x) => x?.trim()).map((x) => x.trim()) ?? local.includes.no,
    },
    media: media ?? local.media,
    wildlife:
      buildWildlifeFromKcList(programme.wildlife as CmsWildlifeItem[] | null | undefined, pageRow, local) ?? {
        ...local.wildlife,
        species: [],
      },
    resources: resolveExperienceResourcesFromPageRow(
      pageRow,
      {
        resources: programme.resources ?? null,
        experienceId: programme._id,
      },
      local,
    ),
    beforeYouGo: buildFlexibleGuideCards(pageRow, programme, settings.travellerGuide ?? null, local),
    terms: buildLearningTerms(pageRow, programme, settings.terms ?? null, local),
    faq: buildLearningFaqs(pageRow, programme, settings.faqs ?? null, local),
    book: {
      ...local.book,
      rows: local.book.rows.map((row) => {
        if (row.label === 'Program') return { ...row, value: programLabel }
        if (row.label === 'Route') return { ...row, value: routeLabel || row.value }
        if (row.label === 'Duration') return { ...row, value: duration || row.value }
        return row
      }),
    },
  }

  pageBookingSummary = buildSoqtapataBookingSummary(experience.hero, experience.book)
  const alsoBook = alsoBookFromStructuredRow(pageRow, local, pageBookingSummary, promotions)
  if (alsoBook.also) {
    experience = {
      ...experience,
      also: {
        ...experience.also,
        ...alsoBook.also,
      },
    }
  }
  if (alsoBook.book) {
    experience = {
      ...experience,
      book: { ...experience.book, ...alsoBook.book },
    }
  }

  const pres = applySoqtapataSectionPresentation({
    experience,
    reviewsLayout,
    sectionModules: pageRow.sectionModules ?? null,
    pageReviews: pageRow.reviewsSection ?? null,
  })
  let sectionVisibility: SoqtapataSectionVisibility = { ...EL_SECTION_VISIBILITY, ...pres.sectionVisibility }

  const pageNavFromCms = mergeInternalNavIntoPageNav(pageRow.internalNav, experience.pageNav, sectionVisibility)
  if (pageNavFromCms) {
    experience = { ...experience, pageNav: pageNavFromCms }
  }

  const programmeSeoFallback = {
    title: programme.seo?.title?.trim() || `${programmeTitle} — Ecotone`,
    description: programme.seo?.description?.trim() || programme.shortDescription?.trim() || '',
  }

  if (!experienceHasMediaSection(experience.media)) {
    sectionVisibility = { ...sectionVisibility, media: false }
  }

  const programmePresentation = learningProgrammeSectionPresentationFromPage(pageRow)

  return {
    experience,
    pageKind: 'learning',
    programType: EXPERIENTIAL_LEARNING_PROGRAM_TYPE,
    reviewsLayout,
    doc: { _id: pageRow._id, slug: pageRow.slug, seo: pageRow.seo ?? null },
    cmsError: null,
    seo: seoFromStructuredRow(pageRow, programmeSeoFallback),
    sectionVisibility,
    reviewsSectionLead: pres.reviewsSectionLead,
    reviewsRatingSummary: { ...DEFAULT_REVIEWS_RATING_SUMMARY },
    rotatingQuoteItems: [],
    offerTerms: [],
    learningContent: {
      ...learningContent,
      programmeSectionEyebrow: programmePresentation.eyebrow,
      programmeSectionTitle: programmePresentation.sectionTitle,
    },
  }
}
