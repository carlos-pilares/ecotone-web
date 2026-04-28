'use client'

import { useCallback, useState, type KeyboardEvent } from 'react'
import type { SoqtapataFaq } from '@/data/soqtapataExperienceLocal'

/**
 * Paridad con `toggleFAQ` en `ecotone-experience_2.html`: una sola `.faq-item.open` a la vez;
 * re-cerrar el abierto deja todo cerrado.
 */
export function ExperienceFaqSoqtapata({ data }: { data: SoqtapataFaq }) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggleFAQ = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <section className="content-section bg-warm fade" id="faq">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={data.h2Style}>
          {data.h2}
        </h2>
        <p style={data.leadStyle}>{data.lead}</p>
        <div className="faq-list">
          {data.items.map((item) => (
            <div
              className={'faq-item' + (openId === item.id ? ' open' : '')}
              id={item.id}
              key={item.id}
            >
              <div
                className="faq-q"
                onClick={() => toggleFAQ(item.id)}
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleFAQ(item.id)
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={openId === item.id}
              >
                <span>{item.question}</span>
                <svg
                  className="faq-chevron"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className="faq-a">
                <div className="faq-a-inner">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
