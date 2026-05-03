import { homePageTextFields } from '@/data/cmsApproved/homePageFields'
import type { HomePageDoc, ReviewDoc } from '@/lib/queries'

export type ResolvedHomePage = Exclude<HomePageDoc, null>

const t = homePageTextFields

/**
 * Same approved copy as components’ hardcoded fallbacks, as a full `homePage` shape
 * (images null — from CMS or component defaults).
 */
export const defaultHomePageDoc: ResolvedHomePage = {
  seo: {
    title: t.seo.title,
    description: t.seo.description,
    noIndex: false,
    ogImageUrl: null,
  },
  heroEyebrow: t.heroEyebrow,
  heroHeadline: t.heroHeadline,
  heroHeadlineLight: t.heroHeadlineLight,
  heroSubheadline: t.heroSubheadline,
  heroPills: [...t.heroPills],
  heroCta1Text: t.heroCta1Text,
  heroCta1Link: t.heroCta1Link,
  heroCta2Text: t.heroCta2Text,
  heroCta2Link: t.heroCta2Link,
  heroCardPrice: t.heroCardPrice,
  heroCardPriceSuffix: t.heroCardPriceSuffix,
  heroCardSubprice: t.heroCardSubprice,
  heroCardRows: t.heroCardRows.map((r) => ({ ...r })),
  heroCardCtaText: t.heroCardCtaText,
  heroCardCtaLink: t.heroCardCtaLink,
  heroImage: null,
  stats: t.stats.map((s) => ({ ...s })),
  manifestoEyebrow: t.manifestoEyebrow,
  manifestoHeadline: t.manifestoHeadline,
  manifestoBody1: t.manifestoBody1,
  manifestoBody2: t.manifestoBody2,
  manifestoImage: null,
  manifestoImageCaption: t.manifestoImageCaption,
  manifestoCta1Text: t.manifestoCta1Text,
  manifestoCta1Link: t.manifestoCta1Link,
  manifestoCta2Text: t.manifestoCta2Text,
  manifestoCta2Link: t.manifestoCta2Link,
  explorerEyebrow: t.explorerEyebrow,
  explorerHeadline: t.explorerHeadline,
  explorerSubheadline: t.explorerSubheadline,
  explorerFilterTabs: t.explorerFilterTabs.map((x) => ({ ...x })),
  explorerPriceEnquireLabel: t.explorerPriceEnquireLabel,
  explorerPriceCustomLabel: t.explorerPriceCustomLabel,
  explorerCardCtaViewLabel: t.explorerCardCtaViewLabel,
  explorerCardCtaEnquireLabel: t.explorerCardCtaEnquireLabel,
  explorerTailorRouteDurationLabel: t.explorerTailorRouteDurationLabel,
  explorerTailorDescriptionFallback: t.explorerTailorDescriptionFallback,
  explorerTailorCtaText: t.explorerTailorCtaText,
  explorerTailorWhatsappUrl: t.explorerTailorWhatsappUrl,
  explorerLearningBadgeLabels: [...t.explorerLearningBadgeLabels],
  explorerEmptyGridMessage: t.explorerEmptyGridMessage,
  explorerEmptyGridLinkLabel: t.explorerEmptyGridLinkLabel,
  explorerEmptyGridLinkHref: t.explorerEmptyGridLinkHref,
  reviewsEyebrow: t.reviewsEyebrow,
  reviewsHeadline: t.reviewsHeadline,
  reviewsScore: t.reviewsScore,
  reviewsSourceLabel: t.reviewsSourceLabel,
  reviewsEmptyMessage: t.reviewsEmptyMessage,
  techEyebrow: t.techEyebrow,
  techHeadline: t.techHeadline,
  techBody: t.techBody,
  missionEyebrow: t.missionEyebrow,
  missionHeadline: t.missionHeadline,
  missionBody: t.missionBody,
  missionItems: t.missionItems.map((m) => ({ ...m })),
  missionCtaText: t.missionCtaText,
  missionCtaLink: t.missionCtaLink,
  missionPhoto1: null,
  missionPhoto2: null,
  missionPhoto3: null,
  partnersLabel: t.partnersLabel,
  blogEyebrow: t.blogEyebrow,
  blogHeadline: t.blogHeadline,
  blogAllPostsLabel: t.blogAllPostsLabel,
  blogAllPostsUrl: t.blogAllPostsUrl,
  blogReadLabel: t.blogReadLabel,
  blogFallbackCategory: t.blogFallbackCategory,
  blogFallbackReadingMinutes: t.blogFallbackReadingMinutes,
  bookingEyebrow: t.bookingEyebrow,
  bookingHeadline: t.bookingHeadline,
  bookingBody: t.bookingBody,
  bookingTrustItems: t.bookingTrustItems.map((x) => ({ ...x })),
  bookingPrice: t.bookingPrice,
  bookingPriceSubtext: t.bookingPriceSubtext,
  bookingCardRows: t.bookingCardRows.map((r) => ({ ...r })),
  bookingCta1Text: t.bookingCta1Text,
  bookingCta1Link: t.bookingCta1Link,
  bookingCta2Text: t.bookingCta2Text,
  bookingCta2Link: t.bookingCta2Link,
}

