import type { SanityImageSource } from '@sanity/image-url'
import { groq } from 'next-sanity'

import type { SmartLinkGroq } from '@/lib/resolveSmartLink'
import { GROQ_SMART_LINK_FIELDS } from '@/lib/smartLinkGroq'
import type { ReserveCtaSettingsGroq } from '@/lib/reserveCtaGroq'
import { GROQ_RESERVE_CTA_SETTINGS_FIELDS } from '@/lib/reserveCtaGroq'
import { GROQ_PARTNER_DOC_FIELDS } from '@/lib/partnerGroq'

/** Experience card row (homepage + listados). */
export type ExperienceFromSanity = {
  _id: string
  name: string
  slug: { current: string } | null
  price: number | null
  priceLabel?: string | null
  duration?: string | null
  programType?: string | null
  route?: string | null
  status?: string | null
  shortDescription?: string | null
  /** Imagen Sanity (urlFor en homepage). */
  mainImage: SanityImageSource | null
  /** URL resuelta en GROQ (referencia o CDN). */
  mainImageUrl?: string | null
}

export const experiencesQuery = groq`
  *[_type == "experience"] | order(price asc) {
    _id,
    name,
    slug,
    price,
    priceLabel,
    duration,
    programType,
    route,
    status,
    shortDescription,
    mainImage,
    "mainImageUrl": mainImage.asset->url
  }
`

/** Resolved in GROQ from `homePage.seo.ogImage`. */
export type HomePageSeoDoc = {
  title?: string | null
  description?: string | null
  noIndex?: boolean | null
  ogImageUrl?: string | null
}

export type ReviewDoc = {
  _id: string
  quote?: string | null
  authorName?: string | null
  authorCity?: string | null
  authorCountry?: string | null
  experience?: {
    name?: string | null
    slug?: { current?: string | null } | null
  } | null
  /** Legacy manual programme label (schema: `experienceName`). */
  experienceName?: string | null
  /** Rare legacy key in older documents only; not in current schema. */
  experienceProgramme?: string | null
  rating?: number | null
  isFeatured?: boolean | null
}

