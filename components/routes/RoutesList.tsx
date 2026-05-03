import type { RoutesCardStatic } from '@/data/routesStatic'

function Badge({ b }: { b: RoutesCardStatic['badges'][number] }) {
  if (b.tone === 'amber') {
    return <span className="pill pill-amber">{b.label}</span>
  }
  if (b.tone === 'neutral') {
    return <span className="pill pill-neutral routes-pill-sm">{b.label}</span>
  }
  return <span className={`pill routes-pill-sm ${b.customClassName ?? ''}`}>{b.label}</span>
}

export function RoutesList({ routes }: { routes: RoutesCardStatic[] }) {
  return (
    <section className="content-section bg-warm fade" id="routes">
      <div className="content-inner">
        <div className="eyebrow">Choose your route</div>
        <h2 className="h2">Three territories, three characters</h2>
        <p className="body routes-list-lead">
          Each route has its own altitude, ecosystem, and lodge. All experiences depart from Cusco, all-inclusive.
        </p>

        <div className="routes-list-stack">
          {routes.map((r) => (
            <article
              key={r.id}
              className={r.variant === 'featured' ? 'route-card route-card-featured' : 'route-card route-card-default'}
            >
              <div className="route-card-grid">
                <div className="route-card-img">
                  <img src={r.imageSrc} alt={r.imageAlt} />
                  <div className="route-card-img-overlay" aria-hidden />
                  <span className="route-card-num pill pill-dark routes-route-num">{r.numLabel}</span>
                  <div className="route-card-altitude">{r.altitudeLine}</div>
                </div>
                <div className="route-card-body">
                  <div>
                    <div className="route-card-badges">
                      {r.badges.map((b, i) => (
                        <Badge key={`${r.id}-b-${i}`} b={b} />
                      ))}
                    </div>
                    <h3 className="route-card-name">{r.name}</h3>
                    <p className="route-card-desc">{r.description}</p>
                    <div className="route-card-chips">
                      {r.chips.map((ch) => (
                        <span className="route-chip-tag" key={`${r.id}-${ch}`}>
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="route-card-foot">
                    <div
                      className="route-card-price"
                      // eslint-disable-next-line react/no-danger -- copy estático aprobado
                      dangerouslySetInnerHTML={{ __html: r.footPriceHtml }}
                    />
                    <a
                      href={r.cta.href}
                      className={`btn route-card-cta-btn ${r.cta.buttonVariant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {r.cta.label}
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
