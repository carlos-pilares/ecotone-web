'use client'

import { useCallback, type MouseEvent } from 'react'
import type { SoqtapataWildlife } from '@/data/soqtapataExperienceLocal'

/** Misma lógica que `hsScroll` en el script inline (170px, smooth). */
function hsScroll(btn: HTMLButtonElement, dir: number) {
  const wrap = btn.closest?.('.wildlife-hscroll') as HTMLElement | null
  const hs = wrap?.querySelector<HTMLElement>('.hscroll')
  if (hs) hs.scrollBy({ left: dir * 170, behavior: 'smooth' })
}

const WcI0 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3m0 14v3M4.22 4.22l2.12 2.12m11.32 11.32 2.12 2.12M2 12h3m14 0h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
  </svg>
)
const WcI1 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
    <circle cx="12" cy="8" r="5" />
    <path d="M8 13c-3 1-5 4-5 7h18c0-3-2-6-5-7" />
  </svg>
)
const WcI2 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)
const WcI3 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
  </svg>
)
const WcI4 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
    <path d="M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v3a8 8 0 0 0 16 0V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z" />
  </svg>
)
const WcI5 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l3 3" />
  </svg>
)
const WcI6 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
)

const WILDLIFE_ICONS = [WcI0, WcI1, WcI2, WcI3, WcI4, WcI5, WcI6] as const

/** `section#wildlife` + `#wildlifeHscroll` — paridad con `ecotone-experience_2.html`. */
export function ExperienceWildlifeSoqtapata({ data }: { data: SoqtapataWildlife }) {
  const onLeft = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    hsScroll(e.currentTarget, -1)
  }, [])
  const onRight = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    hsScroll(e.currentTarget, 1)
  }, [])

  return (
    <section className="content-section bg-cream fade" id="wildlife">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={data.h2Style}>
          {data.h2}
        </h2>
        <p style={data.introStyle}>{data.intro}</p>
        <div className="hscroll-wrap wildlife-hscroll" id="wildlifeHscroll">
          <div className="hscroll">
            {data.species.map((s) => {
              const Icon = WILDLIFE_ICONS[s.iconId]
              return (
                <div className="wildlife-card" key={s.name}>
                  <div className="wc-icon">
                    <Icon />
                  </div>
                  <div className="wc-name">{s.name}</div>
                  <div className="wc-sub">{s.sub}</div>
                </div>
              )
            })}
          </div>
          <div className="wildlife-hs-controls" role="group" aria-label="Scroll species list">
            <button type="button" className="hs-arrow hs-arrow-l" onClick={onLeft} aria-label="Scroll left">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--n700)" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button type="button" className="hs-arrow hs-arrow-r" onClick={onRight} aria-label="Scroll right">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--n700)" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
