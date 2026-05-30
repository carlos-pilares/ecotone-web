import type { ExperienceCardPriceDisplay } from '@/lib/formatExperiencePrice'

import './experience-price-display.css'

type ExperiencePriceDisplayProps = {
  display: ExperienceCardPriceDisplay
  className?: string
  /** @deprecated Use `layout` instead. */
  showPromoLabel?: boolean
  layout?: 'card' | 'mega' | 'inline'
  /** @deprecated Use `layout` instead. */
  variant?: 'card' | 'nav' | 'inline'
}

export function ExperiencePriceDisplay({
  display,
  className,
  showPromoLabel = true,
  layout,
  variant = 'card',
}: ExperiencePriceDisplayProps) {
  const resolvedLayout = layout ?? (variant === 'nav' ? 'mega' : variant)

  if (display.kind === 'enquire') {
    return (
      <span className={className ?? 'experience-price-display experience-price-display--enquire'}>
        {showPromoLabel && display.promoLabel ? (
          <span className="experience-price-display__promo-label">{display.promoLabel}</span>
        ) : null}
        Enquire
      </span>
    )
  }

  if (resolvedLayout === 'mega') {
    const rootClass = className ?? 'dd-exp-meta dd-exp-meta--price experience-price-display experience-price-display--mega'
    return (
      <div className={rootClass}>
        {showPromoLabel && display.promoLabel ? (
          <span className="experience-price-display__promo-label dd-exp-meta-promo">{display.promoLabel}</span>
        ) : null}
        <span className="experience-price-display__mega-line">
          <span className="dd-exp-meta-from">{display.from} </span>
          <span className="dd-exp-meta-amount">{display.amount}</span>
          <span className="dd-exp-meta-per"> {display.perPerson}</span>
        </span>
        {display.hasDiscount && display.originalAmount ? (
          <span className="experience-price-display__original dd-exp-meta-original">{display.originalAmount}</span>
        ) : null}
      </div>
    )
  }

  if (resolvedLayout === 'inline') {
    return (
      <span className={className ?? 'experience-price-display experience-price-display--inline'}>
        {showPromoLabel && display.promoLabel ? (
          <span className="experience-price-display__promo-label">{display.promoLabel}</span>
        ) : null}
        {display.from ? <span className="experience-price-display__from">{display.from} </span> : null}
        <span className="experience-price-display__amount">{display.amount}</span>
        {display.hasDiscount && display.originalAmount ? (
          <span className="experience-price-display__original">{display.originalAmount}</span>
        ) : null}
      </span>
    )
  }

  const rootClass = className ?? 'experience-card__price experience-price-display experience-price-display--card'

  return (
    <span className={rootClass}>
      {showPromoLabel && display.promoLabel ? (
        <span className="experience-price-display__promo-label">{display.promoLabel}</span>
      ) : null}
      <span className="experience-price-display__price-row">
        <span className="experience-card__price-from">{display.from} </span>
        <span className="experience-card__price-amount">{display.amount}</span>
        {display.hasDiscount && display.originalAmount ? (
          <span className="experience-price-display__original">{display.originalAmount}</span>
        ) : null}
      </span>
      <span className="experience-card__price-per">{display.perPerson}</span>
    </span>
  )
}
