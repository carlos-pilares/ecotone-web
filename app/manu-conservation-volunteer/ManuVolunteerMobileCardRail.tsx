'use client'

import { type ReactNode } from 'react'

import { ManuVolunteerMobileHScrollRail } from './ManuVolunteerMobileHScrollRail'

export type ManuVolunteerMobileCardRailItem = {
  key: string
  title: ReactNode
  description: ReactNode
  image: ReactNode
  credit?: ReactNode
}

type ManuVolunteerMobileCardRailProps = {
  items: ManuVolunteerMobileCardRailItem[]
  controlsLabel: string
  listClassName?: string
  titleClassName?: string
  bodyClassName?: string
  railClassName?: string
  listAriaLabel?: string
}

/**
 * Shared mobile horizontal card rail — same DOM/classes as the fieldwork
 * “Biodiversity monitoring” carousel. Desktop layout comes from listClassName
 * grid rules at ≥900px (or ≥768px where configured).
 */
export function ManuVolunteerMobileCardRail({
  items,
  controlsLabel,
  listClassName,
  titleClassName = 'mcv-fieldwork-title',
  bodyClassName = 'mcv-fieldwork-caption',
  railClassName,
  listAriaLabel,
}: ManuVolunteerMobileCardRailProps) {
  return (
    <ManuVolunteerMobileHScrollRail controlsLabel={controlsLabel} className={railClassName}>
      <ul
        className={['mcv-fieldwork-support', 'mcv-mobile-hscroll', listClassName]
          .filter(Boolean)
          .join(' ')}
        {...(listAriaLabel ? { 'aria-label': listAriaLabel } : {})}
      >
        {items.map((item) => (
          <li key={item.key} className="mcv-fieldwork-card">
            <div className="mcv-fieldwork-card-media">
              <div className="mcv-fieldwork-image mcv-hscroll-card-media">{item.image}</div>
              <div className="mcv-fieldwork-copy">
                {item.credit ?? null}
                <h3 className={titleClassName}>{item.title}</h3>
                <p className={bodyClassName}>{item.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ManuVolunteerMobileHScrollRail>
  )
}
