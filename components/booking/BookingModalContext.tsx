'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { BookExperienceModal } from '@/components/booking/BookExperienceModal'
import './booking-modal.css'
import { PlanJourneyModal } from '@/components/booking/PlanJourneyModal'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import type { BookingModalCopy } from '@/lib/bookingModalCopy'
import { defaultWhatsappNumber } from '@/lib/bookingWhatsapp'
import {
  bookNowContextFromSummary,
  trackBookNowClick,
  trackBookingModalOpen,
  type BookNowOpenSource,
} from '@/lib/trackBookNowClick'

type ModalState =
  | { kind: 'closed' }
  | { kind: 'plan'; source: BookNowOpenSource }
  | { kind: 'experience'; summary: ExperienceBookingSummary; source: BookNowOpenSource }

type BookingModalContextValue = {
  openPlanJourney: (source: BookNowOpenSource) => void
  openExperienceBooking: (summary: ExperienceBookingSummary, source: BookNowOpenSource) => void
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

  const openPlanJourney = useCallback((source: BookNowOpenSource) => {
    trackBookNowClick({
      button_location: source.button_location,
      ...(source.price ? { price: source.price } : {}),
      ...(source.promo_label ? { promo_label: source.promo_label } : {}),
    })
    setState({ kind: 'plan', source })
  }, [])

  const openExperienceBooking = useCallback((summary: ExperienceBookingSummary, source: BookNowOpenSource) => {
    trackBookNowClick(bookNowContextFromSummary(summary, source))
    setState({ kind: 'experience', summary, source })
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

  useEffect(() => {
    if (state.kind === 'closed') return
    if (state.kind === 'plan') {
      trackBookingModalOpen({ button_location: state.source.button_location })
      return
    }
    trackBookingModalOpen({
      button_location: state.source.button_location,
      experience_name: state.summary.experienceName,
      route: state.summary.route,
      program_type: state.summary.programType,
    })
  }, [state])

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      <BookingModalLayer state={state} waNumber={waNumber} copy={copy} onClose={close} />
    </BookingModalContext.Provider>
  )
}
