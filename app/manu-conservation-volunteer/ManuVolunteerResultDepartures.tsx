'use client'

import { useState } from 'react'

import { WonderJourneyCardImage } from '../wonder-beyond-the-wonder/WonderResponsiveImage'

import { ManuVolunteerResultDepartureCard } from './ManuVolunteerResultDepartureCard'
import { MCV_FIELDWORK_FEATURED } from './manu-volunteer-images'
import {
  defaultSelectedDepartureKey,
  matchDepartureForTiming,
  type McvResultDeparture,
} from './mcv-result-shell'

export type ManuVolunteerResultDeparturesProps = {
  departures: McvResultDeparture[]
  travelTiming?: string
  discountPercent: number
  programmeHeadline: string
  programmeSupport: string
  inclusionsLine: string
  placesNote: string
}

export function ManuVolunteerResultDepartures({
  departures,
  travelTiming,
  discountPercent,
  programmeHeadline,
  programmeSupport,
  inclusionsLine,
  placesNote,
}: ManuVolunteerResultDeparturesProps) {
  const matched = matchDepartureForTiming(travelTiming, departures)
  const [selectedKey, setSelectedKey] = useState(() =>
    defaultSelectedDepartureKey(travelTiming, departures),
  )

  const selected = departures.find((d) => d.key === selectedKey) ?? departures[0]
  const matchedIsOther = matched?.kind === 'other'
  const selectedIsOther = selected?.kind === 'other'
  const selectedBookingUrl = selected?.bookingUrl?.trim() ?? ''

  return (
    <section className="mcv-result-departures" aria-labelledby="mcv-result-departures-title">
      <div className="mcv-container">
        <div className="mcv-result-departures-head">
          <h2 id="mcv-result-departures-title" className="mcv-section-title">
            Choose your field dates
          </h2>
          <p className="mcv-result-departures-intro">
            Choose one of the fixed 2026 field departures included in your offer, or ask about
            other dates.
          </p>
          {matchedIsOther ? (
            <p className="mcv-result-departures-timing-note" role="status">
              Based on your preferred timing, alternative dates may be the better fit. Your 30%
              offer applies to the selected 2026 promotional departures above.
            </p>
          ) : null}
        </div>

        <div className="mcv-result-departures-layout">
          <article className="mcv-result-programme">
            <div className="mcv-result-programme-media">
              <WonderJourneyCardImage
                image={MCV_FIELDWORK_FEATURED}
                className="mcv-result-programme-img"
                sizes="(min-width: 900px) 52vw, 100vw"
              />
            </div>
            <div className="mcv-result-programme-copy">
              <p className="mcv-result-programme-eyebrow">The programme</p>
              <h3 className="mcv-result-programme-title">{programmeHeadline}</h3>
              <p className="mcv-result-programme-support">{programmeSupport}</p>
              <p className="mcv-result-programme-inclusions">{inclusionsLine}</p>
              <p className="mcv-result-programme-note">{placesNote}</p>
            </div>
          </article>

          <div className="mcv-result-departures-choices">
            <div
              className="mcv-result-departures-list"
              role="radiogroup"
              aria-labelledby="mcv-result-departures-title"
            >
              {departures.map((item) => (
                <ManuVolunteerResultDepartureCard
                  key={item.key}
                  departure={item}
                  discountPercent={discountPercent}
                  selected={item.key === selectedKey}
                  matched={matched?.key === item.key}
                  onSelect={() => setSelectedKey(item.key)}
                />
              ))}
            </div>

            {selected ? (
              <div className="mcv-result-continue">
                {selectedIsOther ? (
                  <button
                    type="button"
                    className="mcv-cta mcv-cta--prominent mcv-result-continue__cta"
                  >
                    Enquire about other dates
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
                ) : selectedBookingUrl ? (
                  <a
                    href={selectedBookingUrl}
                    className="mcv-cta mcv-cta--prominent mcv-result-continue__cta"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore this fixed departure
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
                  </a>
                ) : (
                  <button
                    type="button"
                    className="mcv-cta mcv-cta--prominent mcv-result-continue__cta"
                    disabled
                    aria-disabled="true"
                  >
                    Explore this fixed departure
                  </button>
                )}
                <p className="mcv-result-continue__note">
                  {selectedIsOther
                    ? 'Standard rate applies. Availability must be confirmed before any booking can proceed.'
                    : selectedBookingUrl
                      ? "See the full programme, what's included and how to join on WeTravel."
                      : 'WeTravel booking link for this departure is being finalised. Your field offer details are saved.'}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
