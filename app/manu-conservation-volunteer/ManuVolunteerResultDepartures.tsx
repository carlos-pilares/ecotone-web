'use client'

import { useRef, useState, type MouseEvent } from 'react'

import { WonderJourneyCardImage } from '../wonder-beyond-the-wonder/WonderResponsiveImage'

import { ManuVolunteerResultDepartureCard } from './ManuVolunteerResultDepartureCard'
import { MCV_FIELDWORK_FEATURED } from './manu-volunteer-images'
import {
  canPersistFixedTravelDate,
  defaultSelectedDepartureKey,
  matchDepartureForTiming,
  type McvResultDeparture,
} from './mcv-result-shell'

export type ManuVolunteerResultDeparturesProps = {
  departures: McvResultDeparture[]
  travelTiming?: string
  leadId?: string
  discountPercent: number
  voucherCode: string
  durationLabel: string
  availabilityLabel: string
  originalPrice: string
  promoPrice: string
  programmeHeadline: string
  programmeSupport: string
  inclusionsLine: string
  placesNote: string
}

async function updateTravelDate(leadId: string, travelDate: string): Promise<boolean> {
  const res = await fetch('/api/enquiry/update-travel-date', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId, travelDate }),
  })
  if (!res.ok) return false
  const data = (await res.json()) as { ok?: boolean }
  return data.ok === true
}

export function ManuVolunteerResultDepartures({
  departures,
  travelTiming,
  leadId,
  discountPercent,
  voucherCode,
  durationLabel,
  availabilityLabel,
  originalPrice,
  promoPrice,
  programmeHeadline,
  programmeSupport,
  inclusionsLine,
  placesNote,
}: ManuVolunteerResultDeparturesProps) {
  const matched = matchDepartureForTiming(travelTiming, departures)
  // Visual default only — must not trigger Raw_Leads persistence.
  const [selectedKey, setSelectedKey] = useState(() =>
    defaultSelectedDepartureKey(travelTiming, departures),
  )
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [syncedTravelDate, setSyncedTravelDate] = useState('')
  const syncedTravelDateRef = useRef('')
  const inFlightKeyRef = useRef<string | null>(null)
  const inFlightPromiseRef = useRef<Promise<boolean> | null>(null)

  const selected = departures.find((d) => d.key === selectedKey) ?? departures[0]
  const matchedIsOther = matched?.kind === 'other'
  const selectedIsOther = selected?.kind === 'other'
  const selectedCanPersist = selected ? canPersistFixedTravelDate(selected) : false
  const selectedBookingUrl =
    selectedCanPersist && selected?.bookingUrl?.trim() ? selected.bookingUrl.trim() : ''

  /**
   * Persist TRAVEL DATE only after an explicit user action
   * (card click / booking CTA / retry). Never from mount or visual preselect.
   */
  async function syncFixedDepartureTravelDate(departure: McvResultDeparture): Promise<boolean> {
    if (!canPersistFixedTravelDate(departure)) {
      setUpdateError('')
      return false
    }
    const travelDate = departure.dateRange.trim()
    if (!travelDate) return false

    if (!leadId?.trim()) {
      setUpdateError('Your field dates could not be saved because this session is missing a lead ID.')
      return false
    }

    if (syncedTravelDateRef.current === travelDate) return true
    if (inFlightKeyRef.current === departure.key && inFlightPromiseRef.current) {
      return inFlightPromiseRef.current
    }

    inFlightKeyRef.current = departure.key
    setIsUpdating(true)
    setUpdateError('')

    const promise = (async () => {
      try {
        const ok = await updateTravelDate(leadId.trim(), travelDate)
        if (!ok) {
          setUpdateError('We couldn’t save your selected dates. Please try again.')
          return false
        }
        syncedTravelDateRef.current = travelDate
        setSyncedTravelDate(travelDate)
        return true
      } catch {
        setUpdateError('We couldn’t save your selected dates. Please try again.')
        return false
      } finally {
        if (inFlightKeyRef.current === departure.key) {
          inFlightKeyRef.current = null
          inFlightPromiseRef.current = null
        }
        setIsUpdating(false)
      }
    })()

    inFlightPromiseRef.current = promise
    return promise
  }

  async function onSelectDeparture(departure: McvResultDeparture) {
    setSelectedKey(departure.key)
    setUpdateError('')
    if (!canPersistFixedTravelDate(departure)) return
    await syncFixedDepartureTravelDate(departure)
  }

  async function onBookingClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!selected || !selectedBookingUrl || !canPersistFixedTravelDate(selected)) return
    event.preventDefault()
    // CTA click is an explicit user action even if the card was only visually preselected.
    const ok = await syncFixedDepartureTravelDate(selected)
    if (!ok) return
    window.open(selectedBookingUrl, '_blank', 'noopener,noreferrer')
  }

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
                  durationLabel={durationLabel}
                  availabilityLabel={availabilityLabel}
                  originalPrice={originalPrice}
                  promoPrice={promoPrice}
                  discountPercent={discountPercent}
                  voucherCode={voucherCode}
                  selected={item.key === selectedKey}
                  matched={matched?.key === item.key}
                  onSelect={() => {
                    void onSelectDeparture(item)
                  }}
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
                    aria-disabled={isUpdating}
                    onClick={(event) => {
                      void onBookingClick(event)
                    }}
                  >
                    {isUpdating ? 'Saving your dates…' : 'Explore this fixed departure'}
                    {!isUpdating ? (
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
                    ) : null}
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
                    : !selectedCanPersist
                      ? 'Exact dates for this departure are still being confirmed. TRAVEL DATE is not saved until dates are final.'
                      : selectedBookingUrl
                        ? isUpdating
                          ? 'Saving your selected field dates…'
                          : `Enter code ${voucherCode} on WeTravel to apply your ${discountPercent}% field offer.`
                        : 'WeTravel booking link for this departure is being finalised. Your field offer details are saved.'}
                </p>
                {updateError ? (
                  <p className="mcv-result-continue__error" role="alert">
                    {updateError}{' '}
                    {selected && canPersistFixedTravelDate(selected) ? (
                      <button
                        type="button"
                        className="mcv-result-continue__retry"
                        onClick={() => {
                          void syncFixedDepartureTravelDate(selected)
                        }}
                      >
                        Retry
                      </button>
                    ) : null}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
