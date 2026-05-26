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
