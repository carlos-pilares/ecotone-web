/**
 * Shared GROQ projection for `smartLink` objects (aligned with `SmartLinkGroq` in `resolveSmartLink.ts`).
 * Embed in parent queries: `heroCta1SmartLink { ${GROQ_SMART_LINK_FIELDS} }`.
 */
export const GROQ_SMART_LINK_FIELDS = `
  enabled,
  label,
  linkType,
  samePageSectionId,
  internalPage,
  websitePageSectionId,
  sectionId,
  externalUrl,
  "fileUrl": file.asset->url,
  bookFallbackUrl,
  emailAddress,
  whatsappNumber,
  whatsappMessage,
  openInNewTab,
  "experiencePageSlug": experiencePageRef->slug.current,
  "lodgePageSlug": lodgePageRef->slug.current
`.replace(/\s+/g, ' ')
