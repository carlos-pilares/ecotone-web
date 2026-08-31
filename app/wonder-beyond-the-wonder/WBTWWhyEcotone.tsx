import { WonderJourneyCardImage } from './WonderResponsiveImage'
import { WBTW_JOURNEY_CARD_IMAGES, WBTW_WHY_CARD_IMAGES, type JourneyCardImage } from './wonder-images'

const PRINCIPLES = [
  {
    term: 'Stay',
    detail: 'In places connected to conservation',
    image: WBTW_WHY_CARD_IMAGES.impact,
  },
  {
    term: 'Explore',
    detail: 'With people who know these landscapes',
    image: WBTW_WHY_CARD_IMAGES.connection,
  },
  {
    term: 'Learn',
    detail: 'From the science protecting them',
    image: WBTW_JOURNEY_CARD_IMAGES.wildlife,
  },
] as const satisfies ReadonlyArray<{
  term: string
  detail: string
  image: JourneyCardImage
}>

export function WBTWWhyEcotone() {
  return (
    <section className="wbtw-offer-why" aria-labelledby="wbtw-offer-why-title">
      <div className="wbtw-offer-why-inner">
        <p className="wbtw-offer-why-bridge">
          Whichever journey you choose, you travel differently with Ecotone.
        </p>

        <header className="wbtw-offer-why-head">
          <p className="wbtw-offer-why-eyebrow">Why Ecotone</p>
          <h2 id="wbtw-offer-why-title" className="wbtw-offer-why-title">
            More than a trip into the Amazon
          </h2>
          <p className="wbtw-offer-why-copy">
            Each Ecotone journey combines extraordinary nature with conservation, science and the people
            protecting these landscapes. You don&apos;t just visit Manu. You experience what keeps it alive.
          </p>
        </header>

        <ul className="wbtw-offer-why-moments">
          {PRINCIPLES.map((item) => (
            <li key={item.term} className="wbtw-offer-why-moment">
              <div className="wbtw-offer-why-moment-media">
                <WonderJourneyCardImage
                  image={item.image}
                  className="wbtw-offer-why-moment-img"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 33vw, 100vw"
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
