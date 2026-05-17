import { groq } from 'next-sanity'

import type { RouteCardExperienceRow } from '@/lib/routeCardFootPrice'
import type { ReviewDoc } from '@/lib/queries'
import type { ReserveCtaSettingsGroq } from '@/lib/reserveCtaGroq'
import { GROQ_RESERVE_CTA_SETTINGS_FIELDS } from '@/lib/reserveCtaGroq'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'
import { GROQ_SMART_LINK_FIELDS } from '@/lib/smartLinkGroq'

/**
 * Raw fetch shape for `routesPage` (singleton `_id == "routesPage"`).
 * Nombres de campos = `sanity/schemaTypes/routesPage.js` (p. ej. `territoryEyebrow`, no `territory.eyebrow`).
 */
export type RoutesPageSanityDoc = {
  _id?: string
  internalTitle?: string | null
  slug?: string | null
  seo?: {
    title?: string | null
    description?: string | null
    noIndex?: boolean | null
    ogImageUrl?: string | null
  } | null
  heroImageUrl?: string | null
  heroImageAlt?: string | null
  heroEyebrow?: string | null
  heroTitleLine1?: string | null
  heroTitleLine2?: string | null
  heroTagline?: string | null
  heroPrimaryCta?: { label?: string | null; href?: string | null; openInNewTab?: boolean | null } | null
  heroSecondaryCta?: { label?: string | null; href?: string | null; openInNewTab?: boolean | null } | null
  heroPrimarySmartLink?: SmartLinkGroq | null
  heroSecondarySmartLink?: SmartLinkGroq | null
  snapshotStats?: Array<{ value?: string | null; label?: string | null }> | null
  territorySectionId?: string | null
  territoryEyebrow?: string | null
  territoryH2?: string | null
  territoryBody?: string | null
  territoryStrip?: Array<{
    id?: string | null
    name?: string | null
    meta?: string | null
    variant?: string | null
  }> | null
  routeCards?: RoutesPageSanityRouteCard[] | null
  /** Published landings + KC route/price for “Choose your route” card stats. */
  publishedExperiencePages?: RouteCardExperienceRow[] | null
  compareSectionId?: string | null
  compareEyebrow?: string | null
  compareH2?: string | null
  compareIntro?: string | null
  compareColumns?: Array<{ title?: string | null; subtitle?: string | null; tone?: string | null }> | null
  compareRows?: RoutesPageSanityCompareRow[] | null
  experiencesSectionId?: string | null
  experiencesEyebrow?: string | null
  experiencesH2?: string | null
  experiencesIntro?: string | null
  experiencesAllLabel?: string | null
  experiencesAllHref?: string | null
  experiencesAllSmartLink?: SmartLinkGroq | null
  selectedExperiences?: RoutesPageSanityExperienceRef[] | null
  fallbackToAllExperiences?: boolean | null
  allExperiences?: RoutesPageSanityExperienceRef[] | null
  experiencesFilters?: Array<{ filterId?: string | null; label?: string | null }> | null
  experienceCards?: RoutesPageSanityExpCard[] | null
  reviewsFeaturedQuotes?: Array<{ quoteHtml?: string | null; attribution?: string | null }> | null
  reviewsSection?: {
    eyebrow?: string | null
    title?: string | null
    body?: string | null
    rotatingReviews?: ReviewDoc[] | null
    reviewCards?: ReviewDoc[] | null
  } | null
  reviewsSettings?: {
    ratingValue?: number | null
    reviewCount?: number | null
    reviewProviderName?: string | null
    reviewProviderUrl?: string | null
    reviewProviderLogoUrl?: string | null
    reviewProviderLogoAlt?: string | null
  } | null
  reviewsResolved?: ReviewDoc[] | null
  reviewsEyebrow?: string | null
  reviewsHeadline?: string | null
  reviewsSectionLead?: string | null
  reviewsAverageRating?: string | null
  reviewsSourceLabel?: string | null
  reviewsSecondaryRatingLine?: string | null
  finalCtaSectionId?: string | null
  finalCtaEyebrow?: string | null
  finalCtaH2?: string | null
  finalCtaBody?: string | null
  finalCtaWhatsappHref?: string | null
  finalCtaWhatsappLabel?: string | null
  finalCtaSecondaryHref?: string | null
  finalCtaSecondaryLabel?: string | null
  finalCtaWhatsappSmartLink?: SmartLinkGroq | null
  finalCtaSecondarySmartLink?: SmartLinkGroq | null
  finalCtaTrustItems?: Array<{ icon?: string | null; label?: string | null }> | null
  reserveCtaSettings?: ReserveCtaSettingsGroq
}

