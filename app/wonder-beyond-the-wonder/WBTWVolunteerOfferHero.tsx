import { WonderCopyCodeButton } from './WonderCopyCodeButton'
import { WonderResponsiveImage } from './WonderResponsiveImage'
import { WBTW_CLOSE_IMAGES } from './wonder-images'

export type WBTWVolunteerOfferHeroProps = {
  discountPercent: number
  couponCode: string
  durationLabel: string
  availabilityLabel: string
}

export function WBTWVolunteerOfferHero({
  discountPercent,
  couponCode,
  durationLabel,
  availabilityLabel,
}: WBTWVolunteerOfferHeroProps) {
  return (
    <section className="wbtw-offer-hero wbtw-vol-hero" aria-labelledby="wbtw-vol-hero-title">
      <div className="wbtw-offer-hero-media" aria-hidden>
        <WonderResponsiveImage
          manifest={WBTW_CLOSE_IMAGES}
          className="wbtw-offer-hero-img"
          pictureClassName="wbtw-offer-hero-picture"
          sizes="100vw"
          priority
        />
        <div className="wbtw-offer-hero-scrim" />
        <div className="wbtw-offer-hero-scrim-edge" aria-hidden />
      </div>

      <div className="wbtw-offer-hero-shell">
        <div className="wbtw-offer-hero-content">
          <div className="wbtw-offer-hero-reward">
            <p className="wbtw-offer-hero-eyebrow">Your volunteer offer</p>
            <p
              id="wbtw-vol-hero-title"
              className="wbtw-offer-hero-discount"
              aria-label={`${discountPercent}% OFF`}
            >
              <span className="wbtw-offer-hero-discount-pct">{discountPercent}%</span>
              <span className="wbtw-offer-hero-discount-off">OFF</span>
            </p>
            <p className="wbtw-offer-hero-tagline">Your field experience is unlocked</p>
            <p className="wbtw-offer-hero-support">
              Your private offer to join conservation work in the Peruvian Amazon.
            </p>
          </div>

          <div className="wbtw-offer-hero-details">
            <div className="wbtw-offer-hero-meta">
              <div className="wbtw-offer-hero-meta-item">
                <p className="wbtw-offer-hero-meta-label">Duration</p>
                <p className="wbtw-offer-hero-meta-value">{durationLabel}</p>
              </div>
              <div className="wbtw-offer-hero-meta-item">
                <p className="wbtw-offer-hero-meta-label">Availability</p>
                <p className="wbtw-offer-hero-meta-value">{availabilityLabel}</p>
              </div>
            </div>

            <div className="wbtw-offer-hero-code" aria-label="Your booking code">
              <p className="wbtw-offer-hero-code-label">Your booking code</p>
              <div className="wbtw-offer-hero-code-row">
                <p className="wbtw-offer-hero-code-value">{couponCode}</p>
                <WonderCopyCodeButton code={couponCode} label="Copy" className="wbtw-offer-hero-copy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
