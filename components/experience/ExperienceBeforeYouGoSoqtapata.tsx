'use client'

import { useCallback, useState } from 'react'
import type { BfygCard, SoqtapataBeforeYouGo } from '@/data/soqtapataExperienceLocal'

function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={2}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function HeaderIconEntry() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function HeaderIconLuggage() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  )
}

function HeaderIconPhone() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5.17 2 2 0 0 1 3.58 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17.92v-.01z" />
    </svg>
  )
}

function ItemIcon0() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  )
}
function ItemIcon1() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function ItemIcon2() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
function ItemIcon3() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

const ENTRY_ITEM_ICONS = [ItemIcon0, ItemIcon1, ItemIcon2, ItemIcon3]

function CuscoIcon0() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  )
}
function CuscoIcon1() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function CuscoIcon2() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  )
}
const CUSCO_ITEM_ICONS = [CuscoIcon0, CuscoIcon1, CuscoIcon2]

function BfygHeaderIcon({ k }: { k: 'entry' | 'luggage' | 'phone' }) {
  if (k === 'luggage') return <HeaderIconLuggage />
  if (k === 'phone') return <HeaderIconPhone />
  return <HeaderIconEntry />
}

/**
 * Misma lógica que `toggleBFYG` en el script: una tarjeta abierta; al repetir, todas cerradas.
 * `#before-you-go` — paridad con `ecotone-experience_2.html`.
 */
export function ExperienceBeforeYouGoSoqtapata({ data }: { data: SoqtapataBeforeYouGo }) {
  const [openId, setOpenId] = useState<string>(() => {
    const d = data.cards.find((c) => 'defaultOpen' in c && c.defaultOpen)
    return d?.id ?? 'bfyg1'
  })

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? '' : id))
  }, [])

  return (
    <section className="content-section fade" id="before-you-go">
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2" style={{ marginBottom: data.h2MarginBottom }}>
          {data.h2}
        </h2>
        <p style={data.leadStyle}>{data.lead}</p>
        <div className="bfyg-cards">
          {data.cards.map((card) => (
            <BfygCardView key={card.id} card={card} open={openId === card.id} onToggle={toggle} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BfygCardView({
  card,
  open,
  onToggle,
}: {
  card: BfygCard
  open: boolean
  onToggle: (id: string) => void
}) {
  return (
    <div className={'bfyg-card' + (open ? ' open' : '')} id={card.id}>
      <div className="bfyg-header" onClick={() => onToggle(card.id)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div className="bfyg-icon">
            <BfygHeaderIcon k={card.headerIcon} />
          </div>
          <div className="bfyg-title">{card.title}</div>
        </div>
        <svg
          className="bfyg-chevron"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={open ? 'var(--brown)' : 'var(--n400)'}
          strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <div className="bfyg-body">
        <div className="bfyg-body-inner">
          {card.id === 'bfyg1'
            ? card.items.map((it, j) => {
                const Ic = ENTRY_ITEM_ICONS[j]!
                return (
                  <div className="bfyg-item" key={it.title}>
                    <div className="bfyg-item-icon">
                      <Ic />
                    </div>
                    <div>
                      <div className="bfyg-item-title">{it.title}</div>
                      <div className="bfyg-item-desc">{it.body}</div>
                    </div>
                  </div>
                )
              })
            : null}
          {card.id === 'bfyg2' ? (
            <>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 300,
                  color: 'var(--n700)',
                  lineHeight: 1.7,
                  marginBottom: 10,
                }}
              >
                {card.lead}
              </p>
              <div className="packing-grid">
                {card.packItems.map((p) => (
                  <div className="packing-item" key={p}>
                    <IconCheck />
                    {p}
                  </div>
                ))}
              </div>
            </>
          ) : null}
          {card.id === 'bfyg3'
            ? card.items.map((it, j) => {
                const Ic = CUSCO_ITEM_ICONS[j]!
                return (
                  <div className="bfyg-item" key={it.title}>
                    <div className="bfyg-item-icon">
                      <Ic />
                    </div>
                    <div>
                      <div className="bfyg-item-title">{it.title}</div>
                      <div className="bfyg-item-desc">{it.body}</div>
                    </div>
                  </div>
                )
              })
            : null}
        </div>
      </div>
    </div>
  )
}
