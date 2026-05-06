import Link from 'next/link'
import type { AboutPageResolved } from '@/lib/resolveAboutPageData'

type HeroData = AboutPageResolved['hero']

export function AboutHero({ data }: { data: HeroData }) {
  const primary = data.primaryCta
  const secondary = data.secondaryCta

  return (
    <section className="about-hero" aria-label="About Ecotone">
      <div className="about-hero-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.imageUrl} alt={data.imageAlt} />
        <div className="about-hero-overlay" aria-hidden />
      </div>
      <div className="about-hero-content">
        <div className="about-hero-eyebrow fade">{data.eyebrow}</div>
        <h1 className="about-hero-h1 fade fade-d1">
          {data.titleLines.map((line, i) => (
            <span key={line}>
              {line}
              {i < data.titleLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </h1>
        <p className="about-hero-tagline fade fade-d2">{data.tagline}</p>
        <div className="about-hero-actions fade fade-d3">
          {primary ? (
            primary.openInNewTab ? (
              <a
                href={primary.href}
                className="btn btn-primary"
                target="_blank"
                rel={primary.rel || 'noopener noreferrer'}
              >
                {primary.label}
              </a>
            ) : (
              <Link href={primary.href} className="btn btn-primary">
                {primary.label}
              </Link>
            )
          ) : null}
          {secondary ? (
            secondary.openInNewTab ? (
              <a
                href={secondary.href}
                className="btn btn-ghost-lt"
                target="_blank"
                rel={secondary.rel || 'noopener noreferrer'}
              >
                {secondary.label}
              </a>
            ) : (
              <a href={secondary.href} className="btn btn-ghost-lt">
                {secondary.label}
              </a>
            )
          ) : null}
        </div>
      </div>
    </section>
  )
}
