'use client'

import { ExperienceCardsSection } from '@/components/experience/ExperienceCardsSection'
import { buildRelatedExperienceSectionItems } from '@/lib/buildExperienceCardsSectionItems'
import { tailorMadeBandFromResolved } from '@/lib/tailorMadeBand'
import { CTA_IDS } from '@/lib/ctaIds'
import type { PromotionDoc } from '@/lib/promotionTypes'
import type { SoqtapataAlsoCamanti } from '@/data/soqtapataExperienceLocal'

export function ExperienceAlsoCamantiSoqtapata({
  data,
  promotions,
}: {
  data: SoqtapataAlsoCamanti
  promotions?: PromotionDoc[] | null
}) {
  const sectionCards = buildRelatedExperienceSectionItems(data.cards)
  const tailorProps = data.tailorBand
    ? tailorMadeBandFromResolved(data.tailorBand, { ctaId: CTA_IDS.EXPERIENCE_TAILOR_PROGRAM })
    : null

  return (
    <section className="content-section fade" id="also-camanti">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={data.h2Style}>
          {data.h2}
        </h2>
        {data.lead ? (
          <p className="body" style={{ fontSize: 14, maxWidth: 560, marginBottom: 16, color: 'var(--n700)' }}>
            {data.lead}
          </p>
        ) : null}
        <ExperienceCardsSection
          cards={sectionCards}
          tailorMade={tailorProps}
          promotions={promotions}
          sourceSection="related_experiences"
        />
      </div>
    </section>
  )
}
