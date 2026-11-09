import { ManuVolunteerCopyCodeButton } from '../manu-conservation-volunteer/ManuVolunteerCopyCodeButton'
import { MCV_HERO_IMAGES } from '../manu-conservation-volunteer/manu-volunteer-images'
import { WonderResponsiveImage } from '../wonder-beyond-the-wonder/WonderResponsiveImage'

import {
  MFC2027_DISCOUNT_PERCENT,
  MFC2027_PRICE_DISPLAY,
  MFC2027_PROMO_CODE,
} from './mfc2027-campaign'

export function Mfc2027ResultHero() {
  return (
    <div className="mcv-result-hero-block">
      <section className="mcv-result-hero" aria-labelledby="mfc2027-result-hero-title">
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
              <p className="mcv-result-hero-eyebrow">YOUR 2027 MANU FIELD OFFER</p>

              <h1 id="mfc2027-result-hero-title" className="mcv-result-hero-lockup">
                <span className="mcv-result-hero-lockup__lead">You unlocked</span>
                <span className="mcv-result-hero-lockup__discount">
                  <span className="mcv-result-hero-lockup__pct">{MFC2027_DISCOUNT_PERCENT}%</span>
                  <span className="mcv-result-hero-lockup__off">OFF</span>
                </span>
                <span className="mcv-result-hero-lockup__for">
                  your 4-week Manu Field Crew experience.
                </span>
              </h1>

              <div className="mcv-result-hero-facts" aria-label="Offer pricing and code">
                <p className="mcv-result-hero-facts__price">
                  <span className="mcv-result-hero-facts__was">{MFC2027_PRICE_DISPLAY.base}</span>
                  <span className="mcv-result-hero-facts__arrow" aria-hidden>
                    →
                  </span>
                  <span className="mcv-result-hero-facts__now">{MFC2027_PRICE_DISPLAY.offer}</span>
                </p>
                <div className="mcv-result-hero-facts__code-line">
                  <p className="mcv-result-hero-facts__meta">
                    {MFC2027_DISCOUNT_PERCENT}% off · Code{' '}
                    <span className="mcv-result-hero-accent">{MFC2027_PROMO_CODE}</span>
                  </p>
                  <ManuVolunteerCopyCodeButton
                    code={MFC2027_PROMO_CODE}
                    label="Copy"
                    className="mcv-result-hero-copy"
                  />
                </div>
              </div>

              <p className="mcv-result-hero-support">
                Choose a preferred 2027 departure below, then continue to WeTravel to review the
                itinerary, live availability and booking details. Use code{' '}
                <span className="mcv-result-hero-accent">{MFC2027_PROMO_CODE}</span> on WeTravel.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
