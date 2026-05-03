'use client'

import { useMemo, useState } from 'react'

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
  }
  filters: RoutesExpFilterPill[]
  cards: RoutesExpCardStatic[]
}) {
  const [active, setActive] = useState<RoutesExpRouteFilter>('all')

  const visible = useMemo(() => {
    if (active === 'all') return cards
    return cards.filter((c) => c.route === active)
  }, [active, cards])

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

        <div className="routes-exp-grid">
          {visible.map((c) => (
            <article key={c.href} className="routes-exp-card" data-route={c.route}>
              <a href={c.href} className="routes-exp-card-link">
                <div className="routes-exp-card-img">
                  <img src={c.imageSrc} alt={c.imageAlt} />
                </div>
                <div className="routes-exp-card-body">
                  <div className="routes-exp-card-meta">
                    <span className="pill pill-amber routes-pill-sm">{c.typePill}</span>
                    <span className="routes-exp-duration">{c.duration}</span>
                  </div>
                  <div className="routes-exp-route-line">{c.routeLine}</div>
                  <h3 className="routes-exp-card-name">{c.name}</h3>
                  <p className="routes-exp-card-desc">{c.description}</p>
                  <div className="routes-exp-card-foot">
                    {c.priceKind === 'amount' && c.priceText ? (
                      <span className="routes-exp-price">
                        from <strong>{c.priceText}</strong>
                      </span>
                    ) : null}
                    {c.priceKind === 'enquire' ? (
                      <span className="routes-exp-price routes-exp-price-enquire">Enquire for pricing</span>
                    ) : null}
                    {c.priceKind === 'custom' ? (
                      <span className="routes-exp-price routes-exp-price-custom">{c.priceText ?? 'Custom'}</span>
                    ) : null}
                    <span className="routes-exp-card-cta">View program →</span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>

        <div className="routes-exp-see-all">
          <a href={section.allExperiencesHref} className="routes-exp-see-all-link">
            {section.allExperiencesLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