export type HomePageDoc = {
  seo?: HomePageSeoDoc | null
  heroEyebrow?: string | null
  heroHeadline?: string | null
  heroHeadlineLight?: string | null
  heroSubheadline?: string | null
  heroPills?: string[] | null
  heroCta1Text?: string | null
  heroCta1Link?: string | null
  heroCta2Text?: string | null
  heroCta2Link?: string | null
  heroCardPrice?: string | null
  /** Small label next to hero card price, e.g. `/person`. */
  heroCardPriceSuffix?: string | null
  heroCardSubprice?: string | null
  heroCardRows?: Array<{ _key?: string; _type?: string; label?: string; value?: string }> | null
  heroCardCtaText?: string | null
  heroCardCtaLink?: string | null
  /** Label next to hero scroll line (e.g. “scroll”). */
  heroScrollLabel?: string | null
  /** Technical fallback when `heroImage` is unset. */
  heroImageFallbackUrl?: string | null
  heroImage?: SanityImageSource | null
  stats?: Array<{ _key?: string; _type?: string; number?: string; label?: string }> | null
  manifestoEyebrow?: string | null
  manifestoHeadline?: string | null
  manifestoBody1?: string | null
  manifestoBody2?: string | null
  manifestoImage?: SanityImageSource | null
  manifestoImageCaption?: string | null
  manifestoCta1Text?: string | null
  manifestoCta1Link?: string | null
  manifestoCta2Text?: string | null
  manifestoCta2Link?: string | null
  explorerEyebrow?: string | null
  explorerHeadline?: string | null
  explorerSubheadline?: string | null
  explorerFilterTabs?: Array<{ _key?: string; filterKey?: string; label?: string }> | null
  explorerPriceEnquireLabel?: string | null
  explorerPriceCustomLabel?: string | null
  explorerCardCtaViewLabel?: string | null
  explorerCardCtaEnquireLabel?: string | null
  explorerTailorRouteDurationLabel?: string | null
  explorerTailorDescriptionFallback?: string | null
  explorerTailorCtaText?: string | null
  explorerTailorWhatsappUrl?: string | null
  explorerCardImageFallbackUrl?: string | null
  explorerLearningBadgeLabels?: string[] | null
  explorerEmptyGridMessage?: string | null
  explorerEmptyGridLinkLabel?: string | null
  explorerEmptyGridLinkHref?: string | null
  reviewsEyebrow?: string | null
  reviewsHeadline?: string | null
  /** Intro under reviews heading on Home. */
  reviewsBody?: string | null
  reviewsScore?: string | null
  reviewsSourceLabel?: string | null
  reviewsEmptyMessage?: string | null
  /** Site-wide rating summary (singleton `reviewsSettings`). */
  reviewsSettings?: {
    ratingValue?: number | null
    reviewCount?: number | null
    reviewProviderName?: string | null
    reviewProviderUrl?: string | null
    reviewProviderLogoUrl?: string | null
    reviewProviderLogoAlt?: string | null
  } | null
  /** Curated reviews block (new architecture). */
  reviewsSection?: {
    eyebrow?: string | null
    title?: string | null
    body?: string | null
    rotatingReviews?: ReviewDoc[] | null
    reviewCards?: ReviewDoc[] | null
  } | null
  /** Curated reviews for Home (order preserved). Empty / omit → use all `review` docs. */
  homeSelectedReviews?: ReviewDoc[] | null
  techEyebrow?: string | null
  techHeadline?: string | null
  techBody?: string | null
  /** Curated technology products for Home (order preserved). Empty / omit → use `technologyProductsQuery`. */
  homeSelectedTechnologyProducts?: TechnologyProductDoc[] | null
  missionEyebrow?: string | null
  missionHeadline?: string | null
  missionBody?: string | null
  missionItems?: Array<{
    _key?: string
    iconType?: string
    title?: string
    subtitle?: string
  }> | null
  missionCtaText?: string | null
  missionCtaLink?: string | null
  missionPhoto1?: SanityImageSource | null
  missionPhoto2?: SanityImageSource | null
  missionPhoto3?: SanityImageSource | null
  partnersEyebrow?: string | null
  partnersTitle?: string | null
  /** Legacy; merged into `partnersTitle` until removed by migration. */
  partnersLabel?: string | null
  partnersBody?: string | null
  partnersEmptyMessage?: string | null
  /** Home: ordered partner references only — content lives on each `partner` doc. */
  partnersOnHome?: PartnerDoc[] | null
  /** Legacy field name (pre–partners-on-home). Merged in `mergeHomePageWithDefaults` until documents are re-saved. */
  homeSelectedPartners?: PartnerDoc[] | null
  blogEyebrow?: string | null
  blogHeadline?: string | null
  blogAllPostsLabel?: string | null
  blogAllPostsUrl?: string | null
  blogReadLabel?: string | null
  blogFallbackCategory?: string | null
  blogFallbackReadingMinutes?: number | null
  blogEmptyMessage?: string | null
  blogFallbackPostHref?: string | null
  blogBody?: string | null
  /** Curated blog posts for Home (order preserved). Empty / omit → use `blogPostsQuery`. */
  homeSelectedBlogPosts?: BlogPostDoc[] | null
  bookingEyebrow?: string | null
  bookingHeadline?: string | null
  bookingBody?: string | null
  bookingTrustItems?: Array<{ _key?: string; iconType?: string; text?: string }> | null
  bookingPrice?: string | null
  /** Small suffix beside booking price (e.g. “/ person”). */
  bookingPriceSuffixSmall?: string | null
  bookingPriceSubtext?: string | null
  bookingCardRows?: Array<{ _key?: string; label?: string; value?: string }> | null
  bookingCta1Text?: string | null
  bookingCta1Link?: string | null
  bookingCta2Text?: string | null
  bookingCta2Link?: string | null
  heroCta1SmartLink?: SmartLinkGroq | null
  heroCta2SmartLink?: SmartLinkGroq | null
  heroCardCtaSmartLink?: SmartLinkGroq | null
  manifestoCta1SmartLink?: SmartLinkGroq | null
  manifestoCta2SmartLink?: SmartLinkGroq | null
  missionCtaSmartLink?: SmartLinkGroq | null
  explorerEmptyGridSmartLink?: SmartLinkGroq | null
  explorerTailorWhatsappSmartLink?: SmartLinkGroq | null
  blogAllPostsSmartLink?: SmartLinkGroq | null
  bookingCta1SmartLink?: SmartLinkGroq | null
  bookingCta2SmartLink?: SmartLinkGroq | null
  reserveCtaSettings?: ReserveCtaSettingsGroq
} | null

