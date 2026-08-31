import { WBTWOfferTerms } from './WBTWOfferTerms'
import { WBTWVolunteerDepartures } from './WBTWVolunteerDepartures'
import { WBTWVolunteerHowToUse } from './WBTWVolunteerHowToUse'
import { WBTWVolunteerOfferHero } from './WBTWVolunteerOfferHero'
import { WBTWVolunteerWhy } from './WBTWVolunteerWhy'
import {
  WBTW_VOLUNTEER_DEPARTURES,
  WBTW_VOLUNTEER_RESULT_SHELL,
} from './wbtw-volunteer-result-shell'

import './wbtw-volunteer-result.css'

/** Standalone volunteer result prototype — placeholder data only. */
export function WBTWVolunteerResult() {
  const shell = WBTW_VOLUNTEER_RESULT_SHELL

  return (
    <div className="wbtw-offer-result wbtw-vol-result">
      <WBTWVolunteerOfferHero
        discountPercent={shell.discountPercent}
        couponCode={shell.voucherCode}
        durationLabel={shell.durationLabel}
        availabilityLabel={shell.availabilityLabel}
      />
      <WBTWVolunteerDepartures
        departures={WBTW_VOLUNTEER_DEPARTURES}
        originalPrice={shell.originalPrice}
        promoPrice={shell.promoPrice}
        discountPercent={shell.discountPercent}
      />
      <WBTWVolunteerWhy />
      <WBTWVolunteerHowToUse couponCode={shell.voucherCode} />
      <WBTWOfferTerms />
    </div>
  )
}
