import type { AboutPageResolved } from '@/lib/resolveAboutPageData'

type BcorpData = AboutPageResolved['bcorp']

/**
 * B Corp — dark counterpart to AboutCrees.
 * Logo mark uses CSS mask of the official black SVG → crisp white on dark ground.
 */
export function AboutBcorp({ data }: { data: BcorpData }) {
  return (
    <section
      className="content-section bg-dark fade about-pair about-pair--dark about-bcorp"
      id={data.sectionId}
      aria-labelledby="about-bcorp-heading"
    >
      <div className="content-inner">
        <div className="about-pair-grid about-bcorp-grid">
          <div className="about-pair-visual about-bcorp-visual">
            <div
              className="about-bcorp-mark"
              role="img"
              aria-label={data.logoAlt}
              style={
                data.logoMaskUrl
                  ? {
                      WebkitMaskImage: `url('${data.logoMaskUrl}')`,
                      maskImage: `url('${data.logoMaskUrl}')`,
                    }
                  : undefined
              }
            />
          </div>
          <div className="about-pair-copy about-bcorp-copy">
            <div className="eyebrow eyebrow-lt">{data.eyebrow}</div>
            <h2 className="h2 about-pair-title about-bcorp-h2" id="about-bcorp-heading">
              {data.title}
            </h2>
            {data.paragraphs.map((para, i) => (
              <p key={i} className="about-pair-body about-bcorp-body">
                {para}
              </p>
            ))}
            {data.primaryCta || data.secondaryCta ? (
              <div className="about-pair-actions about-bcorp-actions">
                {data.primaryCta ? (
                  <a
                    href={data.primaryCta.href}
                    className="btn about-bcorp-btn-primary"
                    {...(data.primaryCta.openInNewTab
                      ? {
                          target: '_blank',
                          rel: data.primaryCta.rel || 'noopener noreferrer',
                        }
                      : data.primaryCta.rel
                        ? { rel: data.primaryCta.rel }
                        : {})}
                  >
                    {data.primaryCta.label}
                  </a>
                ) : null}
                {data.secondaryCta ? (
                  <a
                    href={data.secondaryCta.href}
                    className="btn btn-ghost-lt"
                    {...(data.secondaryCta.openInNewTab
                      ? {
                          target: '_blank',
                          rel: data.secondaryCta.rel || 'noopener noreferrer',
                        }
                      : data.secondaryCta.rel
                        ? { rel: data.secondaryCta.rel }
                        : {})}
                  >
                    {data.secondaryCta.label}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
