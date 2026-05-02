import { seedCmsAll } from './seedCmsAll'

seedCmsAll()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log(
      'seed:cms — OK (siteSettings, homePage+images, partners, blog, tech, route, lodge, experience+gallery+itinerary images, reviews, experiencePage; no payloadV1)',
    )
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e)
    process.exit(1)
  })
