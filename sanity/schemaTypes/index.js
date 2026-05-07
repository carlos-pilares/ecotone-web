import {blogPost} from './blogPost'
import {cta} from './objects/cta'
import {imageWithAlt} from './objects/imageWithAlt'
import {review} from './review'
import {linkWithLabel} from './objects/linkWithLabel'
import {smartLink} from './objects/smartLink'
import {headerNavProgramGroup} from './objects/headerNavProgramGroup'
import {headerNavLodgeRouteGroup} from './objects/headerNavLodgeRouteGroup'
import {headerNavSeeAll} from './objects/headerNavSeeAll'
import {headerNavExperiencesGroups} from './objects/headerNavExperiencesGroups'
import {headerNavLodgeGroups} from './objects/headerNavLodgeGroups'
import {headerNavExperienceGroupOverride} from './objects/headerNavExperienceGroupOverride'
import {headerNavExperienceItemOverride} from './objects/headerNavExperienceItemOverride'
import {headerNavLodgeRouteOverride} from './objects/headerNavLodgeRouteOverride'
import {headerNavLodgeItemOverride} from './objects/headerNavLodgeItemOverride'
import {headerNavExperiencesTailorMenu} from './objects/headerNavExperiencesTailorMenu'
import {landingHero} from './objects/landingHero'
import {experienceResourceCard} from './objects/experienceResourceCard'
import {experiencePageResources} from './objects/experiencePageResources'
import {landingReserveBlock} from './objects/landingReserveBlock'
import {lodgePageSectionCopy} from './objects/lodgePageSectionCopy'
import {lodgeSnapshotKeyPick} from './objects/lodgeSnapshotKeyPick'
import {lodgePageBookingBlock} from './objects/lodgePageBookingBlock'
import {lodgePageExperiencesTailorCta} from './objects/lodgePageExperiencesTailorCta'
import {experiencePageSnapshotStatPick} from './objects/experiencePageSnapshotStatPick'
import {experiencePageInternalNav} from './objects/experiencePageInternalNav'
import {internalNavItem} from './objects/internalNavItem'
import {pageModule} from './objects/pageModule'
import {reviewsLayoutBlock} from './objects/reviewsLayoutBlock'
import {seo} from './objects/seo'
import {
  aboutPageParagraph,
  aboutPagePill,
  aboutPageDiffCard,
  aboutPagePerson,
  aboutPageStat,
  aboutPageCtaButton,
  aboutPageTrustItem,
} from './objects/aboutPageObjects'
import {
  routesPageStatLine,
  routesPageTerritoryStripChip,
  routesPageRouteBadge,
  routesPageRouteCard,
  routesPageCompareColumn,
  routesPageExpFilterPill,
  routesPageExpCard,
  routesPageFeaturedQuote,
  routesPageTrustItem,
} from './objects/routesPageObjects'
import {
  routesCompareLodgeCell,
  routesComparePriceCell,
  routesCompareRowText,
  routesCompareRowDots,
  routesCompareRowLodge,
  routesCompareRowBest,
  routesCompareRowPrice,
} from './objects/routesCompareRows'
import {experience} from './experience'
import {experiencePage} from './experiencePage'
import {homePage} from './homePage'
import {routesPage} from './routesPage'
import {aboutPage} from './aboutPage'
import {lodge} from './lodge'
import {lodgePage} from './lodgePage'
import {partner} from './partner'
import {route} from './route'
import {siteSettings} from './siteSettings'
import {technologyProduct} from './technologyProduct'

const objects = [
  seo,
  linkWithLabel,
  smartLink,
  headerNavProgramGroup,
  headerNavLodgeRouteGroup,
  headerNavSeeAll,
  headerNavExperiencesGroups,
  headerNavLodgeGroups,
  headerNavExperienceGroupOverride,
  headerNavExperienceItemOverride,
  headerNavLodgeRouteOverride,
  headerNavLodgeItemOverride,
  headerNavExperiencesTailorMenu,
  cta,
  imageWithAlt,
  experienceResourceCard,
  experiencePageResources,
  internalNavItem,
  experiencePageInternalNav,
  experiencePageSnapshotStatPick,
  pageModule,
  reviewsLayoutBlock,
  landingHero,
  landingReserveBlock,
  lodgePageSectionCopy,
  lodgeSnapshotKeyPick,
  lodgePageBookingBlock,
  lodgePageExperiencesTailorCta,
  routesPageStatLine,
  routesPageTerritoryStripChip,
  routesPageRouteBadge,
  routesPageRouteCard,
  routesPageCompareColumn,
  routesPageExpFilterPill,
  routesPageExpCard,
  routesPageFeaturedQuote,
  routesPageTrustItem,
  aboutPageParagraph,
  aboutPagePill,
  aboutPageDiffCard,
  aboutPagePerson,
  aboutPageStat,
  aboutPageCtaButton,
  aboutPageTrustItem,
  routesCompareLodgeCell,
  routesComparePriceCell,
  routesCompareRowText,
  routesCompareRowDots,
  routesCompareRowLodge,
  routesCompareRowBest,
  routesCompareRowPrice,
]

const documents = [
  siteSettings,
  lodge,
  lodgePage,
  route,
  experience,
  experiencePage,
  technologyProduct,
  review,
  blogPost,
  partner,
  homePage,
  routesPage,
  aboutPage,
]

export const schema = {
  types: [...objects, ...documents],
}
