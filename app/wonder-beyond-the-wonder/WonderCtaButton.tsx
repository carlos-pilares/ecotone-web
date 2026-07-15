'use client'

import type { ReactNode } from 'react'

import {
  isWbtwCtaLocation,
  trackWbtwCtaClick,
  type WbtwCtaLocation,
} from '@/lib/trackWonderBeyondAnalytics'

import { useWonderCampaign } from './WonderCampaignContext'

type Props = {
  children?: ReactNode
  className?: string
  variant?: 'primary' | 'nav'
  ctaLocation: WbtwCtaLocation
}

export function WonderCtaButton({
  children,
  className = '',
  variant = 'primary',
  ctaLocation,
}: Props) {
  const { openModal } = useWonderCampaign()
  const label = typeof children === 'string' ? children : 'Check my travel fit'

  return (
    <button
      type="button"
      className={`wbtw-cta wbtw-cta--${variant} ${className}`.trim()}
      onClick={() => {
        if (!isWbtwCtaLocation(ctaLocation)) return
        trackWbtwCtaClick({
          cta_label: label,
          cta_location: ctaLocation,
        })
        openModal(ctaLocation)
      }}
    >
      {children ?? 'Check my travel fit'}
    </button>
  )
}
