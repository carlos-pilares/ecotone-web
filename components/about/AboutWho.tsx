import { aboutStatic } from '@/data/aboutStatic'

type WhoData = (typeof aboutStatic)['who']

export function AboutWho({ data }: { data: WhoData }) {
  return (
    <section className="content-section fade" id="who">
      <div className="content-inner">
        <div className="who-grid">
          <div className="who-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.imageUrl} alt={data.imageAlt} />
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