const STR_KEYS = [
  'heroEyebrow',
  'heroHeadline',
  'heroHeadlineLight',
  'heroSubheadline',
  'heroCta1Text',
  'heroCta1Link',
  'heroCta2Text',
  'heroCta2Link',
  'heroCardPrice',
  'heroCardPriceSuffix',
  'heroCardSubprice',
  'heroCardCtaText',
  'heroCardCtaLink',
  'manifestoEyebrow',
  'manifestoHeadline',
  'manifestoBody1',
  'manifestoBody2',
  'manifestoImageCaption',
  'manifestoCta1Text',
  'manifestoCta1Link',
  'manifestoCta2Text',
  'manifestoCta2Link',
  'explorerEyebrow',
  'explorerHeadline',
  'explorerSubheadline',
  'explorerPriceEnquireLabel',
  'explorerPriceCustomLabel',
  'explorerCardCtaViewLabel',
  'explorerCardCtaEnquireLabel',
  'explorerTailorRouteDurationLabel',
  'explorerTailorDescriptionFallback',
  'explorerTailorCtaText',
  'explorerTailorWhatsappUrl',
  'explorerEmptyGridMessage',
  'explorerEmptyGridLinkLabel',
  'explorerEmptyGridLinkHref',
  'reviewsEyebrow',
  'reviewsHeadline',
  'reviewsBody',
  'reviewsScore',
  'reviewsSourceLabel',
  'reviewsEmptyMessage',
  'techEyebrow',
  'techHeadline',
  'techBody',
  'missionEyebrow',
  'missionHeadline',
  'missionBody',
  'missionCtaText',
  'missionCtaLink',
  'partnersLabel',
  'partnersBody',
  'blogEyebrow',
  'blogHeadline',
  'blogBody',
  'blogAllPostsLabel',
  'blogAllPostsUrl',
  'blogReadLabel',
  'blogFallbackCategory',
  'bookingEyebrow',
  'bookingHeadline',
  'bookingBody',
  'bookingPrice',
  'bookingPriceSubtext',
  'bookingCta1Text',
  'bookingCta1Link',
  'bookingCta2Text',
  'bookingCta2Link',
] as const satisfies ReadonlyArray<keyof ResolvedHomePage>

const ARR_KEYS = [
  'heroPills',
  'heroCardRows',
  'stats',
  'missionItems',
  'bookingTrustItems',
  'bookingCardRows',
  'explorerFilterTabs',
  'explorerLearningBadgeLabels',
] as const satisfies ReadonlyArray<keyof ResolvedHomePage>

const NUM_KEYS = ['blogFallbackReadingMinutes'] as const satisfies ReadonlyArray<keyof ResolvedHomePage>