/** Singleton by seed id (`data/cmsApproved/ids.ts` → `homePage`), not a generic _type match. */
export const homePageQuery = groq`
  *[_id == "homePage"][0] {
    seo {
      title,
      description,
      noIndex,
      "ogImageUrl": ogImage.asset->url
    },
    heroHeadline, heroHeadlineLight, heroSubheadline,
    heroPills, heroCta1Text, heroCta1Link, heroCta2Text, heroCta2Link,
    heroCardPrice, heroCardPriceSuffix, heroCardSubprice, heroCardRows, heroCardCtaText, heroCardCtaLink,
    heroScrollLabel,
    heroImageFallbackUrl,
    heroEyebrow,
    heroImage,
    stats,
    manifestoEyebrow, manifestoHeadline, manifestoBody1, manifestoBody2,
    manifestoImage, manifestoImageCaption,
    manifestoCta1Text, manifestoCta1Link, manifestoCta2Text, manifestoCta2Link,
    explorerEyebrow, explorerHeadline, explorerSubheadline,
    explorerFilterTabs,
    explorerPriceEnquireLabel,
    explorerPriceCustomLabel,
    explorerCardCtaViewLabel,
    explorerCardCtaEnquireLabel,
    explorerTailorRouteDurationLabel,
    explorerTailorDescriptionFallback,
    explorerTailorCtaText,
    explorerTailorWhatsappUrl,
    explorerCardImageFallbackUrl,
    explorerLearningBadgeLabels,
    explorerEmptyGridMessage,
    explorerEmptyGridLinkLabel,
    explorerEmptyGridLinkHref,
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
    reviewsEyebrow, reviewsHeadline, reviewsBody, reviewsScore,
    reviewsSourceLabel,
    reviewsEmptyMessage,
    "homeSelectedReviews": homeSelectedReviews[]-> {
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
      "experienceProgramme": experienceProgramme,
      rating,
      isFeatured
    },
    techEyebrow, techHeadline, techBody,
    "homeSelectedTechnologyProducts": homeSelectedTechnologyProducts[]-> {
      _id, name, number, description, image, badgeText, badgeTextWhenExcluded, slug
    },
    missionEyebrow, missionHeadline, missionBody, missionItems,
    missionCtaText, missionCtaLink,
    missionPhoto1, missionPhoto2, missionPhoto3,
    partnersEyebrow,
    partnersTitle,
    partnersLabel,
    partnersBody,
    partnersEmptyMessage,
    "partnersOnHome": select(
      length(coalesce(partnersOnHome, [])) > 0 => partnersOnHome[]->{
        _id,
        name,
        category,
        link,
        logoSvg,
        logoImage
      },
      length(coalesce(homeSelectedPartners, [])) > 0 => homeSelectedPartners[]->{
        _id,
        name,
        category,
        link,
        logoSvg,
        logoImage
      },
      []
    ),
    blogEyebrow, blogHeadline, blogBody,
    blogAllPostsLabel,
    blogAllPostsUrl,
    blogReadLabel,
    blogFallbackCategory,
    blogFallbackReadingMinutes,
    blogEmptyMessage,
    blogFallbackPostHref,
    "homeSelectedBlogPosts": homeSelectedBlogPosts[]-> {
      _id,
      title,
      excerpt,
      category,
      tags,
      readingMinutes,
      publishedAt,
      featured,
      image,
      externalLink,
      slug
    },
    bookingEyebrow, bookingHeadline, bookingBody, bookingTrustItems,
    bookingPrice, bookingPriceSuffixSmall, bookingPriceSubtext, bookingCardRows,
    bookingCta1Text, bookingCta1Link, bookingCta2Text, bookingCta2Link,
    heroCta1SmartLink { ${GROQ_SMART_LINK_FIELDS} },
    heroCta2SmartLink { ${GROQ_SMART_LINK_FIELDS} },
    heroCardCtaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    manifestoCta1SmartLink { ${GROQ_SMART_LINK_FIELDS} },
    manifestoCta2SmartLink { ${GROQ_SMART_LINK_FIELDS} },
    missionCtaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    explorerEmptyGridSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    explorerTailorWhatsappSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    blogAllPostsSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    bookingCta1SmartLink { ${GROQ_SMART_LINK_FIELDS} },
    bookingCta2SmartLink { ${GROQ_SMART_LINK_FIELDS} },
    reserveCtaSettings {
      ${GROQ_RESERVE_CTA_SETTINGS_FIELDS}
    }
  }
`

export const reviewsQuery = groq`
  *[_type == "review"] | order(_createdAt asc) {
    _id, quote, authorName, authorCity, authorCountry,
    "experience": experience->{
      name,
      slug
    },
    experienceName,
    rating, isFeatured
  }
`

export const experiencePageBySlugQuery = groq`
  *[_type == "experiencePage" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    seoTitle,
    seoDescription,
    payloadV1
  }
`

