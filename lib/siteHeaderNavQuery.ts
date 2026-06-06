import type { SanityImageSource } from '@sanity/image-url'
import { groq } from 'next-sanity'

import type { SmartLinkGroq } from '@/lib/resolveSmartLink'
import { GROQ_HEADER_NAV_EXPERIENCE_FIELDS } from '@/lib/experienceHeroImageGroq'
import { GROQ_LODGE_ALTITUDE_AS_ALTITUDE } from '@/lib/lodgeAltitudeGroq'
import { GROQ_SMART_LINK_FIELDS } from '@/lib/smartLinkGroq'
import type { ExperienceGalleryLikeRow, PhotoCollectionDoc } from '@/lib/photoLibraryResolve'

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

export type HeaderNavProgramTypeGroupRow = {
  programType?: string | null
  label?: string | null
  sidebarSubLabel?: string | null
  showInMenu?: boolean | null
  order?: number | null
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  body?: string | null
  ctaLabel?: string | null
  ctaSmartLink?: SmartLinkGroq | null
  imageUrl?: string | null
  imageAlt?: string | null
}

export type HeaderNavRouteGroupOverrideRow = {
  route?: {
    _id?: string
    slug?: string | null
    shortLabel?: string | null
    name?: string | null
  } | null
  labelOverride?: string | null
  showInMenu?: boolean | null
  order?: number | null
}

/** Raw bundle for `getSiteHeaderNav` (mega menu + mobile + chrome). */
export type SiteHeaderNavBundleRow = {
  headerSettings: Record<string, unknown> | null
  legacyHeader: Record<string, unknown> | null
  experiencePages: SiteHeaderNavExperiencePageRow[] | null
  learningProgrammes: SiteHeaderNavLearningProgrammeRow[] | null
  lodgePages: SiteHeaderNavLodgePageRow[] | null
  routeNavDocs: SiteHeaderNavRouteNavRow[] | null
}

export type SiteHeaderNavSettingsRow = {
  /** When true, resolver must not apply legacy siteSettings header fallbacks. */
  usesHeaderSettings?: boolean
  routesEnabled?: boolean | null
  routesLabel?: string | null
  routesLinkSmartLink?: SmartLinkGroq | null
  aboutEnabled?: boolean | null
  aboutLabel?: string | null
  aboutLinkSmartLink?: SmartLinkGroq | null
  blogEnabled?: boolean | null
  blogLabel?: string | null
  blogLinkSmartLink?: SmartLinkGroq | null
  experiencesEnabled?: boolean | null
  experiencesLabel?: string | null
  experiencesSideMenuTitle?: string | null
  lodgesSideMenuTitle?: string | null
  programGroups?: HeaderNavProgramTypeGroupRow[] | null
  routeGroupOverrides?: HeaderNavRouteGroupOverrideRow[] | null
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
  navExperiencesSeeAllSmartLink?: SmartLinkGroq | null
  navLodgesSeeAllSmartLink?: SmartLinkGroq | null
}

export type SiteHeaderNavExperienceRouteRefRow = {
  _id?: string | null
  slug?: string | null
  shortLabel?: string | null
  name?: string | null
}

export type SiteHeaderNavLearningProgrammeRow = {
  _id: string
  title?: string | null
  pageSlug?: string | null
  headerNavOrder?: number | null
  programmeCategory?: string | null
  durationDisplay?: string | null
  price?: number | null
  priceLabel?: string | null
  mainImageUrl?: string | null
  routeRef?: SiteHeaderNavExperienceRouteRefRow | null
}

