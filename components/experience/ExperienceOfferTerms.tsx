'use client'

import { useCallback, useState, type KeyboardEvent } from 'react'

import type { PromotionLegalAccordionItem } from '@/lib/promotionTypes'

type ExperienceOfferTermsProps = {
  items: PromotionLegalAccordionItem[]
}

function PromotionLegalAccordion({ items }: { items: PromotionLegalAccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <div className="faq-list experience-offer-terms__list">
      {items.map((item) => {
        const isOpen = openId === item.id
        const linkLabel = item.legalLink?.label?.trim() || 'View full offer details'
        return (
          <div className={'faq-item' + (isOpen ? ' open' : '')} id={`offer-terms-${item.id}`} key={item.id}>
            <div
              className="faq-q"
              onClick={() => toggle(item.id)}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(item.id)
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <svg
                className="faq-chevron"
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
            <div className="faq-a">
              <div className="faq-a-inner experience-offer-terms__body">
                {item.legalText ? <p className="experience-offer-terms__text">{item.legalText}</p> : null}
                {item.legalLink ? (
                  <a
                    href={item.legalLink.href}
                    className="experience-offer-terms__link"
                    target={item.legalLink.openInNewTab ? '_blank' : undefined}
                    rel={item.legalLink.rel || undefined}
                  >
                    {linkLabel}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Compact legal accordion for active promotions on experience detail pages. */
export function ExperienceOfferTerms({ items }: ExperienceOfferTermsProps) {
  if (!items.length) return null

  return (
    <section
      className="content-section bg-warm fade"
      id="promotion-terms"
      aria-labelledby="experience-offer-terms-heading"
    >
      <div className="content-inner">
        <h2 id="experience-offer-terms-heading" className="h2">
          Promotion Terms &amp; Conditions
        </h2>
        <PromotionLegalAccordion items={items} />
      </div>
    </section>
  )
}