/** Soqtapata landing: full `experiencePage` + dereferenced `experience`, lodge, route, reviews, tech. No `payloadV1`. */
export const soqtapataStructuredPageBySlugQuery = groq`
  *[_type == "experiencePage" && slug.current == $slug][0] {
    _id,
    internalTitle,
    slug,
    seo,
    internalNav {
      title,
      subtitle,
      fromLabel,
      priceText,
      priceSuffix,
      ctaLabel,
      ctaUrl,
      ctaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
      ctaVisible,
      items[] {
        _key,
        label,
        targetSection,
        visible,
        order
      }
    },
    sectionModules[] {
      _key,
      key,
      visible,
      anchorId,
      eyebrow,
      sectionTitle,
      sectionText
    },
    pageHero {
      eyebrow,
      headline,
      headlineSub,
      pills,
      priceLine,
      priceSub,
      useProductPrice,
      bookCta { label, href, openInNewTab, style },
      bookCtaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
      heroImage {
        alt,
        title,
        caption,
        image,
        "imageUrl": image.asset->url
      }
    },
    reviewsLayout,
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
    "reviewsSettings": *[_type == "reviewsSettings"][0] {
      ratingValue,
      reviewCount,
      reviewProviderName,
      reviewProviderUrl,
      "reviewProviderLogoUrl": reviewProviderLogo.asset->url,
      reviewProviderLogoAlt
    },
    "reviewDocs": select(
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
      count(coalesce(reviewRefs, [])) > 0 => reviewRefs[]-> {
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
    "techProductDocs": techProductRefs[]-> {
      _id, stableId, name, number, description, image, badgeText, badgeTextWhenExcluded, slug
    },
    includedTechProductIds,
    lodgeCtaLabel,
    "lodgePageSlug": lodgePageLink->slug.current,
    lodgeCtaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    relatedSectionEyebrow,
    relatedSectionTitle,
    "relatedRefIds": relatedExperienceRefs[]._ref,
    "relatedExperiencesFromLanding": relatedExperienceRefs[]-> {
      _id,
      name,
      tagline,
      programType,
      route,
      duration,
      price,
      priceLabel,
      shortDescription,
      mainImage,
      "mainImageUrl": mainImage.asset->url,
      "slug": slug.current
    },
    reserveCtaSettings {
      ${GROQ_RESERVE_CTA_SETTINGS_FIELDS}
    },
    reserveBlock {
      eyebrow,
      headline,
      price,
      priceNote,
      priceSub,
      infoRows[] { label, value },
      wetravelUrl,
      wetravelLabel,
      wetravelSmartLink { ${GROQ_SMART_LINK_FIELDS} },
      whatsappUrl,
      whatsappLabel,
      whatsappSmartLink { ${GROQ_SMART_LINK_FIELDS} },
      legalNote,
      legalTermsLink,
      termsLinkLabel,
      termsSmartLink { ${GROQ_SMART_LINK_FIELDS} },
      trustStripItems[] { text }
    },
    resources {
      mapPreviewTitle,
      mapPreviewSubtitle,
      brochurePreviewBadge,
      cards[] {
        _key,
        title,
        subtitle,
        resourceType,
        visualPreset,
        previewImage {
          alt,
          image,
          "imageUrl": image.asset->url
        },
        fileUrl,
        "fileAssetUrl": file.asset->url,
        ctaLabel,
        visible,
        order
      }
    },
    "experience": experience-> {
      _id,
      name, tagline, programType, route, status,
      duration, price, priceLabel,
      shortDescription, fullDescription,
      mainImage,
      "mainImageUrl": mainImage.asset->url,
      gallery[] {
        caption, category,
        image,
        "imageUrl": image.asset->url
      },
      videoUrl, videoTitle, videoDuration,
      highlights,
      itinerary[] {
        dayNumber, title, subtitle, photoCaption,
        image,
        "imageUrl": image.asset->url,
        timeline[] { time, title, description },
        lodgeOvernight, lodgeSub
      },
      includes, notIncludes,
      lodgeNightLabel, groupSizeMin, groupSizeMax,
      altitude, distanceFromCusco, ecosystem,
      wildlife[] { name, description, iconType, badge, image, "imageUrl": image.asset->url },
      "includedTechProductDocs": includedTechProducts[]-> {
        _id, stableId, name, number, description, image, badgeText, badgeTextWhenExcluded, slug
      },
      bestTimeByMonth[] { month, highlight, level },
      entryRequirements[] { title, description },
      packingList,
      gettingHereInfo[] { title, description },
      cancellationPolicy, termsAndConditions, importantNotes,
      mapPdfUrl, mapPdfLabel, brochurePdfUrl, brochurePdfLabel,
      resources[] {
        _key,
        title,
        subtitle,
        resourceType,
        visualPreset,
        previewImage {
          alt,
          image,
          "imageUrl": image.asset->url
        },
        fileUrl,
        "fileAssetUrl": file.asset->url,
        ctaLabel,
        visible,
        order
      },
      faqs[] { question, answer },
      seo,
      "lodge": lodge-> {
        _id, name, shortDescription, altitude, route, amenities,
        "mainImageUrl": mainImage.asset->url
      },
      "routeDocument": *[_type == "route" && slug.current == ^.route][0] {
        name, shortDescription, tagline, "slug": slug.current
      }
    }
  }
`

/** Published lodge landings: slug segments for `generateStaticParams` (requires `lodge` ref). */
export const lodgePageSlugsQuery = groq`
  *[_type == "lodgePage" && defined(slug.current) && defined(lodge)] | order(slug.current asc) {
    "slug": slug.current
  }
`

