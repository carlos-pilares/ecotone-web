import type { Metadata } from 'next'

import { ManuVolunteerResult } from '../ManuVolunteerResult'

export const metadata: Metadata = {
  title: 'Your field offer | Manu Field Crew',
  description:
    'Your Manu Field Crew place is unlocked. Choose your field dates and explore the full conservation volunteer programme.',
  robots: { index: false, follow: false },
}

export default function ManuConservationVolunteerResultPage() {
  return (
    <main>
      <ManuVolunteerResult />
    </main>
  )
}
