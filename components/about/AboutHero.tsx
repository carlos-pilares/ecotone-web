import Link from 'next/link'
import { aboutStatic } from '@/data/aboutStatic'

type HeroData = (typeof aboutStatic)['hero']

export function AboutHero({ data }: { data: HeroData }) {
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
          <Link href={data.primaryHref} className="btn btn-primary">
            {data.primaryLabel}
          </Link>
          <a href={data.secondaryHref} className="btn btn-ghost-lt">
            {data.secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