export type RoutesPageSanityRouteCard = {
  stableId?: string | null
  variant?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  numLabel?: string | null
  altitudeLine?: string | null
  badges?: Array<{ label?: string | null; tone?: string | null; customClassName?: string | null }> | null
  name?: string | null
  description?: string | null
  chips?: string[] | null
  footPriceHtml?: string | null
  ctaSmartLink?: SmartLinkGroq | null
  cta?: { label?: string | null; href?: string | null; openInNewTab?: boolean | null } | null
  ctaButtonVariant?: string | null
}

export type RoutesPageSanityExpCard = {
  routeKey?: string | null
  hrefSmartLink?: SmartLinkGroq | null
  href?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  typePill?: string | null
  duration?: string | null
  routeLine?: string | null
  name?: string | null
  description?: string | null
  priceKind?: string | null
  priceText?: string | null
}

export type { RouteCardExperienceRow }

export type RoutesPageSanityExperienceRef = {
  _id: string
  name?: string | null
  slug?: string | null
  /** `experiencePage.slug` vinculada (URL pública). */
  experienceLandingSlug?: string | null
  route?: string | null
  duration?: string | null
  programType?: string | null
  shortDescription?: string | null
  tagline?: string | null
  price?: number | null
  priceLabel?: string | null
  status?: string | null
  mainImageUrl?: string | null
  lodgeEnquireSmartLink?: SmartLinkGroq | null
}

export type RoutesPageSanityCompareRow =
  | {
      _type?: 'routesCompareRowText'
      label?: string | null
      altRow?: boolean | null
      col1?: string | null
      col2?: string | null
      col3?: string | null
    }
  | {
      _type?: 'routesCompareRowDots'
      label?: string | null
      altRow?: boolean | null
      dots1?: number | null
      dots2?: number | null
      dots3?: number | null
    }
  | {
      _type?: 'routesCompareRowLodge'
      label?: string | null
      altRow?: boolean | null
      lodge1?: { title?: string | null; subtitle?: string | null } | null
      lodge2?: { title?: string | null; subtitle?: string | null } | null
      lodge3?: { title?: string | null; subtitle?: string | null } | null
    }
  | {
      _type?: 'routesCompareRowBest'
      label?: string | null
      altRow?: boolean | null
      col1?: string | null
      col2?: string | null
      col3?: string | null
    }
  | {
      _type?: 'routesCompareRowPrice'
      label?: string | null
      altRow?: boolean | null
      cell1?: { kind?: string | null; priceText?: string | null } | null
      cell2?: { kind?: string | null; priceText?: string | null } | null
      cell3?: { kind?: string | null; priceText?: string | null } | null
    }
  | Record<string, unknown>

