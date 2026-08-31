import { WonderCopyCodeButton } from './WonderCopyCodeButton'

export type WBTWVolunteerHowToUseProps = {
  couponCode: string
}

/** Compact volunteer redemption help — prototype copy only. */
export function WBTWVolunteerHowToUse({ couponCode }: WBTWVolunteerHowToUseProps) {
  return (
    <section className="wbtw-offer-how wbtw-vol-how" aria-labelledby="wbtw-vol-how-title">
      <div className="wbtw-offer-how-inner">
        <header className="wbtw-offer-how-head wbtw-vol-how-head">
          <h2 id="wbtw-vol-how-title" className="wbtw-offer-how-title wbtw-vol-how-title">
            Ready to join?
          </h2>
          <p className="wbtw-vol-how-lead">Your field experience is one step closer.</p>
          <p className="wbtw-offer-how-intro wbtw-vol-how-intro">
            Choose your departure above, then review the full programme and booking details on
            WeTravel.
          </p>
        </header>

        <div className="wbtw-offer-how-panel">
          <div className="wbtw-offer-how-code" aria-label="Your booking code">
            <p className="wbtw-offer-how-code-label">Your booking code</p>
            <div className="wbtw-offer-how-code-row">
              <span className="wbtw-offer-how-code-value">{couponCode}</span>
              <WonderCopyCodeButton
                code={couponCode}
                label="Copy"
                className="wbtw-offer-how-code-copy"
              />
            </div>
          </div>

          <ol className="wbtw-offer-how-steps" aria-label="How to redeem your volunteer offer">
            <li className="wbtw-offer-how-step">
              <span className="wbtw-offer-how-step-num">01</span>
              <div className="wbtw-offer-how-step-body">
                <span className="wbtw-offer-how-step-label">Select your departure</span>
                <span className="wbtw-offer-how-step-hint">
                  Choose one of the three start dates above.
                </span>
              </div>
            </li>

            <li className="wbtw-offer-how-step">
              <span className="wbtw-offer-how-step-num">02</span>
              <div className="wbtw-offer-how-step-body">
                <span className="wbtw-offer-how-step-label">Book on WeTravel</span>
                <span className="wbtw-offer-how-step-hint">
                  Enter {couponCode} when prompted during booking.
                </span>
              </div>
            </li>

            <li className="wbtw-offer-how-step">
              <span className="wbtw-offer-how-step-num">03</span>
              <div className="wbtw-offer-how-step-body">
                <span className="wbtw-offer-how-step-label">Check your offer</span>
                <span className="wbtw-offer-how-step-hint">
                  Confirm your promotional price before payment.
                </span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
