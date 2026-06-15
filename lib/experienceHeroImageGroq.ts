/** GROQ for experience hero / card image resolution (header nav, cards). */

export const GROQ_EXPERIENCE_GALLERY_ITEM = /* groq */ `{
  _key,
  mediaType,
  title,
  caption,
  alt,
  category,
  videoUrl,
  videoThumbnail,
  "videoThumbnailUrl": videoThumbnail.asset->url,
  image,
  "imageUrl": image.asset->url
}`

export const GROQ_EXPERIENCE_PHOTO_COLLECTION_FIELD = /* groq */ `
  "photoCollection": *[
    _type == "photoCollection"
    && collectionType == "experience"
    && ^._id in experienceRefs[]._ref
  ][0]{
    _id,
    title,
    photos[] {
      _key,
      title,
      caption,
      altText,
      active,
      image,
      "imageUrl": image.asset->url
    }
  }
`

export const GROQ_HEADER_NAV_EXPERIENCE_FIELDS = /* groq */ `
  _id,
  name,
  programType,
  route,
  routeRef->{
    _id,
    "slug": slug.current,
    shortLabel,
    name
  },
  duration,
  price,
  priceLabel,
  mainImage,
  "mainImageUrl": mainImage.asset->url,
  gallery[] ${GROQ_EXPERIENCE_GALLERY_ITEM},
  ${GROQ_EXPERIENCE_PHOTO_COLLECTION_FIELD}
`

/** Header mega menu only — no gallery arrays or photo collection documents. */
export const GROQ_HEADER_NAV_EXPERIENCE_FIELDS_SLIM = /* groq */ `
  _id,
  name,
  programType,
  route,
  routeRef->{
    _id,
    "slug": slug.current,
    shortLabel,
    name
  },
  duration,
  price,
  priceLabel,
  "mainImageUrl": mainImage.asset->url
`

/** Resolves a single nav thumbnail URL on `experiencePage` (order keys → photo library → gallery → main). */
export const GROQ_EXPERIENCE_PAGE_NAV_THUMB_URL = /* groq */ `
"navThumbUrl": coalesce(
  select(count(coalesce(galleryOrderKeys, [])) > 0 => experience->gallery[_key == ^.galleryOrderKeys[0]][0].image.asset->url),
  *[_type == "photoCollection" && collectionType == "experience" && ^.experience._ref in experienceRefs[]._ref][0].photos[active != false && defined(image.asset)][0].image.asset->url,
  experience->gallery[defined(image.asset) && mediaType != "video"][0].image.asset->url,
  experience->gallery[defined(image.asset)][0].image.asset->url,
  experience->mainImage.asset->url
)
`
