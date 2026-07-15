'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

import {
  isWbtwCtaLocation,
  trackWbtwModalClose,
  trackWbtwModalOpen,
  type WbtwCloseMethod,
  type WbtwCtaLocation,
} from '@/lib/trackWonderBeyondAnalytics'

type WonderCampaignContextValue = {
  isModalOpen: boolean
  openedFrom: WbtwCtaLocation | null
  formStarted: boolean
  markFormStarted: () => void
  openModal: (from: WbtwCtaLocation) => void
  closeModal: (method: WbtwCloseMethod) => void
}

const WonderCampaignContext = createContext<WonderCampaignContextValue | null>(null)

export function useWonderCampaign(): WonderCampaignContextValue {
  const ctx = useContext(WonderCampaignContext)
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

export function WonderCampaignProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openedFrom, setOpenedFrom] = useState<WbtwCtaLocation | null>(null)
  const [formStarted, setFormStarted] = useState(false)
  const formStartedRef = useRef(false)
  const openedFromRef = useRef<WbtwCtaLocation | null>(null)
  const isOpenRef = useRef(false)

  const markFormStarted = useCallback(() => {
    if (formStartedRef.current) return
    formStartedRef.current = true
    setFormStarted(true)
  }, [])

  const openModal = useCallback((from: WbtwCtaLocation) => {
    // Require a valid CTA location so origin_cta_location is never empty / "(not set)".
    if (!isWbtwCtaLocation(from)) return
    openedFromRef.current = from
    formStartedRef.current = false
    setOpenedFrom(from)
    setFormStarted(false)
    setIsModalOpen(true)
    isOpenRef.current = true
    trackWbtwModalOpen(from)
  }, [])

  const closeModal = useCallback((method: WbtwCloseMethod) => {
    if (!isOpenRef.current) return
    trackWbtwModalClose({
      close_method: method,
      opened_from: openedFromRef.current,
      form_started: formStartedRef.current,
    })
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
    <WonderCampaignContext.Provider
      value={{ isModalOpen, openedFrom, formStarted, markFormStarted, openModal, closeModal }}
    >
      {children}
    </WonderCampaignContext.Provider>
  )
}
