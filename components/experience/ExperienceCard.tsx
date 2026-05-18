import Link from 'next/link'

import type { ExperienceCardData } from '@/lib/experienceCardData'
import {
  formatExperienceCardPriceDisplay,
  type ExperiencePriceFields,
} from '@/lib/formatExperiencePrice'

import './experience-card.css'

export type ExperienceCardProps = {
  card: ExperienceCardData
  variant?: 'standard' | 'compact'
  className?: string
  /** Passed to root element for route tab filtering on `/routes`. */
  dataRoute?: string
}

function ExperienceCardPrice({ price }: { price: ExperiencePriceFields }) {
  const display = formatExperienceCardPriceDisplay(price)
  if (display.kind === 'enquire') {
    return <span className="experience-card__price experience-card__price--enquire">Enquire</span>
  }
  return (
    <span className="experience-card__price">
      <span className="experience-card__price-from">{display.from} </span>
      <span className="experience-card__price-amount">{display.amount}</span>
      <span className="experience-card__price-per"> {display.perPerson}</span>
    </span>
  )
}

function CardArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="2" y1="6" x2="10" y2="6" />
      <polyline points="7 3 10 6 7 9" />
    </svg>
  )
}

export function ExperienceCard({ card, variant = 'standard', className, dataRoute }: ExperienceCardProps) {
  const cta = (card.ctaLabel?.trim() || 'View').replace(/\s*→\s*$/, '')
  const rootClass =
    'experience-card' +
    (variant === 'compact' ? ' experience-card--compact' : '') +
    (className ? ` ${className}` : '')
  const isExternal = /^https?:\/\//i.test(card.href)

  const body = (
    <>
      <div className="experience-card__media">
        <img src={card.imageUrl} alt={card.imageAlt} loading="lazy" width={600} height={400} />
        {card.routeLabel ? <span className="experience-card__route-pill">{card.routeLabel}</span> : null}
      </div>
      <div className="experience-card__content">
        <p className="experience-card__program">{card.programTypeLabel}</p>
        <h3 className="experience-card__title">{card.title}</h3>
        {card.description ? <p className="experience-card__desc">{card.description}</p> : null}
        <div className="experience-card__foot">
          <ExperienceCardPrice price={{ price: card.price, priceLabel: card.priceLabel }} />
          <span className="experience-card__cta">
            {cta} <CardArrow />
          </span>
        </div>
      </div>
    </>
  )

  if (isExternal) {
    return (
      <a
        href={card.href}
        className={rootClass}
        data-route={dataRoute ?? card.routeSlug}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
      </a>
    )
  }

  return (
    <Link href={card.href} className={rootClass} data-route={dataRoute ?? card.routeSlug}>
      {body}
    </Link>
  )
}
