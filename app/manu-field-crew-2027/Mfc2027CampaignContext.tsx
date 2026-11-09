'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import {
  isMfc2027CtaLocation,
  trackMfc2027ModalOpen,
  type Mfc2027CtaLocation,
} from '@/lib/trackMfc2027Analytics'

type Mfc2027CampaignContextValue = {
  isModalOpen: boolean
  openedFrom: Mfc2027CtaLocation | null
  formStarted: boolean
  markFormStarted: () => void
  openModal: (from: Mfc2027CtaLocation) => void
  closeModal: (method: 'backdrop' | 'close_button' | 'escape') => void
}

const Mfc2027CampaignContext = createContext<Mfc2027CampaignContextValue | null>(null)

export function useMfc2027Campaign(): Mfc2027CampaignContextValue {
  const ctx = useContext(Mfc2027CampaignContext)
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

export function Mfc2027CampaignProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openedFrom, setOpenedFrom] = useState<Mfc2027CtaLocation | null>(null)
  const [formStarted, setFormStarted] = useState(false)
  const formStartedRef = useRef(false)
  const isOpenRef = useRef(false)

  const markFormStarted = useCallback(() => {
    if (formStartedRef.current) return
    formStartedRef.current = true
    setFormStarted(true)
  }, [])

  const openModal = useCallback((from: Mfc2027CtaLocation) => {
    if (!isMfc2027CtaLocation(from)) return
    formStartedRef.current = false
    setOpenedFrom(from)
    setFormStarted(false)
    setIsModalOpen(true)
    isOpenRef.current = true
    trackMfc2027ModalOpen(from)
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
    <Mfc2027CampaignContext.Provider
      value={{ isModalOpen, openedFrom, formStarted, markFormStarted, openModal, closeModal }}
    >
      {children}
    </Mfc2027CampaignContext.Provider>
  )
}
