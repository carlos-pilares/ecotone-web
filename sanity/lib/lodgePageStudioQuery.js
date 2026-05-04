/**
 * GROQ para lecturas editoriales de Lodge en Studio (solo vista previa; no front público).
 * Devuelve siempre `{ lodge: { ... } }` cuando existe el documento, para alinear el mapping en React.
 *
 * Referencias `experiences` / `reviews` se resuelven con subconsulta por `_ref` (más fiable que `[]->` si hay huecos).
 */
const lodgeProjection = /* groq */ `{
  _id,
  _type,
  name,
  "slug": slug.current,
  location,
  route,
  altitude,
  shortDescription,
  longDescription,
  keyElements,
  certifications[]{ label, detail, url },
  snapshotItems[]{ _key, key, label, value },
  "mainImageUrl": mainImage.asset->url,
  gallery[]{
    stableKey,
    title,
    description,
    alt,
    usageSection,
    roomStableId,
    category,
    relatedRoomStableId,
    relatedCommonAreaKey,
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
    gallery[]{ title, description, "imageUrl": image.asset->url }
  },
  commonAreas[]{
    _key,
    stableKey,
    galleryStableKey,
    title,
    description,
    "imageUrl": image.asset->url
  },
  amenities[]{ _key, icon, title, description },
  journeySteps[]{ _key, title, description },
  highlights[]{ _key, title, subtitle },
  researchAreas[]{ _key, title, description },
  specialMessage,
  bookingMessage,
  trustItems[]{ _key, title, subtitle },
  startingPrice,
  currency,
  maxGroupSize,
  availabilityNote,
  "experiences": experiences[]->{
    _id,
    name,
    duration,
    "slug": slug.current,
    tagline,
    programType
  },
  "reviews": reviews[]->{
    _id,
    quote,
    authorName,
    authorCity,
    rating
  },
  faqs[]{ _key, question, answer }
}`

export const lodgeStudioPreviewById = /* groq */ `*[_id == $id && _type == "lodge"][0]{
  "lodge": ${lodgeProjection}
}`
