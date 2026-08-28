'use client'

import type { ReactNode } from 'react'

import { isMcvCtaLocation, trackMcvCtaClick } from '@/lib/trackMcvAnalytics'

import { useManuVolunteerCampaign, type McvCtaLocation } from './ManuVolunteerCampaignContext'

type Props = {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'nav' | 'prominent'
  ctaLocation: McvCtaLocation
  /** Full label for screen readers when visible text is shortened */
  ariaLabel?: string
}

export function ManuVolunteerCtaButton({
  children,
  className = '',
  variant = 'primary',
  ctaLocation,
  ariaLabel,
}: Props) {
  const { openModal } = useManuVolunteerCampaign()
  const label = typeof children === 'string' ? children : ariaLabel ?? 'Join the Manu Field Crew'

  return (
    <button
      type="button"
      className={`mcv-cta mcv-cta--${variant} ${className}`.trim()}
      aria-label={ariaLabel}
      onClick={() => {
        if (!isMcvCtaLocation(ctaLocation)) return
        trackMcvCtaClick({
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
