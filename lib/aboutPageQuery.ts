import { groq } from 'next-sanity'

import type { EcotoneSanityImageField } from '@/lib/ecotoneImage'
import { GROQ_ECOTONE_IMAGE_FIELDS } from '@/lib/ecotoneImage'
import type { PartnerDoc } from '@/lib/queries'
import type { ReserveCtaSettingsGroq } from '@/lib/reserveCtaGroq'
import { GROQ_PARTNER_DOC_FIELDS } from '@/lib/partnerGroq'
import { GROQ_RESERVE_CTA_SETTINGS_FIELDS } from '@/lib/reserveCtaGroq'
import type { PageSectionModuleRow } from '@/lib/pageSectionVisibility'
import type { SmartLinkGroq } from '@/lib/resolveSmartLink'
import { GROQ_SMART_LINK_FIELDS } from '@/lib/smartLinkGroq'

/** Raw fetch for `aboutPage` singleton (`_id == "aboutPage"`). Field names match `sanity/schemaTypes/aboutPage.js`. */
export type AboutPageSanityDoc = {
  _id?: string
  internalTitle?: string | null
  slug?: string | null
  seo?: {
    title?: string | null
    description?: string | null
    noIndex?: boolean | null
    ogImageUrl?: string | null
  } | null
  /** @deprecated Prefer `heroImage` for crop/hotspot-aware delivery. */
  heroImageUrl?: string | null
  heroImage?: EcotoneSanityImageField | null
  heroImageAlt?: string | null
  heroEyebrow?: string | null
  heroTitle?: string | null
  heroTagline?: string | null
  heroPrimaryCta?: { label?: string | null; href?: string | null; openInNewTab?: boolean | null } | null
  heroSecondaryCta?: { label?: string | null; href?: string | null; openInNewTab?: boolean | null } | null
  heroPrimarySmartLink?: SmartLinkGroq | null
  heroSecondarySmartLink?: SmartLinkGroq | null
  whoSectionId?: string | null
  /** @deprecated Prefer `whoImage`. */
  whoImageUrl?: string | null
  whoImage?: EcotoneSanityImageField | null
  whoImageAlt?: string | null
  whoEyebrow?: string | null
  whoTitle?: string | null
  whoBodyParagraphs?: Array<{ text?: string | null }> | null
  whoPills?: Array<{ label?: string | null }> | null
  whySectionId?: string | null
  whyEyebrow?: string | null
  whyTitle?: string | null
  whyBody?: string | null
  creesSectionId?: string | null
  creesEyebrow?: string | null
  creesTitle?: string | null
  creesSubtitle?: string | null
  creesBodyParagraphs?: Array<{ text?: string | null }> | null
  /** @deprecated Prefer `creesImage`. */
  creesImageUrl?: string | null
  creesImage?: EcotoneSanityImageField | null
  creesImageAlt?: string | null
  creesLockupUrl?: string | null
  creesLockupAlt?: string | null
  creesCtaLabel?: string | null
  creesCtaHref?: string | null
  creesCtaSmartLink?: SmartLinkGroq | null
  diffSectionId?: string | null
  diffEyebrow?: string | null
  diffTitle?: string | null
  diffIntro?: string | null
  /** @deprecated Prefer `diffImage`. */
  diffImageUrl?: string | null
  diffImage?: EcotoneSanityImageField | null
  diffImageAlt?: string | null
  diffCards?: Array<{
    iconKey?: string | null
    title?: string | null
    description?: string | null
  }> | null
  waySectionId?: string | null
  wayImageUrl?: string | null
  wayImageAlt?: string | null
  wayEyebrow?: string | null
  wayTitle?: string | null
  wayBodyParagraphs?: Array<{ text?: string | null }> | null
  wayPullquote?: string | null
  peopleSectionId?: string | null
  peopleEyebrow?: string | null
  peopleTitle?: string | null
  peopleBody?: string | null
  peopleInitialVisibleCount?: number | null
  peopleCards?: Array<{
    /** @deprecated Prefer `image`. */
    imageUrl?: string | null
    image?: EcotoneSanityImageField | null
    imageAlt?: string | null
    name?: string | null
    role?: string | null
    affiliation?: string | null
    bio?: string | null
    linkedinUrl?: string | null
  }> | null
  bcorpSectionId?: string | null
  bcorpEyebrow?: string | null
  bcorpTitle?: string | null
  bcorpBodyParagraphs?: Array<{ text?: string | null }> | null
  bcorpLogoUrl?: string | null
  bcorpLogoAlt?: string | null
  bcorpPrimaryCtaLabel?: string | null
  bcorpPrimaryCtaHref?: string | null
  bcorpSecondaryCtaLabel?: string | null
  bcorpSecondaryCtaHref?: string | null
  bcorpPrimarySmartLink?: SmartLinkGroq | null
  bcorpSecondarySmartLink?: SmartLinkGroq | null
  proofSectionId?: string | null
  proofEyebrow?: string | null
  proofTitle?: string | null
  proofBody?: string | null
  proofStats?: Array<{
    value?: string | null
    label?: string | null
    description?: string | null
  }> | null
  proofCertLabel?: string | null
  proofCerts?: string[] | null
  partnersEyebrow?: string | null
  partnersTitle?: string | null
  /** Legacy; coalesced in GROQ until migrated. */
  partnersLabel?: string | null
  partnersBody?: string | null
  partnersEmptyMessage?: string | null
  partnersResolved?: PartnerDoc[] | null
  finalSectionId?: string | null
  finalEyebrow?: string | null
  finalTitle?: string | null
  finalBody?: string | null
  finalButtons?: Array<{
    smartLink?: SmartLinkGroq | null
    label?: string | null
    href?: string | null
    variant?: string | null
    openInNewTab?: boolean | null
  }> | null
  finalTrustItems?: Array<{
    iconKey?: string | null
    text?: string | null
  }> | null
  reserveCtaSettings?: ReserveCtaSettingsGroq
  sectionModules?: PageSectionModuleRow[] | null
}

