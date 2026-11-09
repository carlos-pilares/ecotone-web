'use client'

import type { ReactNode } from 'react'

import {
  isMfc2027CtaLocation,
  trackMfc2027CtaClick,
  type Mfc2027CtaLocation,
} from '@/lib/trackMfc2027Analytics'

import { useMfc2027Campaign } from './Mfc2027CampaignContext'
import { MFC2027_CTA_SEE_DEPARTURES } from './mfc2027-campaign'

type Props = {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'nav' | 'prominent'
  ctaLocation: Mfc2027CtaLocation
  ariaLabel?: string
}

/** Landing CTA → opens 2027 lead-capture modal (not a direct result link). */
export function Mfc2027CtaLink({
  children,
  className = '',
  variant = 'primary',
  ctaLocation,
  ariaLabel,
}: Props) {
  const { openModal } = useMfc2027Campaign()
  const label =
    typeof children === 'string' ? children : ariaLabel ?? MFC2027_CTA_SEE_DEPARTURES

  return (
    <button
      type="button"
      className={`mcv-cta mcv-cta--${variant} mfc2027-cta-link ${className}`.trim()}
      aria-label={ariaLabel}
      onClick={() => {
        if (!isMfc2027CtaLocation(ctaLocation)) return
        trackMfc2027CtaClick({
          cta_label: label,
          cta_location: ctaLocation,
        })
        openModal(ctaLocation)
      }}
    >
      {children}
    </button>
  )
}
