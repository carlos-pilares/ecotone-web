import { groq } from 'next-sanity'

import type { SmartLinkGroq } from '@/lib/resolveSmartLink'
import { GROQ_SMART_LINK_FIELDS } from '@/lib/smartLinkGroq'

/** Raw bundle for `getSiteHeaderNav` (mega menu + mobile). */
export type SiteHeaderNavBundleRow = {
  settings: {
    navTailorMadeTitle?: string | null
    navTailorMadeSubtitle?: string | null
    navTailorMadeBody?: string | null
    navTailorMadeSmartLink?: SmartLinkGroq | null
    navExperiencesSeeAllSmartLink?: SmartLinkGroq | null
    navLodgesSeeAllSmartLink?: SmartLinkGroq | null
  } | null
  experiencePages: SiteHeaderNavExperiencePageRow[] | null
  lodgePages: SiteHeaderNavLodgePageRow[] | null
}

export type SiteHeaderNavExperiencePageRow = {
  pageSlug?: string | null
  experience: {
    _id: string
    name?: string | null
    programType?: string | null
    route?: string | null
    duration?: string | null
    price?: number | null
    priceLabel?: string | null
    mainImageUrl?: string | null
  } | null
}

export type SiteHeaderNavLodgePageRow = {
  pageSlug?: string | null
  lodge: {
    name?: string | null
    route?: string | null
    shortDescription?: string | null
    location?: string | null
    altitude?: number | null
    certifications?: Array<{ label?: string | null } | null> | null
    mainImageUrl?: string | null
  } | null
}

export const siteHeaderNavBundleQuery = groq`{
  "settings": *[_id == "siteSettings"][0]{
    navTailorMadeTitle,
    navTailorMadeSubtitle,
    navTailorMadeBody,
    navTailorMadeSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    navExperiencesSeeAllSmartLink { ${GROQ_SMART_LINK_FIELDS} },
    navLodgesSeeAllSmartLink { ${GROQ_SMART_LINK_FIELDS} }
  },
  "experiencePages": *[_type == "experiencePage" && defined(slug.current) && defined(experience)]
    | order(experience->name asc) {
    "pageSlug": slug.current,
    "experience": experience-> {
      _id,
      name,
      programType,
      route,
      duration,
      price,
      priceLabel,
      "mainImageUrl": mainImage.asset->url
    }
  },
  "lodgePages": *[_type == "lodgePage" && defined(slug.current) && defined(lodge)]
    | order(lodge->name asc) {
    "pageSlug": slug.current,
    "lodge": lodge-> {
      name,
      route,
      shortDescription,
      location,
      altitude,
      certifications[]{ label },
      "mainImageUrl": mainImage.asset->url
    }
  }
}`
