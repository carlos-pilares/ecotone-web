import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { ReviewsSection } from '@/components/ReviewsSection'
import { LodgeBookCta } from '@/components/lodge/LodgeBookCta'
import { LodgeExperiences } from '@/components/lodge/LodgeExperiences'
import { LodgeFacilities } from '@/components/lodge/LodgeFacilities'
import { LodgeFaq } from '@/components/lodge/LodgeFaq'
import { LodgeHero } from '@/components/lodge/LodgeHero'
import { LodgeInPageNav } from '@/components/lodge/LodgeInPageNav'
import { LodgeLocation } from '@/components/lodge/LodgeLocation'
import { LodgeResearch } from '@/components/lodge/LodgeResearch'
import { LodgeOverview } from '@/components/lodge/LodgeOverview'
import { LodgeRooms } from '@/components/lodge/LodgeRooms'
import { GalleryLightbox } from '@/components/shared/GalleryLightbox'
import { InPageNavDrawerClient } from '@/components/shared/InPageNavDrawerClient'
import { SnapshotBar } from '@/components/shared/SnapshotBar'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import type { SoqtapataFaq } from '@/data/soqtapataExperienceLocal'
import type { LodgePageResolvedPayload } from '@/lib/lodgePageCmsTypes'

import type { PromotionDoc } from '@/lib/promotionTypes'

type LodgePageViewProps = {
  resolved: LodgePageResolvedPayload
  promotions?: PromotionDoc[] | null
}

/** Shared lodge landing layout (CMS + static merge). */
export function LodgePageView({ resolved, promotions }: LodgePageViewProps) {
  const lodgeFeaturedQuotes = [...resolved.featuredQuotes]
  const sec = resolved.sectionVisibility

  return (
    <EcotoneV2Client solidMainNav featuredQuoteItems={lodgeFeaturedQuotes}>
      <IsotipoDefs />
      <SiteHeader mainNavSolid />
      <div className="lodge-page" id="ecotone-experience-root">
        {sec.hero ? <LodgeHero data={resolved.hero} /> : null}
        {sec.highlights ? (
          <SnapshotBar items={resolved.snapshot.map((s) => ({ value: s.snapN, label: s.snapL }))} />
        ) : null}
        {sec.navigation ? <LodgeInPageNav nav={resolved.pageNav} /> : null}
        {sec.overview ? <LodgeOverview data={resolved.overview} /> : null}
        {sec.accommodation ? <LodgeRooms data={resolved.rooms} /> : null}
        {sec.facilities ? <LodgeFacilities data={resolved.facilities} /> : null}
        {sec.location ? <LodgeLocation data={resolved.location} /> : null}
        {sec.research ? <LodgeResearch data={resolved.research} /> : null}
        {sec.experiences ? <LodgeExperiences data={resolved.experiences} promotions={promotions} /> : null}
        {sec.reviews ? (
          <ReviewsSection
            sectionClassName="sec bg-cream fade"
            contentInnerClassName="sec-inner"
            eyebrow={resolved.reviewsSection.eyebrow}
            title={resolved.reviewsSection.headline}
            body={resolved.reviewsSection.sectionLead}
            ratingSummary={resolved.reviewsRatingSummary}
            rotatingQuoteItems={[...lodgeFeaturedQuotes]}
            reviewCards={resolved.reviews}
            emptyMessage={resolved.reviewsSection.emptyMessage}
          />
        ) : null}
        {sec.faq ? <LodgeFaq data={resolved.faq as SoqtapataFaq} /> : null}
        {sec.booking ? <LodgeBookCta data={resolved.book} /> : null}
      </div>
      <GalleryLightbox />
      <InPageNavDrawerClient />
      <SiteFooter />
    </EcotoneV2Client>
  )
}
