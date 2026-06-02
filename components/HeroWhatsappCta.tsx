'use client'

import type { ReactNode } from 'react'

import { trackWhatsappClick } from '@/lib/trackWhatsappClick'

type HeroWhatsappCtaProps = {
  href: string
  className?: string
  children: ReactNode
}

export function HeroWhatsappCta({ href, className, children }: HeroWhatsappCtaProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackWhatsappClick({ button_location: 'hero' })}
    >
      {children}
    </a>
  )
}
