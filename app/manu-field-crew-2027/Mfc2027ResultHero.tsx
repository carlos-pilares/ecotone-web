import { MCV_HERO_IMAGES } from '../manu-conservation-volunteer/manu-volunteer-images'
import { WonderResponsiveImage } from '../wonder-beyond-the-wonder/WonderResponsiveImage'

import { MFC2027_PRICE_DISPLAY } from './mfc2027-campaign'

export function Mfc2027ResultHero() {
  return (
    <div className="mcv-result-hero-block">
      <section className="mcv-result-hero mfc2027-result-hero" aria-labelledby="mfc2027-result-hero-title">
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
            <div className="mfc2027-result-hero-copy">
              <p className="mfc2027-result-hero-eyebrow">YOUR 2027 FIELD SEASON</p>

              <h1 id="mfc2027-result-hero-title" className="mfc2027-result-hero-title">
                <span className="mfc2027-result-hero-title__lead">Choose your</span>
                <span className="mfc2027-result-hero-title__line mfc2027-result-hero-title__line--manu">
                  Manu Field
                </span>
                <span className="mfc2027-result-hero-title__line mfc2027-result-hero-title__line--depart">
                  Departure.
                </span>
              </h1>

              <p className="mfc2027-result-hero-support">
                Four weeks of conservation fieldwork, rainforest life and real research experience
                from the Manu Learning Centre.
              </p>

              <div className="mfc2027-result-hero-meta" aria-label="Programme details and price">
                <p className="mfc2027-result-hero-details">
                  4 weeks · Manu Learning Centre · Fixed 2027 departures
                </p>
                <p className="mfc2027-result-hero-price">{MFC2027_PRICE_DISPLAY}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
