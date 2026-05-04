/**
 * Shared GROQ projection for `smartLink` objects (aligned with `SmartLinkGroq` in `resolveSmartLink.ts`).
 * Embed in parent queries: `heroCta1SmartLink { ${GROQ_SMART_LINK_FIELDS} }`.
 */
export const GROQ_SMART_LINK_FIELDS = `
  label,
  linkType,
  internalPage,
  sectionId,
  externalUrl,
  "fileUrl": file.asset->url,
  emailAddress,
  whatsappNumber,
  whatsappMessage,
  openInNewTab,
  "experiencePageSlug": experiencePageRef->slug.current,
  "lodgePageSlug": lodgePageRef->slug.current
`.replace(/\s+/g, ' ')
