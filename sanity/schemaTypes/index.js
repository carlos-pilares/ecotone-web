import {blogPost} from './blogPost'
import {experience} from './experience'
import {homePage} from './homePage'
import {lodge} from './lodge'
import {partner} from './partner'
import {review} from './review'
import {route} from './route'
import {technologyProduct} from './technologyProduct'

export const schema = {
  types: [
    lodge,
    route,
    experience,
    technologyProduct,
    review,
    blogPost,
    partner,
    homePage,
  ],
}
