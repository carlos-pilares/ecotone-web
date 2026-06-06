import { groq } from 'next-sanity'

import { GROQ_EXPERIENCE_LODGE_CARD_LODGE_FIELDS } from '@/lib/lodgeIdentityGroq'
import { GROQ_SMART_LINK_FIELDS } from '@/lib/smartLinkGroq'

export const GROQ_LEARNING_PROGRAMME_CARD_FIELDS = `
  _id,
  title,
  "experienceSlug": slug.current,
  "programType": "experiential-learning",
  "routeRefId": routeRef._ref,
  shortDescription,
  price,
  priceLabel,
  status,
  duration,
  "durationDisplay": coalesce(durationDisplay, duration),
  "routeSlug": coalesce(routeRef->slug.current, routeRef->route),
  "routeLabel": coalesce(routeRef->shortLabel, routeRef->name),
  "mainImageUrl": mainImage.asset->url
`

/**
 * Lodge page experience cards: public slug from `experiencePage`, KC fields from `learningProgramme`.
 * Match programmes where `lodgePresentationRows[].lodge` or legacy `fieldBaseRef` equals the lodge page's lodge.
 */
export const GROQ_LODGE_LINKED_LEARNING_PROGRAMME_VIA_PAGE = `
  "_id": learningProgramme._ref,
  "name": learningProgramme->title,
  "programType": "experiential-learning",
  "routeRefId": learningProgramme->routeRef._ref,
  "shortDescription": learningProgramme->shortDescription,
  "price": learningProgramme->price,
  "priceLabel": learningProgramme->priceLabel,
  "status": learningProgramme->status,
  "duration": coalesce(learningProgramme->durationDisplay, learningProgramme->duration),
  "routeSlug": coalesce(learningProgramme->routeRef->slug.current, learningProgramme->routeRef->route),
  "routeLabel": coalesce(learningProgramme->routeRef->shortLabel, learningProgramme->routeRef->name),
  "route": coalesce(learningProgramme->routeRef->slug.current, learningProgramme->routeRef->route),
  "mainImageUrl": coalesce(
    learningProgramme->mainImage.asset->url,
    learningProgramme->gallery[0].image.asset->url
  ),
  "slug": slug.current,
  "experienceLandingSlug": slug.current
`

/** Card/listing fields when the public slug comes from a linked `experiencePage`. */
export const GROQ_LEARNING_PROGRAMME_LISTING_VIA_PAGE = `
  "_id": learningProgramme._ref,
  "title": learningProgramme->title,
  "experienceSlug": slug.current,
  "experienceLandingSlug": slug.current,
  "programType": "experiential-learning",
  "routeRefId": learningProgramme->routeRef._ref,
  "shortDescription": learningProgramme->shortDescription,
  "price": learningProgramme->price,
  "priceLabel": learningProgramme->priceLabel,
  "status": learningProgramme->status,
  "durationDisplay": coalesce(learningProgramme->durationDisplay, learningProgramme->duration),
  "routeSlug": coalesce(learningProgramme->routeRef->slug.current, learningProgramme->routeRef->route),
  "routeLabel": coalesce(learningProgramme->routeRef->shortLabel, learningProgramme->routeRef->name),
  "mainImageUrl": learningProgramme->mainImage.asset->url
`

export const GROQ_LEARNING_PROGRAMME_DEREF_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  status,
  programmeCategory,
  shortDescription,
  durationDisplay,
  price,
  priceLabel,
  mainImage,
  "mainImageUrl": mainImage.asset->url,
  gallery[] {
    _key,
    kind,
    title,
    caption,
    alt,
    category,
    videoUrl,
    videoThumbnail,
    "videoThumbnailUrl": videoThumbnail.asset->url,
    image,
    "imageUrl": image.asset->url
  },
  overviewHighlights,
  snapshotHighlights[] {
    _key,
    title,
    subtitle
  },
  howItWorksPillTitle,
  howItWorksIntro,
  howItWorksImage,
  "howItWorksImageUrl": howItWorksImage.asset->url,
  howItWorksImageCaption,
  howItWorksSteps[] {
    _key,
    title,
    label,
    body
  },
  typicalDayIntro,
  typicalDayPillTitle,
  typicalDayImage,
  "typicalDayImageUrl": typicalDayImage.asset->url,
  typicalDayImageCaption,
  typicalDayRows[] {
    _key,
    timeLabel,
    title,
    body
  },
  typicalDayNote,
  projects[] {
    _key,
    title,
    description,
    iconKey,
    tag,
    image,
    "imageUrl": image.asset->url
  },
  learningOutcomes[] {
    _key,
    title,
    description,
    icon
  },
  wildlife[] {
    _key,
    name,
    description,
    iconType,
    badge,
    image,
    "imageUrl": image.asset->url
  },
  fieldBaseOverrideTitle,
  fieldBaseOverrideText,
  fieldBaseRef-> {
    ${GROQ_EXPERIENCE_LODGE_CARD_LODGE_FIELDS}
  },
  lodgePresentationRows[] {
    _key,
    nightsLabel,
    highlightLabel,
    highlights,
    ctaLabel,
    ctaVisible,
    ctaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    "lodge": lodge-> {
      ${GROQ_EXPERIENCE_LODGE_CARD_LODGE_FIELDS}
    }
  },
  includes,
  notIncludes,
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
  routeRef-> {
    _id,
    "slug": slug.current,
    name,
    shortLabel
  },
  seo {
    title,
    description,
    noIndex,
    "ogImageUrl": ogImage.asset->url
  }
