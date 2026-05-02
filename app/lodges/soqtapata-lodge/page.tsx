import type { Metadata } from 'next'

import { EcotoneV2Client } from '@/components/EcotoneV2Client'
import { IsotipoDefs } from '@/components/IsotipoDefs'
import { LodgeFaq } from '@/components/lodge/LodgeFaq'
import { LodgeHero } from '@/components/lodge/LodgeHero'
import { LodgeOverview } from '@/components/lodge/LodgeOverview'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import {
  lodgeSoqtapataFaq,
  lodgeSoqtapataHero,
  lodgeSoqtapataOverview,
} from '@/data/lodgeSoqtapataStatic'

export const metadata: Metadata = {
  title: 'Soqtapata Lodge — Ecotone · Cusco, Perú',
  description:
    'The only lodge inside the Soqtapata Reserve. Cloud forest stays adjacent to CIDS research station — Camanti Route, Cusco.',
}

export default function SoqtapataLodgePage() {
  return (
    <EcotoneV2Client solidMainNav>
      <IsotipoDefs />
      <SiteHeader mainNavSolid />
      <div className="lodge-page" id="ecotone-experience-root">
        <LodgeHero data={lodgeSoqtapataHero} />
        <LodgeOverview data={lodgeSoqtapataOverview} />
        <LodgeFaq data={lodgeSoqtapataFaq} />
      </div>
      <SiteFooter />
    </EcotoneV2Client>
  )
}
