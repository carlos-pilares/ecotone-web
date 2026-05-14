import { groq } from 'next-sanity'

import type { SmartLinkGroq } from '@/lib/resolveSmartLink'
import { GROQ_LODGE_ALTITUDE_AS_ALTITUDE } from '@/lib/lodgeAltitudeGroq'
import { GROQ_SMART_LINK_FIELDS } from '@/lib/smartLinkGroq'

export type HeaderNavProgramGroupRow = {
  label?: string | null
  enabled?: boolean | null
  order?: number | null
}

export type HeaderNavLodgeRouteGroupRow = HeaderNavProgramGroupRow

export type HeaderNavSeeAllRow = {
  enabled?: boolean | null
  label?: string | null
  smartLink?: SmartLinkGroq | null
}

export type HeaderNavExperienceGroupOverrideRow = {
  groupKey?: string | null
  labelOverride?: string | null
  showInMenu?: boolean | null
  order?: number | null
}

export type HeaderNavExperienceItemOverrideRow = {
  experiencePageId?: string | null
  showInMenu?: boolean | null
  labelOverride?: string | null
  order?: number | null
}

export type HeaderNavExperiencesTailorMenuRow = {
  enabled?: boolean | null
  label?: string | null
}

export type HeaderNavLodgeItemOverrideRow = {
  lodgePageId?: string | null
  showInMenu?: boolean | null
  labelOverride?: string | null
  order?: number | null
}

/** Raw bundle for `getSiteHeaderNav` (mega menu + mobile + chrome). */
export type SiteHeaderNavBundleRow = {
  settings: SiteHeaderNavSettingsRow | null
  experiencePages: SiteHeaderNavExperiencePageRow[] | null
  lodgePages: SiteHeaderNavLodgePageRow[] | null
  routeNavDocs: SiteHeaderNavRouteNavRow[] | null
}

export type SiteHeaderNavSettingsRow = {
  routesEnabled?: boolean | null
  routesLabel?: string | null
  routesLinkSmartLink?: SmartLinkGroq | null
  aboutEnabled?: boolean | null
  aboutLabel?: string | null
  aboutLinkSmartLink?: SmartLinkGroq | null
  experiencesEnabled?: boolean | null
  experiencesLabel?: string | null
  experiencesGroupOverrides?: HeaderNavExperienceGroupOverrideRow[] | null
  experiencesItemOverrides?: HeaderNavExperienceItemOverrideRow[] | null
  experiencesTailorMenu?: HeaderNavExperiencesTailorMenuRow | null
  experiencesGroups?: {
    classicNature?: HeaderNavProgramGroupRow | null
    signatureExpeditions?: HeaderNavProgramGroupRow | null
    experientialLearning?: HeaderNavProgramGroupRow | null
    tailorMade?: HeaderNavProgramGroupRow | null
  } | null
  experiencesSeeAll?: HeaderNavSeeAllRow | null
  lodgesEnabled?: boolean | null
  lodgesLabel?: string | null
  lodgesItemOverrides?: HeaderNavLodgeItemOverrideRow[] | null
  lodgeGroups?: {
    camanti?: HeaderNavLodgeRouteGroupRow | null
    manuRoad?: HeaderNavLodgeRouteGroupRow | null
    manuCore?: HeaderNavLodgeRouteGroupRow | null
  } | null
  lodgesSeeAll?: HeaderNavSeeAllRow | null
  navTailorMadeTitle?: string | null
  navTailorMadeSubtitle?: string | null
  navTailorMadeBody?: string | null
  navTailorMadeSmartLink?: SmartLinkGroq | null
  /** Legacy flat smart link — merged when `experiencesSeeAll` is empty. */
  navExperiencesSeeAllSmartLink?: SmartLinkGroq | null
  /** Legacy flat smart link — merged when `lodgesSeeAll` is empty. */
  navLodgesSeeAllSmartLink?: SmartLinkGroq | null
}

