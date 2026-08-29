import { getHomePage } from '@/lib/getHomePage'
import { filterPublishedPartnerDocs } from '@/lib/partnerDocs'

import { ManuVolunteerPageContent } from './ManuVolunteerPageContent'

export default async function ManuConservationVolunteerPage() {
  const home = await getHomePage()
  const partners = filterPublishedPartnerDocs(home.partnersOnHome)

  return (
    <ManuVolunteerPageContent
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
