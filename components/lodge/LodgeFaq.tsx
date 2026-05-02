'use client'

import type { SoqtapataFaq } from '@/data/soqtapataExperienceLocal'
import { FAQAccordion } from '@/components/shared/FAQAccordion'

/**
 * Paridad con `toggleFAQ` en `ecotone-experience_2.html`: lista FAQ vía `FAQAccordion`.
 */
export function LodgeFaq({ data }: { data: SoqtapataFaq }) {
  return (
    <section className="content-section bg-warm fade" id="faq">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={data.h2Style}>
          {data.h2}
        </h2>
        <p style={data.leadStyle}>{data.lead}</p>
        <FAQAccordion
          items={data.items.map((item) => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
          }))}
        />
      </div>
    </section>
  )
}
