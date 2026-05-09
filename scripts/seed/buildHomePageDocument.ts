import type { SanityClient } from '@sanity/client'

import { CMS_IDS } from '@/data/cmsApproved/ids'
import { partnerSeeds } from '@/data/cmsApproved/librarySeeds'
import { homePageTextFields } from '@/data/cmsApproved/homePageFields'
import { HOME_IMAGE_URLS } from '@/data/cmsApproved/homeImageUrls'
import { createUrlImageCache } from './urlImageCache'

/** Full `homePage` singleton with text + images uploaded to Sanity assets. */
export async function buildHomePageDocument(client: SanityClient) {
  const cache = createUrlImageCache(client)
  const [heroImage, manifestoImage, missionPhoto1, missionPhoto2, missionPhoto3] = await Promise.all([
    cache.get(HOME_IMAGE_URLS.hero, 'home-hero-bg.jpg'),
    cache.get(HOME_IMAGE_URLS.manifesto, 'home-manifesto.jpg'),
    cache.get(HOME_IMAGE_URLS.missionPhoto1, 'home-mission-1.jpg'),
    cache.get(HOME_IMAGE_URLS.missionPhoto2, 'home-mission-2.jpg'),
    cache.get(HOME_IMAGE_URLS.missionPhoto3, 'home-mission-3.jpg'),
  ])

  const partnersOnHome = partnerSeeds.map((p, i) => ({
    _type: 'reference' as const,
    _ref: p._id,
    _key: `home-partner-${i}`,
  }))

  return {
    _id: CMS_IDS.homePage,
    _type: 'homePage' as const,
    ...homePageTextFields,
    heroImage,
    manifestoImage,
    missionPhoto1,
    missionPhoto2,
    missionPhoto3,
    partnersOnHome,
  }
}
