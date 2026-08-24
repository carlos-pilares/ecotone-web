import type { McvResultDeparture } from './mcv-result-shell'

export type ManuVolunteerResultDepartureCardProps = {
  departure: McvResultDeparture
  originalPrice: string
  promoPrice: string
  discountPercent: number
  selected: boolean
  matched: boolean
  onSelect: () => void
}

export function ManuVolunteerResultDepartureCard({
  departure,
  originalPrice,
  promoPrice,
  discountPercent,
  selected,
  matched,
  onSelect,
}: ManuVolunteerResultDepartureCardProps) {
  const isOther = departure.kind === 'other'
  const className = [
    'mcv-result-date',
    isOther ? 'mcv-result-date--other' : 'mcv-result-date--promo',
    matched ? 'mcv-result-date--matched' : '',
    selected ? 'mcv-result-date--selected' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={className}
      onClick={onSelect}
    >
      <span className="mcv-result-date__indicator" aria-hidden>
        <span className="mcv-result-date__indicator-dot" />
      </span>

      <span className="mcv-result-date__content">
        {(matched || !isOther) ? (
          <span className="mcv-result-date__title-row">
            {!isOther ? (
              <span className="mcv-result-date__label">{departure.departureLabel}</span>
            ) : null}
            {matched ? (
              <span className="mcv-result-date__badge">Best match for your timing</span>
            ) : null}
          </span>
        ) : null}

        {isOther ? (
          <>
            <span className="mcv-result-date__dates">{departure.departureLabel}</span>
            {departure.supportText ? (
              <span className="mcv-result-date__support">{departure.supportText}</span>
            ) : null}
          </>
        ) : (
          <>
            <span className="mcv-result-date__dates">{departure.dateRange}</span>
            <span className="mcv-result-date__period">Fixed 4-week departure</span>
            <span className="mcv-result-date__offer-note">
              30% field offer applies to these fixed dates
            </span>
            <span className="mcv-result-date__places">Limited places</span>
          </>
        )}

        {isOther ? (
          <>
            <span className="mcv-result-date__duration">{departure.duration}</span>
            <span className="mcv-result-date__places">*Subject to availability</span>
          </>
        ) : null}

        {departure.hasPromoOffer ? (
          <span
            className="mcv-result-date__pricing"
            aria-label={`${promoPrice}, with your ${discountPercent}% field offer`}
          >
            <span className="mcv-result-date__price-was">{originalPrice}</span>
            <span className="mcv-result-date__price-now">{promoPrice}</span>
            <span className="mcv-result-date__price-context">
              with your {discountPercent}% field offer
            </span>
          </span>
        ) : (
          <span className="mcv-result-date__pricing mcv-result-date__pricing--standard">
            <span className="mcv-result-date__price-now">Standard rate applies</span>
            <span className="mcv-result-date__price-context">*Subject to availability</span>
          </span>
        )}
      </span>
    </button>
  )
}
