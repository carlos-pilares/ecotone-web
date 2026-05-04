import type { Metadata } from 'next'
import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { ReviewsSection } from '@/components/ReviewsSection'
import { RoutesCompare } from '@/components/routes/RoutesCompare'
import { RoutesExperiences } from '@/components/routes/RoutesExperiences'
import { RoutesFinalCta } from '@/components/routes/RoutesFinalCta'
import { RoutesHero } from '@/components/routes/RoutesHero'
import { RoutesList } from '@/components/routes/RoutesList'
import { RoutesTerritory } from '@/components/routes/RoutesTerritory'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { SnapshotBar } from '@/components/shared/SnapshotBar'
import { getRoutesPage } from '@/lib/getRoutesPage'

import '../experiences/experience-surface.css'
import './routes-surface.css'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getRoutesPage()
  const { seo } = page
  return {
    title: seo.title,
    description: seo.description,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: seo.ogImageUrl
      ? {
          title: seo.title,
          description: seo.description,
          images: [{ url: seo.ogImageUrl }],
        }
      : { title: seo.title, description: seo.description },
  }
}

export default async function RoutesPage() {
  const p = await getRoutesPage()
  const snapshotItems = p.snapshotStats.map((s) => ({ value: s.value, label: s.label }))

  return (
    <EcotoneV2Client featuredQuoteItems={p.featuredQuotes}>
      <div className="routes-page">
        <IsotipoDefs />
        <SiteHeader />
        <RoutesHero data={p.hero} />
        <SnapshotBar items={snapshotItems} />
        <RoutesTerritory data={p.territory} />
        <RoutesList routes={p.routesCards} />
        <RoutesCompare section={p.compareSection} columns={p.compareColumns} rows={p.compareRows} />
        <RoutesExperiences section={p.experiencesSection} filters={p.expFilters} cards={p.expCards} />
        <ReviewsSection
          reviews={p.reviews}
          featuredQuoteItems={p.featuredQuotes}
          sectionClassName="content-section bg-cream fade"
          contentInnerClassName="content-inner"
          eyebrow={p.reviewsEyebrow}
          headline={p.reviewsHeadline}
          averageRating={p.reviewsAverageRating}
          sourceLabel={p.reviewsSourceLabel}
          secondaryRatingLine={p.reviewsSecondaryRatingLine}
          sectionLead={p.reviewsSectionLead}
        />
        <RoutesFinalCta data={p.finalCta} />
        <SiteFooter />
      </div>
    </EcotoneV2Client>
  )
}
