'use client'

import { useSyncExternalStore } from 'react'

import { ManuVolunteerCampaignFooter } from './ManuVolunteerCampaignFooter'
import { ManuVolunteerResultDepartures } from './ManuVolunteerResultDepartures'
import { ManuVolunteerResultHero } from './ManuVolunteerResultHero'
import { ManuVolunteerResultReady } from './ManuVolunteerResultReady'
import { ManuVolunteerResultTerms } from './ManuVolunteerResultTerms'
import { ManuVolunteerResultWhy } from './ManuVolunteerResultWhy'
import {
  MCV_QUALIFICATION_STORAGE_KEY,
  MCV_RESULT_DEPARTURES,
  MCV_RESULT_SHELL,
  type McvQualificationData,
} from './mcv-result-shell'

import './mcv-result.css'

/** No live subscription — modal writes storage then navigates; result remounts fresh. */
function subscribeQualification() {
  return () => {}
}

/** Stable primitive snapshot for useSyncExternalStore (must not return a new object each call). */
function getQualificationRaw(): string | null {
  try {
    return sessionStorage.getItem(MCV_QUALIFICATION_STORAGE_KEY)
  } catch {
    return null
  }
}

function getServerQualificationRaw(): string | null {
  return null
}

function parseQualification(raw: string | null): McvQualificationData | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    const record = parsed as Record<string, unknown>
    const travelTiming = typeof record.travelTiming === 'string' ? record.travelTiming.trim() : ''
    const groupSize = typeof record.groupSize === 'string' ? record.groupSize.trim() : ''
    const leadId = typeof record.leadId === 'string' ? record.leadId.trim() : ''
    if (!travelTiming && !groupSize) return null
    return { travelTiming, groupSize, ...(leadId ? { leadId } : {}) }
  } catch {
    return null
  }
}

export function ManuVolunteerResult() {
  const shell = MCV_RESULT_SHELL
  const raw = useSyncExternalStore(
    subscribeQualification,
    getQualificationRaw,
    getServerQualificationRaw,
  )
  const qualification = parseQualification(raw)

  return (
    <div className="mcv-page mcv-result-page">
      <ManuVolunteerResultHero
        discountPercent={shell.discountPercent}
        couponCode={shell.voucherCode}
        durationLabel={shell.durationLabel}
        availabilityLabel={shell.availabilityLabel}
        offerScopeLine={shell.offerScopeLine}
      />
      <ManuVolunteerResultDepartures
        key={qualification?.travelTiming || 'no-timing'}
        departures={MCV_RESULT_DEPARTURES}
        travelTiming={qualification?.travelTiming}
        discountPercent={shell.discountPercent}
        voucherCode={shell.voucherCode}
        durationLabel={shell.durationLabel}
        availabilityLabel={shell.availabilityLabel}
        originalPrice={shell.originalPrice}
        promoPrice={shell.promoPrice}
        programmeHeadline={shell.programmeHeadline}
        programmeSupport={shell.programmeSupport}
        inclusionsLine={shell.inclusionsLine}
        placesNote={shell.placesNote}
      />
      <ManuVolunteerResultWhy />
      <ManuVolunteerResultReady couponCode={shell.voucherCode} />
      <ManuVolunteerResultTerms />
      <ManuVolunteerCampaignFooter />
    </div>
  )
}
