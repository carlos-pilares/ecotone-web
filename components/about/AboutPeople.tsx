import type { AboutPageResolved } from '@/lib/resolveAboutPageData'

type PeopleData = AboutPageResolved['people']

export function AboutPeople({ data }: { data: PeopleData }) {
  return (
    <section className="content-section bg-parch fade" id={data.sectionId}>
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2">{data.headline}</h2>
        <p className="body" style={{ marginBottom: 28, maxWidth: 560 }}>
          {data.intro}
        </p>
        <div className="people-grid">
          {data.members.map((m) => (
            <article key={m.key} className="person-card">
              <div className="person-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.imageUrl} alt={m.imageAlt} />
              </div>
              <div className="person-body">
                <div className="person-name">{m.name}</div>
                <div className="person-role">{m.role}</div>
                <p className="person-bio">{m.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
