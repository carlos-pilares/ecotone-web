import { formatWbtwTripContext } from './wbtw-result-context'
import { WonderCopyCodeButton } from './WonderCopyCodeButton'

export type WBTWJourneyOfferReminderProps = {
  discountPercent: number
  couponCode: string
  travelTiming: string
  partySize: string
  variant: 'desktop' | 'mobile'
}

export function WBTWJourneyOfferReminder({
  discountPercent,
  couponCode,
  travelTiming,
  partySize,
  variant,
}: WBTWJourneyOfferReminderProps) {
  const tripContext = formatWbtwTripContext(travelTiming, partySize)
  const variantClass =
    variant === 'desktop' ? 'wbtw-journey-offer--desktop' : 'wbtw-journey-offer--mobile'

  if (variant === 'mobile') {
    return (
      <aside
        className={`wbtw-journey-offer ${variantClass}`}
        aria-label="Your unlocked travel offer"
      >
        <div className="wbtw-journey-offer__pass">
          <div
            className="wbtw-journey-offer__discount wbtw-journey-offer__discount--mobile"
            aria-label={`${discountPercent}% off`}
          >
            <span className="wbtw-journey-offer__discount-pct">{discountPercent}%</span>
            <span className="wbtw-journey-offer__discount-off">OFF</span>
          </div>

          <p className="wbtw-journey-offer__message wbtw-journey-offer__message--mobile">
            Three journeys.
            <br />
            One exclusive offer.
          </p>
          <p className="wbtw-journey-offer__context">{tripContext}</p>

          <div className="wbtw-journey-offer__coupon wbtw-journey-offer__coupon--mobile">
            <p className="wbtw-journey-offer__coupon-label">Your booking code</p>
            <div className="wbtw-journey-offer__coupon-row">
              <span className="wbtw-journey-offer__code">{couponCode}</span>
              <WonderCopyCodeButton
                code={couponCode}
                label="Copy code"
                className="wbtw-journey-offer__copy"
              />
            </div>
          </div>

          <p className="wbtw-journey-offer__footer wbtw-journey-offer__footer--mobile">
            Explore freely. Your offer stays with you.
          </p>
        </div>
      </aside>
    )
  }

  return (
    <aside className={`wbtw-journey-offer ${variantClass}`} aria-label="Your unlocked travel offer">
      <div className="wbtw-journey-offer__pass">
        <div className="wbtw-journey-offer__layout">
          <div className="wbtw-journey-offer__primary">
            <div
              className="wbtw-journey-offer__discount"
              aria-label={`${discountPercent}% off`}
            >
              <span className="wbtw-journey-offer__discount-pct">{discountPercent}%</span>
              <span className="wbtw-journey-offer__discount-off">OFF</span>
            </div>

            <p className="wbtw-journey-offer__message">
              Three journeys.
              <br />
              One exclusive offer.
            </p>
            <p className="wbtw-journey-offer__context">{tripContext}</p>
          </div>

          <div className="wbtw-journey-offer__divider" aria-hidden />

          <div className="wbtw-journey-offer__coupon">
            <p className="wbtw-journey-offer__coupon-label">Your booking code</p>
            <div className="wbtw-journey-offer__coupon-row">
              <span className="wbtw-journey-offer__code">{couponCode}</span>
              <WonderCopyCodeButton
                code={couponCode}
                label="Copy code"
                className="wbtw-journey-offer__copy"
              />
            </div>
          </div>
        </div>

        <p className="wbtw-journey-offer__footer">
          Explore freely. Your offer stays with you.
        </p>
      </div>
    </aside>
  )
}
