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
import { ExperienceOfferTerms } from '@/components/experience/ExperienceOfferTerms'
import { buildSoqtapataBookingSummary } from '@/lib/buildSoqtapataBookingSummary'
import { getActivePromotions } from '@/lib/getPromotions'
import {
  SOQTAPATA_LOCAL_FALLBACK_SLUG,
  soqtapataPristineSeoDefault,
} from '@/lib/soqtapataCmsV1'
import { experienceHasMediaSection } from '@/lib/soqtapataStructuredCms'
import { experienceLandingSlugsQuery } from '@/lib/queries'
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
import { ExperienceLearningPageSections } from '@/components/experience/learning/ExperienceLearningPageSections'
import { ExperienceViewTracker } from '@/components/experience/ExperienceViewTracker'
import type { ReviewsSectionProps } from '@/components/ReviewsSection'
import { buildExperienceLearningPageNav } from '@/lib/experienceLearningNav'
import {
  getExperienceLearningPreviewContent,
  isExperienceLearningPreviewRequest,
} from '@/lib/experienceLearningPreview'
import { getExperienceLandingPage } from '@/lib/getExperienceLandingPage'

import '@/components/shared/in-page-nav.css'
import '../experience-surface.css'

export const revalidate = 60

/** CMS can add new experience landings without redeploy; still cached with `revalidate`. */
export const dynamicParams = true

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return [{ slug: SOQTAPATA_LOCAL_FALLBACK_SLUG }]
  }
  const slugs = await clientServer.fetch<string[] | null>(experienceLandingSlugsQuery)
  const list = (slugs ?? []).filter((s): s is string => typeof s === 'string' && Boolean(s.trim())).map((s) => s.trim())
  return list.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const landing = await getExperienceLandingPage(slug)
  if (!landing) notFound()
  const seo = landing.seo
  return {
    title: seo.title || soqtapataPristineSeoDefault.title,
    description: seo.description || soqtapataPristineSeoDefault.description,
  }
}

export default async function ExperienceLandingPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp = await searchParams
  const landing = await getExperienceLandingPage(slug)
  if (!landing) notFound()

  const previewLearning = isExperienceLearningPreviewRequest(sp)
  const isExperientialLearning = landing.pageKind === 'learning' || previewLearning

  const {
    experience: ex,
    programType,
    reviewsLayout,
    sectionVisibility: sec,
    reviewsSectionLead,
    reviewsRatingSummary,
    rotatingQuoteItems,
    offerTerms,
  } = landing

  const learningContent =
    landing.pageKind === 'learning'
      ? landing.learningContent
      : previewLearning
        ? getExperienceLearningPreviewContent()
        : null

  const pageNav = isExperientialLearning ? buildExperienceLearningPageNav(ex.pageNav) : ex.pageNav

  const promotions = await getActivePromotions()

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
      <ExperienceViewTracker
        experience_name={bookingSummary.experienceName}
        experience_slug={slug}
        route={bookingSummary.route}
        program_type={programType ?? bookingSummary.programType}
      />
      <IsotipoDefs />
      <SiteHeader mainNavSolid />
      <SoqtapataPhotoLightbox items={ex.media.lightboxItems} />
      <div id="ecotone-experience-root">
        {sec.hero !== false ? (
          <ExperienceHeroSoqtapata data={ex.hero} bookingSummary={bookingSummary} />
        ) : null}
        {sec.highlights !== false ? <ExperienceStatsBarSoqtapata items={ex.stats} /> : null}
        {sec.internalNav !== false ? (
          <ExperiencePageNavSoqtapata data={pageNav} bookingSummary={bookingSummary} />
        ) : null}
        {sec.overview !== false ? <ExperienceOverviewSoqtapata data={ex.overview} /> : null}

        {isExperientialLearning && learningContent ? (
          <>
            <ExperienceLearningPageSections
              content={learningContent}
              lodge={ex.lodge}
              showProgramme={sec.programme !== false}
              showProjects={sec.projects !== false}
              showOutcomes={sec.learningOutcomes !== false}
              showFieldBase={sec.fieldBase !== false && sec.lodge !== false}
            />
            {sec.wildlife !== false ? <ExperienceWildlifeSoqtapata data={ex.wildlife} /> : null}
            {sec.includes !== false ? <ExperienceIncludesSoqtapata data={ex.includes} /> : null}
            {sec.media !== false && experienceHasMediaSection(ex.media) ? (
              <ExperienceMediaSoqtapata data={ex.media} />
            ) : null}
            {sec.beforeYouGo !== false ? (
              <ExperienceBeforeYouGoSoqtapata data={ex.beforeYouGo} sectionId="good-to-know" />
            ) : null}
            {sec.terms !== false ? <ExperienceTermsSoqtapata data={ex.terms} /> : null}
            {sec.resources !== false ? (
              <ExperienceResourcesSoqtapata data={ex.resources} experienceName={bookingSummary.experienceName} />
            ) : null}
            {sec.faq !== false ? <ExperienceFaqSoqtapata data={ex.faq} /> : null}
            {sec.reviews !== false ? <ReviewsSection {...reviewsProps} /> : null}
            {sec.related !== false && (ex.also.cards.length > 0 || ex.also.tailorBand) ? (
              <ExperienceAlsoCamantiSoqtapata data={ex.also} promotions={promotions} />
            ) : null}
            {sec.reserve !== false ? (
              <>
                <ExperienceBookSoqtapata data={ex.book} bookingSummary={bookingSummary} />
                <ExperienceOfferTerms items={offerTerms} />
              </>
            ) : null}
          </>
        ) : (
          <>
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
            {sec.resources !== false ? (
              <ExperienceResourcesSoqtapata data={ex.resources} experienceName={bookingSummary.experienceName} />
            ) : null}
            {sec.faq !== false ? <ExperienceFaqSoqtapata data={ex.faq} /> : null}
            {sec.related !== false && (ex.also.cards.length > 0 || ex.also.tailorBand) ? (
              <ExperienceAlsoCamantiSoqtapata data={ex.also} promotions={promotions} />
            ) : null}
            {sec.reserve !== false ? (
              <>
                <ExperienceBookSoqtapata data={ex.book} bookingSummary={bookingSummary} />
                <ExperienceOfferTerms items={offerTerms} />
              </>
            ) : null}
          </>
        )}
      </div>
      <ExperiencePageChromeClient />
      <InPageNavDrawerClient />
      <SiteFooter />
    </EcotoneV2Client>
  )
}
