/** GROQ fragments and queries shared by Studio pickers and Vision. */

export const photoLibraryItemProjection = /* groq */ `{
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

export const lodgePhotoCollectionQuery = /* groq */ `*[
  _type == "photoCollection"
  && collectionType == "lodge"
  && lodge._ref == $lodgeId
][0]{
  _id,
  title,
  "rows": photos[] ${photoLibraryItemProjection}
}`

export const experiencePhotoCollectionQuery = /* groq */ `*[
  _type == "photoCollection"
  && collectionType == "experience"
  && $experienceId in experienceRefs[]._ref
][0]{
  _id,
  title,
  experienceFamilyName,
  "rows": photos[] ${photoLibraryItemProjection}
}`

/** For GROQ in page queries — nested under lodge-> */
export const groqLodgePhotoCollectionField = /* groq */ `
  "photoCollection": *[
    _type == "photoCollection"
    && collectionType == "lodge"
    && lodge._ref == ^._id
  ][0]{
    _id,
    title,
    photos[] ${photoLibraryItemProjection}
  }
`

/** Nested under experience-> in page queries */
export const groqExperiencePhotoCollectionField = /* groq */ `
  "photoCollection": *[
    _type == "photoCollection"
    && collectionType == "experience"
    && ^._id in experienceRefs[]._ref
  ][0]{
    _id,
    title,
    experienceFamilyName,
    photos[] ${photoLibraryItemProjection}
  }
`
