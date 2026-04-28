/**
 * Sanity → shape `soqtapataExperience` (mismo que `data/soqtapataExperienceLocal.ts`).
 * Solo capa de datos: URLs de imagen, mapeo de campos, partial para `deepMergeWithLocalFallback`.
 */
import type { SanityImageSource } from '@sanity/image-url'

import { soqtapataExperience } from '@/data/soqtapataExperienceLocal'
import type {
  SoqtapataAlsoCamanti,
  SoqtapataBook,
  SoqtapataRelatedCardImage,
  SoqtapataWhen,
  SoqtapataWhenMonth,
} from '@/data/soqtapataExperienceLocal'

type SoqtapataExperience = typeof soqtapataExperience
import type { ReviewDoc, TechnologyProductDoc } from '@/lib/queries'
import type { CmsInternalNav } from '@/lib/soqtapataInternalNav'
import type { SoqtapataPageModuleRow } from '@/lib/soqtapataSectionPresentation'
import { urlFor } from '@/lib/sanity'

// --- public row shape (subset of GROQ result) ---

export type SoqtapataStructuredPageRow = {
  _id: string
  internalTitle?: string | null
  slug?: { current?: string | null } | null
  seo?: { title?: string | null; description?: string | null } | null
  /** Overrides por bloque (eyebrow, título, intro, visible). */
  sectionModules?: SoqtapataPageModuleRow[] | null
  pageHero?: CmsPageHero | null
  reviewsLayout?: CmsReviewsLayout | null
  reviewRefs?: unknown[] | null
  reviewDocs?: CmsReviewDoc[] | null
  techProductRefs?: unknown[] | null
  techProductDocs?: CmsTechProduct[] | null
  includedTechProductIds?: string[] | null
  relatedSectionEyebrow?: string | null
  relatedSectionTitle?: string | null
  relatedRefIds?: string[] | null
  relatedExperiencesFromLanding?: CmsRelatedExperience[] | null
  reserveBlock?: CmsReserveBlock | null
  internalNav?: CmsInternalNav | null
  experience?: CmsExperience | null
} | null

type CmsRelatedExperience = {
  _id: string
  name?: string | null
  tagline?: string | null
  programType?: string | null
  route?: string | null
  duration?: string | null
  price?: number | null
  priceLabel?: string | null
  shortDescription?: string | null
  mainImageUrl?: string | null
  slug?: string | null
}

type CmsReserveBlock = {
  eyebrow?: string | null
  headline?: string | null
  price?: string | null
  priceNote?: string | null
  priceSub?: string | null
  infoRows?: { label?: string | null; value?: string | null }[] | null
  wetravelUrl?: string | null
  wetravelLabel?: string | null
  whatsappUrl?: string | null
  whatsappLabel?: string | null
  legalNote?: string | null
  legalTermsLink?: string | null
}

type CmsPageHero = {
  eyebrow?: string | null
  headline?: string | null
  headlineSub?: string | null
  pills?: string[] | null
  priceLine?: string | null
  priceSub?: string | null
  useProductPrice?: boolean | null
  bookCta?: { label?: string | null; href?: string | null } | null
  heroImage?: { image?: SanityImageSource | null; alt?: string | null; imageUrl?: string | null } | null
} | null

type CmsReviewsLayout = {
  eyebrow?: string | null
  headline?: string | null
  averageRating?: string | null
  sectionClassName?: string | null
  contentInnerClassName?: string | null
  useHomepageSampleReviewsIfEmpty?: boolean | null
} | null

type CmsReviewDoc = {
  _id: string
  quote?: string | null
  authorName?: string | null
  authorCity?: string | null
  authorCountry?: string | null
  experienceName?: string | null
  rating?: number | null
  isFeatured?: boolean | null
}

type CmsTechProduct = {
  _id: string
  stableId?: string | null
  name?: string | null
  number?: string | null
  description?: string | null
  image?: SanityImageSource | null
  badgeText?: string | null
  badgeTextWhenExcluded?: string | null
  slug?: { current?: string | null } | null
}

