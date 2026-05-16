import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ExperiencePageChromeClient } from '@/components/ExperiencePageChromeClient'
import { InPageNavDrawerClient } from '@/components/shared/InPageNavDrawerClient'
import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { SoqtapataPhotoLightbox } from '@/components/SoqtapataPhotoLightbox'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { ReviewsSection } from '@/components/ReviewsSection'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { TechProductsSection } from '@/components/TechProductsSection'
import { buildSoqtapataBookingSummary } from '@/lib/buildSoqtapataBookingSummary'
import {
  SOQTAPATA_LOCAL_FALLBACK_SLUG,
  getSoqtapataPageCms,
  soqtapataPristineSeoDefault,
} from '@/lib/soqtapataCmsV1'
import { experienceHasMediaSection } from '@/lib/soqtapataStructuredCms'
import { experiencePageSlugsQuery } from '@/lib/queries'
import { clientServer } from '@/lib/sanity'
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

export const revalidate = 60

/** CMS can add new experience landings without redeploy; still cached with `revalidate`. */
export const dynamicParams = true

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return [{ slug: SOQTAPATA_LOCAL_FALLBACK_SLUG }]
  }
  const slugs = await clientServer.fetch<string[] | null>(experiencePageSlugsQuery)
  const list = (slugs ?? []).filter((s): s is string => typeof s === 'string' && Boolean(s.trim())).map((s) => s.trim())
  return list.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getSoqtapataPageCms(slug)
  if (!data) notFound()
  return {
    title: data.seo.title || soqtapataPristineSeoDefault.title,
    description: data.seo.description || soqtapataPristineSeoDefault.description,
  }
}

export default async function ExperienceLandingPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getSoqtapataPageCms(slug)
  if (!data) notFound()

  const {
    experience: ex,
    reviewsLayout,
    sectionVisibility: sec,
    reviewsSectionLead,
    reviewsRatingSummary,
    rotatingQuoteItems,
  } = data

  const localReviews = ex.reviews
  const bookingSummary = buildSoqtapataBookingSummary(ex.hero, ex.book)

  const reviewsProps: ReviewsSectionProps = {
    sectionClassName: 'sec bg-cream fade',
    contentInnerClassName: 'sec-inner',
    eyebrow: reviewsLayout.eyebrow,
    title: reviewsLayout.headline,
    body: reviewsSectionLead ?? null,
    ratingSummary: reviewsRatingSummary,
    rotatingQuoteItems,
    reviewCards: localReviews,
    emptyMessage: reviewsLayout.emptyMessage?.trim() || null,
  }

  return (
    <EcotoneV2Client solidMainNav featuredQuoteItems={rotatingQuoteItems}>
      <IsotipoDefs />
      <SiteHeader mainNavSolid />
      <SoqtapataPhotoLightbox />
      <div id="ecotone-experience-root">
        <ExperienceHeroSoqtapata data={ex.hero} bookingSummary={bookingSummary} />
        <ExperienceStatsBarSoqtapata items={ex.stats} />
        <ExperiencePageNavSoqtapata data={ex.pageNav} bookingSummary={bookingSummary} />
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
        {sec.media !== false && experienceHasMediaSection(ex.media) ? (
          <ExperienceMediaSoqtapata data={ex.media} />
        ) : null}
        {sec.whenToVisit !== false ? <ExperienceWhenSoqtapata data={ex.when} /> : null}
        {sec.beforeYouGo !== false ? <ExperienceBeforeYouGoSoqtapata data={ex.beforeYouGo} /> : null}
        {sec.reviews !== false ? <ReviewsSection {...reviewsProps} /> : null}
        {sec.terms !== false ? <ExperienceTermsSoqtapata data={ex.terms} /> : null}
        {sec.resources !== false ? <ExperienceResourcesSoqtapata data={ex.resources} /> : null}
        {sec.faq !== false ? <ExperienceFaqSoqtapata data={ex.faq} /> : null}
        {sec.related !== false && ex.also.cards.length > 0 ? (
          <ExperienceAlsoCamantiSoqtapata data={ex.also} />
        ) : null}
        {sec.reserve !== false ? <ExperienceBookSoqtapata data={ex.book} bookingSummary={bookingSummary} /> : null}
      </div>
      <ExperiencePageChromeClient />
      <InPageNavDrawerClient />
      <SiteFooter />
    </EcotoneV2Client>
  )
}
