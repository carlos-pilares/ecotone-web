import { WBTWHowToUseOffer } from './WBTWHowToUseOffer'
import { WBTWOfferHero } from './WBTWOfferHero'
import { WBTWOfferTerms } from './WBTWOfferTerms'
import { WBTWPromotionalExperienceCards } from './WBTWPromotionalExperienceCards'
import { WBTWWhyEcotone } from './WBTWWhyEcotone'
import {
  WBTW_RESULT_SHELL,
  WBTW_RESULT_SHELL_EXPERIENCES,
  WBTW_RESULT_SHELL_PERSONALIZATION,
  type WbtwResultShellExperience,
} from './wbtw-result-shell'

export type WBTWOfferResultProps = {
  discountPercent?: number
  couponCode?: string
  travelTiming?: string
  partySize?: string
  experiences?: WbtwResultShellExperience[]
  /** Modal dialog title id — passed through to the offer hero heading. */
  titleId?: string
}

/** Shared WBTW offer result: reward → journeys → why → redeem → terms. */
export function WBTWOfferResult({
  discountPercent = WBTW_RESULT_SHELL.discountPercent,
  couponCode = WBTW_RESULT_SHELL.voucherCode,
  travelTiming = WBTW_RESULT_SHELL_PERSONALIZATION.travelTiming,
  partySize = WBTW_RESULT_SHELL_PERSONALIZATION.partySize,
  experiences = WBTW_RESULT_SHELL_EXPERIENCES,
  titleId,
}: WBTWOfferResultProps) {
  const discountLabel = `${discountPercent}% OFF`

  return (
    <div className="wbtw-offer-result">
      <WBTWOfferHero
        discountLabel={discountLabel}
        couponCode={couponCode}
        travelTiming={travelTiming}
        partySize={partySize}
        titleId={titleId}
      />
      <WBTWPromotionalExperienceCards
        experiences={experiences}
        discountLabel={discountLabel}
        discountPercent={discountPercent}
        couponCode={couponCode}
        travelTiming={travelTiming}
        partySize={partySize}
      />
      <WBTWWhyEcotone />
      <WBTWHowToUseOffer couponCode={couponCode} />
      <WBTWOfferTerms />
    </div>
  )
}