`

export const learningProgrammesForCardsQuery = groq`
  *[_type == "learningProgramme" && status == "active"] | order(price asc) {
    ${GROQ_LEARNING_PROGRAMME_CARD_FIELDS}
  }
`

export const learningProgrammeSlugsQuery = groq`
  *[_type == "learningProgramme" && defined(slug.current) && status == "active"].slug.current
`

export const learningProgrammeBySlugQuery = groq`
  *[_type == "learningProgramme" && slug.current == $slug][0] {
    ${GROQ_LEARNING_PROGRAMME_DEREF_FIELDS}
  }
`

export type LearningProgrammeCmsRow = {
  _id: string
  title?: string | null
  slug?: string | null
  status?: string | null
  programmeCategory?: string | null
  shortDescription?: string | null
  durationDisplay?: string | null
  price?: number | null
  priceLabel?: string | null
  mainImageUrl?: string | null
  gallery?: Array<{
    _key?: string
    kind?: string
    title?: string
    caption?: string
    alt?: string
    imageUrl?: string
    videoUrl?: string
    videoThumbnailUrl?: string
  }> | null
  overviewHighlights?: string[] | null
  snapshotHighlights?: Array<{ _key?: string; title?: string | null; subtitle?: string | null }> | null
  howItWorksPillTitle?: string | null
  howItWorksIntro?: string | null
  howItWorksImageUrl?: string | null
  howItWorksImageCaption?: string | null
  howItWorksSteps?: Array<{ _key?: string; title?: string; label?: string; body?: string }> | null
  typicalDayIntro?: string | null
  typicalDayPillTitle?: string | null
  typicalDayImageUrl?: string | null
  typicalDayImageCaption?: string | null
  typicalDayRows?: Array<{ _key?: string; timeLabel?: string; title?: string; body?: string }> | null
  typicalDayNote?: string | null
  projects?: Array<{
    _key?: string
    title?: string
    description?: string
    iconKey?: string
    tag?: string
    imageUrl?: string
  }> | null
  learningOutcomes?: Array<{ _key?: string; title?: string; description?: string; icon?: string | null; iconKey?: string | null }> | null
  wildlife?: Array<{
    _key?: string
    name?: string | null
    description?: string | null
    iconType?: string | null
    badge?: string | null
    imageUrl?: string | null
  }> | null
  fieldBaseOverrideTitle?: string | null
  fieldBaseOverrideText?: string | null
  lodgePresentationRows?: Array<{
    _key?: string
    nightsLabel?: string | null
    highlightLabel?: string | null
    ctaLabel?: string | null
    ctaVisible?: boolean | null
    lodge?: Record<string, unknown> | null
  }> | null
  fieldBaseRef?: Record<string, unknown> | null
  includes?: string[] | null
  notIncludes?: string[] | null
  resources?: Array<{
    _key?: string
    title?: string | null
    subtitle?: string | null
    resourceType?: string | null
    visualPreset?: string | null
    previewImage?: { alt?: string | null; imageUrl?: string | null } | null
    fileUrl?: string | null
    fileAssetUrl?: string | null
    ctaLabel?: string | null
    visible?: boolean | null
    order?: number | null
  }> | null
  routeRef?: { _id?: string; slug?: string | null; name?: string | null; shortLabel?: string | null } | null
  seo?: { title?: string | null; description?: string | null; noIndex?: boolean | null; ogImageUrl?: string | null } | null
}