type CmsExperience = {
  _id: string
  name?: string | null
  tagline?: string | null
  programType?: string | null
  route?: string | null
  duration?: string | null
  price?: number | null
  priceLabel?: string | null
  shortDescription?: string | null
  fullDescription?: string | null
  mainImage?: SanityImageSource | null
  mainImageUrl?: string | null
  gallery?: CmsGalleryItem[] | null
  videoUrl?: string | null
  videoTitle?: string | null
  videoDuration?: string | null
  highlights?: string[] | null
  itinerary?: CmsItineraryDay[] | null
  includes?: string[] | null
  notIncludes?: string[] | null
  lodge?: CmsLodge | null
  lodgeNightLabel?: string | null
  groupSizeMin?: number | null
  groupSizeMax?: number | null
  altitude?: string | null
  distanceFromCusco?: string | null
  ecosystem?: string | null
  wildlife?: CmsWildlifeItem[] | null
  includedTechProducts?: unknown[] | null
  includedTechProductDocs?: CmsTechProduct[] | null
  bestTimeByMonth?: CmsMonthRow[] | null
  entryRequirements?: { title?: string; description?: string }[] | null
  packingList?: string[] | null
  gettingHereInfo?: { title?: string; description?: string }[] | null
  cancellationPolicy?: string | null
  termsAndConditions?: string | null
  importantNotes?: string[] | null
  mapPdfUrl?: string | null
  mapPdfLabel?: string | null
  brochurePdfUrl?: string | null
  brochurePdfLabel?: string | null
  faqs?: { question?: string; answer?: string }[] | null
  seo?: { title?: string | null; description?: string | null } | null
  routeDocument?: { name?: string | null; shortDescription?: string | null; slug?: { current?: string | null } | null } | null
} | null

type CmsGalleryItem = {
  image?: SanityImageSource | null
  imageUrl?: string | null
  caption?: string | null
  category?: string | null
}

type CmsItineraryDay = {
  dayNumber?: number | null
  title?: string | null
  subtitle?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
  photoCaption?: string | null
  timeline?: { time?: string; title?: string; description?: string }[] | null
  lodgeOvernight?: string | null
  lodgeSub?: string | null
}

type CmsWildlifeItem = { name?: string; description?: string | null; iconType?: string | null }

type CmsLodge = {
  _id?: string
  name?: string | null
  shortDescription?: string | null
  altitude?: string | null
  route?: string | null
  mainImageUrl?: string | null
  amenities?: string[] | null
}

type CmsMonthRow = { month?: string; highlight?: string; level?: string }

// --- mappers ---

const PROGRAM: Record<string, string> = {
  'nature-core': 'Nature Core',
  'family-adventure': 'Family Adventure',
  'experiential-learning': 'Exp. Learning',
  'tailor-made': 'Tailor Made',
}

const ROUTE: Record<string, string> = {
  camanti: 'Camanti Route',
  'manu-road': 'Manu Road',
  'manu-core': 'Manu Core',
}

const MONTH_SLUG: Record<string, string> = {
  january: 'January',
  february: 'February',
  march: 'March',
  april: 'April',
  may: 'May',
  june: 'June',
  july: 'July',
  august: 'August',
  september: 'September',
  october: 'October',
  november: 'November',
  december: 'December',
}

const W_ICON: Record<string, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
  bird: 0,
  bear: 1,
  cat: 2,
  jaguar: 3,
  monkey: 5,
  otter: 6,
  reptile: 4,
  fish: 4,
  plant: 4,
  insect: 4,
  generic: 6,
}

const DAY_IDS = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7', 'day8', 'day9', 'day10'] as const

function imgW(src: string | null | undefined, w: number): string | null {
  if (!src) return null
  return src
}

function assetToUrl(
  source: SanityImageSource | null | undefined,
  width: number,
  fallback: string,
): string {
  if (!source) return fallback
  try {
    return urlFor(source).width(width).quality(85).url() || fallback
  } catch {
    return fallback
  }
}

function techToDoc(t: CmsTechProduct | null | undefined): TechnologyProductDoc {
  if (!t) {
    return { _id: '' }
  }
  return {
    _id: (t.stableId || t._id) as string,
    name: t.name,
    number: t.number,
    description: t.description,
    image: t.image ?? null,
    badgeText: t.badgeText,
    badgeTextWhenExcluded: t.badgeTextWhenExcluded,
    slug: t.slug ? { current: t.slug.current ?? undefined } : null,
  }
}

