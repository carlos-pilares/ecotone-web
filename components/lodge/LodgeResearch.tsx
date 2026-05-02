import type { LodgeResearchData } from '@/data/lodgeSoqtapataStatic'

import { LodgeSectionHeading } from '@/components/lodge/LodgeSectionHeading'

type LodgeResearchProps = {
  data: LodgeResearchData
}

/** Research — `reference/ecotone-lodge_11.html` `#research`. */
const researchBodyStyle = {
  fontSize: 15,
  fontWeight: 300,
  color: 'var(--n700)',
  lineHeight: 1.8,
  maxWidth: 640,
  marginBottom: 20,
} as const

export function LodgeResearch({ data }: LodgeResearchProps) {
  return (
    <section className="content-section bg-warm" id="research">
      <div className="content-inner">
        <LodgeSectionHeading
          eyebrow={data.eyebrow}
          title={data.title}
          body={data.body}
          titleStyle={{ marginBottom: 6 }}
          bodyStyle={researchBodyStyle}
        />

        <div className="research-stats">
          {data.stats.map((s, i) => (
            <div className="stat-card" key={`${s.label}-${i}`}>
              <div className="stat-n">{s.value}</div>
              <div className="stat-l">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="research-areas-stack">
          {data.pillars.map((p, i) => (
            <div className="research-area-card" key={`${p.title}-${i}`}>
              <div className="research-area-dot" aria-hidden />
              <div>
                <div className="research-area-title">{p.title}</div>
                <div className={p.detailSmall ? 'research-area-desc research-area-desc--sm' : 'research-area-desc'}>
                  {p.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lodge-research-footnote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="2" aria-hidden>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>{data.footnote}</span>
        </div>
      </div>
    </section>
  )
}
