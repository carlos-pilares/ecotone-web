import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './wonder-beyond.css'

export const metadata: Metadata = {
  title: 'Wonder Beyond the Wonder | Ecotone — Peru 2026',
  description:
    'Planning Peru in 2026? Go beyond Machu Picchu with a 4-night Ecotone nature extension — cloud forest, wildlife and conservation in the Tropical Andes.',
  robots: { index: true, follow: true },
}

export default function WonderBeyondLayout({ children }: { children: ReactNode }) {
  return <div className="wbtw-root">{children}</div>
}
