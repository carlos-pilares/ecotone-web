import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { MetaPixel } from '@/components/MetaPixel'

import './manu-volunteer.css'

export const metadata: Metadata = {
  title: 'Join the Manu Field Crew | Ecotone Conservation Volunteer',
  description:
    'Two weeks of real conservation field work in the Manu rainforest. See if you qualify for a supported 2026 place with Ecotone.',
  robots: { index: true, follow: true },
}

export default function ManuConservationVolunteerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mcv-root">
      {children}
      <MetaPixel />
    </div>
  )
}