export const routesPageQuery = groq`
  *[_id == "routesPage"][0] {
    _id,
    internalTitle,
    "slug": slug.current,
    seo {
      title,
      description,
      noIndex,
      "ogImageUrl": ogImage.asset->url
    },
    "heroImageUrl": heroImage.asset->url,
    heroImageAlt,
    heroEyebrow,
    heroTitleLine1,
    heroTitleLine2,
    heroTagline,
    heroPrimaryCta,
    heroSecondaryCta,
    heroPrimarySmartLink { ${GROQ_SMART_LINK_FIELDS} },
    heroSecondarySmartLink { ${GROQ_SMART_LINK_FIELDS} },
    snapshotStats[]{ value, label },
    territorySectionId,
    territoryEyebrow,
    territoryH2,
    territoryBody,
    territoryStrip[]{ id, name, meta, variant },
    routeCards[]{
      stableId,
      variant,
      "imageUrl": image.asset->url,
      imageAlt,
      numLabel,
      altitudeLine,
      badges[]{ label, tone, customClassName },
      name,
      description,
      chips,
      footPriceHtml,
      ctaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
      cta,
      ctaButtonVariant
    },
    compareSectionId,
    compareEyebrow,
    compareH2,
    compareIntro,
    compareColumns[]{ title, subtitle, tone },
    compareRows[]{
      _type,
      label,
      altRow,
      col1,
      col2,
      col3,
      dots1,
      dots2,
      dots3,
      lodge1,
      lodge2,
      lodge3,
      cell1,
      cell2,
      cell3
    },
    experiencesSectionId,
    experiencesEyebrow,
    experiencesH2,
    experiencesIntro,
    experiencesAllLabel,
    experiencesAllHref,
    experiencesAllSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    selectedExperiences[]->{
      _id,
      name,
      "slug": slug.current,
      "experienceLandingSlug": *[_type == "experiencePage" && experience._ref == ^._id][0].slug.current,
      route,
      duration,
      programType,
      shortDescription,
      tagline,
      price,
      priceLabel,
      status,
      "mainImageUrl": mainImage.asset->url,
      lodgeEnquireSmartLink { ${GROQ_SMART_LINK_FIELDS} }
    },
    fallbackToAllExperiences,
    "allExperiences": *[_type == "experience"] | order(_createdAt desc){
      _id,
      name,
      "slug": slug.current,
      "experienceLandingSlug": *[_type == "experiencePage" && experience._ref == ^._id][0].slug.current,
      route,
      duration,
      programType,
      shortDescription,
      tagline,
      price,
      priceLabel,
      status,
      "mainImageUrl": mainImage.asset->url,
      lodgeEnquireSmartLink { ${GROQ_SMART_LINK_FIELDS} }
    },
    experiencesFilters[]{ filterId, label },
    experienceCards[]{
      routeKey,
      hrefSmartLink { ${GROQ_SMART_LINK_FIELDS} },
      href,
      "imageUrl": image.asset->url,
      imageAlt,
      typePill,
      duration,
      routeLine,
      name,
      description,
      priceKind,
      priceText
    },
    reviewsFeaturedQuotes[]{ quoteHtml, attribution },
    "reviewsSettings": *[_type == "reviewsSettings"][0] {
      ratingValue,
      reviewCount,
      reviewProviderName,
      reviewProviderUrl,
      "reviewProviderLogoUrl": reviewProviderLogo.asset->url,
      reviewProviderLogoAlt
    },
    reviewsSection {
      eyebrow,
      title,
      body,
      "rotatingReviews": rotatingReviews[]-> {
        _id,
        quote,
        authorName,
        authorCity,
        authorCountry,
        "experience": experience->{
          name,
          slug
        },
        experienceName,
        rating,
        isFeatured
      },
      "reviewCards": reviewCards[]-> {
        _id,
        quote,
        authorName,
        authorCity,
        authorCountry,
        "experience": experience->{
          name,
          slug
        },
        experienceName,
        rating,
        isFeatured
      }
    },
    "reviewsResolved": select(
      count(coalesce(reviewsSection.reviewCards, [])) > 0 => reviewsSection.reviewCards[]-> {
        _id,
        quote,
        authorName,
        authorCity,
        authorCountry,
        "experience": experience->{
          name,
          slug
        },
        experienceName,
        rating,
        isFeatured
      },
      count(coalesce(reviewsRefs, [])) > 0 => reviewsRefs[]-> {
        _id,
        quote,
        authorName,
        authorCity,
        authorCountry,
        "experience": experience->{
          name,
          slug
        },
        experienceName,
        rating,
        isFeatured
      },
      []
    ),
    reviewsEyebrow,
    reviewsHeadline,
    reviewsSectionLead,
    reviewsAverageRating,
    reviewsSourceLabel,
    reviewsSecondaryRatingLine,
    finalCtaSectionId,
    finalCtaEyebrow,
    finalCtaH2,
    finalCtaBody,
    finalCtaWhatsappHref,
    finalCtaWhatsappLabel,
    finalCtaSecondaryHref,
    finalCtaSecondaryLabel,
    finalCtaWhatsappSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    finalCtaSecondarySmartLink { ${GROQ_SMART_LINK_FIELDS} },
    finalCtaTrustItems[]{ icon, label },
    reserveCtaSettings {
      ${GROQ_RESERVE_CTA_SETTINGS_FIELDS}
    },
    "publishedExperiencePages": *[_type == "experiencePage" && defined(slug.current) && defined(experience)]{
      "route": experience->route,
      "price": experience->price,
      "priceLabel": experience->priceLabel,
      "status": experience->status
    }
  }
`

