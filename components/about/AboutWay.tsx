import { aboutStatic } from '@/data/aboutStatic'

type WayData = (typeof aboutStatic)['way']

export function AboutWay({ data }: { data: WayData }) {
  return (
    <section className="content-section fade" id="way">
      <div className="content-inner">
        <div className="way-grid">
          <div>
            <div className="eyebrow">{data.eyebrow}</div>
            <h2 className="h2">{data.headline}</h2>
            {data.paragraphs.map((p, i) => (
              <p key={i} className="body" style={i > 0 ? { marginTop: 14 } : undefined}>
                {p}
              </p>
            ))}
            <div className="way-pullquote">
              <p>&ldquo;{data.pullquote}&rdquo;</p>
            </div>
          </div>
          <div className="way-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.imageUrl} alt={data.imageAlt} />
          </div>
        </div>
      </div>
    </section>
  )
}
