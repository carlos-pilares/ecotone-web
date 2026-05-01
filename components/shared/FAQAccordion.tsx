'use client'

import { useCallback, useState, type KeyboardEvent } from 'react'

export type FAQAccordionItem = {
  id?: string
  question: string
  answer: string
}

export type FAQAccordionProps = {
  items: FAQAccordionItem[]
}

function resolveItemId(item: FAQAccordionItem, index: number): string {
  const raw = item.id?.trim()
  return raw && raw.length > 0 ? raw : `faq-${index}`
}

/**
 * Accordion FAQ: una sola `.faq-item.open` a la vez (paridad con `ecotone-experience_2.html`).
 * Clases: `faq-list`, `faq-item`, `faq-q`, `faq-a`, `faq-a-inner`, `faq-chevron`.
 */
export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const id = resolveItemId(item, index)
        const isOpen = openId === id
        return (
          <div className={'faq-item' + (isOpen ? ' open' : '')} id={id} key={id}>
            <div
              className="faq-q"
              onClick={() => toggle(id)}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(id)
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
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
        )
      })}
    </div>
  )
}
