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
import {
  routesCards,
  routesCompareColumns,
  routesCompareRows,
  routesCompareSection,
  routesExpCards,
  routesExperiencesSection,
  routesExpFilters,
  routesFeaturedQuoteItems,
  routesFinalCta,
  routesHero,
  routesReviewDocs,
  routesSnapshotStats,
  routesTerritory,
} from '@/data/routesStatic'

import '../experiences/experience-surface.css'
import './routes-surface.css'

export const metadata: Metadata = {
  title: 'Routes — Ecotone · Cusco, Perú',
  description:
    'Three corridors from Cusco into the Manu Biosphere Reserve and Camanti — cloud forest, gradient, and deep Amazon. Compare routes and find your program.',
}

export default function RoutesPage() {
  const snapshotItems = routesSnapshotStats.map((s) => ({ value: s.value, label: s.label }))

  return (
    <EcotoneV2Client featuredQuoteItems={routesFeaturedQuoteItems}>
      <div className="routes-page">
        <IsotipoDefs />
        <SiteHeader />
        <RoutesHero data={routesHero} />
        <SnapshotBar items={snapshotItems} />
        <RoutesTerritory data={routesTerritory} />
        <RoutesList routes={routesCards} />
        <RoutesCompare section={routesCompareSection} columns={routesCompareColumns} rows={routesCompareRows} />
        <RoutesExperiences section={routesExperiencesSection} filters={routesExpFilters} cards={routesExpCards} />
        <ReviewsSection
          reviews={routesReviewDocs}
          featuredQuoteItems={routesFeaturedQuoteItems}
          sectionClassName="content-section bg-cream fade"
          contentInnerClassName="content-inner"
          eyebrow="Guest voices"
          headline="Along these routes"
          secondaryRatingLine="12 verified reviews"
          sectionLead="Stories from Camanti and Manu — same care and standards on every corridor."
        />
        <RoutesFinalCta data={routesFinalCta} />
        <SiteFooter />
      </div>
    </EcotoneV2Client>
  )
}
