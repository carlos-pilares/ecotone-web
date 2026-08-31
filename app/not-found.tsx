import Link from 'next/link'

import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

import './experiences/experience-surface.css'
import './not-found.css'

export default function NotFound() {
  return (
    <EcotoneV2Client solidMainNav>
      <div className="not-found-page">
        <IsotipoDefs />
        <SiteHeader />
        <main className="not-found-main" id="main-content">
          <div className="not-found-inner">
            <figure className="not-found-visual" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/manu-conservation-volunteer/explore-rainforest/mobile.webp"
                alt=""
                width={560}
                height={420}
                loading="eager"
                decoding="async"
              />
            </figure>
            <p className="eyebrow not-found-eyebrow">404</p>
            <h1 className="not-found-h1">Looks like the monkeys unplugged the cables.</h1>
            <p className="not-found-body">
              Sorry, the page you were looking for seems to have disappeared into the forest. Let&apos;s
              head back to familiar ground and start again.
            </p>
            <div className="not-found-actions">
              <Link href="/" className="btn btn-primary">
                Back to Ecotone
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </EcotoneV2Client>
  )
}
