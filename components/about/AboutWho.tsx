import { EcotoneImage } from '@/components/media/EcotoneImage'
import type { AboutPageResolved } from '@/lib/resolveAboutPageData'

type WhoData = AboutPageResolved['who']

export function AboutWho({ data }: { data: WhoData }) {
  return (
    <section className="content-section fade" id={data.sectionId}>
      <div className="content-inner">
        <div className="who-grid">
          <div className="who-img">
            <EcotoneImage
              image={data.image.image}
              fallbackUrl={data.image.fallbackUrl || data.imageUrl}
              masterWidth={data.image.masterWidth}
              masterHeight={data.image.masterHeight}
              role="editorial"
              alt={data.imageAlt}
            />
          </div>
          <div>
            <div className="eyebrow">{data.eyebrow}</div>
            <h2 className="h2">{data.headline}</h2>
            {data.paragraphs.map((p, i) => (
              <p key={i} className="body" style={i > 0 ? { marginTop: 14 } : undefined}>
                {p}
              </p>
            ))}
            <div className="who-pills">
              {data.pills.map((label) => (
                <span key={label} className="pill pill-amber">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
