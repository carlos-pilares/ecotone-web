/**
 * GROQ para previews editoriales en Studio (no usado en el front público).
 * Proyecta solo lo necesario para lectura en el formulario.
 */
export const experienceStudioPreviewById = /* groq */ `*[_id == $id][0]{
  _id, name, status, tagline, programType, duration, fullDescription, shortDescription, highlights,
  price, priceLabel,
  altitude, distanceFromCusco, groupSizeMax, ecosystem,
  itinerary[]{
    dayNumber, title, subtitle, photoCaption,
    timeline[]{ time, title, description }
  },
  wildlife[]{ name, description, iconType, badge, "imageUrl": image.asset->url },
  includes, notIncludes,
  videoUrl, videoTitle,
  bestTimeByMonth[]{ month, highlight, level },
  entryRequirements[]{ title, description },
  packingList,
  gettingHereInfo[]{ title, description },
  cancellationPolicy, termsAndConditions, importantNotes,
  mapPdfUrl, mapPdfLabel, brochurePdfUrl, brochurePdfLabel,
  resources[]{
    _key,
    title,
    subtitle,
    resourceType,
    visualPreset,
    previewImage{
      alt,
      "imageUrl": image.asset->url
    },
    fileUrl,
    "fileAssetUrl": file.asset->url,
    ctaLabel,
    visible,
    order
  },
  faqs[]{ question, answer },
  "lodge": lodge->{
    _id, name, shortDescription, amenities,
    "mainImageUrl": mainImage.asset->url
  },
  gallery[]{ caption, category, "url": image.asset->url },
  "mainImageUrl": mainImage.asset->url,
  route,
  "incTech": includedTechProducts[]->{
    _id, name, number, description, stableId, "imageUrl": image.asset->url
  },
  "relFromExp": relatedExperiences[]->{
    _id, name, duration, "slug": slug.current, "imageUrl": mainImage.asset->url
  }
}`

export const learningProgrammeStudioPreviewById = /* groq */ `*[_id == $id][0]{
  _id,
  title,
  shortDescription,
  durationDisplay,
  price,
  priceLabel,
  wildlife[]{ name, description, iconType, badge, "imageUrl": image.asset->url },
  includes,
  notIncludes,
  overviewHighlights,
  gallery[]{ caption, "url": image.asset->url },
  "mainImageUrl": mainImage.asset->url,
  "fieldBase": fieldBaseRef->{
    _id, name, shortDescription, amenities,
    "mainImageUrl": mainImage.asset->url
  }
}`

export const reviewDocsByIds = /* groq */ `*[_id in $ids]{
  _id, quote, authorName, authorCity, authorCountry,
  "experience": experience->{ name, slug },
  experienceName,
  "experienceProgramme": experienceProgramme,
  rating,
  isFeatured
} | order(_id)`

export const techDocsByIds = /* groq */ `*[_id in $ids]{
  _id, name, number, description, stableId, "imageUrl": image.asset->url
} | order(_id)`

export const experienceDocsByIds = /* groq */ `*[_id in $ids]{
  _id,
  name,
  duration,
  tagline,
  programType,
  route,
  shortDescription,
  price,
  priceLabel,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url
}`

/** Site-wide CTA / brand (Studio reserve tab: «fuente» vs hero de landing). */
export const siteSettingsReservePreview = /* groq */ `*[_type == "siteSettings"][0]{
  siteName,
  primaryCta { label, href, openInNewTab, style }
}`
