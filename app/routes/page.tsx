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
import { getActivePromotions } from '@/lib/getPromotions'
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
  const [p, promotions] = await Promise.all([getRoutesPage(), getActivePromotions()])
  const snapshotItems = p.snapshotStats.map((s) => ({ value: s.value, label: s.label }))
  const sec = p.sectionVisibility

  return (
    <EcotoneV2Client solidMainNav featuredQuoteItems={p.featuredQuotes}>
      <div className="routes-page">
        <IsotipoDefs />
        <SiteHeader />
        {sec.hero ? <RoutesHero data={p.hero} /> : null}
        {sec.snapshot ? <SnapshotBar items={snapshotItems} /> : null}
        {sec.territory ? <RoutesTerritory data={p.territory} /> : null}
        {sec.routes ? <RoutesList routes={p.routesCards} /> : null}
        {sec.compare ? (
          <RoutesCompare section={p.compareSection} columns={p.compareColumns} rows={p.compareRows} />
        ) : null}
        {sec.experiences ? (
          <RoutesExperiences
            section={p.experiencesSection}
            filters={p.expFilters}
            cards={p.expCards}
            promotions={promotions}
          />
        ) : null}
        {sec.reviews ? (
          <ReviewsSection
            sectionClassName="sec bg-cream fade"
            contentInnerClassName="sec-inner"
            eyebrow={p.reviewsEyebrow}
            title={p.reviewsHeadline}
            body={p.reviewsSectionLead || null}
            ratingSummary={p.reviewsRatingSummary}
            rotatingQuoteItems={p.featuredQuotes}
            reviewCards={p.reviews}
          />
        ) : null}
        {sec.finalCta ? <RoutesFinalCta data={p.finalCta} /> : null}
        <SiteFooter />
      </div>
    </EcotoneV2Client>
  )
}
