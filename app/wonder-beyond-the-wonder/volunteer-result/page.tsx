import type { Metadata } from 'next'

import { WBTWVolunteerResult } from '../WBTWVolunteerResult'

export const metadata: Metadata = {
  title: 'Your volunteer offer | Wonder Beyond the Wonder',
  description:
    'Prototype — your exclusive volunteer offer for a 4-week Ecotone field experience in the Peruvian Amazon.',
  robots: { index: false, follow: false },
}

export default function WonderVolunteerResultPage() {
  return (
    <main className="wbtw-page wbtw-page--result">
      <WBTWVolunteerResult />
    </main>
  )
}
