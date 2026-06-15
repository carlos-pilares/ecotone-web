/** Shared GROQ projection for dereferenced `review` documents. */
export const GROQ_REVIEW_DOC_FIELDS = `
  _id,
  quote,
  authorName,
  authorCity,
  authorCountry,
  "experience": experience->{
    name,
    slug
  },
  "learningProgramme": learningProgramme->{
    _id,
    title,
    "slug": slug.current
  },
  experienceName,
  rating,
  isFeatured
`
