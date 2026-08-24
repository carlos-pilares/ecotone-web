'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

export type McvCtaLocation =
  | 'header'
  | 'hero'
  | 'fieldwork'
  | 'reasons'
  | 'enjoy'
  | 'science'
  | 'opportunity'
  | 'how_it_works'
  | 'footer'

type ManuVolunteerCampaignContextValue = {
  isModalOpen: boolean
  openedFrom: McvCtaLocation | null
  openModal: (from: McvCtaLocation) => void
  closeModal: (method: 'backdrop' | 'close_button' | 'escape') => void
}

const ManuVolunteerCampaignContext = createContext<ManuVolunteerCampaignContextValue | null>(null)

export function useManuVolunteerCampaign(): ManuVolunteerCampaignContextValue {
  const ctx = useContext(ManuVolunteerCampaignContext)
  if (!ctx) {
    return {
      isModalOpen: false,
      openedFrom: null,
      openModal: () => {},
      closeModal: () => {},
    }
  }
  return ctx
}

export function ManuVolunteerCampaignProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openedFrom, setOpenedFrom] = useState<McvCtaLocation | null>(null)
  const isOpenRef = useRef(false)

  const openModal = useCallback((from: McvCtaLocation) => {
    setOpenedFrom(from)
    setIsModalOpen(true)
    isOpenRef.current = true
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
    <ManuVolunteerCampaignContext.Provider value={{ isModalOpen, openedFrom, openModal, closeModal }}>
      {children}
    </ManuVolunteerCampaignContext.Provider>
  )
}
