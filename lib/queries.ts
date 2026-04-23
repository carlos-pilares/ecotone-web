import type { SanityImageSource } from '@sanity/image-url'
import { groq } from 'next-sanity'

/** Experience document as returned from GROQ (published API shape). */
export type ExperienceFromSanity = {
  _id: string
  name: string
  slug: { current: string } | null
  price: number | null
  duration?: string | null
  programType?: string | null
  route?: string | null
  status?: string | null
  shortDescription?: string | null
  mainImage: SanityImageSource | null
}

export const experiencesQuery = groq`
  *[_type == "experience"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    price,
    duration,
    programType,
    route,
    status,
    shortDescription,
    mainImage
  }
`

export type HomePageDoc = {
  heroHeadline?: string | null
  heroHeadlineLight?: string | null
  heroSubheadline?: string | null
  heroPills?: string[] | null
  heroCta1Text?: string | null
  heroCta1Link?: string | null
  heroCta2Text?: string | null
  heroCta2Link?: string | null
  heroCardPrice?: string | null
  heroCardSubprice?: string | null
  heroCardRows?: Array<{ _key?: string; _type?: string; label?: string; value?: string }> | null
  heroCardCtaText?: string | null
  heroCardCtaLink?: string | null
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
  reviewsEyebrow?: string | null
  reviewsHeadline?: string | null
  reviewsScore?: string | null
  techEyebrow?: string | null
  techHeadline?: string | null
  techBody?: string | null
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
  partnersLabel?: string | null
  blogEyebrow?: string | null
  blogHeadline?: string | null
  bookingEyebrow?: string | null
  bookingHeadline?: string | null
  bookingBody?: string | null
  bookingTrustItems?: Array<{ _key?: string; iconType?: string; text?: string }> | null
  bookingPrice?: string | null
  bookingPriceSubtext?: string | null
  bookingCardRows?: Array<{ _key?: string; label?: string; value?: string }> | null
  bookingCta1Text?: string | null
  bookingCta1Link?: string | null
  bookingCta2Text?: string | null
  bookingCta2Link?: string | null
} | null

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    heroHeadline, heroHeadlineLight, heroSubheadline,
    heroPills, heroCta1Text, heroCta1Link, heroCta2Text, heroCta2Link,
    heroCardPrice, heroCardSubprice, heroCardRows, heroCardCtaText, heroCardCtaLink,
    heroImage,
    stats,
    manifestoEyebrow, manifestoHeadline, manifestoBody1, manifestoBody2,
    manifestoImage, manifestoImageCaption,
    manifestoCta1Text, manifestoCta1Link, manifestoCta2Text, manifestoCta2Link,
    explorerEyebrow, explorerHeadline, explorerSubheadline,
    reviewsEyebrow, reviewsHeadline, reviewsScore,
    techEyebrow, techHeadline, techBody,
    missionEyebrow, missionHeadline, missionBody, missionItems,
    missionCtaText, missionCtaLink,
    missionPhoto1, missionPhoto2, missionPhoto3,
    partnersLabel,
    blogEyebrow, blogHeadline,
    bookingEyebrow, bookingHeadline, bookingBody, bookingTrustItems,
    bookingPrice, bookingPriceSubtext, bookingCardRows,
    bookingCta1Text, bookingCta1Link, bookingCta2Text, bookingCta2Link,
  }
`

export type ReviewDoc = {
  _id: string
  quote?: string | null
  authorName?: string | null
  authorCity?: string | null
  authorCountry?: string | null
  experienceName?: string | null
  rating?: number | null
  isFeatured?: boolean | null
}

export const reviewsQuery = groq`
  *[_type == "review"] | order(_createdAt asc) {
    _id, quote, authorName, authorCity, authorCountry,
    experienceName, rating, isFeatured
  }
`

export type TechnologyProductDoc = {
  _id: string
  name?: string | null
  number?: string | null
  description?: string | null
  image?: SanityImageSource | null
  badgeText?: string | null
  slug?: { current?: string } | null
}

export const technologyProductsQuery = groq`
  *[_type == "technologyProduct"] | order(order asc) {
    _id, name, number, description, image, badgeText, slug
  }
`

export type PartnerDoc = {
  _id: string
  name?: string | null
  logoSvg?: string | null
  link?: string | null
  order?: number | null
}

export const partnersQuery = groq`
  *[_type == "partner"] | order(order asc) {
    _id, name, logoSvg, link, order
  }
`

export type BlogPostDoc = {
  _id: string
  title?: string | null
  category?: string | null
  readingMinutes?: number | null
  image?: SanityImageSource | null
  externalLink?: string | null
  slug?: { current?: string } | null
}

export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) [0...3] {
    _id, title, category, readingMinutes, image, externalLink, slug
  }
`
