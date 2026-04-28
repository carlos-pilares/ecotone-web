'use client'

import { useCallback, useState, type KeyboardEvent } from 'react'
import type { SoqtapataTerms } from '@/data/soqtapataExperienceLocal'

/**
 * Misma lógica que `toggleTcard` en el script. `#terms-accordion` — paridad con `ecotone-experience_2.html`.
 */
export function ExperienceTermsSoqtapata({ data }: { data: SoqtapataTerms }) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <section className="content-section bg-warm fade" id="terms">
      <div className="content-inner">
        <div className="terms-section-intro">
          <div className="eyebrow">{data.introEyebrow}</div>
          <h2 className="h2">{data.h2}</h2>
          <p className="terms-section-lead">{data.lead}</p>
        </div>
        <div className="tcard-wrap" id="terms-accordion" aria-label="Terms summary">
          {data.cards.map((c) => (
            <div className={'tcard' + (openId === c.id ? ' open' : '')} id={c.id} key={c.id}>
              <div
                className="tcard-hd"
                onClick={() => toggle(c.id)}
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggle(c.id)
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={openId === c.id}
              >
                <span className="tcard-hd-title">{c.title}</span>
                <svg
                  className="tcard-ch"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className="tcard-bd">
                <div className="tcard-bd-inner">{c.body}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="terms-pdf-cta">
          <a href={data.pdfHref} className="download-btn" data-terms-pdf download>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={2}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download full terms (PDF)
          </a>
        </div>
      </div>
    </section>
  )
}
