import { EcotoneImage } from '@/components/media/EcotoneImage'
import type { AboutPageResolved } from '@/lib/resolveAboutPageData'

type CreesData = AboutPageResolved['crees']

/**
 * Ecotone + CREES — light counterpart to AboutBcorp.
 */
export function AboutCrees({ data }: { data: CreesData }) {
  const cta = data.cta

  return (
    <section
      className="content-section bg-parch fade about-pair about-pair--light"
      id={data.sectionId}
      aria-labelledby="about-crees-heading"
    >
      <div className="content-inner">
        <div className="about-pair-grid">
          <div className="about-pair-visual about-crees-media">
            <EcotoneImage
              image={data.image.image}
              fallbackUrl={data.image.fallbackUrl || data.imageUrl}
              masterWidth={data.image.masterWidth}
              masterHeight={data.image.masterHeight}
              role="editorial"
              alt={data.imageAlt}
              loading="lazy"
            />
          </div>
          <div className="about-pair-copy about-crees-copy">
            <div className="eyebrow">{data.eyebrow}</div>
            <h2 className="h2 about-pair-title" id="about-crees-heading">
              {data.title}
            </h2>
            <p className="body about-crees-subtitle">{data.subtitle}</p>
            {data.paragraphs[0] ? (
              <p className="body about-pair-body">{data.paragraphs[0]}</p>
            ) : null}
            <div className="about-crees-lockup">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.lockupUrl}
                alt={data.lockupAlt}
                className="about-crees-lockup-img"
              />
            </div>
            {data.paragraphs.slice(1).map((para, i) => (
              <p key={i} className="body about-pair-body">
                {para}
              </p>
            ))}
            {cta ? (
              <div className="about-pair-actions">
                <a
                  href={cta.href}
                  className="btn btn-primary"
                  {...(cta.openInNewTab
                    ? { target: '_blank', rel: cta.rel || 'noopener noreferrer' }
                    : cta.rel
                      ? { rel: cta.rel }
                      : {})}
                >
                  {cta.label}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
