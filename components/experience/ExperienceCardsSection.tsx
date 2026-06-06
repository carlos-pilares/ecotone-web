'use client'

import type { ReactNode } from 'react'

import { ExperienceCard } from '@/components/experience/ExperienceCard'
import { TailorMadeBand } from '@/components/shared/TailorMadeBand'
import type { ExperienceCardData } from '@/lib/experienceCardData'
import type { TailorMadeBandComponentProps } from '@/lib/tailorMadeBand'
import type { PromotionDoc } from '@/lib/promotionTypes'
import type { ExperienceCardClickSourceSection } from '@/lib/trackExperienceAnalytics'

import './experience-cards-section.css'
import '@/app/lodges/lodge-surface.css'

export type ExperienceCardsSectionItem = {
  key: string
  card: ExperienceCardData
  /** Home program filter (`data-type` on filter slot). */
  filterDataType?: string
  /** Routes page route filter (`data-route` on card). */
  dataRoute?: string
}

export type ExperienceCardsSectionProps = {
  cards: ExperienceCardsSectionItem[]
  cardCtaLabel?: string
  tailorMade?: TailorMadeBandComponentProps | null
  emptyMessage?: ReactNode
  gridClassName?: string
  gridId?: string
  promotions?: PromotionDoc[] | null
  sourceSection?: ExperienceCardClickSourceSection
}

export function ExperienceCardsSection({
  cards,
  cardCtaLabel = 'View',
  tailorMade,
  emptyMessage,
  gridClassName = 'experience-cards-grid',
  gridId,
  promotions,
  sourceSection,
}: ExperienceCardsSectionProps) {
  const showEmpty = cards.length === 0 && !tailorMade?.visible

  return (
    <div className={gridClassName} id={gridId}>
      {showEmpty && emptyMessage ? (
        <div className="experience-cards-empty">{emptyMessage}</div>
      ) : null}
      {cards.map(({ key, card, filterDataType, dataRoute }) => {
        const resolved = {
          ...card,
          ctaLabel: card.ctaLabel?.trim() || cardCtaLabel,
        }
        const cardEl = (
          <ExperienceCard
            card={resolved}
            dataRoute={dataRoute}
            promotions={promotions}
            sourceSection={sourceSection}
          />
        )
        if (filterDataType) {
          return (
            <div className="experience-card-filter-slot" data-type={filterDataType} key={key}>
              {cardEl}
            </div>
          )
        }
        return <div key={key}>{cardEl}</div>
      })}
      {tailorMade?.visible ? (
        <TailorMadeBand
          {...tailorMade}
          className={['experience-cards-tailor-band', tailorMade.className].filter(Boolean).join(' ')}
          dataType={tailorMade.dataType ?? 'tailor'}
        />
      ) : null}
    </div>
  )
}
