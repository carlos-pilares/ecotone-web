import { ReserveCtaSection } from '@/components/shared/ReserveCtaSection'
import type { RoutesPageResolved } from '@/lib/resolveRoutesPageData'

export function RoutesFinalCta({ data }: { data: RoutesPageResolved['finalCta'] }) {
  return (
    <ReserveCtaSection
      id={data.sectionId}
      titleId="routes-final-cta-heading"
      eyebrow={data.eyebrow}
      title={data.h2}
      body={data.body}
      card={data.reserveCard}
    />
  )
}
