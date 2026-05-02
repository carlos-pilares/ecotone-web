import type { LodgeOverviewData } from '@/data/lodgeSoqtapataStatic'

import { LodgeSectionHeading } from '@/components/lodge/LodgeSectionHeading'

const overviewBodyStyle = {
  fontSize: 15,
  fontWeight: 300,
  color: 'var(--n700)',
  lineHeight: 1.8,
  maxWidth: 640,
  marginBottom: 20,
} as const

/** Lodge overview — CMS: eyebrow, title, body, highlights. */
export function LodgeOverview({ data }: { data: LodgeOverviewData }) {
  return (
    <section className="content-section bg-warm" id="overview">
      <div className="content-inner">
        <LodgeSectionHeading eyebrow={data.eyebrow} title={data.title} body={data.body} bodyStyle={overviewBodyStyle} />
        <ul className="highlights" style={{ maxWidth: 560, marginTop: 20 }}>
          {data.highlights.map((h) => (
            <li className="highlight-item" key={h}>
              <div className="highlight-dot" />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
