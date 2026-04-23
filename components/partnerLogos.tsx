import type { ReactNode } from 'react'

/** Hardcoded markups for partners when `logoSvg` is empty (match `ecotone-home-final.html`, keyed by name). */
export function PartnerMarkByName({ name }: { name: string }): ReactNode {
  const n = (name || '').toLowerCase()
  if (n.includes('b corp')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="4" fill="#1A5276" />
        <path
          d="M10 8h6.5c2.5 0 4 1.2 4 3.2 0 1.4-.8 2.4-2 2.8 1.5.4 2.5 1.5 2.5 3.1 0 2.2-1.7 3.5-4.5 3.5H10V8zm2.2 5.2h3.8c1.1 0 1.8-.6 1.8-1.6s-.7-1.6-1.8-1.6h-3.8v3.2zm0 5.4h4.1c1.2 0 2-.7 2-1.8s-.8-1.8-2-1.8h-4.1v3.6z"
          fill="white"
        />
      </svg>
    )
  }
  if (n.includes('atta') || n.includes('adventure travel') || n.includes('adventure travel trade')) {
    return (
      <svg width="44" height="32" viewBox="0 0 44 32" fill="none" aria-hidden>
        <rect width="44" height="32" rx="4" fill="#1E5631" />
        <text
          x="22"
          y="21"
          textAnchor="middle"
          style={{ fontFamily: 'system-ui,sans-serif', fontWeight: 700, fontSize: 11, fill: 'white', letterSpacing: 1 }}
        >
          ATTA
        </text>
      </svg>
    )
  }
  if (n.includes('rainforest')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="4" fill="#1E7A34" />
        <ellipse cx="16" cy="18" rx="7" ry="5" fill="#52B76A" />
        <circle cx="11" cy="13" r="3" fill="#52B76A" />
        <circle cx="21" cy="13" r="3" fill="#52B76A" />
        <circle cx="10.5" cy="12.5" r="1.2" fill="white" />
        <circle cx="21.5" cy="12.5" r="1.2" fill="white" />
      </svg>
    )
  }
  if (n.includes('gstc')) {
    return (
      <svg width="40" height="32" viewBox="0 0 40 32" fill="none" aria-hidden>
        <rect width="40" height="32" rx="4" fill="#0D5C8A" />
        <text
          x="20"
          y="21"
          textAnchor="middle"
          style={{ fontFamily: 'system-ui,sans-serif', fontWeight: 700, fontSize: 11, fill: 'white', letterSpacing: 0.5 }}
        >
          GSTC
        </text>
      </svg>
    )
  }
  if (n.includes('iucn')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="4" fill="#E05A00" />
        <text
          x="16"
          y="21"
          textAnchor="middle"
          style={{ fontFamily: 'system-ui,sans-serif', fontWeight: 700, fontSize: 10, fill: 'white' }}
        >
          IUCN
        </text>
      </svg>
    )
  }
  if (n.includes('un tourism') || n.includes('tourism')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="4" fill="#2E4057" />
        <circle cx="16" cy="16" r="7" stroke="white" strokeWidth="1.2" fill="none" />
        <line x1="16" y1="9" x2="16" y2="23" stroke="white" strokeWidth="1" />
        <ellipse cx="16" cy="16" rx="3.5" ry="7" stroke="white" strokeWidth="1" fill="none" />
        <line x1="9" y1="16" x2="23" y2="16" stroke="white" strokeWidth="1" />
      </svg>
    )
  }
  return null
}
