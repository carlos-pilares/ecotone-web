'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { BookExperienceModal } from '@/components/booking/BookExperienceModal'
import './booking-modal.css'
import { PlanJourneyModal } from '@/components/booking/PlanJourneyModal'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import type { BookingModalCopy } from '@/lib/bookingModalCopy'
import { defaultWhatsappNumber } from '@/lib/bookingWhatsapp'

type ModalState =
  | { kind: 'closed' }
  | { kind: 'plan' }
  | { kind: 'experience'; summary: ExperienceBookingSummary }

type BookingModalContextValue = {
  openPlanJourney: () => void
  openExperienceBooking: (summary: ExperienceBookingSummary) => void
  close: () => void
}

const BookingModalContext = createContext<BookingModalContextValue | null>(null)

export function useBookingModal(): BookingModalContextValue {
  const v = useContext(BookingModalContext)
  if (!v) {
    return {
      openPlanJourney: () => {},
      openExperienceBooking: () => {},
      close: () => {},
    }
  }
  return v
}

function BookingModalLayer({
  state,
  waNumber,
  copy,
  onClose,
}: {
  state: ModalState
  waNumber: string
  copy: BookingModalCopy
  onClose: () => void
}) {
  if (state.kind === 'closed') return null
  if (state.kind === 'plan') return <PlanJourneyModal waNumber={waNumber} copy={copy.plan} onClose={onClose} />
  return <BookExperienceModal waNumber={waNumber} copy={copy.experience} summary={state.summary} onClose={onClose} />
}

export function BookingModalProvider({
  children,
  defaultWhatsappUrl,
  copy,
}: {
  children: ReactNode
  defaultWhatsappUrl: string | null
  copy: BookingModalCopy
}) {
  const [state, setState] = useState<ModalState>({ kind: 'closed' })
  const waNumber = useMemo(() => defaultWhatsappNumber(defaultWhatsappUrl), [defaultWhatsappUrl])

  const close = useCallback(() => setState({ kind: 'closed' }), [])

  const openPlanJourney = useCallback(() => {
    setState({ kind: 'plan' })
  }, [])

  const openExperienceBooking = useCallback((summary: ExperienceBookingSummary) => {
    setState({ kind: 'experience', summary })
  }, [])

  const value = useMemo(
    () => ({
      openPlanJourney,
      openExperienceBooking,
      close,
    }),
    [openPlanJourney, openExperienceBooking, close],
  )

  useEffect(() => {
    if (state.kind === 'closed') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [state.kind])

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      <BookingModalLayer state={state} waNumber={waNumber} copy={copy} onClose={close} />
    </BookingModalContext.Provider>
  )
}
