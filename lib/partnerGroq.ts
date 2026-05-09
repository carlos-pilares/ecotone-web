/** Inline projection for dereferenced `partner` documents (single source of truth). */
export const GROQ_PARTNER_DOC_FIELDS = `
  _id,
  name,
  category,
  link,
  logoSvg,
  logoImage
`.replace(/\s+/g, ' ')
