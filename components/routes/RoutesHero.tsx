import type { RoutesHeroStatic } from '@/data/routesStatic'

export function RoutesHero({ data }: { data: RoutesHeroStatic }) {
  return (
    <section className="routes-hero" aria-labelledby="routes-hero-heading">
      <div className="routes-hero-img">
        <img src={data.imageSrc} alt={data.imageAlt} />
        <div className="routes-hero-overlay" aria-hidden />
      </div>
      <div className="routes-hero-content">
        <div className="routes-hero-inner fade">
          <p className="routes-hero-eyebrow">{data.eyebrow}</p>
          <h1 id="routes-hero-heading" className="routes-hero-h1">
            {data.titleLine1}
            <br />
            {data.titleLine2}
          </h1>
          <p className="routes-hero-tagline">{data.tagline}</p>
          <div className="routes-hero-actions">
            <a href={data.primaryCta.href} className="btn btn-primary">
              {data.primaryCta.label}
            </a>
            <a href={data.secondaryCta.href} className="btn btn-ghost-lt">
              {data.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