/** Lodge landing: `lodgePage` + dereferenced `lodge` + curated experiences/reviews. */
export const lodgeStructuredPageBySlugQuery = groq`
  *[_type == "lodgePage" && slug.current == $slug][0] {
    _id,
    internalTitle,
    slug,
    seo,
    heroImage,
    heroHighlights[]{ text, key },
    heroTitle,
    heroShortDescription,
    heroCTA { label, href, openInNewTab },
    heroCtaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    heroSecondaryCtaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    highlightLines[]{ title, subtitle },
    snapshotSelection[]{ key },
    navTitle,
    navSubtitle,
    navItems[]{ label, targetSection, sectionId },
    navCTA { label, href, openInNewTab },
    navCtaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    overviewHighlights,
    facilitiesAmenitiesEyebrow,
    facilitiesGallerySelection[]{ galleryRowKey, galleryStableKey },
    facilitiesAmenitiesSelection[]{ amenityRowKey, amenityIcon },
    overviewSectionCopy { eyebrow, title, body },
    accommodationSectionCopy { eyebrow, title, body },
    facilitiesSectionCopy { eyebrow, title, body },
    locationSectionCopy { eyebrow, title, body },
    gettingHereImage,
    "gettingHereImageUrl": gettingHereImage.asset->url,
    gettingHereImageAlt,
    gettingHereIndications[]{ _key, title, text },
    researchSectionCopy { eyebrow, title, body },
    experiencesSectionCopy { eyebrow, title, body },
    faqSectionCopy { eyebrow, title, body },
    scienceHighlights[]{ title, subtitle },
    scienceProjects[]{ title, subtitle },
    scienceSpecialText { iconKey, text },
    faqItems[]{ title, text },
    sections {
      overview { eyebrow, title, body },
      accommodation { eyebrow, title, body },
      facilities { eyebrow, title, body },
      location { eyebrow, title, body },
      research { eyebrow, title, body },
      experiences { eyebrow, title, body },
      reviews { eyebrow, title, body },
      faq { eyebrow, title, body },
      booking { eyebrow, title, body },
    },
    featuredRoomStableId,
    experiencesSelection[]-> {
      _id,
      "linkedLodgeId": coalesce(lodge->_id, lodge._ref),
      name,
      tagline,
      programType,
      route,
      duration,
      price,
      priceLabel,
      status,
      shortDescription,
      mainImage,
      "mainImageUrl": mainImage.asset->url,
      "slug": slug.current,
      "experienceLandingSlug": *[_type == "experiencePage" && experience._ref == ^._id][0].slug.current,
      lodgeEnquireSmartLink { ${GROQ_SMART_LINK_FIELDS} }
    },
    fallbackToLodgeRelations,
    experiencesTailorCta {
      enabled,
      showTailorMade,
      eyebrow,
      title,
      description,
      tailorMadeEyebrow,
      tailorMadeTitle,
      tailorMadeBody,
      tailorMadeCta { ${GROQ_SMART_LINK_FIELDS} },
      image,
      "imageUrl": image.asset->url,
      imageAlt,
      ctaSmartLink { ${GROQ_SMART_LINK_FIELDS} }
    },
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
    reviewsSelection[]-> {
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
      "experienceProgramme": experienceProgramme,
      rating,
      isFeatured
    },
    reserveCtaSettings {
      ${GROQ_RESERVE_CTA_SETTINGS_FIELDS}
    },
    bookingCta {
      title,
      body,
      ctas[]{ label, href, openInNewTab },
      bookingPrimarySmartLink { ${GROQ_SMART_LINK_FIELDS} },
      bookingSecondarySmartLink { ${GROQ_SMART_LINK_FIELDS} },
      trustItemsOverride[]{ title, subtitle }
    },
    reviewsPresentation {
      sourceLabel,
      averageRating,
      secondaryRatingLine,
      carouselEndLabel,
      carouselEndHref,
      emptyMessage
    },
    "lodge": lodge-> {
      _id,
      name,
      slug,
      route,
      location,
      altitude,
      certifications[]{ label, detail, url },
      shortDescription,
      longDescription,
      keyElements,
      snapshotItems[]{ key, label, value },
      gallery[]{
        _key,
        stableKey,
        title,
        caption,
        altText,
        description,
        alt,
        photoCategory,
        accommodationRoomKey,
        usageSection,
        roomStableId,
        category,
        relatedRoomStableId,
        relatedCommonAreaKey,
        image,
        "imageUrl": image.asset->url
      },
      rooms[]{
        _key,
        stableId,
        name,
        numberOfRooms,
        capacity,
        highlights,
        galleryItemKeys[]{ galleryStableKey },
        gallery[]{
          title,
          description,
          image,
          "imageUrl": image.asset->url
        }
      },
      commonAreas[]{
        stableKey,
        galleryStableKey,
        title,
        description,
        image,
        "imageUrl": image.asset->url
      },
      amenities[]{ _key, icon, title, description },
      mapImage,
      "mapImageUrl": mapImage.asset->url,
      journeySteps[]{ title, description },
      highlights[]{ title, subtitle },
      researchAreas[]{ title, description },
      specialMessage,
      accommodationSpecialMessage,
      experiences[]-> {
        _id,
        "linkedLodgeId": coalesce(lodge->_id, lodge._ref),
        name,
        tagline,
        programType,
        route,
        duration,
        price,
        priceLabel,
        status,
        shortDescription,
        mainImage,
        "mainImageUrl": mainImage.asset->url,
        "slug": slug.current,
        "experienceLandingSlug": *[_type == "experiencePage" && experience._ref == ^._id][0].slug.current,
        lodgeEnquireSmartLink { ${GROQ_SMART_LINK_FIELDS} }
      },
      reviews[]-> {
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
        "experienceProgramme": experienceProgramme,
        rating,
        isFeatured
      },
      faqs[]{ question, answer },
      startingPrice,
      currency,
      maxGroupSize,
      availabilityNote,
      bookingMessage,
      trustItems[]{ title, subtitle },
      seo,
      seoTitle,
      seoDescription,
      ogImage,
      mainImage,
      "mainImageUrl": mainImage.asset->url,
      heroGalleryOpenAriaLabel,
      facilitiesAmenitiesEyebrow,
      facilitiesGalleryTileAriaPrefix,
      facilitiesGalleryStripMoreAriaLabel,
      facilitiesStripMoreCount,
      facilitiesStripMoreLabel,
      locationMapLabels {
        cuscoTitle,
        cuscoSubtitle,
        trailheadLabel,
        walkHint,
        lodgeTitle,
        lodgeSubtitle
      },
      experienceCardCtaLabel,
      experienceCardPricePrefix,
      experienceCardPriceSuffix,
      bookingDetailRowLabels {
        shortestProgram,
        startingFrom,
        groupSize,
        availability
      }
    }
  }
`

