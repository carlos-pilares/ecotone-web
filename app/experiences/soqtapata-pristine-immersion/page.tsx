import type { Metadata } from 'next'
import { ExperiencePageChromeClient } from '@/components/ExperiencePageChromeClient'
import { InPageNavDrawerClient } from '@/components/shared/InPageNavDrawerClient'
import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { SoqtapataPhotoLightbox } from '@/components/SoqtapataPhotoLightbox'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { ReviewsSection } from '@/components/ReviewsSection'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { TechProductsSection } from '@/components/TechProductsSection'
import { buildFeaturedQuoteItemsForExperience } from '@/lib/experienceFeaturedQuotes'
import { getSoqtapataPageCms, soqtapataPristineSeoDefault } from '@/lib/soqtapataCmsV1'
import { ExperienceHeroSoqtapata } from '@/components/experience/ExperienceHeroSoqtapata'
import { ExperienceStatsBarSoqtapata } from '@/components/experience/ExperienceStatsBarSoqtapata'
import { ExperiencePageNavSoqtapata } from '@/components/experience/ExperiencePageNavSoqtapata'
import { ExperienceOverviewSoqtapata } from '@/components/experience/ExperienceOverviewSoqtapata'
import { ExperienceItinerarySoqtapata } from '@/components/experience/ExperienceItinerarySoqtapata'
import { ExperienceLodgeSoqtapata } from '@/components/experience/ExperienceLodgeSoqtapata'
import { ExperienceWildlifeSoqtapata } from '@/components/experience/ExperienceWildlifeSoqtapata'
import { ExperienceIncludesSoqtapata } from '@/components/experience/ExperienceIncludesSoqtapata'
import { ExperienceMediaSoqtapata } from '@/components/experience/ExperienceMediaSoqtapata'
import { ExperienceWhenSoqtapata } from '@/components/experience/ExperienceWhenSoqtapata'
import { ExperienceBeforeYouGoSoqtapata } from '@/components/experience/ExperienceBeforeYouGoSoqtapata'
import { ExperienceTermsSoqtapata } from '@/components/experience/ExperienceTermsSoqtapata'
import { ExperienceResourcesSoqtapata } from '@/components/experience/ExperienceResourcesSoqtapata'
import { ExperienceFaqSoqtapata } from '@/components/experience/ExperienceFaqSoqtapata'
import { ExperienceAlsoCamantiSoqtapata } from '@/components/experience/ExperienceAlsoCamantiSoqtapata'
import { ExperienceBookSoqtapata } from '@/components/experience/ExperienceBookSoqtapata'
import type { ReviewsSectionProps } from '@/components/ReviewsSection'

import '@/components/shared/in-page-nav.css'
import '../experience-surface.css'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSoqtapataPageCms()
  return {
    title: seo.title || soqtapataPristineSeoDefault.title,
    description: seo.description || soqtapataPristineSeoDefault.description,
  }
}

export default async function SoqtapataPristineImmersionPage() {
  const {
    experience: ex,
    reviewsLayout,
    sectionVisibility: sec,
    reviewsSectionLead,
  } = await getSoqtapataPageCms()

  const localReviews = ex.reviews
  const featuredQuoteItems = buildFeaturedQuoteItemsForExperience(localReviews)

  const reviewsProps: ReviewsSectionProps = {
    ...reviewsLayout,
    reviews: localReviews,
    featuredQuoteItems,
    homeData: null,
    sectionLead: reviewsSectionLead,
  }

  return (
    <EcotoneV2Client solidMainNav featuredQuoteItems={featuredQuoteItems}>
      <IsotipoDefs />
      <SiteHeader mainNavSolid />
      <SoqtapataPhotoLightbox />
      <div id="ecotone-experience-root">
        <ExperienceHeroSoqtapata data={ex.hero} />
        <ExperienceStatsBarSoqtapata items={ex.stats} />
        <ExperiencePageNavSoqtapata data={ex.pageNav} />
        {sec.overview !== false ? <ExperienceOverviewSoqtapata data={ex.overview} /> : null}
        {sec.itinerary !== false ? <ExperienceItinerarySoqtapata data={ex.itinerary} /> : null}
        {sec.lodge !== false ? <ExperienceLodgeSoqtapata data={ex.lodge} /> : null}
        {sec.wildlife !== false ? <ExperienceWildlifeSoqtapata data={ex.wildlife} /> : null}
        {sec.includes !== false ? <ExperienceIncludesSoqtapata data={ex.includes} /> : null}
        {sec.tech !== false ? (
          <TechProductsSection
            variant="experience"
            products={ex.techProducts}
            includedProductIds={ex.includedProductIds}
            description={ex.techDescription}
            eyebrow={ex.techEyebrow}
            title={ex.techTitle}
          />
        ) : null}
        {sec.media !== false ? <ExperienceMediaSoqtapata data={ex.media} /> : null}
        {sec.whenToVisit !== false ? <ExperienceWhenSoqtapata data={ex.when} /> : null}
        {sec.beforeYouGo !== false ? <ExperienceBeforeYouGoSoqtapata data={ex.beforeYouGo} /> : null}
        {sec.reviews !== false ? <ReviewsSection {...reviewsProps} /> : null}
        {sec.terms !== false ? <ExperienceTermsSoqtapata data={ex.terms} /> : null}
        {sec.resources !== false ? <ExperienceResourcesSoqtapata data={ex.resources} /> : null}
        {sec.faq !== false ? <ExperienceFaqSoqtapata data={ex.faq} /> : null}
        {sec.related !== false ? <ExperienceAlsoCamantiSoqtapata data={ex.also} /> : null}
        {sec.reserve !== false ? <ExperienceBookSoqtapata data={ex.book} /> : null}
      </div>
      <ExperiencePageChromeClient />
      <InPageNavDrawerClient />
      <SiteFooter />
    </EcotoneV2Client>
  )
}
