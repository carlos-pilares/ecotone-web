/**
 * Shared GROQ projection for public experience cards (Route KC + program type + price).
 * Use on dereferenced `experience` documents or joined experiencePage rows.
 */
export const GROQ_EXPERIENCE_KC_CARD_FIELDS = `
  name,
  "experienceSlug": slug.current,
  programType,
  shortDescription,
  price,
  priceLabel,
  status,
  "routeSlug": coalesce(routeRef->slug.current, route),
  "routeLabel": coalesce(routeRef->shortLabel, routeRef->name),
  "mainImageUrl": mainImage.asset->url
`
