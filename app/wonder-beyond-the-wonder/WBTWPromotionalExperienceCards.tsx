import { WBTWJourneyOfferReminder } from './WBTWJourneyOfferReminder'
import { WonderResultPromoCard } from './WonderResultPromoCard'
import {
  splitPresentationalJourneys,
  WBTW_JOURNEY_ALL_INCLUSIVE_FOOTNOTE,
  WBTW_RESULT_FEATURED_BADGE,
  type WbtwResultShellExperience,
} from './wbtw-result-shell'

export type WBTWPromotionalExperienceCardsProps = {
  experiences: WbtwResultShellExperience[]
  discountLabel: string
  discountPercent: number
  couponCode: string
  travelTiming: string
  partySize: string
}

export function WBTWPromotionalExperienceCards({
  experiences,
  discountLabel,
  discountPercent,
  couponCode,
  travelTiming,
  partySize,
}: WBTWPromotionalExperienceCardsProps) {
  const { featured, alternatives } = splitPresentationalJourneys(experiences)

  const offerReminderProps = {
    discountPercent,
    couponCode,
    travelTiming,
    partySize,
  }

  return (
    <section className="wbtw-result-journeys" aria-labelledby="wbtw-result-journeys-title">
      <header className="wbtw-result-journeys-head">
        <h2 id="wbtw-result-journeys-title" className="wbtw-result-journeys-title">
          Choose your journey
        </h2>
        <p className="wbtw-result-journeys-intro">
          Your offer is valid on all three Ecotone journeys below.
        </p>
      </header>

      <div className="wbtw-journey-curation">
        <div className="wbtw-journey-curation__featured">
          <WonderResultPromoCard
            experience={featured}
            discountLabel={discountLabel}
            variant="featured"
            badgeLabel={WBTW_RESULT_FEATURED_BADGE}
          />
          <WBTWJourneyOfferReminder {...offerReminderProps} variant="desktop" />
        </div>

        <div className="wbtw-journey-curation__alternatives">
          {alternatives.map((item) => (
            <WonderResultPromoCard
              key={item.key}
              experience={item}
              discountLabel={discountLabel}
              variant="compact"
            />
          ))}
        </div>
      </div>

      <WBTWJourneyOfferReminder {...offerReminderProps} variant="mobile" />

      <p className="wbtw-result-journeys-footnote">{WBTW_JOURNEY_ALL_INCLUSIVE_FOOTNOTE}</p>
    </section>
  )
}
