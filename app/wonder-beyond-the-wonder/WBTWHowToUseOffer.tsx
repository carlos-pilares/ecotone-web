import { WonderCopyCodeButton } from './WonderCopyCodeButton'

export type WBTWHowToUseOfferProps = {
  couponCode: string
}

export function WBTWHowToUseOffer({ couponCode }: WBTWHowToUseOfferProps) {
  return (
    <section className="wbtw-offer-how" aria-labelledby="wbtw-offer-how-title">
      <div className="wbtw-offer-how-inner">
        <header className="wbtw-offer-how-head">
          <p className="wbtw-offer-how-eyebrow">How to use your offer</p>
          <h2 id="wbtw-offer-how-title" className="wbtw-offer-how-title">
            Ready when you are.
          </h2>
          <p className="wbtw-offer-how-intro">
            Booking through WeTravel? Enter your code before completing payment.
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

          <ol className="wbtw-offer-how-steps" aria-label="How to redeem your offer">
            <li className="wbtw-offer-how-step">
              <span className="wbtw-offer-how-step-num">01</span>
              <div className="wbtw-offer-how-step-body">
                <span className="wbtw-offer-how-step-label">Explore your journey</span>
                <span className="wbtw-offer-how-step-hint">
                  Open any of the eligible experiences above.
                </span>
              </div>
            </li>

            <li className="wbtw-offer-how-step">
              <span className="wbtw-offer-how-step-num">02</span>
              <div className="wbtw-offer-how-step-body">
                <span className="wbtw-offer-how-step-label">Book on WeTravel</span>
                <span className="wbtw-offer-how-step-hint">
                  Choose your preferred departure and enter {couponCode} when prompted.
                </span>
              </div>
            </li>

            <li className="wbtw-offer-how-step">
              <span className="wbtw-offer-how-step-num">03</span>
              <div className="wbtw-offer-how-step-body">
                <span className="wbtw-offer-how-step-label">Check your offer</span>
                <span className="wbtw-offer-how-step-hint">
                  Make sure your promotional price is reflected before payment.
                </span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
