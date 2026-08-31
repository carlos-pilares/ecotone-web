'use client'

import { useState } from 'react'

import { WonderJourneyCardImage } from './WonderResponsiveImage'
import { WBTWVolunteerDepartureCard } from './WBTWVolunteerDepartureCard'
import { WBTW_WHY_CARD_IMAGES } from './wonder-images'
import type { WbtwVolunteerDeparture } from './wbtw-volunteer-result-shell'

export type WBTWVolunteerDeparturesProps = {
  departures: WbtwVolunteerDeparture[]
  originalPrice: string
  promoPrice: string
  discountPercent: number
}

function defaultSelectedKey(departures: WbtwVolunteerDeparture[]) {
  return departures.find((d) => d.recommended)?.key ?? departures[0]?.key ?? ''
}

export function WBTWVolunteerDepartures({
  departures,
  originalPrice,
  promoPrice,
  discountPercent,
}: WBTWVolunteerDeparturesProps) {
  const [selectedKey, setSelectedKey] = useState(() => defaultSelectedKey(departures))
  const selected = departures.find((d) => d.key === selectedKey) ?? departures[0]

  return (
    <section className="wbtw-vol-departures" aria-labelledby="wbtw-vol-departures-title">
      <div className="wbtw-vol-departures-head">
        <h2 id="wbtw-vol-departures-title" className="wbtw-vol-departures-title">
          Choose your field dates
        </h2>
        <p className="wbtw-vol-departures-intro">
          One 4-week programme. Three fixed departures.
        </p>
      </div>

      <div className="wbtw-vol-departures-layout">
        <div className="wbtw-vol-departures-visual">
          <WonderJourneyCardImage
            image={WBTW_WHY_CARD_IMAGES.impact}
            className="wbtw-vol-departures-img"
            sizes="(min-width: 900px) 58vw, 100vw"
          />
          <div className="wbtw-vol-departures-visual-copy">
            <p className="wbtw-vol-departures-visual-eyebrow">The programme</p>
            <p className="wbtw-vol-departures-visual-title">4 weeks in the Peruvian Amazon</p>
            <p className="wbtw-vol-departures-visual-support">
              Work alongside conservation teams in one of the world&apos;s most biodiverse
              landscapes.
            </p>
            <p className="wbtw-vol-departures-visual-inclusive">
              All-inclusive field experience*
            </p>
            <p className="wbtw-vol-departures-visual-pillars">
              Accommodation · Meals · Field activities · Programme support
            </p>
            <p className="wbtw-vol-departures-visual-note">Limited places per departure</p>
          </div>
        </div>

        <div className="wbtw-vol-departures-choices">
          <div
            className="wbtw-vol-departures-list"
            role="radiogroup"
            aria-labelledby="wbtw-vol-departures-title"
          >
            {departures.map((item) => (
              <div
                key={item.key}
                className={
                  item.recommended
                    ? 'wbtw-vol-departures-item wbtw-vol-departures-item--recommended'
                    : 'wbtw-vol-departures-item'
                }
              >
                <WBTWVolunteerDepartureCard
                  departure={item}
                  originalPrice={originalPrice}
                  promoPrice={promoPrice}
                  discountPercent={discountPercent}
                  selected={item.key === selectedKey}
                  onSelect={() => setSelectedKey(item.key)}
                />
              </div>
            ))}
          </div>

          {selected ? (
            <div className="wbtw-vol-continue">
              <button type="button" className="wbtw-vol-continue__cta">
                Explore the {selected.monthYear} programme
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  aria-hidden
                >
                  <line x1="2" y1="6" x2="10" y2="6" />
                  <polyline points="7 3 10 6 7 9" />
                </svg>
              </button>
              <p className="wbtw-vol-continue__note">
                See the full programme, what&apos;s included and how to join on WeTravel.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