function reviewToDoc(r: CmsReviewDoc | null | undefined): ReviewDoc | null {
  if (!r?._id) return null
  return {
    _id: r._id,
    quote: r.quote,
    authorName: r.authorName,
    authorCity: r.authorCity,
    authorCountry: r.authorCountry,
    experienceName: r.experienceName,
    rating: r.rating,
    isFeatured: r.isFeatured,
  }
}

function levelToCardClass(
  level: string | null | undefined,
): 'default' | 'good' | 'peak' {
  if (level === 'peak') return 'peak'
  if (level === 'good') return 'good'
  return 'default'
}

function levelToBar(level: 'default' | 'good' | 'peak'): string {
  if (level === 'peak') return 'linear-gradient(90deg,var(--brown-dk),var(--brown-xdk))'
  if (level === 'good') return 'linear-gradient(90deg,var(--brown),var(--brown-dk))'
  return 'linear-gradient(90deg,#5a8a3a,#4a7a2a)'
}

function levelToStars(level: 'default' | 'good' | 'peak'): { level: 1 | 2; aria: string } | null {
  if (level === 'peak') return { level: 2, aria: 'Peak season' }
  if (level === 'good') return { level: 1, aria: 'Great season' }
  return null
}

function whenMonthFromCms(m: CmsMonthRow, base: SoqtapataWhen, idx: number): SoqtapataWhenMonth {
  const b = base.months[idx]!
  const cardClass = levelToCardClass(m.level)
  const cc = cardClass as 'default' | 'good' | 'peak'
  const name = (m.month && MONTH_SLUG[m.month]) || b.name
  return {
    cardClass: cc,
    barStyle: levelToBar(cc),
    name,
    stars: levelToStars(cc),
    highlight: m.highlight && m.highlight.trim() ? m.highlight : b.highlight,
  }
}

/**
 * Construye un `Partial<SoqtapataExperience>` desde el row GROQ (ya dereferenciado).
 * Omite claves que no tienen datos CMS útiles; el merge con local rellena el resto.
 */
