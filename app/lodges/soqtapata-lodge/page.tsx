import type { Metadata } from 'next'

import { LodgePageView } from '@/app/lodges/LodgePageView'
import { buildAbsoluteSeoMetadata } from '@/lib/buildAbsoluteSeoMetadata'
import { getActivePromotions } from '@/lib/getPromotions'
import { getSoqtapataLodgePageCms } from '@/lib/lodgePageCms'
import { LODGE_SOQTAPATA_PAGE_SLUG } from '@/lib/lodgePageCmsTypes'

/** ISR: la landing lee `lodgePage` en build; sin revalidate los overrides CMS no llegan hasta el próximo deploy. */
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const resolved = await getSoqtapataLodgePageCms()
  return buildAbsoluteSeoMetadata({
    path: `/lodges/${LODGE_SOQTAPATA_PAGE_SLUG}`,
    title: resolved.seo.title,
    description: resolved.seo.description,
    noIndex: resolved.seo.noIndex,
    ogImageUrl: resolved.seo.ogImageUrl,
  })
}

export default async function SoqtapataLodgePage() {
  const [resolved, promotions] = await Promise.all([getSoqtapataLodgePageCms(), getActivePromotions()])
  return <LodgePageView resolved={resolved} promotions={promotions} />
}
