'use client'

import {
  formatMfc2027CompactDateLine,
  MFC2027_DURATION_LABEL,
  type Mfc2027Departure,
} from './mfc2027-campaign'

type Props = {
  departure: Mfc2027Departure
  selected: boolean
  onSelect: () => void
}

/** MCV-style selectable departure card — no repeated price/promo. */
export function Mfc2027DepartureCard({ departure, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={[
        'mcv-result-date',
        'mcv-result-date--promo',
        'mfc2027-result-date',
        selected ? 'mcv-result-date--selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onSelect}
    >
      <span className="mcv-result-date__indicator" aria-hidden>
        <span className="mcv-result-date__indicator-dot" />
      </span>

      <span className="mcv-result-date__content">
        <span className="mcv-result-date__title-row">
          <span className="mcv-result-date__label">{departure.departureLabel}</span>
          <span className="mfc2027-result-date__month">{departure.monthLabel}</span>
        </span>
        <span className="mcv-result-date__dates">
          {formatMfc2027CompactDateLine(departure)}
        </span>
        <span className="mcv-result-date__meta">{MFC2027_DURATION_LABEL}</span>
      </span>
    </button>
  )
}