const IMG_KEYS = [
  'heroImage',
  'manifestoImage',
  'missionPhoto1',
  'missionPhoto2',
  'missionPhoto3',
] as const satisfies ReadonlyArray<keyof ResolvedHomePage>

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

/** Merge CMS `homePage` with approved defaults: missing or empty fields use local fallbacks. */
export function mergeHomePageWithDefaults(cms: HomePageDoc | null): ResolvedHomePage {
  const def = defaultHomePageDoc
  if (!cms) {
    return { ...def }
  }
  const out: ResolvedHomePage = { ...def }

  const o = out as unknown as Record<string, unknown>
  for (const k of STR_KEYS) {
    const v = cms[k as keyof HomePageDoc]
    if (isNonEmptyString(v)) o[k] = v
  }
  for (const k of ARR_KEYS) {
    const v: unknown = cms[k as keyof HomePageDoc]
    if (Array.isArray(v) && v.length > 0) o[k] = v
  }
  for (const k of NUM_KEYS) {
    const v = cms[k as keyof HomePageDoc]
    if (typeof v === 'number' && Number.isFinite(v) && v > 0) o[k] = v
  }
  for (const k of IMG_KEYS) {
    const v = cms[k as keyof HomePageDoc]
    if (v != null) o[k] = v
  }

  const cmsSeo = cms.seo
  if (cmsSeo) {
    const merged = { ...(out.seo as NonNullable<ResolvedHomePage['seo']>) }
    if (isNonEmptyString(cmsSeo.title)) merged.title = cmsSeo.title.trim()
    if (isNonEmptyString(cmsSeo.description)) merged.description = cmsSeo.description.trim()
    if (typeof cmsSeo.noIndex === 'boolean') merged.noIndex = cmsSeo.noIndex
    if (isNonEmptyString(cmsSeo.ogImageUrl)) merged.ogImageUrl = cmsSeo.ogImageUrl.trim()
    out.seo = merged
  }

  const sel = cms.homeSelectedReviews
  if (Array.isArray(sel) && sel.length > 0) {
    const cleaned = sel.filter(
      (r): r is ReviewDoc =>
        r != null &&
        typeof r === 'object' &&
        typeof r._id === 'string' &&
        r._id.length > 0,
    )
    if (cleaned.length > 0) {
      ;(out as ResolvedHomePage).homeSelectedReviews = cleaned
    }
  }

  const selectedTech = cms.homeSelectedTechnologyProducts
  if (Array.isArray(selectedTech) && selectedTech.length > 0) {
    const cleaned = selectedTech.filter(
      (p): p is NonNullable<ResolvedHomePage['homeSelectedTechnologyProducts']>[number] =>
        p != null &&
        typeof p === 'object' &&
        typeof p._id === 'string' &&
        p._id.length > 0,
    )
    if (cleaned.length > 0) {
      ;(out as ResolvedHomePage).homeSelectedTechnologyProducts = cleaned
    }
  }

  const selectedPartners = cms.homeSelectedPartners
  if (Array.isArray(selectedPartners) && selectedPartners.length > 0) {
    const cleaned = selectedPartners.filter(
      (p): p is NonNullable<ResolvedHomePage['homeSelectedPartners']>[number] =>
        p != null &&
        typeof p === 'object' &&
        typeof p._id === 'string' &&
        p._id.length > 0,
    )
    if (cleaned.length > 0) {
      ;(out as ResolvedHomePage).homeSelectedPartners = cleaned
    }
  }

  const selectedBlogPosts = cms.homeSelectedBlogPosts
  if (Array.isArray(selectedBlogPosts) && selectedBlogPosts.length > 0) {
    const cleaned = selectedBlogPosts.filter(
      (p): p is NonNullable<ResolvedHomePage['homeSelectedBlogPosts']>[number] =>
        p != null &&
        typeof p === 'object' &&
        typeof p._id === 'string' &&
        p._id.length > 0,
    )
    if (cleaned.length > 0) {
      ;(out as ResolvedHomePage).homeSelectedBlogPosts = cleaned
    }
  }

  return out
}
