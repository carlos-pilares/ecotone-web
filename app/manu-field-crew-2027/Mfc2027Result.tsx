'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

import { trackMfc2027ResultView } from '@/lib/trackMfc2027Analytics'

import { ManuVolunteerResultHeader } from '../manu-conservation-volunteer/ManuVolunteerResultHeader'

import { Mfc2027ResultDepartures } from './Mfc2027ResultDepartures'
import { Mfc2027ResultHero } from './Mfc2027ResultHero'
import { MFC2027_SESSION_KEY, type Mfc2027SessionData } from './mfc2027-campaign'

function subscribeSession() {
  return () => {}
}

function getSessionRaw(): string | null {
  try {
    return sessionStorage.getItem(MFC2027_SESSION_KEY)
  } catch {
    return null
  }
}

function getServerSessionRaw(): string | null {
  return null
}

function parseSession(raw: string | null): Mfc2027SessionData | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    const record = parsed as Record<string, unknown>
    const travelTiming = typeof record.travelTiming === 'string' ? record.travelTiming.trim() : ''
    const groupSize = typeof record.groupSize === 'string' ? record.groupSize.trim() : ''
    const leadId = typeof record.leadId === 'string' ? record.leadId.trim() : ''
    if (!travelTiming && !groupSize && !leadId) return null
    return { travelTiming, groupSize, leadId }
  } catch {
    return null
  }
}

export function Mfc2027Result() {
  const raw = useSyncExternalStore(subscribeSession, getSessionRaw, getServerSessionRaw)
  const session = parseSession(raw)
  const resultViewTrackedRef = useRef(false)

  useEffect(() => {
    if (resultViewTrackedRef.current) return
    resultViewTrackedRef.current = true
    trackMfc2027ResultView({
      travel_timing: session?.travelTiming,
      group_size: session?.groupSize,
    })
  }, [session?.travelTiming, session?.groupSize])

  return (
    <div className="mcv-page mcv-result-page mfc2027-result-page">
      <ManuVolunteerResultHeader />
      <Mfc2027ResultHero />
      <Mfc2027ResultDepartures leadId={session?.leadId} />
    </div>
  )
}
