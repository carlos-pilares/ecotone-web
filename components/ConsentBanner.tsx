'use client'

import { useEffect, useState } from 'react'

import { applyConsent, readStoredConsent, writeStoredConsent, type ConsentChoice } from '@/lib/consent'

const DEV = process.env.NODE_ENV === 'development'

/**
 * First-party consent banner for Google Consent Mode v2.
 *
 * Defaults are set in the Google tag: granted for US/Canada, denied for EEA/UK.
 * The banner lets any visitor make an explicit choice and pushes a consent
 * `update`. The choice is stored in a first-party cookie so returning visitors
 * are not prompted again and their preference is re-applied on each load.
 *
 * Rendering does not depend on GA4/Ads IDs being present, so the banner works
 * on localhost and production alike. `applyConsent` safely no-ops when the
 * Google tag is not loaded (e.g. locally without a measurement ID).
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = readStoredConsent()
    if (DEV) {
      // eslint-disable-next-line no-console
      console.log('[ConsentBanner] stored ecotone_consent:', stored, '→ show banner:', !stored)
    }
    if (stored) {
      applyConsent(stored)
      return
    }
    setVisible(true)
  }, [])

  if (!visible) return null

  const choose = (choice: ConsentChoice) => {
    writeStoredConsent(choice)
    applyConsent(choice)
    setVisible(false)
    if (DEV) {
      // eslint-disable-next-line no-console
      console.log('[ConsentBanner] consent applied:', choice)
    }
  }

  return (
    <div className="consent-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className="consent-banner-inner">
        <p className="consent-banner-text">
          We use cookies to analyse traffic and measure our advertising. You can accept or decline
          non-essential cookies. See our{' '}
          <a className="consent-banner-link" href="/privacy-policy">
            cookie policy
          </a>
          .
        </p>
        <div className="consent-banner-actions">
          <button
            type="button"
            className="consent-banner-btn consent-banner-btn--ghost"
            onClick={() => choose('denied')}
          >
            Decline
          </button>
          <button
            type="button"
            className="consent-banner-btn consent-banner-btn--primary"
            onClick={() => choose('granted')}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
