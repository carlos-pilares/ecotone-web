const OFFER_TERMS = [
  'The promotional offer is valid only for the travel period and party size shown in your unlocked offer.',
  'The offer applies only to the eligible Ecotone Experiences displayed with this promotion.',
  'The promotional code must be entered when booking through WeTravel.',
  'The discount cannot be combined with other promotional offers or discount codes.',
  'Availability is subject to the selected experience, travel dates and operational capacity.',
  'The offer has no cash value and cannot be exchanged for cash.',
  'Ecotone reserves the right to verify that the booking meets the conditions associated with the promotional offer.',
] as const

export function WBTWOfferTerms() {
  return (
    <section className="wbtw-offer-terms-section" aria-label="Offer terms and conditions">
      <div className="wbtw-offer-terms-inner">
        <details className="wbtw-offer-terms">
          <summary className="wbtw-offer-terms__summary">
            <span className="wbtw-offer-terms__summary-label">Offer terms &amp; conditions</span>
            <span className="wbtw-offer-terms__toggle" aria-hidden />
          </summary>
          <div className="wbtw-offer-terms__panel">
            <p className="wbtw-offer-terms__eyebrow">Offer terms &amp; conditions</p>
            <ul className="wbtw-offer-terms__list">
              {OFFER_TERMS.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </section>
  )
}
