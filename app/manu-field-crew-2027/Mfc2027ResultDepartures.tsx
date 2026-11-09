'use client'

import { useRef, useState, type MouseEvent } from 'react'

import {
  openMfc2027WeTravelBooking,
  trackMfc2027BookCallClick,
  trackMfc2027DepartureSelect,
  trackMfc2027FullProgrammeClick,
} from '@/lib/trackMfc2027Analytics'

import { WonderJourneyCardImage } from '../wonder-beyond-the-wonder/WonderResponsiveImage'
import { MCV_FIELDWORK_FEATURED } from '../manu-conservation-volunteer/manu-volunteer-images'

import { Mfc2027DepartureCard } from './Mfc2027DepartureCard'
import {
  formatMfc2027CompactDateLine,
  getMfc2027FeaturedDepartures,
  getMfc2027RemainingDepartures,
  getMfc2027WeTravelUrl,
  MFC2027_CALENDLY_URL,
  MFC2027_CTA_BOOK_CALL,
  MFC2027_CTA_VIEW_PROGRAMME_BOOK,
  MFC2027_DURATION_DETAIL,
  MFC2027_DURATION_LABEL,
  MFC2027_EXPLORE_CV_LABEL,
  MFC2027_FULL_PROGRAMME_PATH,
  MFC2027_LOCATION,
  MFC2027_PROMO_CODE,
  type Mfc2027Departure,
} from './mfc2027-campaign'

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

export function Mfc2027ResultDepartures({ leadId }: { leadId?: string }) {
  const featured = getMfc2027FeaturedDepartures()
  const remaining = getMfc2027RemainingDepartures()
  const [selectedKey, setSelectedKey] = useState<string | null>(featured[0]?.key ?? null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const syncedTravelDateRef = useRef('')
  const inFlightKeyRef = useRef<string | null>(null)
  const inFlightPromiseRef = useRef<Promise<boolean> | null>(null)

  const selected = featured.find((d) => d.key === selectedKey) ?? null
  const bookingUrl = getMfc2027WeTravelUrl(selected ?? undefined)

  async function syncFixedDepartureTravelDate(departure: Mfc2027Departure): Promise<boolean> {
    const travelDate = departure.dateRange.trim()
    if (!travelDate) return false

    if (!leadId?.trim()) {
      // No session lead — selection still works for WeTravel; skip sheet update.
      setUpdateError('')
      return true
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

  async function onSelectDeparture(departure: Mfc2027Departure) {
    setSelectedKey(departure.key)
    setUpdateError('')
    trackMfc2027DepartureSelect(departure)
    await syncFixedDepartureTravelDate(departure)
  }

  async function onBookingClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    if (selected) {
      await syncFixedDepartureTravelDate(selected)
    }
    openMfc2027WeTravelBooking(selected, bookingUrl)
  }

  return (
    <section
      className="mcv-result-departures mfc2027-booking"
      aria-labelledby="mfc2027-departures-title"
    >
      <div className="mcv-container">
        <div className="mcv-result-departures-head">
          <h2 id="mfc2027-departures-title" className="mcv-section-title">
            Choose your 2027 start date
          </h2>
          <p className="mcv-result-departures-intro">
            Select a preferred fixed Monday departure, then continue to WeTravel to review the full
            programme and secure your place.
          </p>
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
              <h3 className="mcv-result-programme-title">4 weeks in the Peruvian Amazon</h3>
              <p className="mcv-result-programme-support">
                {MFC2027_LOCATION} · {MFC2027_DURATION_LABEL} · {MFC2027_DURATION_DETAIL}
              </p>
              <p className="mcv-result-programme-inclusions">
                Conservation fieldwork, rainforest immersion, and life at a working research
                station — with fixed Monday departures throughout 2027.
              </p>
              <p className="mcv-result-programme-note">
                Places are confirmed in order of booking and are subject to availability. Use code{' '}
                {MFC2027_PROMO_CODE} on WeTravel.
              </p>
            </div>
          </article>

          <div className="mcv-result-departures-choices">
            <div
              className="mcv-result-departures-list"
              role="radiogroup"
              aria-labelledby="mfc2027-departures-title"
            >
              {featured.map((departure) => (
                <Mfc2027DepartureCard
                  key={departure.key}
                  departure={departure}
                  selected={departure.key === selectedKey}
                  onSelect={() => {
                    void onSelectDeparture(departure)
                  }}
                />
              ))}
            </div>

            <div className="mcv-result-continue mfc2027-book-primary">
              <a
                href={bookingUrl}
                className="mcv-cta mcv-cta--prominent mcv-result-continue__cta mfc2027-cta-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={isUpdating}
                onClick={(event) => {
                  void onBookingClick(event)
                }}
              >
                {isUpdating ? 'Saving your dates…' : MFC2027_CTA_VIEW_PROGRAMME_BOOK}
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
              <p className="mcv-result-continue__note">
                See the full day-by-day itinerary, live availability and secure your place on
                WeTravel.
              </p>
              {updateError ? (
                <p className="mcv-result-continue__error" role="alert">
                  {updateError}{' '}
                  {selected ? (
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

            <details className="mfc2027-all-dates">
              <summary className="mfc2027-all-dates__summary">View all 2027 dates</summary>
              <p className="mfc2027-all-dates__intro">
                2027 departures run every four weeks from January to December.
              </p>
              <ul className="mfc2027-all-dates__list">
                {remaining.map((departure) => (
                  <li key={departure.key} className="mfc2027-all-dates__row">
                    <span className="mfc2027-all-dates__month">{departure.monthLabel}</span>
                    <span className="mfc2027-all-dates__range">
                      {formatMfc2027CompactDateLine(departure)}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>

        <div className="mfc2027-aftercare">
          <aside className="mfc2027-assistance" aria-labelledby="mfc2027-assistance-title">
            <h3 id="mfc2027-assistance-title" className="mfc2027-assistance__title">
              Need help choosing?
            </h3>
            <p className="mfc2027-assistance__body">
              Book a short call if you have a specific question before booking.
            </p>
            <a
              href={MFC2027_CALENDLY_URL}
              className="mfc2027-assistance__cta"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackMfc2027BookCallClick()}
            >
              {MFC2027_CTA_BOOK_CALL}
            </a>
          </aside>

          <p className="mfc2027-programme-alt">
            <span className="mfc2027-programme-alt__question">
              Looking for another programme length?
            </span>
            <a
              href={MFC2027_FULL_PROGRAMME_PATH}
              className="mfc2027-programme-alt__link"
              onClick={() =>
                trackMfc2027FullProgrammeClick({ cta_location: 'result_programme_alt' })
              }
            >
              {MFC2027_EXPLORE_CV_LABEL}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