export function soqtapataPartialFromStructuredRow(
  row: SoqtapataStructuredPageRow,
  local: SoqtapataExperience = soqtapataExperience,
): Partial<SoqtapataExperience> {
  if (!row?.experience) return {}
  const e = row.experience
  const ph = row.pageHero
  const l = local

  const programBadge = (e.programType && PROGRAM[e.programType]) || 'Nature Core'
  const routeBadge = (e.route && ROUTE[e.route]) || 'Camanti Route'
  const priceLine =
    ph?.useProductPrice !== false
      ? ph?.priceLine?.trim() ||
        e.priceLabel?.trim() ||
        (e.price != null && e.price > 0 ? `USD ${e.price}` : undefined) ||
        l.hero.price
      : ph?.priceLine?.trim() || l.hero.price
  const priceSubline = ph?.priceSub?.trim() || l.hero.priceSub
  const h1 = (ph?.headline && ph.headline.trim()) || e.name?.trim() || l.hero.h1
  const tag = (ph?.headlineSub && ph.headlineSub.trim()) || e.tagline?.trim() || l.hero.tagline
  const badges =
    (ph?.pills && ph.pills.length > 0) ? ph.pills : [programBadge, routeBadge, e.duration || l.stats[0]?.n || '3D · 2N']
  const bookUrl = (ph?.bookCta?.href && ph.bookCta.href.trim()) || l.hero.bookUrl
  const bookLabel = (ph?.bookCta?.label && ph.bookCta.label.trim()) || l.hero.bookLabel

  const mainFallback = l.hero.gallery[0]?.imageSrc || ''
  const mainUrl = e.mainImageUrl || (e.mainImage ? assetToUrl(e.mainImage, 1200, mainFallback) : null) || mainFallback
  const gal = e.gallery && e.gallery.length > 0 ? e.gallery : null

  const galleryCells =
    gal && gal.length > 0
      ? (() => {
          const g0 = gal[0]!
          const u0 = g0.imageUrl || (g0.image ? assetToUrl(g0.image, 900, mainUrl) : mainUrl)
          const u1 = gal[1]
            ? gal[1]!.imageUrl || (gal[1]!.image
                ? assetToUrl(gal[1]!.image, 500, l.hero.gallery[1]?.imageSrc || u0)
                : l.hero.gallery[1]?.imageSrc)
            : l.hero.gallery[1]?.imageSrc
          const u2 = gal[2]
            ? gal[2]!.imageUrl || (gal[2]!.image
                ? assetToUrl(gal[2]!.image, 500, l.hero.gallery[2]?.imageSrc || u0)
                : l.hero.gallery[2]?.imageSrc)
            : l.hero.gallery[2]?.imageSrc
          const cap0 = (g0.caption && g0.caption.slice(0, 80)) || 'Main'
          return [
            {
              kind: 'main' as const,
              dataExpLb: '0',
              ariaLabel: 'Open photo gallery, image 1',
              imageSrc: u0,
              imageAlt: cap0,
            },
            {
              kind: 'thumb' as const,
              dataExpLb: '0',
              ariaLabel: 'Open photo gallery, image 1',
              imageSrc: u1 || u0,
              imageAlt: cap0,
              galleryLabel: (gal[1]?.caption && gal[1]!.caption.slice(0, 40)) || 'Gallery',
            },
            {
              kind: 'thumb' as const,
              dataExpLb: '1',
              ariaLabel: 'Open photo gallery, image 2',
              imageSrc: u2 || u0,
              imageAlt: (gal[2]?.caption && gal[2]!.caption.slice(0, 40)) || 'More',
              stylePositionRelative: true,
              galleryLabel: (gal[2]?.caption && gal[2]!.caption.slice(0, 40)) || 'Cloud forest',
              moreBadge: l.hero.gallery[2]!.moreBadge,
            },
          ]
        })()
      : (ph?.heroImage?.imageUrl || ph?.heroImage?.image) &&
        (() => {
          const ov = ph.heroImage!.imageUrl || assetToUrl(ph!.heroImage!.image!, 1200, mainUrl)
          const alt = ph!.heroImage!.alt || h1
          return [
            { kind: 'main' as const, dataExpLb: '0', ariaLabel: 'Hero', imageSrc: ov, imageAlt: alt },
            ...l.hero.gallery.slice(1, 3),
          ]
        })()

  const br = [...l.hero.breadcrumb] as (typeof l.hero)['breadcrumb']
  const routeName = (e.routeDocument && e.routeDocument.name) || ROUTE[e.route || ''] || (br[4] as { type: 'link'; text: string }).text
  ;(br[4] as { type: 'link'; href: string; text: string }) = { type: 'link', href: '#', text: routeName }

  const out: Partial<SoqtapataExperience> = {
    hero: {
      ...l.hero,
      h1,
      tagline: tag,
      badges,
      price: priceLine,
      priceSub: priceSubline,
      bookUrl,
      bookLabel,
      breadcrumb: br,
      lodgeName: (e.lodge && e.lodge.name) || l.hero.lodgeName,
      ...(galleryCells ? { gallery: galleryCells } : {}),
    },
    pageNav: {
      ...l.pageNav,
      leadName: h1,
      leadDays: (e.duration && e.duration.trim()) || l.pageNav.leadDays,
      fromNum: priceLine,
      fromAriaLabel: `From ${priceLine} per person`,
      bookHref: bookUrl,
      bookLabel,
    },
  }

  if (e.shortDescription || e.fullDescription) {
    const full = (e.fullDescription && e.fullDescription.trim()) || ''
    const parts = full.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    out.overview = {
      ...l.overview,
      h2: l.overview.h2,
      eyebrow: l.overview.eyebrow,
      paragraphs: [
        (parts[0] || (e.shortDescription && e.shortDescription.trim()) || l.overview.paragraphs[0])!,
        (parts[1] || l.overview.paragraphs[1])!,
      ] as [string, string],
      highlights: (e.highlights && e.highlights.length > 0 ? e.highlights : l.overview.highlights) as string[],
    }
  } else if (e.highlights && e.highlights.length > 0) {
    out.overview = { ...l.overview, highlights: e.highlights }
  }

  if (e.itinerary && e.itinerary.length > 0) {
    out.itinerary = {
      ...l.itinerary,
      days: e.itinerary.map((d, i) => {
        const id = (DAY_IDS[i] || 'day1') as 'day1' | 'day2' | 'day3'
        const photo = d.imageUrl || (d.image ? assetToUrl(d.image, 1000, l.itinerary.days[i]!.photoSrc) : l.itinerary.days[i]!.photoSrc)
        return {
          ...l.itinerary.days[i]!,
          id,
          dayNum: String(d.dayNumber ?? i + 1),
          title: d.title || l.itinerary.days[i]!.title,
          subtitle: d.subtitle || l.itinerary.days[i]!.subtitle,
          photoSrc: photo,
          photoAlt: d.title || l.itinerary.days[i]!.photoAlt,
          caption: d.photoCaption || l.itinerary.days[i]!.caption,
          timeline: (d.timeline && d.timeline.length > 0
            ? d.timeline.map((t) => ({
                time: t.time || '',
                title: t.title || '',
                desc: t.description || '',
              }))
            : l.itinerary.days[i]!.timeline) as (typeof l.itinerary)['days'][0]['timeline'],
          lodgeBadge:
            d.lodgeOvernight || d.lodgeSub
              ? { name: d.lodgeOvernight || '', sub: d.lodgeSub || '' }
              : l.itinerary.days[i]!.lodgeBadge,
        }
      }),
    }
  }

  if (e.lodge && (e.lodge.name || e.lodge.shortDescription || e.lodge.mainImageUrl)) {
    const ld = l.lodge
    out.lodge = {
      ...ld,
      intro:
        (e.lodge!.shortDescription && e.lodge!.shortDescription.trim()) || ld.intro,
      card: {
        ...ld.card,
        name: (e.lodge!.name && e.lodge.name.trim()) || ld.card.name,
        imageSrc: (e.lodge.mainImageUrl && imgW(e.lodge.mainImageUrl, 500)) || ld.card.imageSrc,
        nightBadge: (e.lodgeNightLabel && e.lodgeNightLabel.trim()) || ld.card.nightBadge,
        meta:
          [e.lodge!.altitude, e.lodge!.route && ROUTE[e.lodge!.route] || e.lodge!.route, e.lodge!.shortDescription]
            .filter(Boolean)
            .join(' · ') || ld.card.meta,
        chips: (e.lodge.amenities && e.lodge.amenities.length > 0 ? e.lodge.amenities : ld.card.chips) as string[],
      },
    }
  }

  if (e.wildlife && e.wildlife.length > 0) {
    out.wildlife = {
      ...l.wildlife,
      species: e.wildlife.map((s, i) => ({
        name: s.name || l.wildlife.species[i]?.name || '',
        sub: s.description || l.wildlife.species[i]?.sub || '',
        iconId: (s.iconType && W_ICON[s.iconType] !== undefined ? W_ICON[s.iconType]! : l.wildlife.species[i]!.iconId) as
          | 0
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6,
      })),
    }
  }

  if ((e.includes && e.includes.length > 0) || (e.notIncludes && e.notIncludes.length > 0)) {
    out.includes = {
      ...l.includes,
      yes: (e.includes && e.includes.length > 0 ? e.includes : l.includes.yes) as string[],
      no: (e.notIncludes && e.notIncludes.length > 0 ? e.notIncludes : l.includes.no) as string[],
    }
  }

  if (e.groupSizeMax != null || e.altitude || e.distanceFromCusco || e.ecosystem || e.duration) {
    const st = l.stats
    out.stats = [
      { n: (e.duration && e.duration.trim()) || st[0]!.n, l: st[0]!.l },
      { n: (e.distanceFromCusco && e.distanceFromCusco.trim()) || st[1]!.n, l: st[1]!.l },
      { n: (e.altitude && e.altitude.trim()) || st[2]!.n, l: st[2]!.l },
      { n: (e.groupSizeMax != null ? `Max ${e.groupSizeMax}` : st[3]!.n) || st[3]!.n, l: st[3]!.l },
      { n: st[4]!.n, l: st[4]!.l },
      { n: (e.ecosystem && e.ecosystem.trim()) || st[5]!.n, l: st[5]!.l },
    ]
  }

  if (e.bestTimeByMonth && e.bestTimeByMonth.length === 12) {
    out.when = {
      ...l.when,
      months: e.bestTimeByMonth.map((m, i) => whenMonthFromCms(m, l.when, i)),
    } as SoqtapataWhen
  }

  if (e.entryRequirements?.length || e.packingList?.length || e.gettingHereInfo?.length) {
    const c0 = l.beforeYouGo.cards[0] as { id: string; items: { title: string; body: string }[] }
    const c1 = l.beforeYouGo.cards[1] as { id: string; packItems: string[]; lead: string }
    const c2 = l.beforeYouGo.cards[2] as { id: string; items: { title: string; body: string }[] }
    out.beforeYouGo = { ...l.beforeYouGo, cards: [...l.beforeYouGo.cards] }
    if (e.entryRequirements && e.entryRequirements.length > 0) {
      ;(out.beforeYouGo!.cards[0] as typeof c0).items = e.entryRequirements.map((x) => ({
        title: x.title || '',
        body: x.description || '',
      }))
    }
    if (e.packingList && e.packingList.length > 0) {
      ;(out.beforeYouGo!.cards[1] as typeof c1).packItems = e.packingList
    }
    if (e.gettingHereInfo && e.gettingHereInfo.length > 0) {
      ;(out.beforeYouGo!.cards[2] as typeof c2).items = e.gettingHereInfo.map((x) => ({
        title: x.title || '',
        body: x.description || '',
      }))
    }
  }

  if (e.cancellationPolicy?.trim() || e.termsAndConditions?.trim() || (e.importantNotes && e.importantNotes.length > 0)) {
    const tc = l.terms
    const cards = tc.cards.map((c, i) => {
      if (i === 0 && e.cancellationPolicy && e.cancellationPolicy.trim()) {
        return { ...c, body: e.cancellationPolicy.trim() }
      }
      if (i === 1 && e.termsAndConditions && e.termsAndConditions.trim()) {
        return { ...c, body: e.termsAndConditions.trim() }
      }
      if (i === 4 && e.importantNotes && e.importantNotes.length > 0) {
        return { ...c, body: [c.body, e.importantNotes.join('\n')].filter(Boolean).join('\n\n') }
      }
      return c
    })
    out.terms = { ...tc, cards }
  }

  if (e.mapPdfUrl || e.brochurePdfUrl) {
    const res = l.resources
    const cards = res.cards.map((c, i) => {
      if (i === 0 && c.kind === 'map' && e.mapPdfUrl) {
        return { ...c, downloadHref: e.mapPdfUrl, downloadLabel: e.mapPdfLabel || c.downloadLabel }
      }
      if (i === 1 && c.kind === 'brochure' && e.brochurePdfUrl) {
        return { ...c, downloadHref: e.brochurePdfUrl, downloadLabel: e.brochurePdfLabel || c.downloadLabel }
      }
      return c
    })
    out.resources = { ...res, cards }
  }

  if (e.faqs && e.faqs.length > 0) {
    out.faq = {
      ...l.faq,
      items: e.faqs.map((f, i) => ({
        id: `faq${i + 1}`,
        question: f.question || '',
        answer: f.answer || '',
      })),
    }
  }

  if (e.videoUrl || (e.gallery && e.gallery.length > 0)) {
    const m = l.media
    const videoImg =
      (e.mainImage && assetToUrl(e.mainImage, 1200, m.video.imageSrc)) ||
      (e.gallery && e.gallery[0] && (e.gallery[0]!.imageUrl || (e.gallery[0]!.image && assetToUrl(e.gallery[0]!.image!, 1200, m.video.imageSrc)))) ||
      m.video.imageSrc
    out.media = {
      ...m,
      video: {
        ...m.video,
        imageSrc: videoImg,
        imageAlt: (e.videoTitle && e.videoTitle.trim()) || m.video.imageAlt,
        filmPill: h1,
        officialPill: m.video.officialPill,
      },
    }
  }

  return out
}

