/**
 * Editor-facing options for `smartLink` custom inputs.
 * Legacy stored values may differ; they are accepted by field validation but not listed as new choices.
 */
export const SMART_LINK_LINK_TYPE_EDITOR_OPTIONS = [
  {title: 'A. Section within this page', value: 'samePageSection'},
  {title: 'B. Page within the website', value: 'websitePage'},
  {title: 'C. External page', value: 'externalUrl'},
  {title: 'D. File download', value: 'file'},
  {title: 'E. Book (flow pending — optional fallback URL)', value: 'book'},
  {title: 'F. WhatsApp', value: 'whatsapp'},
]

/** @type {ReadonlySet<string>} */
export const SMART_LINK_LINK_TYPE_LEGACY = new Set(['internalPage', 'pageSection', 'email'])

export const SMART_LINK_WEBSITE_PAGE_EDITOR_OPTIONS = [
  {title: 'Home', value: 'home'},
  {title: 'Experiences index', value: 'experiencesIndex'},
  {title: 'Routes', value: 'routes'},
  {title: 'Lodges index', value: 'lodgesIndex'},
  {title: 'About', value: 'about'},
  {title: 'Journal', value: 'journal'},
  {title: 'Experience landing (pick document)', value: 'experiencePage'},
  {title: 'Lodge landing (pick document)', value: 'lodgePage'},
]

/**
 * Legacy `internalPage` keys still resolved by `lib/resolveSmartLink.ts` `pagePathFor`.
 * @type {ReadonlySet<string>}
 */
export const SMART_LINK_INTERNAL_PAGE_LEGACY_ALIASES = new Set(['aboutPage', 'routesPage'])
