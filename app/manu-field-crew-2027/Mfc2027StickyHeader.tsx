'use client'

import { useEffect, useState } from 'react'

import { ManuVolunteerBrandLogo } from '../manu-conservation-volunteer/ManuVolunteerBrandLogo'

import { Mfc2027CtaLink } from './Mfc2027CtaLink'
import { MFC2027_CTA_SEE_DEPARTURES } from './mfc2027-campaign'

const CTA_ARIA = 'See 2027 Manu Field Crew departures'
const SCROLL_SOLID_AT = 40

export function Mfc2027StickyHeader() {
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
        <Mfc2027CtaLink
          variant="nav"
          className="mcv-topbar-cta"
          ctaLocation="header"
          ariaLabel={CTA_ARIA}
        >
          {MFC2027_CTA_SEE_DEPARTURES}
        </Mfc2027CtaLink>
      </div>
    </header>
  )
}