export type TechnologyProductDoc = {
  _id: string
  name?: string | null
  number?: string | null
  description?: string | null
  image?: SanityImageSource | null
  badgeText?: string | null
  /** CTA on this card when it is *not* in `includedProductIds` (e.g. “Download free on iOS”). */
  badgeTextWhenExcluded?: string | null
  slug?: { current?: string } | null
}

export const technologyProductsQuery = groq`
  *[_type == "technologyProduct"] | order(order asc) {
    _id, name, number, description, image, badgeText, badgeTextWhenExcluded, slug
  }
`

export type PartnerDoc = {
  _id: string
  name?: string | null
  /** Certification / partner / other (from partner document). */
  category?: string | null
  logoSvg?: string | null
  logoImage?: SanityImageSource | null
  link?: string | null
}

export const partnersQuery = groq`
  *[_type == "partner"] | order(name asc) {
    ${GROQ_PARTNER_DOC_FIELDS}
  }
`

export type BlogPostDoc = {
  _id: string
  title?: string | null
  excerpt?: string | null
  category?: string | null
  tags?: string[] | null
  readingMinutes?: number | null
  publishedAt?: string | null
  featured?: boolean | null
  image?: SanityImageSource | null
  externalLink?: string | null
  slug?: { current?: string } | null
}

export const blogPostsQuery = groq`
  *[_type == "blogPost" && defined(slug.current)] | order(coalesce(publishedAt, _updatedAt) desc) [0...3] {
    _id,
    title,
    excerpt,
    category,
    tags,
    readingMinutes,
    publishedAt,
    featured,
    image,
    externalLink,
    slug
  }
`

/** Singleton CMS copy for `/journal` index (document `_id == "journalPage"`). */
export type JournalPageDoc = {
  heroEyebrow?: string | null
  heroTitle?: string | null
  heroIntro?: string | null
  showTagFilter?: boolean | null
  seo?: {
    title?: string | null
    description?: string | null
    noIndex?: boolean | null
    ogImageUrl?: string | null
  } | null
}

export const journalPageQuery = groq`
  *[_id == "journalPage"][0] {
    _id,
    heroEyebrow,
    heroTitle,
    heroIntro,
    showTagFilter,
    seo {
      title,
      description,
      noIndex,
      "ogImageUrl": ogImage.asset->url
    }
  }
`

export const journalPostsIndexQuery = groq`
  *[_type == "blogPost" && defined(slug.current)] | order(coalesce(publishedAt, _updatedAt) desc) {
    _id,
    title,
    excerpt,
    category,
    tags,
    readingMinutes,
    publishedAt,
    featured,
    image,
    slug,
    externalLink
  }
`

/** One projection for all journal body blocks; unused fields are omitted per `_type`. */
const GROQ_JOURNAL_CONTENT_BLOCKS = `
  contentBlocks[]{
    _key,
    _type,
    body,
    image,
    alt,
    caption,
    fullWidth,
    images,
    url,
    "videoAccessibleTitle": title,
    quote,
    attribution,
    style,
    label,
    href,
    openInNewTab,
    eyebrow,
    "experience": experience->{
      _id,
      name,
      slug,
      "slugCurrent": slug.current,
      mainImage,
      "mainImageUrl": mainImage.asset->url,
      tagline,
      duration
    }
  }
`

export type JournalPostDetailDoc = BlogPostDoc & {
  author?: string | null
  contentBlocks?: unknown[] | null
  seo?: JournalPageDoc['seo']
}

export const journalPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    category,
    tags,
    readingMinutes,
    publishedAt,
    featured,
    author,
    image,
    externalLink,
    slug,
    seo {
      title,
      description,
      noIndex,
      "ogImageUrl": ogImage.asset->url
    },
    ${GROQ_JOURNAL_CONTENT_BLOCKS}
  }
`

export const journalAllSlugsQuery = groq`
  *[_type == "blogPost" && defined(slug.current)] {
    "slug": slug.current
  }
