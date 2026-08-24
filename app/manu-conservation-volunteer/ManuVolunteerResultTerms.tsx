const OFFER_TERMS = [
  'The promotional offer is valid only for selected 2026 Conservation Volunteer places shown with this campaign.',
  'The offer applies only to the Manu Field Crew / Conservation Volunteer programme displayed with this promotion.',
  'The promotional code must be entered when booking through WeTravel.',
  'The discount cannot be combined with other promotional offers or discount codes.',
  'Availability is subject to the selected departure dates and operational capacity.',
  'The offer has no cash value and cannot be exchanged for cash.',
  'Ecotone reserves the right to verify that the booking meets the conditions associated with the promotional offer.',
] as const

export function ManuVolunteerResultTerms() {
  return (
    <section className="mcv-result-terms" aria-label="Offer terms and conditions">
      <div className="mcv-container">
        <details className="mcv-result-terms-details">
          <summary className="mcv-result-terms-summary">
            <span className="mcv-result-terms-summary-label">Offer terms &amp; conditions</span>
            <span className="mcv-result-terms-toggle" aria-hidden />
          </summary>
          <div className="mcv-result-terms-panel">
            <ul className="mcv-result-terms-list">
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
