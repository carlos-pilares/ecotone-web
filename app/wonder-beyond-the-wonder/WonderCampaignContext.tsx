'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

type WonderCampaignContextValue = {
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const WonderCampaignContext = createContext<WonderCampaignContextValue | null>(null)

export function useWonderCampaign(): WonderCampaignContextValue {
  const ctx = useContext(WonderCampaignContext)
  if (!ctx) {
    return { isModalOpen: false, openModal: () => {}, closeModal: () => {} }
  }
  return ctx
}

export function WonderCampaignProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

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
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isModalOpen, closeModal])

  return (
    <WonderCampaignContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </WonderCampaignContext.Provider>
  )
}
