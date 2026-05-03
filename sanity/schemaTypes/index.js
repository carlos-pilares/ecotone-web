import {blogPost} from './blogPost'
import {cta} from './objects/cta'
import {imageWithAlt} from './objects/imageWithAlt'
import {review} from './review'
import {linkWithLabel} from './objects/linkWithLabel'
import {landingHero} from './objects/landingHero'
import {experienceResourceCard} from './objects/experienceResourceCard'
import {experiencePageResources} from './objects/experiencePageResources'
import {landingReserveBlock} from './objects/landingReserveBlock'
import {lodgePageSectionCopy} from './objects/lodgePageSectionCopy'
import {lodgeSnapshotKeyPick} from './objects/lodgeSnapshotKeyPick'
import {lodgePageBookingBlock} from './objects/lodgePageBookingBlock'
import {experiencePageSnapshotStatPick} from './objects/experiencePageSnapshotStatPick'
import {experiencePageInternalNav} from './objects/experiencePageInternalNav'
import {internalNavItem} from './objects/internalNavItem'
import {pageModule} from './objects/pageModule'
import {reviewsLayoutBlock} from './objects/reviewsLayoutBlock'
import {seo} from './objects/seo'
import {experience} from './experience'
import {experiencePage} from './experiencePage'
import {homePage} from './homePage'
import {lodge} from './lodge'
import {lodgePage} from './lodgePage'
import {partner} from './partner'
import {route} from './route'
import {siteSettings} from './siteSettings'
import {technologyProduct} from './technologyProduct'

const objects = [
  seo,
  linkWithLabel,
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
]

export const schema = {
  types: [...objects, ...documents],
}
