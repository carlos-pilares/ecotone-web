import type { AboutPageResolved } from '@/lib/resolveAboutPageData'
import { ReserveCtaSection } from '@/components/shared/ReserveCtaSection'

type FinalData = AboutPageResolved['finalCta']

export function AboutFinalCta({ data }: { data: FinalData }) {
  return (
    <ReserveCtaSection
      id={data.sectionId}
      surface="dark"
      sectionClassName="content-section bg-parch fade"
      titleId="about-final-heading"
      eyebrow={data.eyebrow}
      title={data.headline}
      body={data.body}
      card={data.reserveCard}
    />
  )
}
