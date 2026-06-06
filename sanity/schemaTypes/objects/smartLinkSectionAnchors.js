/**
 * In-document section ids for `smartLink` → “Section within this page”.
 * Values must match real DOM `id`s (or CMS sectionId defaults) for each document type.
 */
const ABOUT_PAGE_SECTIONS = [
  {title: 'Who we are', value: 'who'},
  {title: 'Why we exist', value: 'why'},
  {title: 'What makes us different', value: 'different'},
  {title: 'Our way', value: 'way'},
  {title: 'People', value: 'people'},
  {title: 'Proof / platform', value: 'proof'},
  {title: 'Final CTA', value: 'contact'},
]

const ROUTES_PAGE_SECTIONS = [
  {title: 'Territory', value: 'territory'},
  {title: 'Route cards', value: 'routes'},
  {title: 'Compare', value: 'compare'},
  {title: 'Experiences grid', value: 'experiences'},
  {title: 'Reviews', value: 'reviews'},
  {title: 'Final CTA', value: 'contact'},
]

/** Order follows home layout: hero → experiences → reviews → static bands (about, mission, tech, blog, book). */
const HOME_PAGE_SECTIONS = [
  {title: 'Top / hero', value: 'top'},
  {title: 'Experiences', value: 'experiences'},
  {title: 'Routes', value: 'routes'},
  {title: 'Mission', value: 'mission'},
  {title: 'Technology', value: 'tech'},
  {title: 'Reviews', value: 'reviews'},
  {title: 'Booking', value: 'book'},
  {title: 'About band', value: 'about'},
  {title: 'Blog', value: 'blog'},
]

/** DOM anchors on the Soqtapata experience long-form page (`INTERNAL_NAV_TARGET_META` in app). */
const EXPERIENCE_PAGE_SECTIONS = [
  {title: 'Overview', value: 'overview'},
  {title: 'Itinerary', value: 'itinerary'},
  {title: 'Lodges / wildlife', value: 'lodges'},
  {title: 'Includes / tech', value: 'includes'},
  {title: 'Media / when to visit', value: 'media'},
  {title: 'When to visit', value: 'when'},
  {title: 'Before you go', value: 'before-you-go'},
  {title: 'Reviews', value: 'reviews'},
  {title: 'Terms', value: 'terms'},
  {title: 'Resources', value: 'resources'},
  {title: 'FAQ', value: 'faq'},
  {title: 'Related', value: 'also-camanti'},
  {title: 'Book', value: 'book'},
  {title: 'Projects (EL)', value: 'projects'},
  {title: 'Learning outcomes (EL)', value: 'learningOutcomes'},
]

const LODGE_PAGE_SECTIONS = [
  {title: 'Top / hero', value: 'top'},
  {title: 'Overview', value: 'overview'},
  {title: 'Rooms', value: 'rooms'},
  {title: 'Facilities', value: 'facilities'},
  {title: 'Location', value: 'location'},
  {title: 'Research', value: 'research'},
  {title: 'Experiences', value: 'experiences'},
  {title: 'FAQ', value: 'faq'},
  {title: 'Book', value: 'book'},
]

const BY_DOC_TYPE = {
  aboutPage: ABOUT_PAGE_SECTIONS,
  routesPage: ROUTES_PAGE_SECTIONS,
  homePage: HOME_PAGE_SECTIONS,
  experiencePage: EXPERIENCE_PAGE_SECTIONS,
  lodgePage: LODGE_PAGE_SECTIONS,
}

/**
 * Static anchor options for Studio and tooling. Always returns a new array of `{ title, value }`.
 * @param {string | null | undefined} documentType Sanity document `_type`
 * @returns {{ title: string, value: string }[]}
 */
export function getSectionAnchorOptions(documentType) {
  const t = typeof documentType === 'string' && documentType.trim() ? documentType.trim() : undefined
  const list = t ? BY_DOC_TYPE[t] : undefined
  return Array.isArray(list) ? list.map((item) => ({title: item.title, value: item.value})) : []
}

/** @param {Record<string, unknown> | null | undefined} document */
export function samePageSectionListForDocument(document) {
  const t = document && typeof document === 'object' && '_type' in document ? document._type : undefined
  return getSectionAnchorOptions(typeof t === 'string' ? t : undefined)
}

/**
 * Maps `smartLink.internalPage` (site page picker) to Sanity document `_type` keys used in `BY_DOC_TYPE`.
 * @param {string | null | undefined} websiteTarget
 * @returns {string | null}
 */
export function getDocTypeForWebsitePageTarget(websiteTarget) {
  const p = typeof websiteTarget === 'string' ? websiteTarget.trim() : ''
  if (!p) return null
  if (p === 'home') return 'homePage'
  if (p === 'routes' || p === 'routesPage') return 'routesPage'
  if (p === 'about' || p === 'aboutPage') return 'aboutPage'
  if (p === 'experiencePage') return 'experiencePage'
  if (p === 'lodgePage') return 'lodgePage'
  return null
}
