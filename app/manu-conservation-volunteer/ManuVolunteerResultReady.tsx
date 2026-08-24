import { ManuVolunteerCopyCodeButton } from './ManuVolunteerCopyCodeButton'

export type ManuVolunteerResultReadyProps = {
  couponCode: string
}

export function ManuVolunteerResultReady({ couponCode }: ManuVolunteerResultReadyProps) {
  return (
    <section className="mcv-result-ready mcv-section mcv-section--dark" aria-labelledby="mcv-result-ready-title">
      <div className="mcv-container mcv-result-ready-inner">
        <header className="mcv-result-ready-head">
          <h2 id="mcv-result-ready-title" className="mcv-section-title mcv-section-title--on-dark">
            Ready to join?
          </h2>
          <p className="mcv-result-ready-lead">Your Manu Field Crew place is one step closer.</p>
          <p className="mcv-result-ready-intro">
            Select a 2026 field departure above, continue to WeTravel, and confirm your 30% field
            offer. Other dates are available at the standard rate, subject to availability.
          </p>
        </header>

        <div className="mcv-result-ready-panel">
          <div className="mcv-result-ready-code" aria-label="Your booking code">
            <p className="mcv-result-ready-code-label">Your booking code</p>
            <div className="mcv-result-ready-code-row">
              <span className="mcv-result-ready-code-value">{couponCode}</span>
              <ManuVolunteerCopyCodeButton code={couponCode} label="Copy" />
            </div>
          </div>

          <ol className="mcv-result-ready-steps" aria-label="How to use your field offer">
            <li className="mcv-result-ready-step">
              <span className="mcv-result-ready-step-num">01</span>
              <div className="mcv-result-ready-step-body">
                <span className="mcv-result-ready-step-label">Select your departure</span>
                <span className="mcv-result-ready-step-hint">
                  Choose the field dates that work for you.
                </span>
              </div>
            </li>
            <li className="mcv-result-ready-step">
              <span className="mcv-result-ready-step-num">02</span>
              <div className="mcv-result-ready-step-body">
                <span className="mcv-result-ready-step-label">Continue to WeTravel</span>
                <span className="mcv-result-ready-step-hint">
                  Review the full programme and booking details.
                </span>
              </div>
            </li>
            <li className="mcv-result-ready-step">
              <span className="mcv-result-ready-step-num">03</span>
              <div className="mcv-result-ready-step-body">
                <span className="mcv-result-ready-step-label">Confirm your field offer</span>
                <span className="mcv-result-ready-step-hint">
                  For promotional departures, enter {couponCode} when prompted and check your
                  supported price.
                </span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
