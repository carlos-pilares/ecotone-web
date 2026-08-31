import type { WbtwVolunteerDeparture } from './wbtw-volunteer-result-shell'

export type WBTWVolunteerDepartureCardProps = {
  departure: WbtwVolunteerDeparture
  originalPrice: string
  promoPrice: string
  discountPercent: number
  selected: boolean
  onSelect: () => void
}

export function WBTWVolunteerDepartureCard({
  departure,
  originalPrice,
  promoPrice,
  discountPercent,
  selected,
  onSelect,
}: WBTWVolunteerDepartureCardProps) {
  const className = [
    'wbtw-vol-date',
    departure.recommended ? 'wbtw-vol-date--recommended' : '',
    selected ? 'wbtw-vol-date--selected' : '',
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
      <span className="wbtw-vol-date__indicator" aria-hidden>
        <span className="wbtw-vol-date__indicator-dot" />
      </span>

      <span className="wbtw-vol-date__content">
        <span className="wbtw-vol-date__title-row">
          <span className="wbtw-vol-date__label">{departure.departureLabel}</span>
          {departure.recommended ? (
            <span className="wbtw-vol-date__badge">Recommended</span>
          ) : null}
        </span>

        <span className="wbtw-vol-date__month">{departure.monthYear}</span>
        <span className="wbtw-vol-date__range">{departure.dateRange}</span>
        <span className="wbtw-vol-date__duration">{departure.duration}</span>

        {departure.recommended && departure.recommendReason ? (
          <span className="wbtw-vol-date__reason">{departure.recommendReason}</span>
        ) : (
          <span className="wbtw-vol-date__places">Limited places</span>
        )}

        <span
          className="wbtw-vol-date__pricing"
          aria-label={`${promoPrice}, with your ${discountPercent}% offer`}
        >
          <span className="wbtw-vol-date__price-was">{originalPrice}</span>
          <span className="wbtw-vol-date__price-now">{promoPrice}</span>
          <span className="wbtw-vol-date__price-context">with your {discountPercent}% offer</span>
        </span>
      </span>
    </button>
  )
}