`

export type ExperienceLodgeDoc = {
  _id?: string | null
  name?: string | null
  slug?: { current?: string } | null
  altitude?: string | null
  distanceFromCusco?: string | null
  capacity?: number | null
  ecosystem?: string | null
  shortDescription?: string | null
  mainImage?: SanityImageSource | null
  mainImageUrl?: string | null
  researchStation?: { name?: string; description?: string; organization?: string } | null
  amenities?: string[] | null
  roomTypes?: Array<{
    name?: string
    capacity?: number
    bedType?: string
    hasPrivateBathroom?: boolean
    description?: string
  }> | null
} | null

export type ItineraryTimelineItem = { time?: string | null; title?: string | null; description?: string | null }
export type ItineraryDay = {
  dayNumber?: number | null
  title?: string | null
  subtitle?: string | null
  photoCaption?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
  timeline?: ItineraryTimelineItem[] | null
  lodgeOvernight?: string | null
  lodgeSub?: string | null
}

export type BestTimeMonth = {
  month?: string | null
  highlight?: string | null
  level?: 'always-good' | 'good' | 'peak' | null
}

export type FaqItem = { question?: string | null; answer?: string | null }
export type WildlifeItem = {
  name?: string | null
  subtitle?: string | null
  description?: string | null
  iconType?: string | null
  image?: SanityImageSource | null
  imageUrl?: string | null
  badge?: string | null
}

export type ExperienceDoc = {
  _id: string
  name: string
  slug: { current: string } | null
  price: number | null
  priceLabel?: string | null
  tagline?: string | null
  duration?: string | null
  programType?: string | null
  route?: string | null
  status?: string | null
  shortDescription?: string | null
  fullDescription?: string | null
  highlights?: string[] | null
  includes?: string[] | null
  notIncludes?: string[] | null
  mainImage: SanityImageSource | null
  mainImageUrl?: string | null
  gallery?: Array<{
    _key?: string
    image?: SanityImageSource | null
    caption?: string | null
    category?: string | null
    url?: string | null
  }> | null
  lodge?: ExperienceLodgeDoc
  lodgeNightLabel?: string | null
  groupSizeMin?: number | null
  groupSizeMax?: number | null
  altitude?: string | null
  distanceFromCusco?: string | null
  ecosystem?: string | null
  itinerary?: ItineraryDay[] | null
  videoUrl?: string | null
  videoTitle?: string | null
  videoDuration?: string | null
  mapPdfUrl?: string | null
  mapPdfLabel?: string | null
  brochurePdfUrl?: string | null
  brochurePdfLabel?: string | null
  bestTimeByMonth?: BestTimeMonth[] | null
  packingList?: string[] | null
  entryRequirements?: Array<{ title?: string; description?: string }> | null
  gettingHereInfo?: Array<{ title?: string; description?: string }> | null
  cancellationPolicy?: string | null
  termsAndConditions?: string | null
  importantNotes?: string[] | null
  faqs?: FaqItem[] | null
  wildlife?: WildlifeItem[] | null
  wildlifeHighlights?: WildlifeItem[] | null
  includedTech?: TechnologyProductDoc[] | null
  includedTechIds?: string[] | null
  /** All `technologyProduct` documents (GROQ subquery); not a stored CMS field. */
  techProducts?: TechnologyProductDoc[] | null
  reviews?: ReviewDoc[] | null
  related?: ExperienceCardTeaser[] | null
  relatedExperiences?: ExperienceCardTeaser[] | null
  seoTitle?: string | null
  seoDescription?: string | null
}

export type ExperienceCardTeaser = {
  _id: string
  name?: string | null
  slug?: { current?: string } | null
  price?: number | null
  priceLabel?: string | null
  duration?: string | null
  programType?: string | null
  shortDescription?: string | null
  mainImage?: SanityImageSource | null
  mainImageUrl?: string | null
  route?: string | null
}

export const experienceBySlugQuery = groq`
  *[_type == "experience" && slug.current == $slug][0] {
    _id, name, slug, programType, route, status,
    duration, price, priceLabel, tagline,
    shortDescription, fullDescription,
    highlights[],
    mainImage,
    "mainImageUrl": mainImage.asset->url,
    gallery[] {
      _key,
      caption, category,
      image,
      "url": image.asset->url
    },
    videoUrl, videoTitle, videoDuration,
    "itinerary": itinerary | order(dayNumber asc) {
      dayNumber, title, subtitle, photoCaption,
      image,
      "imageUrl": image.asset->url,
      lodgeOvernight, lodgeSub,
      timeline[] { time, title, description }
    },
    includes[], notIncludes[],
    "lodge": lodge-> {
      _id, name, slug,
      altitude, distanceFromCusco, capacity,
      ecosystem, shortDescription, researchStation,
      mainImage,
      "mainImageUrl": mainImage.asset->url,
      amenities[], roomTypes
    },
    lodgeNightLabel, groupSizeMin, groupSizeMax,
    altitude, distanceFromCusco, ecosystem,
    wildlife[] {
      name, description, iconType, badge,
      image,
      "imageUrl": image.asset->url
    },
    "wildlifeHighlights": wildlife[] {
      name,
      "subtitle": description,
      description,
      iconType,
      badge,
      image,
      "imageUrl": image.asset->url
    },
    "techProducts": *[_type == "technologyProduct"] | order(order asc) {
      _id, name, number, description, image, badgeText, badgeTextWhenExcluded,
      "imageUrl": image.asset->url,
      "slug": slug
    },
    "includedTech": includedTechProducts[]-> {
      _id, name, number, description, image, badgeText, badgeTextWhenExcluded, slug
    },
    "includedTechIds": includedTechProducts[]-> _id,
    bestTimeByMonth[] { month, highlight, level },
    packingList[],
    entryRequirements[] { title, description },
    gettingHereInfo[] { title, description },
    cancellationPolicy, termsAndConditions,
    importantNotes[],
    mapPdfUrl, mapPdfLabel,
    brochurePdfUrl, brochurePdfLabel,
    resources[] {
      _key,
      title,
      subtitle,
      resourceType,
      visualPreset,
      previewImage {
        alt,
        image,
        "imageUrl": image.asset->url
      },
      fileUrl,
      "fileAssetUrl": file.asset->url,
      ctaLabel,
      visible,
      order
    },
    "related": relatedExperiences[]-> {
      _id, name, slug, price, priceLabel,
      duration, programType, shortDescription,
      mainImage, route,
      "mainImageUrl": mainImage.asset->url
    },
    "relatedExperiences": relatedExperiences[]-> {
      _id, name, slug, duration, priceLabel,
      programType, shortDescription,
      mainImage,
      "mainImageUrl": mainImage.asset->url
    },
    faqs[] { question, answer },
    seoTitle, seoDescription,
    "reviews": *[_type == "review"] | order(_createdAt asc) {
      _id, quote, authorName, authorCity, authorCountry,
      "experience": experience->{
        name,
        slug
      },
      experienceName,
      "experienceProgramme": experienceProgramme,
      rating, isFeatured
    }
  }
