import { aboutStatic } from '@/data/aboutStatic'

type WhyData = (typeof aboutStatic)['why']

export function AboutWhy({ data }: { data: WhyData }) {
  return (
    <section className="content-section bg-dark fade" id="why">
      <div className="content-inner">
        <div className="why-inner">
          <div className="eyebrow eyebrow-lt about-eyebrow-center">{data.eyebrow}</div>
          <h2 className="why-h2">
            {data.headlineLines.map((line, i) => (
              <span key={line}>
                {line}
                {i < data.headlineLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>
          <p className="why-body">{data.body}</p>
        </div>
      </div>
    </section>
  )
}
