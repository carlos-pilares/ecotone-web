import Link from 'next/link'

import type { LodgeExperiencesData } from '@/data/lodgeSoqtapataStatic'

import { LodgeSectionHeading } from '@/components/lodge/LodgeSectionHeading'

type LodgeExperiencesProps = {
  data: LodgeExperiencesData
}

function ViewArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="2" y1="6" x2="10" y2="6" />
      <polyline points="7 3 10 6 7 9" />
    </svg>
  )
}

/**
 * Experiences grid — visual reference `ecotone-lodge_11.html` (`exp-card-v` + tailor band).
 */
const experiencesBodyStyle = {
  fontSize: 14,
  fontWeight: 300,
  color: 'var(--n700)',
  lineHeight: 1.8,
  marginBottom: 20,
} as const

export function LodgeExperiences({ data }: LodgeExperiencesProps) {
  return (
    <section id="experiences" className="content-section">
      <div className="content-inner">
        <LodgeSectionHeading
          eyebrow={data.eyebrow}
          title={data.title}
          body={data.body}
          titleStyle={{ marginBottom: 6 }}
          bodyStyle={experiencesBodyStyle}
        />

        <div className="lodge-exp-cards-grid">
          {data.cards.map((card) => (
            <Link key={card.name} href={card.href} className="lodge-exp-card-v">
              <div className="lodge-exp-card-v-img">
                <img src={card.image} alt={card.imageAlt} width={600} height={400} loading="lazy" />
                <div className="lodge-exp-card-v-overlay" aria-hidden />
                <span className="lodge-exp-card-v-type">{card.typeLabel}</span>
                <span className="lodge-exp-card-v-dur">{card.duration}</span>
                <span className="lodge-exp-card-v-route">{card.route}</span>
              </div>
              <div className="lodge-exp-card-v-body">
                <div className="lodge-exp-card-v-name">{card.name}</div>
                <div className="lodge-exp-card-v-desc">{card.description}</div>
                <div className="lodge-exp-card-v-foot">
                  <div>
                    <div className="lodge-exp-card-v-price">{card.footPrimary}</div>
                    {card.footSecondary ? (
                      <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--n400)' }}>{card.footSecondary}</div>
                    ) : null}
                  </div>
                  <div className="lodge-exp-card-v-cta">
                    {data.programCardCtaLabel} <ViewArrow />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {data.tailor ? (
            <a href={data.tailor.href} className="lodge-exp-tailor">
              <div>
                <div className="lodge-exp-tailor-kicker">{data.tailor.kicker}</div>
                <div className="lodge-exp-tailor-title">{data.tailor.title}</div>
                <div className="lodge-exp-tailor-desc">{data.tailor.description}</div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <span className="lodge-exp-tailor-cta">{data.tailor.ctaLabel}</span>
              </div>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}
