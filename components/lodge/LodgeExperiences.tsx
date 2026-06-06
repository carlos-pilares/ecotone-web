import type { LodgeExperiencesData } from '@/data/lodgeSoqtapataStatic'

import { ExperienceCardsSection } from '@/components/experience/ExperienceCardsSection'
import { LodgeSectionHeading } from '@/components/lodge/LodgeSectionHeading'
import { buildLodgeExperienceSectionItems } from '@/lib/buildExperienceCardsSectionItems'
import { tailorMadeBandFromResolved } from '@/lib/tailorMadeBand'

import type { PromotionDoc } from '@/lib/promotionTypes'

type LodgeExperiencesProps = {
  data: LodgeExperiencesData
  promotions?: PromotionDoc[] | null
}

const experiencesBodyStyle = {
  fontSize: 14,
  fontWeight: 300,
  color: 'var(--n700)',
  lineHeight: 1.8,
  marginBottom: 20,
} as const

export function LodgeExperiences({ data, promotions }: LodgeExperiencesProps) {
  const ctaLabel = data.programCardCtaLabel.trim() || 'View'
  const sectionCards = buildLodgeExperienceSectionItems([...data.cards], ctaLabel)
  const tailor =
    data.tailor &&
    tailorMadeBandFromResolved({
      eyebrow: data.tailor.kicker,
      title: data.tailor.title,
      subtitle: data.tailor.description,
      ctaLabel: data.tailor.ctaLabel,
      href: data.tailor.href,
      openInNewTab: data.tailor.openInNewTab,
      rel: data.tailor.rel,
      bookingModal: data.tailor.bookingModal,
      bookingSummary: data.tailor.bookingSummary,
    })

  return (
    <section id="experiences" className="content-section">
      <div className="content-inner">
        <LodgeSectionHeading
          eyebrow={data.eyebrow}
          title={data.title}
          body={data.body}
          titleStyle={{ marginBottom: 6 }}
          bodyStyle={experiencesBodyStyle}
        />

        <ExperienceCardsSection
          cards={sectionCards}
          cardCtaLabel={ctaLabel}
          tailorMade={tailor}
          promotions={promotions}
          sourceSection="lodge"
          emptyMessage={
            sectionCards.length === 0 && !tailor ? (
              <p className="lodge-exp-empty">No experiences are listed for this lodge yet.</p>
            ) : null
          }
        />
      </div>
    </section>
  )
}
