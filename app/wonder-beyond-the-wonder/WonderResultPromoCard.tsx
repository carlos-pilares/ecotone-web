import Link from 'next/link'

import { WonderJourneyCardImage } from './WonderResponsiveImage'
import {
  WBTW_JOURNEY_ALL_INCLUSIVE_DETAIL,
  type WbtwResultShellExperience,
} from './wbtw-result-shell'

import './wbtw-result-promo-card.css'

function CardArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <line x1="2" y1="6" x2="10" y2="6" />
      <polyline points="7 3 10 6 7 9" />
    </svg>
  )
}

export type WonderResultPromoCardProps = {
  experience: WbtwResultShellExperience
  discountLabel: string
  variant?: 'featured' | 'compact'
  badgeLabel?: string
}

function offerContextFromDiscount(discountLabel: string) {
  const pct = discountLabel.replace(/\s*off\s*$/i, '').trim()
  return `with your ${pct} offer`
}

export function WonderResultPromoCard({
  experience,
  discountLabel,
  variant = 'featured',
  badgeLabel,
}: WonderResultPromoCardProps) {
  const cardClass =
    variant === 'featured'
      ? 'wbtw-journey-card wbtw-journey-card--featured'
      : 'wbtw-journey-card wbtw-journey-card--compact'

  const offerContext = offerContextFromDiscount(discountLabel)

  return (
    <Link
      href={experience.href}
      className={cardClass}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="wbtw-journey-card__media">
        <WonderJourneyCardImage
          image={experience.image}
          className="wbtw-journey-card__img"
          sizes={
            variant === 'featured'
              ? '(min-width: 1024px) 55vw, 100vw'
              : '(min-width: 1024px) 45vw, 100vw'
          }
        />
        {badgeLabel ? <span className="wbtw-journey-card__badge">{badgeLabel}</span> : null}
      </div>

      <div className="wbtw-journey-card__body">
        <h3 className="wbtw-journey-card__title">{experience.title}</h3>

        <div className="wbtw-journey-card__meta">
          <p className="wbtw-journey-card__duration">{experience.duration}</p>
          <p className="wbtw-journey-card__best-for">Best for · {experience.bestFor}</p>
        </div>

        <p className="wbtw-journey-card__proposition">{experience.proposition}</p>

        <div
          className="wbtw-journey-card__pricing"
          aria-label={`${experience.promoPrice} per person, ${offerContext}`}
        >
          <p className="wbtw-journey-card__price-now">
            {experience.promoPrice}
            <span className="wbtw-journey-card__price-pp">pp</span>
          </p>
          <div className="wbtw-journey-card__price-quiet">
            <span className="wbtw-journey-card__price-was">{experience.originalPrice}</span>
            <span className="wbtw-journey-card__price-context">{offerContext}</span>
          </div>
        </div>

        <div className="wbtw-journey-card__inclusive-block">
          <p className="wbtw-journey-card__inclusive">All-inclusive journey*</p>
          <p className="wbtw-journey-card__inclusive-detail">{WBTW_JOURNEY_ALL_INCLUSIVE_DETAIL}</p>
        </div>

        <span className="wbtw-journey-card__cta">
          EXPLORE THIS JOURNEY <CardArrow />
        </span>
      </div>
    </Link>
  )
}
