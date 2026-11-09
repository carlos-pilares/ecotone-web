import type { Metadata } from 'next'

import { Mfc2027Result } from '../Mfc2027Result'

export const metadata: Metadata = {
  title: 'Choose your 2027 departure | Manu Field Crew',
  description:
    'Choose your Manu Field Crew 2027 departure, then continue to WeTravel to check availability and book.',
  robots: { index: true, follow: true },
}

export default function ManuFieldCrew2027ResultPage() {
  return (
    <main>
      <Mfc2027Result />
    </main>
  )
}
