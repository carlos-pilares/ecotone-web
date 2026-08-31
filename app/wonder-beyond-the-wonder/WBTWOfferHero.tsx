import { WonderCopyCodeButton } from './WonderCopyCodeButton'
import { WonderResponsiveImage } from './WonderResponsiveImage'
import { WBTW_CLOSE_IMAGES } from './wonder-images'

export type WBTWOfferHeroProps = {
  discountLabel: string
  couponCode: string
  travelTiming: string
  partySize: string
  /** When rendered inside the lead modal, ties `aria-labelledby` to the dialog title. */
  titleId?: string
}

export function WBTWOfferHero({
  discountLabel,
  couponCode,
  travelTiming,
  partySize,
  titleId,
}: WBTWOfferHeroProps) {
  const discountPct = discountLabel.replace(/\s*OFF\s*$/i, '').trim()

  return (
    <section className="wbtw-offer-hero" aria-labelledby={titleId ?? 'wbtw-offer-hero-title'}>
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
            <p className="wbtw-offer-hero-eyebrow">Your exclusive Peru offer</p>
            <p
              id={titleId ?? 'wbtw-offer-hero-title'}
              className="wbtw-offer-hero-discount"
              aria-label={discountLabel}
            >
              <span className="wbtw-offer-hero-discount-pct">{discountPct}</span>
              <span className="wbtw-offer-hero-discount-off">OFF</span>
            </p>
            <p className="wbtw-offer-hero-tagline">Your offer is unlocked</p>
            <p className="wbtw-offer-hero-support">Your private offer for the Peruvian Amazon</p>
          </div>

          <div className="wbtw-offer-hero-details">
            <div className="wbtw-offer-hero-meta">
              <div className="wbtw-offer-hero-meta-item">
                <p className="wbtw-offer-hero-meta-label">Travel period</p>
                <p className="wbtw-offer-hero-meta-value">{travelTiming}</p>
              </div>
              <div className="wbtw-offer-hero-meta-item">
                <p className="wbtw-offer-hero-meta-label">Travellers</p>
                <p className="wbtw-offer-hero-meta-value">{partySize}</p>
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