export function reviewsFromRow(row: SoqtapataStructuredPageRow): ReviewDoc[] | null {
  const docs = row?.reviewDocs
  if (!docs || docs.length === 0) return null
  return docs.map((d) => reviewToDoc(d)).filter((x): x is ReviewDoc => x != null)
}

export function techProductsFromRow(row: SoqtapataStructuredPageRow): TechnologyProductDoc[] | null {
  const docs = row?.techProductDocs
  if (docs && docs.length > 0) {
    return docs.map((d) => techToDoc(d))
  }
  const fromExp = row?.experience?.includedTechProductDocs
  if (fromExp && fromExp.length > 0) {
    return fromExp.map((d) => techToDoc(d))
  }
  return null
}

export function includedIdsFromRow(row: SoqtapataStructuredPageRow): string[] | null {
  const ids = row?.includedTechProductIds
  if (!ids || ids.length === 0) return null
  return [...ids]
}

export function reviewsLayoutFromRow(
  row: SoqtapataStructuredPageRow,
  defaults: typeof import('@/data/soqtapataExperienceLocal').soqtapataExperienceReviewsLayout,
): typeof import('@/data/soqtapataExperienceLocal').soqtapataExperienceReviewsLayout {
  const r = row?.reviewsLayout
  if (!r) return { ...defaults }
  const out = { ...defaults } as Record<string, unknown>
  if (r.eyebrow?.trim()) out.eyebrow = r.eyebrow.trim()
  if (r.headline?.trim()) out.headline = r.headline.trim()
  if (r.averageRating?.trim()) out.averageRating = r.averageRating.trim()
  if (r.sectionClassName?.trim()) out.sectionClassName = r.sectionClassName.trim()
  if (r.contentInnerClassName?.trim()) out.contentInnerClassName = r.contentInnerClassName.trim()
  if (r.useHomepageSampleReviewsIfEmpty != null) out.useHomepageSampleReviewsIfEmpty = r.useHomepageSampleReviewsIfEmpty
  return out as typeof import('@/data/soqtapataExperienceLocal').soqtapataExperienceReviewsLayout
}

