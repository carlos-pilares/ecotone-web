import type { Metadata } from 'next'

import { WonderResultPage } from '../WonderResultPage'

export const metadata: Metadata = {
  title: 'Your Peru offer | Wonder Beyond the Wonder',
  description: 'Your exclusive direct-booking benefit is ready for selected Ecotone Experiences.',
  robots: { index: false, follow: false },
}

export default function WonderBeyondTheWonderResultPage() {
  return <WonderResultPage />
}
