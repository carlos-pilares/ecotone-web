'use client'

import type { ReactNode } from 'react'

import { useWonderCampaign } from './WonderCampaignContext'

type Props = {
  children?: ReactNode
  className?: string
  variant?: 'primary' | 'nav'
}

export function WonderCtaButton({ children, className = '', variant = 'primary' }: Props) {
  const { openModal } = useWonderCampaign()
  const label = children ?? 'Check my travel fit'

  return (
    <button type="button" className={`wbtw-cta wbtw-cta--${variant} ${className}`.trim()} onClick={openModal}>
      {label}
    </button>
  )
}
