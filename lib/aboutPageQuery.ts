import { groq } from 'next-sanity'

import type { PartnerDoc } from '@/lib/queries'
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
  heroImageUrl?: string | null
  heroImageAlt?: string | null
  heroEyebrow?: string | null
  heroTitle?: string | null
  heroTagline?: string | null
  heroPrimaryCta?: { label?: string | null; href?: string | null; openInNewTab?: boolean | null } | null
  heroSecondaryCta?: { label?: string | null; href?: string | null; openInNewTab?: boolean | null } | null
  heroPrimarySmartLink?: SmartLinkGroq | null
  heroSecondarySmartLink?: SmartLinkGroq | null
  whoSectionId?: string | null
  whoImageUrl?: string | null
  whoImageAlt?: string | null
  whoEyebrow?: string | null
  whoTitle?: string | null
  whoBodyParagraphs?: Array<{ text?: string | null }> | null
  whoPills?: Array<{ label?: string | null }> | null
  whySectionId?: string | null
  whyEyebrow?: string | null
  whyTitle?: string | null
  whyBody?: string | null
  diffSectionId?: string | null
  diffEyebrow?: string | null
  diffTitle?: string | null
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
  peopleCards?: Array<{
    imageUrl?: string | null
    imageAlt?: string | null
    name?: string | null
    role?: string | null
    bio?: string | null
  }> | null
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
  partnersLabel?: string | null
  partnersBody?: string | null
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
    heroImageAlt,
    heroEyebrow,
    heroTitle,
    heroTagline,
    heroPrimaryCta,
    heroSecondaryCta,
    heroPrimarySmartLink { ${GROQ_SMART_LINK_FIELDS} },
    heroSecondarySmartLink { ${GROQ_SMART_LINK_FIELDS} },
    whoSectionId,
    "whoImageUrl": whoImage.asset->url,
    whoImageAlt,
    whoEyebrow,
    whoTitle,
    whoBodyParagraphs[]{ text },
    whoPills[]{ label },
    whySectionId,
    whyEyebrow,
    whyTitle,
    whyBody,
    diffSectionId,
    diffEyebrow,
    diffTitle,
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
    peopleCards[]{
      "imageUrl": image.asset->url,
      imageAlt,
      name,
      role,
      bio
    },
    proofSectionId,
    proofEyebrow,
    proofTitle,
    proofBody,
    proofStats[]{ value, label, description },
    proofCertLabel,
    proofCerts,
    partnersLabel,
    partnersBody,
    "partnersResolved": partnerRefs[]->{
      _id,
      name,
      logoSvg,
      link,
      order
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
    finalTrustItems[]{ iconKey, text }
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
    "whoBodyCount": count(whoBodyParagraphs),
    "whoPillsCount": count(whoPills),
    "diffCardsCount": count(diffCards),
    "peopleCount": count(peopleCards),
    "proofStatsCount": count(proofStats),
    "proofCertsCount": count(proofCerts),
    "partnerRefsCount": count(partnerRefs),
    "finalButtonsCount": count(finalButtons),
    "finalTrustCount": count(finalTrustItems),
    "heroPrimarySmartLink": heroPrimarySmartLink { label, linkType, internalPage, sectionId },
    "heroSecondarySmartLink": heroSecondarySmartLink { label, linkType, internalPage, sectionId }
  }
`
