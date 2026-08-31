import { WBTWOfferResult } from './WBTWOfferResult'
import { WBTW_RESULT_SHELL_PERSONALIZATION } from './wbtw-result-shell'

export function WonderResultPage() {
  return (
    <main className="wbtw-page wbtw-page--result">
      <WBTWOfferResult
        travelTiming={WBTW_RESULT_SHELL_PERSONALIZATION.travelTiming}
        partySize={WBTW_RESULT_SHELL_PERSONALIZATION.partySize}
      />
    </main>
  )
}
