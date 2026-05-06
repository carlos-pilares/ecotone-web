import type { RoutesHeroStatic } from '@/data/routesStatic'

export function RoutesHero({ data }: { data: RoutesHeroStatic }) {
  const primary = data.primaryCta
  const secondary = data.secondaryCta

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
            {primary ? (
              <a
                href={primary.href}
                className="btn btn-primary"
                {...(primary.openInNewTab
                  ? { target: '_blank' as const, rel: primary.rel || 'noopener noreferrer' }
                  : {})}
              >
                {primary.label}
              </a>
            ) : null}
            {secondary ? (
              <a
                href={secondary.href}
                className="btn btn-ghost-lt"
                {...(secondary.openInNewTab
                  ? { target: '_blank' as const, rel: secondary.rel || 'noopener noreferrer' }
                  : {})}
              >
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