export function seoFromStructuredRow(
  row: SoqtapataStructuredPageRow | null | undefined,
  fallbacks: { title: string; description: string },
): { title: string; description: string } {
  if (!row) return fallbacks
  const pageSeo = row.seo
  const expSeo = row.experience?.seo
  return {
    title: (pageSeo?.title && pageSeo.title.trim()) || (expSeo?.title && expSeo.title.trim()) || fallbacks.title,
    description:
      (pageSeo?.description && pageSeo.description.trim()) || (expSeo?.description && expSeo.description.trim()) || fallbacks.description,
  }
}

function strOrNull(v: unknown): string | null {
  if (v == null) return null
  const s = typeof v === 'string' ? v.trim() : String(v).trim()
  return s.length > 0 ? s : null
}

function orderRelatedByRefs(
  docs: CmsRelatedExperience[] | null | undefined,
  refIds: string[] | null | undefined,
): CmsRelatedExperience[] {
  if (!docs?.length) return []
  if (!refIds?.length) return docs
  const m = new Map(docs.map((d) => [d._id, d]))
  return refIds.map((id) => m.get(id)).filter((x): x is CmsRelatedExperience => x != null)
}

function relatedExperienceToCard(
  exp: CmsRelatedExperience,
  fallbackImage: string,
): SoqtapataRelatedCardImage {
  const programLabel = (exp.programType && PROGRAM[exp.programType]) || 'Experience'
  const routeLabel = (exp.route && ROUTE[exp.route]) || exp.route || ''
  const pillLeft = programLabel
  const pillRight = (exp.duration && exp.duration.trim()) || '—'
  const typeLabel = programLabel
  const firstLine =
    (exp.shortDescription && exp.shortDescription.trim().split(/\n+/)[0]?.trim()) ||
    (exp.tagline && exp.tagline.trim()) ||
    [routeLabel].filter(Boolean).join(' · ') ||
    '—'
  const meta = firstLine.length > 160 ? `${firstLine.slice(0, 157)}…` : firstLine
  let price = '—'
  if (exp.price != null && exp.price > 0) price = `from $${exp.price}`
  else if (exp.priceLabel && exp.priceLabel.trim()) price = exp.priceLabel.trim()
  return {
    kind: 'image',
    imageSrc: (exp.mainImageUrl && exp.mainImageUrl.trim()) || fallbackImage,
    imageAlt: (exp.name && exp.name.trim()) || 'Experience',
    pillLeft,
    pillRight,
    typeLabel,
    name: (exp.name && exp.name.trim()) || 'Experience',
    meta,
    price,
    footRight: 'View →',
  }
}

