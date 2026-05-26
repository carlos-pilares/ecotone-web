import { GROQ_LODGE_ALTITUDE_AS_ALTITUDE } from '@/lib/lodgeAltitudeGroq'

const GROQ_PHOTO_LIBRARY_ITEM = /* groq */ `{
  _key,
  title,
  caption,
  altText,
  tags,
  usageNotes,
  photoCategory,
  active,
  image,
  "imageUrl": image.asset->url
}`

const GROQ_LODGE_PHOTO_COLLECTION_FIELD = /* groq */ `
  "photoCollection": *[
    _type == "photoCollection"
    && collectionType == "lodge"
    && lodge._ref == ^._id
  ][0]{
    _id,
    title,
    photos[] ${GROQ_PHOTO_LIBRARY_ITEM}
  }
`

/** Lodge `gallery[]` row for identity image resolution on experience lodge cards. */
export const GROQ_LODGE_GALLERY_ITEM_FIELDS = /* groq */ `{
  _key,
  stableKey,
  title,
  caption,
  altText,
  alt,
  description,
  photoCategory,
  usageSection,
  image,
  "imageUrl": image.asset->url
}`

/** Dereferenced `lodge` on Experience KC `lodgePresentationRows[]`. */
export const GROQ_EXPERIENCE_LODGE_CARD_LODGE_FIELDS = /* groq */ `
  _id,
  name,
  shortDescription,
  ${GROQ_LODGE_ALTITUDE_AS_ALTITUDE},
  route,
  amenities,
  mainImage,
  "mainImageUrl": mainImage.asset->url,
  gallery[] ${GROQ_LODGE_GALLERY_ITEM_FIELDS},
  ${GROQ_LODGE_PHOTO_COLLECTION_FIELD},
  "pageSlug": *[_type == "lodgePage" && lodge._ref == ^._id][0].slug.current,
  "lodgePage": *[_type == "lodgePage" && lodge._ref == ^._id][0] {
    heroShortDescription,
    heroHighlights[]{ text, key },
    heroGalleryOrderKeys,
    menuThumbnailImage,
    "slug": slug.current
  }
`
