import type { McvResultDeparture } from './mcv-result-shell'

export type ManuVolunteerResultDepartureCardProps = {
  departure: McvResultDeparture
  durationLabel: string
  availabilityLabel: string
  originalPrice: string
  promoPrice: string
  discountPercent: number
  voucherCode: string
  selected: boolean
  matched: boolean
  onSelect: () => void
}

export function ManuVolunteerResultDepartureCard({
  departure,
  durationLabel,
  availabilityLabel,
  originalPrice,
  promoPrice,
  discountPercent,
  voucherCode,
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
        {isOther ? (
          <>
            {matched ? (
              <span className="mcv-result-date__title-row">
                <span className="mcv-result-date__badge">Best match for your timing</span>
              </span>
            ) : null}
            <span className="mcv-result-date__dates">{departure.departureLabel}</span>
            {departure.supportText ? (
              <span className="mcv-result-date__support">{departure.supportText}</span>
            ) : null}
            <span className="mcv-result-date__meta">
              {durationLabel} · *Subject to availability
            </span>
            <span className="mcv-result-date__pricing mcv-result-date__pricing--standard">
              <span className="mcv-result-date__price-now">{originalPrice}</span>
              <span className="mcv-result-date__price-context">
                Standard rate · no campaign discount
              </span>
            </span>
          </>
        ) : (
          <>
            <span className="mcv-result-date__title-row">
              <span className="mcv-result-date__label">{departure.departureLabel}</span>
              {matched ? (
                <span className="mcv-result-date__badge">Best match for your timing</span>
              ) : null}
            </span>
            <span className="mcv-result-date__dates">{departure.dateRange}</span>
            <span className="mcv-result-date__meta">
              {durationLabel} · {availabilityLabel}
            </span>
            <span
              className="mcv-result-date__pricing"
              aria-label={`${promoPrice}, ${discountPercent}% off with code ${voucherCode}`}
            >
              <span className="mcv-result-date__price-was">{originalPrice}</span>
              <span className="mcv-result-date__price-now">{promoPrice}</span>
              <span className="mcv-result-date__promo-line">
                {discountPercent}% off with code{' '}
                <span className="mcv-result-date__code-value">{voucherCode}</span>
              </span>
            </span>
          </>
        )}
      </span>
    </button>
  )
}