export type SiteHeaderNavExperiencePageRow = {
  _id: string
  pageSlug?: string | null
  headerNavOrder?: number | null
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

export type SiteHeaderNavRouteNavRow = {
  _id: string
  name?: string | null
  slug?: string | null
  shortLabel?: string | null
  menuOrder?: number | null
  showInMenu?: boolean | null
}

export type SiteHeaderNavLodgePageRow = {
  _id: string
  pageSlug?: string | null
  headerNavOrder?: number | null
  heroTitle?: string | null
  heroShortDescription?: string | null
  heroHighlights?: Array<{ text?: string | null } | null> | null
  heroImageUrl?: string | null
  menuCtaLabel?: string | null
  menuCtaSmartLink?: SmartLinkGroq | null
  lodge: {
    name?: string | null
    route?: string | null
    shortDescription?: string | null
    location?: string | null
    altitude?: number | string | null
    certifications?: Array<{ label?: string | null } | null> | null
    mainImageUrl?: string | null
    firstHeroGalleryUrl?: string | null
    firstGalleryUrl?: string | null
  } | null
}

const SL = `{ ${GROQ_SMART_LINK_FIELDS} }`

export const siteHeaderNavBundleQuery = groq`{
  "settings": *[_id == "siteSettings"][0]{
    routesEnabled,
    routesLabel,
    "routesLinkSmartLink": header.routesLinkSmartLink ${SL},
    aboutEnabled,
    aboutLabel,
    "aboutLinkSmartLink": header.aboutLinkSmartLink ${SL},
    experiencesEnabled,
    experiencesLabel,
    "experiencesGroupOverrides": header.experiencesGroupOverrides[]{
      groupKey,
      labelOverride,
      showInMenu,
      order
    },
    "experiencesItemOverrides": header.experiencesItemOverrides[]{
      "experiencePageId": experiencePage->_id,
      showInMenu,
      "labelOverride": labelOverride,
      order
    },
    "experiencesTailorMenu": header.experiencesTailorMenu {
      enabled,
      label
    },
    "experiencesGroups": header.experiencesGroups {
      classicNature { label, enabled, order },
      signatureExpeditions { label, enabled, order },
      experientialLearning { label, enabled, order },
      tailorMade { label, enabled, order }
    },
    "experiencesSeeAll": header.experiencesSeeAll {
      enabled,
      label,
      "smartLink": smartLink ${SL}
    },
    lodgesEnabled,
    lodgesLabel,
    "lodgesItemOverrides": header.lodgesItemOverrides[]{
      "lodgePageId": lodgePage->_id,
      showInMenu,
      "labelOverride": labelOverride,
      order
    },
    "lodgeGroups": header.lodgeGroups {
      camanti { label, enabled, order },
      manuRoad { label, enabled, order },
      manuCore { label, enabled, order }
    },
    "lodgesSeeAll": header.lodgesSeeAll {
      enabled,
      label,
      "smartLink": smartLink ${SL}
    },
    "navTailorMadeTitle": header.navTailorMadeTitle,
    "navTailorMadeSubtitle": header.navTailorMadeSubtitle,
    "navTailorMadeBody": header.navTailorMadeBody,
    "navTailorMadeSmartLink": header.navTailorMadeSmartLink ${SL},
    "navExperiencesSeeAllSmartLink": header.navExperiencesSeeAllSmartLink ${SL},
    "navLodgesSeeAllSmartLink": header.navLodgesSeeAllSmartLink ${SL}
  },
  "experiencePages": *[_type == "experiencePage" && defined(slug.current) && defined(experience)]
    | order(coalesce(headerNavOrder, 999) asc, experience->name asc) {
    _id,
    "pageSlug": slug.current,
    headerNavOrder,
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
    | order(coalesce(headerNavOrder, 999) asc, lodge->name asc) {
    _id,
    "pageSlug": slug.current,
    headerNavOrder,
    heroTitle,
    heroShortDescription,
    heroHighlights[]{ text },
    "heroImageUrl": heroImage.asset->url,
    menuCtaLabel,
    "menuCtaSmartLink": menuCtaSmartLink ${SL},
    "lodge": lodge-> {
      name,
      route,
      shortDescription,
      location,
      ${GROQ_LODGE_ALTITUDE_AS_ALTITUDE},
      certifications[]{ label },
      "mainImageUrl": mainImage.asset->url,
      "firstHeroGalleryUrl": gallery[(photoCategory == "hero" || usageSection == "hero") && defined(image.asset)][0].image.asset->url,
      "firstGalleryUrl": gallery[defined(image.asset)][0].image.asset->url
    }
  },
  "routeNavDocs": *[_type == "route" && defined(slug.current)]
    | order(coalesce(menuOrder, 999) asc, lower(name) asc) {
    _id,
    name,
    "slug": slug.current,
    shortLabel,
    menuOrder,
    showInMenu
  }
}`