export const aboutPageQuery = groq`
  *[_id == "aboutPage"][0] {
    _id,
    internalTitle,
    "slug": slug.current,
    seo {
      title,
      description,
      noIndex,
      "ogImageUrl": ogImage.asset->url
    },
    "heroImageUrl": heroImage.asset->url,
    heroImage { ${GROQ_ECOTONE_IMAGE_FIELDS} },
    heroImageAlt,
    heroEyebrow,
    heroTitle,
    heroTagline,
    heroPrimaryCta,
    heroSecondaryCta,
    heroPrimarySmartLink { ${GROQ_SMART_LINK_FIELDS} },
    heroSecondarySmartLink { ${GROQ_SMART_LINK_FIELDS} },
    sectionModules[]{ key, visible, anchorId, eyebrow, sectionTitle, sectionText },
    whoSectionId,
    "whoImageUrl": whoImage.asset->url,
    whoImage { ${GROQ_ECOTONE_IMAGE_FIELDS} },
    whoImageAlt,
    whoEyebrow,
    whoTitle,
    whoBodyParagraphs[]{ text },
    whoPills[]{ label },
    whySectionId,
    whyEyebrow,
    whyTitle,
    whyBody,
    creesSectionId,
    creesEyebrow,
    creesTitle,
    creesSubtitle,
    creesBodyParagraphs[]{ text },
    "creesImageUrl": creesImage.asset->url,
    creesImage { ${GROQ_ECOTONE_IMAGE_FIELDS} },
    creesImageAlt,
    "creesLockupUrl": creesLockup.asset->url,
    creesLockupAlt,
    creesCtaLabel,
    creesCtaHref,
    creesCtaSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    diffSectionId,
    diffEyebrow,
    diffTitle,
    diffIntro,
    "diffImageUrl": diffImage.asset->url,
    diffImage { ${GROQ_ECOTONE_IMAGE_FIELDS} },
    diffImageAlt,
    diffCards[]{ iconKey, title, description },
    waySectionId,
    "wayImageUrl": wayImage.asset->url,
    wayImageAlt,
    wayEyebrow,
    wayTitle,
    wayBodyParagraphs[]{ text },
    wayPullquote,
    peopleSectionId,
    peopleEyebrow,
    peopleTitle,
    peopleBody,
    peopleInitialVisibleCount,
    peopleCards[]{
      "imageUrl": image.asset->url,
      image { ${GROQ_ECOTONE_IMAGE_FIELDS} },
      imageAlt,
      name,
      role,
      affiliation,
      bio,
      linkedinUrl
    },
    bcorpSectionId,
    bcorpEyebrow,
    bcorpTitle,
    bcorpBodyParagraphs[]{ text },
    "bcorpLogoUrl": bcorpLogo.asset->url,
    bcorpLogoAlt,
    bcorpPrimaryCtaLabel,
    bcorpPrimaryCtaHref,
    bcorpSecondaryCtaLabel,
    bcorpSecondaryCtaHref,
    bcorpPrimarySmartLink { ${GROQ_SMART_LINK_FIELDS} },
    bcorpSecondarySmartLink { ${GROQ_SMART_LINK_FIELDS} },
    proofSectionId,
    proofEyebrow,
    proofTitle,
    proofBody,
    proofStats[]{ value, label, description },
    proofCertLabel,
    proofCerts,
    partnersEyebrow,
    "partnersTitle": coalesce(partnersTitle, partnersLabel),
    partnersBody,
    partnersEmptyMessage,
    "partnersResolved": partnerRefs[]->{
      ${GROQ_PARTNER_DOC_FIELDS}
    },
    finalSectionId,
    finalEyebrow,
    finalTitle,
    finalBody,
    finalButtons[]{
      smartLink { ${GROQ_SMART_LINK_FIELDS} },
      label,
      href,
      variant,
      openInNewTab
    },
    finalTrustItems[]{ iconKey, text },
    reserveCtaSettings {
      ${GROQ_RESERVE_CTA_SETTINGS_FIELDS}
    }
  }
`

/** Same paths as schema for Vision / seed verify. */
export const aboutPageDiagnosticsQuery = groq`
  *[_id == "aboutPage"][0]{
    _id,
    _type,
    internalTitle,
    "slug": slug.current,
    "seo": defined(seo),
    "heroImage": defined(heroImage),
    "whoImage": defined(whoImage),
    "wayImage": defined(wayImage),
    "creesImage": defined(creesImage),
    "bcorpLogo": defined(bcorpLogo),
    "whoBodyCount": count(whoBodyParagraphs),
    "whoPillsCount": count(whoPills),
    "diffCardsCount": count(diffCards),
    "peopleCount": count(peopleCards),
    "proofStatsCount": count(proofStats),
    "proofCertsCount": count(proofCerts),
    "partnerRefsCount": count(partnerRefs),
    "finalButtonsCount": count(finalButtons),
    "finalTrustCount": count(finalTrustItems),
    "heroPrimarySmartLink": heroPrimarySmartLink { ${GROQ_SMART_LINK_FIELDS} },
    "heroSecondarySmartLink": heroSecondarySmartLink { ${GROQ_SMART_LINK_FIELDS} }
  }
`
