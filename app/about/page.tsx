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
  const sec = p.sectionVisibility

  return (
    <EcotoneV2Client solidMainNav>
      <div className="about-page">
        <IsotipoDefs />
        <SiteHeader />
        {sec.hero ? <AboutHero data={p.hero} /> : null}
        {sec.who ? <AboutWho data={p.who} /> : null}
        {sec.why ? <AboutWhy data={p.why} /> : null}
        {sec.different ? <AboutDifference data={p.difference} /> : null}
        {sec.way ? <AboutWay data={p.way} /> : null}
        {sec.people ? <AboutPeople data={p.people} /> : null}
        {sec.proof ? <AboutProof data={p.proof} /> : null}
        {sec.partners &&
        (p.partnersBand.partners.length > 0 || p.partnersBand.emptyMessage?.trim()) ? (
          <PartnersBand
            eyebrow={p.partnersBand.eyebrow || null}
            title={p.partnersBand.title || null}
            body={p.partnersBand.body}
            partners={p.partnersBand.partners}
            emptyMessage={p.partnersBand.emptyMessage}
          />
        ) : null}
        {sec.finalCta ? <AboutFinalCta data={p.finalCta} /> : null}
        <SiteFooter />
      </div>
    </EcotoneV2Client>
  )
}
