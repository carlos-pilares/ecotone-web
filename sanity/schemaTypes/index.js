import {blogPost} from './blogPost'
import {journalPage} from './journalPage'
import {
  journalBlockRichText,
  journalBlockImage,
  journalBlockGallery,
  journalBlockVideoEmbed,
  journalBlockQuote,
  journalBlockDivider,
  journalBlockCta,
  journalBlockRelatedExperience,
} from './objects/journalContentBlocks'
import {cta} from './objects/cta'
import {imageWithAlt} from './objects/imageWithAlt'
import {review} from './review'
import {linkWithLabel} from './objects/linkWithLabel'
import {smartLink} from './objects/smartLink'
import {headerNavProgramGroup} from './objects/headerNavProgramGroup'
import {headerNavProgramTypeGroup} from './objects/headerNavProgramTypeGroup'
import {headerNavRouteGroupOverride} from './objects/headerNavRouteGroupOverride'
import {headerNavLodgeRouteGroup} from './objects/headerNavLodgeRouteGroup'
import {headerNavSeeAll} from './objects/headerNavSeeAll'
import {headerNavExperiencesGroups} from './objects/headerNavExperiencesGroups'
import {headerNavLodgeGroups} from './objects/headerNavLodgeGroups'
import {headerNavExperienceGroupOverride} from './objects/headerNavExperienceGroupOverride'
import {headerNavExperienceItemOverride} from './objects/headerNavExperienceItemOverride'
import {headerNavLodgeRouteOverride} from './objects/headerNavLodgeRouteOverride'
import {headerNavLodgeItemOverride} from './objects/headerNavLodgeItemOverride'
import {headerNavExperiencesTailorMenu} from './objects/headerNavExperiencesTailorMenu'
import {headerNavExperiencesDropdown} from './objects/headerNavExperiencesDropdown'
import {headerNavLodgesDropdown} from './objects/headerNavLodgesDropdown'
import {headerNavTab} from './objects/headerNavTab'
import {landingHero} from './objects/landingHero'
import {
  experienceGalleryItem,
  experienceItineraryOvernight,
  experienceKnowledgeResource,
  experienceSnapshotHighlight,
  experienceLodgePresentationRow,
  experienceSeasonLegend,
  experienceTermsPanel,
  experienceTravelerGuideSection,
  experienceTravelerGuideRow,
  experienceTravelerGuideChecklistRow,
  experienceTravelerGuideSubsection,
} from './objects/experienceKnowledgeObjects'
import {experienceResourceCard} from './objects/experienceResourceCard'
import {experiencePageResources} from './objects/experiencePageResources'
import {landingReserveBlock} from './objects/landingReserveBlock'
import {reserveCtaSettings} from './objects/reserveCtaSettings'
import {experienceReserveCardRow} from './objects/experienceReserveCardRow'
import {lodgePageSectionCopy} from './objects/lodgePageSectionCopy'
import {lodgeSnapshotKeyPick} from './objects/lodgeSnapshotKeyPick'
import {lodgePageHeroHighlightPill} from './objects/lodgePageHeroHighlightPill'
import {
  lodgePageHighlightLine,
  lodgePageNavItem,
  lodgeGalleryStableKeyPick,
  lodgeAmenityIconPick,
  lodgeScienceSpecialText,
  lodgePageFaqItem,
} from './objects/lodgePageObjects'
import {lodgePageBookingBlock} from './objects/lodgePageBookingBlock'
import {lodgePageExperiencesTailorCta} from './objects/lodgePageExperiencesTailorCta'
import {tailorMadeBand} from './objects/tailorMadeBand'
import {homeExperienceProgramGroup} from './objects/homeExperienceProgramGroup'
import {experiencePageSnapshotStatPick} from './objects/experiencePageSnapshotStatPick'
import {experiencePageInternalNav} from './objects/experiencePageInternalNav'
import {internalNavItem} from './objects/internalNavItem'
import {pageModule} from './objects/pageModule'
import {reviewsLayoutBlock} from './objects/reviewsLayoutBlock'
import {pageReviewsSection} from './objects/pageReviewsSection'
import {experiencePageReviewsSection} from './objects/experiencePageReviewsSection'
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
import {headerSettings} from './headerSettings'
import {footerSettings} from './footerSettings'
import {reviewsSettings} from './reviewsSettings'
import {bookingModalSettings} from './bookingModalSettings'
import {technologyProduct} from './technologyProduct'

const objects = [
  seo,
  linkWithLabel,
  smartLink,
  headerNavProgramGroup,
  headerNavProgramTypeGroup,
  headerNavRouteGroupOverride,
  headerNavLodgeRouteGroup,
  headerNavSeeAll,
  headerNavExperiencesGroups,
  headerNavLodgeGroups,
  headerNavExperienceGroupOverride,
  headerNavExperienceItemOverride,
  headerNavLodgeRouteOverride,
  headerNavLodgeItemOverride,
  headerNavExperiencesTailorMenu,
  headerNavExperiencesDropdown,
  headerNavLodgesDropdown,
  headerNavTab,
  cta,
  imageWithAlt,
  experienceGalleryItem,
  experienceItineraryOvernight,
  experienceSnapshotHighlight,
  experienceLodgePresentationRow,
  experienceSeasonLegend,
  experienceTravelerGuideRow,
  experienceTravelerGuideChecklistRow,
  experienceTravelerGuideSection,
  experienceTravelerGuideSubsection,
  experienceTermsPanel,
  experienceKnowledgeResource,
  experienceResourceCard,
  experiencePageResources,
  internalNavItem,
  experiencePageInternalNav,
  experiencePageSnapshotStatPick,
  pageModule,
  reviewsLayoutBlock,
  pageReviewsSection,
  experiencePageReviewsSection,
  landingHero,
  landingReserveBlock,
  experienceReserveCardRow,
  reserveCtaSettings,
  lodgePageSectionCopy,
  lodgeSnapshotKeyPick,
  lodgePageHeroHighlightPill,
  lodgePageHighlightLine,
  lodgePageNavItem,
  lodgeGalleryStableKeyPick,
  lodgeAmenityIconPick,
  lodgeScienceSpecialText,
  lodgePageFaqItem,
  lodgePageBookingBlock,
  tailorMadeBand,
  homeExperienceProgramGroup,
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
  journalBlockRichText,
  journalBlockImage,
  journalBlockGallery,
  journalBlockVideoEmbed,
  journalBlockQuote,
  journalBlockDivider,
  journalBlockCta,
  journalBlockRelatedExperience,
]

const documents = [
  siteSettings,
  headerSettings,
  footerSettings,
  bookingModalSettings,
  reviewsSettings,
  lodge,
  lodgePage,
  route,
  experience,
  experiencePage,
  technologyProduct,
  review,
  blogPost,
  journalPage,
  partner,
  homePage,
  routesPage,
  aboutPage,
]

export const schema = {
  types: [...objects, ...documents],
}
