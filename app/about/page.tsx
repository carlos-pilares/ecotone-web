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
import { getAboutPage } from '@/lib/getAboutPage'

import '../experiences/experience-surface.css'
import './about-surface.css'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage()
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

export default async function AboutPage() {
  const p = await getAboutPage()

  return (
    <EcotoneV2Client>
      <div className="about-page">
        <IsotipoDefs />
        <SiteHeader />
        <AboutHero data={p.hero} />
        <AboutWho data={p.who} />
        <AboutWhy data={p.why} />
        <AboutDifference data={p.difference} />
        <AboutWay data={p.way} />
        <AboutPeople data={p.people} />
        <AboutProof data={p.proof} />
        <PartnersBand
          label={p.partnersBand.label}
          body={p.partnersBand.body}
          partners={p.partnersBand.partners}
          partnerNameFallback={p.partnersBand.partnerNameFallback}
          emptyMessage={p.partnersBand.emptyMessage}
        />
        <AboutFinalCta data={p.finalCta} />
        <SiteFooter />
      </div>
    </EcotoneV2Client>
  )
}
