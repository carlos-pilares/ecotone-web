import { WonderJourneyCardImage } from './WonderResponsiveImage'
import { WBTW_JOURNEY_CARD_IMAGES, WBTW_WHY_CARD_IMAGES } from './wonder-images'

const PRINCIPLES = [
  {
    term: 'Stay',
    detail: 'At a conservation-linked field station',
    image: WBTW_WHY_CARD_IMAGES.impact,
  },
  {
    term: 'Contribute',
    detail: 'Alongside researchers in the field',
    image: WBTW_WHY_CARD_IMAGES.connection,
  },
  {
    term: 'Learn',
    detail: 'From the science protecting Manu',
    image: WBTW_JOURNEY_CARD_IMAGES.wildlife,
  },
] as const

/** Compact volunteer why block — reuses tourism photographic treatment. */
export function WBTWVolunteerWhy() {
  return (
    <section className="wbtw-offer-why wbtw-vol-why" aria-labelledby="wbtw-vol-why-title">
      <div className="wbtw-offer-why-inner">
        <header className="wbtw-offer-why-head wbtw-vol-why-head">
          <p className="wbtw-offer-why-eyebrow wbtw-vol-why-eyebrow">Why Ecotone</p>
          <h2 id="wbtw-vol-why-title" className="wbtw-offer-why-title wbtw-vol-why-title">
            More than a volunteering placement
          </h2>
          <p className="wbtw-offer-why-copy wbtw-vol-why-copy">
            Four weeks living close to the conservation work protecting the Peruvian Amazon —
            alongside the people who know these landscapes.
          </p>
        </header>

        <ul className="wbtw-offer-why-moments">
          {PRINCIPLES.map((item) => (
            <li key={item.term} className="wbtw-offer-why-moment">
              <div className="wbtw-offer-why-moment-media">
                <WonderJourneyCardImage
                  image={item.image}
                  className="wbtw-offer-why-moment-img"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
                <div className="wbtw-offer-why-moment-scrim" aria-hidden />
                <div className="wbtw-offer-why-moment-copy">
                  <span className="wbtw-offer-why-moment-term">{item.term}</span>
                  <span className="wbtw-offer-why-moment-detail">{item.detail}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
