import type { RoutesTerritoryStatic } from '@/data/routesStatic'
import { RoutesTerritoryMap } from '@/components/routes/RoutesTerritoryMap'

export function RoutesTerritory({ data }: { data: RoutesTerritoryStatic }) {
  return (
    <section className="content-section fade routes-territory-section" id={data.sectionId}>
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2">{data.h2}</h2>
        <p className="body routes-territory-lead">{data.body}</p>

        <div className="territory-map">
          <RoutesTerritoryMap />
        </div>

        <div className="route-strip" role="list" aria-label="Routes overview">
          {data.strip.map((chip) => (
            <div
              key={chip.id}
              className={
                chip.variant === 'active'
                  ? 'route-chip route-chip-active'
                  : 'route-chip route-chip-neutral'
              }
              role="listitem"
            >
              <div className={`route-chip-name ${chip.variant === 'active' ? 'route-chip-name-active' : ''}`}>
                {chip.name}
              </div>
              <div className="route-chip-meta">{chip.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