export type SiteHeaderNavExperiencePageRow = {
  _id: string
  pageSlug?: string | null
  headerNavOrder?: number | null
  galleryOrderKeys?: string[] | null
  experience: {
    _id: string
    name?: string | null
    programType?: string | null
    route?: string | null
    routeRef?: SiteHeaderNavExperienceRouteRefRow | null
    duration?: string | null
    price?: number | null
    priceLabel?: string | null
    mainImage?: SanityImageSource | null
    mainImageUrl?: string | null
    gallery?: ExperienceGalleryLikeRow[] | null
    photoCollection?: PhotoCollectionDoc
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
  heroGalleryOrderKeys?: string[] | null
  menuThumbnailImage?: string | null
  menuThumbnailImageUrl?: string | null
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

const LEGACY_HEADER_NAV = `
  "routesEnabled": header.routesEnabled,
  "routesLabel": header.routesLabel,
  "routesLinkSmartLink": header.routesLinkSmartLink ${SL},
  "aboutEnabled": header.aboutEnabled,
  "aboutLabel": header.aboutLabel,
  "aboutLinkSmartLink": header.aboutLinkSmartLink ${SL},
  "experiencesEnabled": header.experiencesEnabled,
  "experiencesLabel": header.experiencesLabel,
  "experiencesGroupOverrides": header.experiencesGroupOverrides[]{
    groupKey, labelOverride, showInMenu, order
  },
  "experiencesItemOverrides": header.experiencesItemOverrides[]{
    "experiencePageId": experiencePage->_id,
    showInMenu, labelOverride, order
  },
  "experiencesTailorMenu": header.experiencesTailorMenu { enabled, label },
  "experiencesGroups": header.experiencesGroups {
    classicNature { label, enabled, order },
    signatureExpeditions { label, enabled, order },
    experientialLearning { label, enabled, order },
    tailorMade { label, enabled, order }
  },
  "experiencesSeeAll": header.experiencesSeeAll {
    enabled, label, "smartLink": smartLink ${SL}
  },
  "lodgesEnabled": header.lodgesEnabled,
  "lodgesLabel": header.lodgesLabel,
  "lodgesItemOverrides": header.lodgesItemOverrides[]{
    "lodgePageId": lodgePage->_id,
    showInMenu, labelOverride, order
  },
  "lodgeGroups": header.lodgeGroups {
    camanti { label, enabled, order },
    manuRoad { label, enabled, order },
    manuCore { label, enabled, order }
  },
  "lodgesSeeAll": header.lodgesSeeAll {
    enabled, label, "smartLink": smartLink ${SL}
  },
  "navTailorMadeTitle": header.navTailorMadeTitle,
  "navTailorMadeSubtitle": header.navTailorMadeSubtitle,
  "navTailorMadeBody": header.navTailorMadeBody,
  "navTailorMadeSmartLink": header.navTailorMadeSmartLink ${SL},
  "navExperiencesSeeAllSmartLink": header.navExperiencesSeeAllSmartLink ${SL},
  "navLodgesSeeAllSmartLink": header.navLodgesSeeAllSmartLink ${SL}
`

const NAV_TAB_FIELDS = `
  _key,
  label,
  showInHeader,
  smartLink ${SL},
  hasDropdown,
  dropdownType,
  showSeeAll,
  seeAllLabel,
  seeAllSmartLink ${SL},
  experiencesDropdown {
    sideMenuTitle,
    programGroups[]{
      programType, label, sidebarSubLabel, showInMenu, order,
      eyebrow, title, subtitle, body, ctaLabel,
      ctaSmartLink ${SL},
      imageAlt,
      "imageUrl": image.asset->url
    }
  },
  lodgesDropdown {
    sideMenuTitle
  }
`

const HEADER_SETTINGS_NAV = `
  _id,
  navTabs[]{ ${NAV_TAB_FIELDS} },
  experiencesShowInHeader,
  experiencesLabel,
  experiencesSmartLink ${SL},
  experiencesSideMenuTitle,
  programGroups[]{
    programType, label, sidebarSubLabel, showInMenu, order,
    eyebrow, title, subtitle, body, ctaLabel,
    ctaSmartLink ${SL},
    imageAlt,
    "imageUrl": image.asset->url
  },
  experiencesSeeAll { enabled, label, "smartLink": smartLink ${SL} },
  lodgesShowInHeader,
  lodgesLabel,
  lodgesSmartLink ${SL},
  lodgesSideMenuTitle,
  routeGroupOverrides[]{
    route->{ _id, "slug": slug.current, shortLabel, name },
    labelOverride, showInMenu, order
  },
  lodgesSeeAll { enabled, label, "smartLink": smartLink ${SL} },
  routesShowInHeader,
  routesLabel,
  routesSmartLink ${SL},
  aboutShowInHeader,
  aboutLabel,
  aboutSmartLink ${SL},
  blogShowInHeader,
  blogLabel,
  blogSmartLink ${SL},
  mainCtaShowInHeader,
  mainCtaLabel,
  mainCtaSmartLink ${SL}
`

export const siteHeaderNavBundleQuery = groq`{
  "headerSettings": *[_type == "headerSettings" && _id == "headerSettings"][0]{ ${HEADER_SETTINGS_NAV} },
  "legacyHeader": *[_id == "siteSettings"][0]{ ${LEGACY_HEADER_NAV} },
  "experiencePages": *[_type == "experiencePage" && defined(slug.current) && defined(experience)]
    | order(coalesce(headerNavOrder, 999) asc, experience->name asc) {
    _id,
    "pageSlug": slug.current,
    headerNavOrder,
    galleryOrderKeys,
    "experience": experience-> {
      ${GROQ_HEADER_NAV_EXPERIENCE_FIELDS}
    }
  },
  "learningProgrammes": *[_type == "experiencePage" && defined(learningProgramme._ref) && learningProgramme->status == "active" && defined(slug.current)]
    | order(coalesce(headerNavOrder, 999) asc, learningProgramme->title asc) {
    "_id": learningProgramme._ref,
    "title": learningProgramme->title,
    "pageSlug": slug.current,
    headerNavOrder,
    "programmeCategory": learningProgramme->programmeCategory,
    "durationDisplay": coalesce(learningProgramme->durationDisplay, learningProgramme->duration),
    "price": learningProgramme->price,
    "priceLabel": learningProgramme->priceLabel,
    "mainImageUrl": learningProgramme->mainImage.asset->url,
    "routeRef": learningProgramme->routeRef-> {
      _id,
      "slug": slug.current,
      shortLabel,
      name
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
    heroGalleryOrderKeys,
    menuThumbnailImage,
    "menuThumbnailImageUrl": coalesce(
      select(menuThumbnailImage != "" => lodge->gallery[_key == ^.menuThumbnailImage][0].image.asset->url),
      select(count(coalesce(heroGalleryOrderKeys, [])) > 0 => lodge->gallery[_key == ^.heroGalleryOrderKeys[0]][0].image.asset->url),
      lodge->gallery[defined(image.asset)][0].image.asset->url,
      lodge->mainImage.asset->url
    ),
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
