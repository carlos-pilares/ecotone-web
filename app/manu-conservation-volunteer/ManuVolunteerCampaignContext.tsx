'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

import {
  isMcvCtaLocation,
  trackMcvModalOpen,
  type McvCtaLocation,
} from '@/lib/trackMcvAnalytics'

type ManuVolunteerCampaignContextValue = {
  isModalOpen: boolean
  openedFrom: McvCtaLocation | null
  formStarted: boolean
  markFormStarted: () => void
  openModal: (from: McvCtaLocation) => void
  closeModal: (method: 'backdrop' | 'close_button' | 'escape') => void
}

const ManuVolunteerCampaignContext = createContext<ManuVolunteerCampaignContextValue | null>(null)

export type { McvCtaLocation }

export function useManuVolunteerCampaign(): ManuVolunteerCampaignContextValue {
  const ctx = useContext(ManuVolunteerCampaignContext)
  if (!ctx) {
    return {
      isModalOpen: false,
      openedFrom: null,
      formStarted: false,
      markFormStarted: () => {},
      openModal: () => {},
      closeModal: () => {},
    }
  }
  return ctx
}

export function ManuVolunteerCampaignProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openedFrom, setOpenedFrom] = useState<McvCtaLocation | null>(null)
  const [formStarted, setFormStarted] = useState(false)
  const formStartedRef = useRef(false)
  const openedFromRef = useRef<McvCtaLocation | null>(null)
  const isOpenRef = useRef(false)

  const markFormStarted = useCallback(() => {
    if (formStartedRef.current) return
    formStartedRef.current = true
    setFormStarted(true)
  }, [])

  const openModal = useCallback((from: McvCtaLocation) => {
    if (!isMcvCtaLocation(from)) return
    openedFromRef.current = from
    formStartedRef.current = false
    setOpenedFrom(from)
    setFormStarted(false)
    setIsModalOpen(true)
    isOpenRef.current = true
    trackMcvModalOpen(from)
  }, [])

  const closeModal = useCallback((_method: 'backdrop' | 'close_button' | 'escape') => {
    if (!isOpenRef.current) return
    isOpenRef.current = false
    setIsModalOpen(false)
  }, [])

  useEffect(() => {
    if (!isModalOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isModalOpen])

  useEffect(() => {
    if (!isModalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal('escape')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isModalOpen, closeModal])

  return (
    <ManuVolunteerCampaignContext.Provider
      value={{ isModalOpen, openedFrom, formStarted, markFormStarted, openModal, closeModal }}
    >
      {children}
    </ManuVolunteerCampaignContext.Provider>
  )
}
