import { ManuVolunteerCopyCodeButton } from './ManuVolunteerCopyCodeButton'
import { MCV_HERO_IMAGES } from './manu-volunteer-images'
import { WonderResponsiveImage } from '../wonder-beyond-the-wonder/WonderResponsiveImage'

export type ManuVolunteerResultHeroProps = {
  discountPercent: number
  couponCode: string
  durationLabel: string
  availabilityLabel: string
  offerScopeLine: string
}

export function ManuVolunteerResultHero({
  discountPercent,
  couponCode,
  durationLabel,
  availabilityLabel,
  offerScopeLine,
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
              <p className="mcv-result-hero-eyebrow">
                Your field offer
                <span className="mcv-result-hero-eyebrow-mark" aria-hidden />
              </p>
              <p
                className="mcv-result-hero-discount"
                aria-label={`${discountPercent}% OFF`}
              >
                <span className="mcv-result-hero-discount-pct">{discountPercent}%</span>
                <span className="mcv-result-hero-discount-off">OFF</span>
              </p>
              <h1 id="mcv-result-hero-title" className="mcv-result-hero-headline">
                Your Manu Field Crew place is unlocked.
              </h1>
              <p className="mcv-result-hero-support">{offerScopeLine}</p>
              <p className="mcv-result-hero-support mcv-result-hero-support--secondary">
                Choose the field dates that work for you and explore the full programme.
              </p>
            </div>

            <div className="mcv-result-hero-details mcv-result-hero-details--desktop">
              <div className="mcv-result-hero-meta">
                <div className="mcv-result-hero-meta-item">
                  <p className="mcv-result-hero-meta-label">Duration</p>
                  <p className="mcv-result-hero-meta-value">{durationLabel}</p>
                </div>
                <div className="mcv-result-hero-meta-item">
                  <p className="mcv-result-hero-meta-label">Availability</p>
                  <p className="mcv-result-hero-meta-value">{availabilityLabel}</p>
                </div>
              </div>

              <div className="mcv-result-hero-code" aria-label="Your booking code">
                <p className="mcv-result-hero-code-label">Your booking code</p>
                <div className="mcv-result-hero-code-row">
                  <p className="mcv-result-hero-code-value">{couponCode}</p>
                  <ManuVolunteerCopyCodeButton
                    code={couponCode}
                    label="Copy"
                    className="mcv-result-hero-copy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mcv-result-hero-info-strip" aria-label="Offer details">
        <div className="mcv-container">
          <div className="mcv-result-hero-info-inner">
            <div className="mcv-result-hero-info-meta">
              <div className="mcv-result-hero-info-item">
                <p className="mcv-result-hero-info-value">{durationLabel}</p>
                <p className="mcv-result-hero-info-label">Duration</p>
              </div>
              <div className="mcv-result-hero-info-item">
                <p className="mcv-result-hero-info-value">{availabilityLabel}</p>
                <p className="mcv-result-hero-info-label">Availability</p>
              </div>
            </div>

            <div className="mcv-result-hero-info-code" aria-label="Your booking code">
              <div className="mcv-result-hero-info-code-row">
                <p className="mcv-result-hero-info-code-value">{couponCode}</p>
                <ManuVolunteerCopyCodeButton
                  code={couponCode}
                  label="Copy"
                  className="mcv-result-hero-info-copy"
                />
              </div>
              <p className="mcv-result-hero-info-code-label">Your booking code</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
