'use client'

import type { ReactNode } from 'react'

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

  return (
    <button
      type="button"
      className={`mcv-cta mcv-cta--${variant} ${className}`.trim()}
      aria-label={ariaLabel}
      onClick={() => openModal(ctaLocation)}
    >
      {children}
    </button>
  )
}