`

export const experienceSlugsQuery = groq`
  *[_type == "experience" && defined(slug.current)]{ "slug": slug.current }
`

/** Logos for global shell (SiteHeader / SiteFooter). Document id is fixed in Sanity structure. */
export type SiteSettingsLogosRow = {
  headerLogoLight: SanityImageSource | null
  headerLogoDark: SanityImageSource | null
  /** Footer: optional dedicated asset */
  footerLogo: SanityImageSource | null
  brandIsotipo: SanityImageSource | null
}

export const siteSettingsLogosQuery = groq`
  *[_id == "siteSettings"][0]{
    "headerLogoLight": coalesce(header.headerLogoLight, header.headerLogoFullHorizontal),
    "headerLogoDark": header.headerLogoDark,
    "footerLogo": coalesce(footer.footerLogo, footer.footerLogoFullHorizontal, header.headerLogoFullHorizontal),
    "brandIsotipo": brandIsotipo
  }
`

/** Global shell: header nav/CTA + footer copy/links + logos (single fetch for `SiteHeader` / `SiteFooter`). */
export type SiteSettingsShellRow = {
  defaultWhatsappUrl?: string | null
  homePath: string | null
  mobileMenuAriaLabel: string | null
  mainNav: Array<{ label?: string; href?: string; openInNewTab?: boolean }> | null
  navBookNowSmartLink?: SmartLinkGroq | null
  primaryCta: { label?: string; href?: string; openInNewTab?: boolean } | null
  headerLogoLight: SanityImageSource | null
  headerLogoDark: SanityImageSource | null
  footerLogo: SanityImageSource | null
  brandIsotipo: SanityImageSource | null
  footer: {
    showBrandDeco: boolean | null
    tagline: string | null
    descriptionLines: string[] | null
    exploreTitle: string | null
    exploreLinks: Array<{ label?: string; href?: string; openInNewTab?: boolean }> | null
    contactTitle: string | null
    contactLinks: Array<{ label?: string; href?: string; openInNewTab?: boolean }> | null
  } | null
  copyright: string | null
  footerCertText: string[] | null
} | null

export const siteSettingsShellQuery = groq`
  *[_id == "siteSettings"][0]{
    defaultWhatsappUrl,
    "homePath": header.homePath,
    "mobileMenuAriaLabel": header.mobileMenuAriaLabel,
    "mainNav": header.mainNav,
    "navBookNowSmartLink": header.navBookNowSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    "primaryCta": header.primaryCta,
    "headerLogoLight": coalesce(header.headerLogoLight, header.headerLogoFullHorizontal),
    "headerLogoDark": header.headerLogoDark,
    "footerLogo": coalesce(footer.footerLogo, footer.footerLogoFullHorizontal, header.headerLogoFullHorizontal),
    "brandIsotipo": brandIsotipo,
    "footer": {
      "showBrandDeco": footer.showBrandDeco,
      "tagline": footer.tagline,
      "descriptionLines": footer.descriptionLines,
      "exploreTitle": footer.exploreTitle,
      "exploreLinks": footer.exploreLinks,
      "contactTitle": footer.contactTitle,
      "contactLinks": footer.contactLinks
    },
    "copyright": copyright,
    "footerCertText": footer.footerCertText
  }
`
