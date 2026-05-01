/**
 * Referencia de eyebrow + H2 tal como en `components/ExperiencePage.tsx` (solo Studio).
 * Si un módulo no figura aquí, mostrar "definido por el front".
 */
export const WEB_HEADLINE_REFERENCE = {
  overview: {eyebrow: 'About this experience', title: 'The journey'},
  itinerary: {eyebrow: 'Day by day', title: "What you'll experience"},
  includes: {eyebrow: "What's covered", title: 'Includes & not included'},
  lodge: {eyebrow: "Where you'll stay", title: 'Your base in the forest'},
  wildlife: {eyebrow: 'What you might encounter', title: 'Wildlife'},
  tech: {eyebrow: 'Exclusive technology', title: "What's in your tech pack"},
  media: {eyebrow: 'See it before you go', title: 'The experience, unfiltered'},
  whenToVisit: {eyebrow: 'When to visit', title: 'Every month has something special'},
  beforeYouGo: {eyebrow: 'Traveller guide', title: 'Before you go'},
  reviews: {eyebrow: 'What guests say', title: 'Real experiences'},
  terms: {eyebrow: 'Terms', title: 'Terms & conditions'},
  resources: {eyebrow: 'Resources', title: 'Download & plan'},
  faq: {eyebrow: 'FAQs', title: 'Questions we hear often'},
  related: {eyebrow: 'You may also like', title: 'Related experiences'},
  reserve: {eyebrow: 'Reserve', title: 'Ready to go?'},
}

export const FRONT_DEFAULT_LABEL = 'definido por el front'

/**
 * Texto que ve el usuario en la web para eyebrow/H2: override de landing, o referencia del mapa, o etiqueta clara.
 * @param {string|null|undefined} key - pageModule.key
 * @param {{eyebrow?: string, sectionTitle?: string}} row
 */
export function getActualWebHeadlines(key, row) {
  const ovE = (row?.eyebrow ?? '').trim()
  const ovT = (row?.sectionTitle ?? '').trim()
  const ref = key && WEB_HEADLINE_REFERENCE[key]
  return {
    eyebrow: ovE || ref?.eyebrow || FRONT_DEFAULT_LABEL,
    title: ovT || ref?.title || FRONT_DEFAULT_LABEL,
    hasOverrideEyebrow: Boolean(ovE),
    hasOverrideTitle: Boolean(ovT),
  }
}
