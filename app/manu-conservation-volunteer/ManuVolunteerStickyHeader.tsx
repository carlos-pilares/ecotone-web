'use client'

import { useEffect, useState } from 'react'

import { ManuVolunteerBrandLogo } from './ManuVolunteerBrandLogo'
import { ManuVolunteerCtaButton } from './ManuVolunteerCtaButton'

const CTA_VISIBLE = 'See if you qualify'
const CTA_ARIA = 'See if you qualify for a 2026 supported place'
const SCROLL_SOLID_AT = 40

/**
 * Persistent campaign header: transparent over hero, cream bar when scrolled.
 * CTA opens the existing qualification modal (`ctaLocation="header"`).
 */
export function ManuVolunteerStickyHeader() {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const sync = () => setSolid(window.scrollY > SCROLL_SOLID_AT)
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [])

  return (
    <header className={`mcv-topbar${solid ? ' mcv-topbar--solid' : ' mcv-topbar--hero'}`}>
      <div className="mcv-container mcv-topbar-inner">
        <ManuVolunteerBrandLogo
          tone={solid ? 'gold' : 'cream'}
          wrapClassName="mcv-logo-wrap--header"
        />
        <ManuVolunteerCtaButton
          variant="nav"
          className="mcv-topbar-cta"
          ctaLocation="header"
          ariaLabel={CTA_ARIA}
        >
          {CTA_VISIBLE}
        </ManuVolunteerCtaButton>
      </div>
    </header>
  )
}