/**
 * Aplica `relatedSection*`, `relatedExperienceRefs` (orden de la landing) y `reserveBlock` del documento
 * `experiencePage` sobre el fallback local. Sin refs de relacionadas: se mantienen las cards locales;
 * título/eyebrow de sección se pueden seguir poniendo por CMS aunque no haya refs.
 */
/**
 * Construye el documento mínimo `experiencePage` en memoria (Studio) para reutilizar
 * `alsoBookFromStructuredRow` y mostrar el mismo texto que en la ruta pública.
 */
export function buildSoqtapataStudioPreviewRow(p: {
  relatedSectionEyebrow?: string | null
  relatedSectionTitle?: string | null
  relatedRefIds: string[]
  relatedExperiencesFromLanding: CmsRelatedExperience[] | null | undefined
  reserveBlock?: CmsReserveBlock | null
}): SoqtapataStructuredPageRow {
  return {
    _id: 'studioPreview',
    relatedSectionEyebrow: p.relatedSectionEyebrow,
    relatedSectionTitle: p.relatedSectionTitle,
    relatedRefIds: p.relatedRefIds,
    relatedExperiencesFromLanding: p.relatedExperiencesFromLanding || [],
    reserveBlock: p.reserveBlock ?? null,
  }
}

export function alsoBookFromStructuredRow(
  row: SoqtapataStructuredPageRow,
  local: SoqtapataExperience,
): { also: SoqtapataAlsoCamanti; book: SoqtapataBook } {
  if (!row) {
    return { also: local.also, book: local.book }
  }
  const lAlso = local.also
  const lBook = local.book
  const refIds = row.relatedRefIds || []
  const ordered = orderRelatedByRefs(row.relatedExperiencesFromLanding, refIds)
  const fallbackImage =
    lAlso.cards.find((c): c is SoqtapataRelatedCardImage => c.kind === 'image')?.imageSrc ||
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80'

  const eyebrow = strOrNull(row.relatedSectionEyebrow) ?? lAlso.eyebrow
  const h2 = strOrNull(row.relatedSectionTitle) ?? lAlso.h2
  const cards: SoqtapataAlsoCamanti['cards'] =
    ordered.length > 0 ? ordered.map((exp) => relatedExperienceToCard(exp, fallbackImage)) : lAlso.cards

  const also: SoqtapataAlsoCamanti = { ...lAlso, eyebrow, h2, cards }

  const rb = row.reserveBlock
  const book: SoqtapataBook = {
    ...lBook,
    eyebrow: strOrNull(rb?.eyebrow) ?? lBook.eyebrow,
    h2: strOrNull(rb?.headline) ?? lBook.h2,
    h2Style: lBook.h2Style,
    price: strOrNull(rb?.price) ?? lBook.price,
    priceSmall: strOrNull(rb?.priceNote) ?? lBook.priceSmall,
    sub: strOrNull(rb?.priceSub) ?? lBook.sub,
    rows:
      rb?.infoRows && rb.infoRows.length > 0
        ? rb.infoRows.map((r) => ({
            label: (r?.label && r.label.trim()) || '',
            value: (r?.value && r.value.trim()) || '',
          }))
        : lBook.rows,
    wetravelUrl: strOrNull(rb?.wetravelUrl) ?? lBook.wetravelUrl,
    wetravelLabel: strOrNull(rb?.wetravelLabel) ?? lBook.wetravelLabel,
    whatsappUrl: strOrNull(rb?.whatsappUrl) ?? lBook.whatsappUrl,
    whatsappLabel: strOrNull(rb?.whatsappLabel) ?? lBook.whatsappLabel,
    termsNote: strOrNull(rb?.legalNote) ?? lBook.termsNote,
    termsHash: strOrNull(rb?.legalTermsLink) ?? lBook.termsHash,
  }

  return { also, book }
}
