'use client'

import { useMemo, useState } from 'react'

import { ExperienceCardsSection } from '@/components/experience/ExperienceCardsSection'
import { buildRoutesExperienceSectionItems } from '@/lib/buildExperienceCardsSectionItems'
import type { RoutesExpCardStatic, RoutesExpFilterPill, RoutesExpRouteFilter } from '@/data/routesStatic'

export function RoutesExperiences({
  section,
  filters,
  cards,
}: {
  section: {
    sectionId: string
    eyebrow: string
    h2: string
    intro: string
    allExperiencesHref: string
    allExperiencesLabel: string
    cardCtaLabel: string
  }
  filters: RoutesExpFilterPill[]
  cards: RoutesExpCardStatic[]
}) {
  const [active, setActive] = useState<RoutesExpRouteFilter>('all')

  const visible = useMemo(() => {
    if (active === 'all') return cards
    return cards.filter((c) => c.route.trim() === active)
  }, [active, cards])

  const ctaLabel = section.cardCtaLabel.trim() || 'View'
  const sectionCards = buildRoutesExperienceSectionItems(visible, ctaLabel)

  return (
    <section className="content-section bg-warm fade" id={section.sectionId}>
      <div className="content-inner">
        <div className="eyebrow">{section.eyebrow}</div>
        <h2 className="h2">{section.h2}</h2>
        <p className="body routes-exp-intro">{section.intro}</p>

        <div className="routes-filter-pills" role="tablist" aria-label="Filter by route">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active === f.id}
              className={'routes-filter-pill' + (active === f.id ? ' routes-filter-pill-active' : '')}
              data-route-filter={f.id}
              onClick={() => setActive(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ExperienceCardsSection cards={sectionCards} cardCtaLabel={ctaLabel} />

        {section.allExperiencesHref ? (
          <p className="routes-exp-see-all">
            <a href={section.allExperiencesHref} className="routes-exp-see-all-link">
              {section.allExperiencesLabel}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  )
}
