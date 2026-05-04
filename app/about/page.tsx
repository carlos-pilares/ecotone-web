import type { Metadata } from 'next'
import { AboutDifference } from '@/components/about/AboutDifference'
import { AboutFinalCta } from '@/components/about/AboutFinalCta'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutPeople } from '@/components/about/AboutPeople'
import { AboutProof } from '@/components/about/AboutProof'
import { AboutWay } from '@/components/about/AboutWay'
import { AboutWho } from '@/components/about/AboutWho'
import { AboutWhy } from '@/components/about/AboutWhy'
import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { PartnersBand } from '@/components/shared/PartnersBand'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { aboutPartnersCopy, aboutPartnersFallback, aboutStatic } from '@/data/aboutStatic'
import { client } from '@/lib/sanity'
import { partnersQuery, type PartnerDoc } from '@/lib/queries'

import '../experiences/experience-surface.css'
import './about-surface.css'

export const metadata: Metadata = {
  title: 'About — Ecotone · Cusco, Perú',
  description:
    'Regenerative travel in the Manu Biosphere Reserve and Camanti — who we are, why we exist, and how we design immersive nature journeys from Cusco.',
}

export default async function AboutPage() {
  let partnersFromCms: PartnerDoc[] = []
  try {
    partnersFromCms = await client.fetch<PartnerDoc[]>(partnersQuery)
  } catch {
    partnersFromCms = []
  }
  const partnersForBand = partnersFromCms.length > 0 ? partnersFromCms : aboutPartnersFallback

  return (
    <EcotoneV2Client>
      <div className="about-page">
        <IsotipoDefs />
        <SiteHeader />
        <AboutHero data={aboutStatic.hero} />
        <AboutWho data={aboutStatic.who} />
        <AboutWhy data={aboutStatic.why} />
        <AboutDifference data={aboutStatic.difference} />
        <AboutWay data={aboutStatic.way} />
        <AboutPeople data={aboutStatic.people} />
        <AboutProof data={aboutStatic.proof} />
        <PartnersBand
          label={aboutPartnersCopy.label}
          body={aboutPartnersCopy.body}
          partners={partnersForBand}
          partnerNameFallback={aboutPartnersCopy.partnerNameFallback}
          emptyMessage={aboutPartnersCopy.emptyMessage}
        />
        <AboutFinalCta data={aboutStatic.finalCta} />
        <SiteFooter />
      </div>
    </EcotoneV2Client>
  )
}
