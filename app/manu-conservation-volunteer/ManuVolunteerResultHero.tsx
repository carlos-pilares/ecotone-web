import { ManuVolunteerCopyCodeButton } from './ManuVolunteerCopyCodeButton'
import { MCV_HERO_IMAGES } from './manu-volunteer-images'
import { WonderResponsiveImage } from '../wonder-beyond-the-wonder/WonderResponsiveImage'

export type ManuVolunteerResultHeroProps = {
  discountPercent: number
  couponCode: string
  originalPrice: string
  promoPrice: string
}

export function ManuVolunteerResultHero({
  discountPercent,
  couponCode,
  originalPrice,
  promoPrice,
}: ManuVolunteerResultHeroProps) {
  return (
    <div className="mcv-result-hero-block">
      <section className="mcv-result-hero" aria-labelledby="mcv-result-hero-title">
        <div className="mcv-result-hero-media" aria-hidden>
          <WonderResponsiveImage
            manifest={MCV_HERO_IMAGES}
            className="mcv-result-hero-img"
            pictureClassName="mcv-result-hero-picture"
            sizes="100vw"
            priority
          />
          <div className="mcv-result-hero-scrim" />
        </div>

        <div className="mcv-result-hero-shell">
          <div className="mcv-result-hero-content">
            <div className="mcv-result-hero-reward">
              <p className="mcv-result-hero-eyebrow">Your field offer</p>

              <h1 id="mcv-result-hero-title" className="mcv-result-hero-lockup">
                <span className="mcv-result-hero-lockup__lead">You unlocked</span>
                <span className="mcv-result-hero-lockup__discount">
                  <span className="mcv-result-hero-lockup__pct">{discountPercent}%</span>
                  <span className="mcv-result-hero-lockup__off">OFF</span>
                </span>
                <span className="mcv-result-hero-lockup__for">
                  for your Manu Field Crew experience.
                </span>
              </h1>

              <div className="mcv-result-hero-facts" aria-label="Offer pricing and code">
                <p className="mcv-result-hero-facts__price">
                  <span className="mcv-result-hero-facts__was">{originalPrice}</span>
                  <span className="mcv-result-hero-facts__arrow" aria-hidden>
                    →
                  </span>
                  <span className="mcv-result-hero-facts__now">{promoPrice}</span>
                </p>
                <div className="mcv-result-hero-facts__code-line">
                  <p className="mcv-result-hero-facts__meta">
                    {discountPercent}% off · Code{' '}
                    <span className="mcv-result-hero-accent">{couponCode}</span>
                  </p>
                  <ManuVolunteerCopyCodeButton
                    code={couponCode}
                    label="Copy"
                    className="mcv-result-hero-copy"
                  />
                </div>
              </div>

              <p className="mcv-result-hero-support">
                Choose one of the selected 4-week 2026 departures below and use code{' '}
                <span className="mcv-result-hero-accent">{couponCode}</span> on WeTravel.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