/**
 * GROQ de diagnóstico: mismos paths que el schema `routesPage` (Vision / scripts).
 * No inventar aliases de “sección plana”; solo campos reales del documento.
 */
export const routesPageDiagnosticsQuery = groq`
  *[_id == "routesPage"][0]{
    _id,
    _type,
    internalTitle,
    "slug": slug.current,
    "seo": seo { title, description, noIndex, "ogImage": defined(ogImage) },
    "heroImage": defined(heroImage),
    heroImageAlt,
    heroEyebrow,
    heroTitleLine1,
    heroTitleLine2,
    heroTagline,
    heroPrimaryCta,
    heroSecondaryCta,
    "heroPrimarySmartLink": heroPrimarySmartLink { label, linkType, internalPage, sectionId },
    "heroSecondarySmartLink": heroSecondarySmartLink { label, linkType, internalPage, sectionId },
    "snapshotStatsCount": count(coalesce(snapshotStats, [])),
    territorySectionId,
    territoryEyebrow,
    territoryH2,
    territoryBody,
    "territoryStripCount": count(coalesce(territoryStrip, [])),
    "routeCardsCount": count(coalesce(routeCards, [])),
    compareSectionId,
    compareEyebrow,
    compareH2,
    compareIntro,
    "compareColumnsCount": count(coalesce(compareColumns, [])),
    "compareRowsCount": count(coalesce(compareRows, [])),
    experiencesSectionId,
    experiencesEyebrow,
    experiencesH2,
    experiencesIntro,
    experiencesAllLabel,
    experiencesAllHref,
    "experiencesFiltersCount": count(coalesce(experiencesFilters, [])),
    "experienceCardsCount": count(coalesce(experienceCards, [])),
    "reviewsFeaturedQuotesCount": count(coalesce(reviewsFeaturedQuotes, [])),
    "reviewsRefsCount": count(coalesce(reviewsRefs, [])),
    reviewsEyebrow,
    reviewsHeadline,
    reviewsSectionLead,
    reviewsAverageRating,
    reviewsSourceLabel,
    reviewsSecondaryRatingLine,
    finalCtaSectionId,
    finalCtaEyebrow,
    finalCtaH2,
    finalCtaBody,
    finalCtaWhatsappHref,
    finalCtaWhatsappLabel,
    finalCtaSecondaryHref,
    finalCtaSecondaryLabel,
    "finalCtaWhatsappSmartLink": finalCtaWhatsappSmartLink { label, linkType, whatsappNumber },
    "finalCtaSecondarySmartLink": finalCtaSecondarySmartLink { label, linkType, internalPage },
    "finalCtaTrustItemsCount": count(coalesce(finalCtaTrustItems, []))
  }
`
