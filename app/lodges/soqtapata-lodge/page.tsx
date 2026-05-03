import type { Metadata } from 'next'

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
  const resolved = await getSoqtapataLodgePageCms()
  const lodgeFeaturedQuotes = [...resolved.featuredQuotes]

  return (
    <EcotoneV2Client solidMainNav featuredQuoteItems={lodgeFeaturedQuotes}>
      <IsotipoDefs />
      <SiteHeader mainNavSolid />
      <div className="lodge-page" id="ecotone-experience-root">
        <LodgeHero data={resolved.hero} />
        <SnapshotBar
          items={resolved.snapshot.map((s) => ({ value: s.snapN, label: s.snapL }))}
        />
        <LodgeInPageNav nav={resolved.pageNav} />
        <LodgeOverview data={resolved.overview} />
        <LodgeRooms data={resolved.rooms} />
        <LodgeFacilities data={resolved.facilities} />
        <LodgeLocation data={resolved.location} />
        <LodgeResearch data={resolved.research} />
        <LodgeExperiences data={resolved.experiences} />
        <ReviewsSection
          reviews={resolved.reviews}
          featuredQuoteItems={lodgeFeaturedQuotes}
          useHomepageSampleReviewsIfEmpty={false}
          sectionClassName="content-section bg-cream"
          contentInnerClassName="content-inner"
          eyebrow={resolved.reviewsSection.eyebrow}
          headline={resolved.reviewsSection.headline}
          averageRating={resolved.reviewsSection.averageRating}
          sourceLabel={resolved.reviewsSection.sourceLabel}
          secondaryRatingLine={resolved.reviewsSection.secondaryRatingLine}
          sectionLead={resolved.reviewsSection.sectionLead}
          emptyMessage={resolved.reviewsSection.emptyMessage}
          reviewCarouselEnd={
            <a
              className="rev-card lodge-rev-card-all"
              href={resolved.reviewsSection.carouselEndHref}
            >
              <span>{resolved.reviewsSection.carouselEndLabel}</span>
            </a>
          }
        />
        <LodgeFaq data={resolved.faq as SoqtapataFaq} />
        <LodgeBookCta data={resolved.book} />
      </div>
      <GalleryLightbox />
      <InPageNavDrawerClient />
      <SiteFooter />
    </EcotoneV2Client>
  )
}
