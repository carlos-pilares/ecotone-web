import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { MetaPixel } from '@/components/MetaPixel'

import { ManuVolunteerCampaignFooter } from '../manu-conservation-volunteer/ManuVolunteerCampaignFooter'

import '../site-footer.css'
import '../manu-conservation-volunteer/manu-volunteer.css'
import '../manu-conservation-volunteer/mcv-result.css'
import './mfc2027.css'

export const metadata: Metadata = {
  title: 'Manu Field Crew 2027 | Ecotone Conservation Volunteer',
  description:
    'Join the Manu Field Crew in 2027. Four weeks of conservation fieldwork at the Manu Learning Centre with fixed Monday departures. Book your place on WeTravel.',
  robots: { index: true, follow: true },
}

export default function ManuFieldCrew2027Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mcv-root mfc2027-root">
      {children}
      <ManuVolunteerCampaignFooter />
      <MetaPixel />
    </div>
  )
}
