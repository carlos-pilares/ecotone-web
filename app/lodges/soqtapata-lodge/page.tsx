import type { Metadata } from 'next'

import { LodgePageView } from '@/app/lodges/LodgePageView'
import { getActivePromotions } from '@/lib/getPromotions'
import { getSoqtapataLodgePageCms } from '@/lib/lodgePageCms'
import { lodgeSoqtapataSeoDefault } from '@/lib/lodgePageCmsTypes'

/** ISR: la landing lee `lodgePage` en build; sin revalidate los overrides CMS no llegan hasta el próximo deploy. */
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const resolved = await getSoqtapataLodgePageCms()
  return {
    title: resolved.seo.title || lodgeSoqtapataSeoDefault.title,
    description: resolved.seo.description || lodgeSoqtapataSeoDefault.description,
  }
}

export default async function SoqtapataLodgePage() {
  const [resolved, promotions] = await Promise.all([getSoqtapataLodgePageCms(), getActivePromotions()])
  return <LodgePageView resolved={resolved} promotions={promotions} />
}
