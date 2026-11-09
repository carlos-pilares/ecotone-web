import { getHomePage } from '@/lib/getHomePage'
import { filterPublishedPartnerDocs } from '@/lib/partnerDocs'

import { Mfc2027PageContent } from './Mfc2027PageContent'

export default async function ManuFieldCrew2027Page() {
  const home = await getHomePage()
  const partners = filterPublishedPartnerDocs(home.partnersOnHome)

  return (
    <Mfc2027PageContent
      partnersBand={{
        eyebrow: home.partnersEyebrow ?? 'Partners & Certifications',
        title: home.partnersTitle ?? home.partnersLabel ?? null,
        body: home.partnersBody ?? null,
        emptyMessage: home.partnersEmptyMessage ?? null,
        partners,
      }}
    />
  )
}
