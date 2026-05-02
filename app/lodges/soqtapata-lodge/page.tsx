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
import {
  lodgeSoqtapataBook,
  lodgeSoqtapataExperiences,
  lodgeSoqtapataFacilities,
  lodgeSoqtapataFaq,
  lodgeSoqtapataFeaturedQuotes,
  lodgeSoqtapataHero,
  lodgeSoqtapataLocation,
  lodgeSoqtapataPageNav,
  lodgeSoqtapataOverview,
  lodgeSoqtapataResearch,
  lodgeSoqtapataReviewCards,
  lodgeSoqtapataRooms,
  lodgeSoqtapataSnapshot,
} from '@/data/lodgeSoqtapataStatic'

export const metadata: Metadata = {
  title: 'Soqtapata Lodge — Ecotone · Cusco, Perú',
  description:
    'The only lodge inside the Soqtapata Reserve. Cloud forest stays adjacent to CIDS research station — Camanti Route, Cusco.',
}

const lodgeFeaturedQuotes = [...lodgeSoqtapataFeaturedQuotes]

export default function SoqtapataLodgePage() {
  return (
    <EcotoneV2Client solidMainNav featuredQuoteItems={lodgeFeaturedQuotes}>
      <IsotipoDefs />
      <SiteHeader mainNavSolid />
      <div className="lodge-page" id="ecotone-experience-root">
        <LodgeHero data={lodgeSoqtapataHero} />
        <SnapshotBar
          items={lodgeSoqtapataSnapshot.map((s) => ({ value: s.snapN, label: s.snapL }))}
        />
        <LodgeInPageNav nav={lodgeSoqtapataPageNav} />
        <LodgeOverview data={lodgeSoqtapataOverview} />
        <LodgeRooms data={lodgeSoqtapataRooms} />
        <LodgeFacilities data={lodgeSoqtapataFacilities} />
        <LodgeLocation data={lodgeSoqtapataLocation} />
        <LodgeResearch data={lodgeSoqtapataResearch} />
        <LodgeExperiences data={lodgeSoqtapataExperiences} />
        <ReviewsSection
          reviews={lodgeSoqtapataReviewCards}
          featuredQuoteItems={lodgeFeaturedQuotes}
          useHomepageSampleReviewsIfEmpty={false}
          sectionClassName="content-section bg-cream"
          contentInnerClassName="content-inner"
          eyebrow="What guests say"
          headline="Real stays"
          averageRating="5.0"
          secondaryRatingLine="12 verified reviews"
          reviewCarouselEnd={
            <a
              className="rev-card lodge-rev-card-all"
              href="/experiences/soqtapata-pristine-immersion#reviews"
            >
              <span>All 12 reviews →</span>
            </a>
          }
        />
        <LodgeFaq data={lodgeSoqtapataFaq} />
        <LodgeBookCta data={lodgeSoqtapataBook} />
      </div>
      <GalleryLightbox />
      <InPageNavDrawerClient />
      <SiteFooter />
    </EcotoneV2Client>
  )
}
