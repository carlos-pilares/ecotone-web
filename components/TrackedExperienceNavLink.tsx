'use client'

import type { ReactNode } from 'react'

import {
  trackExperienceCardClickFromHref,
  type ExperienceCardClickSourceSection,
} from '@/lib/trackExperienceAnalytics'

type Props = {
  href: string
  experienceName: string
  sourceSection: ExperienceCardClickSourceSection
  route?: string
  programType?: string
  className?: string
  children: ReactNode
}

/** Experience mega-menu link with GA4 `experience_card_click` on navigate. */
export function TrackedExperienceNavLink({
  href,
  experienceName,
  sourceSection,
  route,
  programType,
  className,
  children,
}: Props) {
  return (
    <a
      href={href}
      className={className}
      onClick={() =>
        trackExperienceCardClickFromHref(href, {
          experience_name: experienceName,
          source_section: sourceSection,
          route,
          program_type: programType,
        })
      }
    >
      {children}
    </a>
  )
}
