'use client'

import { usePathname } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { BookExperienceModal } from '@/components/booking/BookExperienceModal'
import './booking-modal.css'
import { PlanJourneyModal } from '@/components/booking/PlanJourneyModal'
import type { ExperienceBookingSummary } from '@/components/booking/types'
import type { BookingModalCopy } from '@/lib/bookingModalCopy'
import {
  buildBookFormSearch,
  buildClearModalSearch,
  buildModalOpenSearch,
  buildPlanStepSearch,
  buildThankYouSearch,
  DEFAULT_PLAN_JOURNEY_STEP,
  getBookingModalPageContext,
  hrefFromPathAndSearch,
  parseModalUrl,
  type BookingEnquiryIntent,
  type ContactChannelSlug,
  type ParsedModalUrl,
  type PlanJourneyStepSlug,
} from '@/lib/bookingModalUrl'
import { trackEmailConversionSuccess } from '@/lib/conversionAnalytics'
import { CTA_IDS } from '@/lib/ctaIds'
import { defaultWhatsappNumber } from '@/lib/bookingWhatsapp'
import {
  bookNowContextFromSummary,
  trackBookNowClick,
  trackBookingModalOpen,
  type BookNowOpenSource,
} from '@/lib/trackBookNowClick'

type ModalPhase = 'form' | 'thank-you'

type ModalState =
  | { kind: 'closed' }
  | {
      kind: 'plan'
      source: BookNowOpenSource
      phase: ModalPhase
      step: PlanJourneyStepSlug
      channel: ContactChannelSlug | null
    }
  | {
      kind: 'experience'
      summary: ExperienceBookingSummary
      source: BookNowOpenSource
      phase: ModalPhase
      channel: ContactChannelSlug | null
    }

type BookingModalContextValue = {
  openPlanJourney: (source: BookNowOpenSource) => void
  openExperienceBooking: (summary: ExperienceBookingSummary, source: BookNowOpenSource) => void
  close: () => void
}

const BookingModalContext = createContext<BookingModalContextValue | null>(null)

const DEFAULT_PLAN_SOURCE: BookNowOpenSource = {
  cta_id: CTA_IDS.HEADER_BOOK_NOW,
  button_location: 'header',
}

type ModalHistoryState = {
  ecotoneBookingModal?: boolean
  depth?: number
}

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
  onPlanEmailThankYou,
  onExperienceEmailThankYou,
  onPlanStepAdvance,
  onPlanStepBack,
  onPlanChannelSelect,
  onExperienceChannelSelect,
}: {
  state: ModalState
  waNumber: string
  copy: BookingModalCopy
  onClose: () => void
  onPlanEmailThankYou: () => void
  onExperienceEmailThankYou: () => void
  onPlanStepAdvance: (step: PlanJourneyStepSlug) => void
  onPlanStepBack: () => void
  onPlanChannelSelect: (channel: ContactChannelSlug) => void
  onExperienceChannelSelect: (channel: ContactChannelSlug) => void
}) {
  if (state.kind === 'closed') return null
  if (state.kind === 'plan') {
    return (
      <PlanJourneyModal
        waNumber={waNumber}
        copy={copy.plan}
        onClose={onClose}
        thankYouPhase={state.phase === 'thank-you'}
        onEmailThankYou={onPlanEmailThankYou}
        planStep={state.phase === 'form' ? state.step : DEFAULT_PLAN_JOURNEY_STEP}
        contactChannel={state.phase === 'form' && state.step === 'contact' ? state.channel : null}
        onPlanStepAdvance={onPlanStepAdvance}
        onPlanStepBack={onPlanStepBack}
        onContactChannelSelect={onPlanChannelSelect}
      />
    )
  }
  return (
    <BookExperienceModal
      waNumber={waNumber}
      copy={copy.experience}
      summary={state.summary}
      onClose={onClose}
      thankYouPhase={state.phase === 'thank-you'}
      onEmailThankYou={onExperienceEmailThankYou}
      contactChannel={state.phase === 'form' ? state.channel : null}
      onContactChannelSelect={onExperienceChannelSelect}
    />
  )
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
  const pathname = usePathname() ?? '/'
  const [state, setState] = useState<ModalState>({ kind: 'closed' })
  const waNumber = useMemo(() => defaultWhatsappNumber(defaultWhatsappUrl), [defaultWhatsappUrl])

  const modalHistoryDepth = useRef(0)
  const modalHistoryPushes = useRef(0)
  const closingHistorySteps = useRef(0)
  const activeModalRef = useRef<ModalState>({ kind: 'closed' })
  /** Set only after a successful email submit in the current modal session. */
  const thankYouEligibleRef = useRef(false)

  useEffect(() => {
    activeModalRef.current = state
  }, [state])

  const stripModalParamsFromUrl = useCallback(() => {
    const cleared = buildClearModalSearch(window.location.search.replace(/^\?/, ''))
    const href = hrefFromPathAndSearch(window.location.pathname, cleared)
    window.history.replaceState(window.history.state, '', href)
  }, [])

  const rejectUnauthorizedThankYou = useCallback(
    (parsed: ParsedModalUrl): boolean => {
      if (parsed.status !== 'open' || !('thankYou' in parsed) || !parsed.thankYou) return false
      if (thankYouEligibleRef.current) return false
      stripModalParamsFromUrl()
      setState({ kind: 'closed' })
      return true
    },
    [stripModalParamsFromUrl],
  )

  const pushModalUrl = useCallback((search: string) => {
    const nextDepth = modalHistoryDepth.current + 1
    modalHistoryDepth.current = nextDepth
    modalHistoryPushes.current = nextDepth
    const href = hrefFromPathAndSearch(window.location.pathname, search)
    const historyState: ModalHistoryState = { ecotoneBookingModal: true, depth: nextDepth }
    window.history.pushState(historyState, '', href)
  }, [])

  const syncStateFromUrl = useCallback(() => {
    const currentPath = window.location.pathname
    const currentSearch = window.location.search.replace(/^\?/, '')
    const parsed = parseModalUrl(currentPath, currentSearch)
    const active = activeModalRef.current

    if (rejectUnauthorizedThankYou(parsed)) return

    if (parsed.status === 'closed') {
      setState({ kind: 'closed' })
      return
    }

    if (parsed.status === 'open' && 'form' in parsed && parsed.form === 'plan' && 'step' in parsed) {
      if (active.kind === 'plan') {
        setState({ ...active, phase: 'form', step: parsed.step, channel: parsed.channel })
        return
      }
      setState({
        kind: 'plan',
        source: DEFAULT_PLAN_SOURCE,
        phase: 'form',
        step: parsed.step,
        channel: parsed.channel,
      })
      return
    }

    if (parsed.status === 'open' && 'form' in parsed && parsed.form === 'book') {
      if (active.kind === 'experience') {
        setState({ ...active, phase: 'form', channel: parsed.channel })
        return
      }
      return
    }

    if (parsed.status === 'open' && 'thankYou' in parsed && parsed.thankYou) {
      if (parsed.intent === 'plan' && active.kind === 'plan') {
        setState({ ...active, phase: 'thank-you' })
        return
      }
      if (parsed.intent === 'book' && active.kind === 'experience') {
        setState({ ...active, phase: 'thank-you' })
        return
      }
      if (parsed.intent === 'plan') {
        setState({
          kind: 'plan',
          source: DEFAULT_PLAN_SOURCE,
          phase: 'thank-you',
          step: DEFAULT_PLAN_JOURNEY_STEP,
          channel: parsed.channel,
        })
        return
      }
    }
  }, [rejectUnauthorizedThankYou])

  const close = useCallback(() => {
    thankYouEligibleRef.current = false
    const pushes = modalHistoryPushes.current
    modalHistoryDepth.current = 0
    modalHistoryPushes.current = 0
    setState({ kind: 'closed' })
    if (pushes > 0) {
      closingHistorySteps.current = pushes
      window.history.go(-pushes)
    }
  }, [])

  const openPlanJourney = useCallback(
    (source: BookNowOpenSource) => {
      thankYouEligibleRef.current = false
      trackBookNowClick({
        cta_id: source.cta_id,
        source: source.source,
        button_location: source.button_location,
        ...(source.price ? { price: source.price } : {}),
        ...(source.promo_label ? { promo_label: source.promo_label } : {}),
      })
      setState({
        kind: 'plan',
        source,
        phase: 'form',
        step: DEFAULT_PLAN_JOURNEY_STEP,
        channel: null,
      })
      pushModalUrl(buildModalOpenSearch(window.location.pathname, window.location.search, 'plan'))
    },
    [pushModalUrl],
  )

  const openExperienceBooking = useCallback(
    (summary: ExperienceBookingSummary, source: BookNowOpenSource) => {
      thankYouEligibleRef.current = false
      trackBookNowClick(bookNowContextFromSummary(summary, source))
      setState({ kind: 'experience', summary, source, phase: 'form', channel: null })
      pushModalUrl(buildModalOpenSearch(window.location.pathname, window.location.search, 'experience'))
    },
    [pushModalUrl],
  )

  const enterThankYouUrl = useCallback(
    (intent: BookingEnquiryIntent) => {
      pushModalUrl(
        buildThankYouSearch(window.location.pathname, window.location.search, intent, 'email'),
      )
    },
    [pushModalUrl],
  )

  const onPlanStepAdvance = useCallback(
    (step: PlanJourneyStepSlug) => {
      const active = activeModalRef.current
      if (active.kind !== 'plan' || active.phase !== 'form') return
      setState({ ...active, step, channel: null })
      pushModalUrl(buildPlanStepSearch(window.location.pathname, window.location.search, step))
    },
    [pushModalUrl],
  )

  const onPlanStepBack = useCallback(() => {
    window.history.back()
  }, [])

  const onPlanChannelSelect = useCallback(
    (channel: ContactChannelSlug) => {
      const active = activeModalRef.current
      if (active.kind !== 'plan' || active.phase !== 'form' || active.step !== 'contact') return
      if (active.channel === channel) return
      setState({ ...active, channel })
      pushModalUrl(
        buildPlanStepSearch(window.location.pathname, window.location.search, 'contact', channel),
      )
    },
    [pushModalUrl],
  )

  const onExperienceChannelSelect = useCallback(
    (channel: ContactChannelSlug) => {
      const active = activeModalRef.current
      if (active.kind !== 'experience' || active.phase !== 'form') return
      if (active.channel === channel) return
      setState({ ...active, channel })
      pushModalUrl(buildBookFormSearch(window.location.pathname, window.location.search, channel))
    },
    [pushModalUrl],
  )

  const onPlanEmailThankYou = useCallback(() => {
    const active = activeModalRef.current
    if (active.kind !== 'plan') return
    thankYouEligibleRef.current = true
    setState({ ...active, phase: 'thank-you' })
    enterThankYouUrl('plan')
    trackEmailConversionSuccess({
      conversion_intent: 'plan_journey',
      channel: 'email',
      cta_id: active.source.cta_id,
      source: active.source.source ?? active.source.button_location,
    })
  }, [enterThankYouUrl])

  const onExperienceEmailThankYou = useCallback(() => {
    const active = activeModalRef.current
    if (active.kind !== 'experience') return
    thankYouEligibleRef.current = true
    setState({ ...active, phase: 'thank-you' })
    enterThankYouUrl('book')
    trackEmailConversionSuccess({
      conversion_intent: 'book_experience',
      channel: 'email',
      cta_id: active.source.cta_id,
      source: active.source.source ?? active.source.button_location,
      experienceSummary: active.summary,
    })
  }, [enterThankYouUrl])

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

  const openedTrackingRef = useRef(false)

  useEffect(() => {
    if (state.kind === 'closed') {
      openedTrackingRef.current = false
      return
    }
    if (openedTrackingRef.current || state.phase !== 'form') return
    openedTrackingRef.current = true
    if (state.kind === 'plan') {
      trackBookingModalOpen({
        cta_id: state.source.cta_id,
        source: state.source.source ?? state.source.button_location,
        button_location: state.source.button_location,
      })
      return
    }
    trackBookingModalOpen({
      cta_id: state.source.cta_id,
      source: state.source.source ?? state.source.button_location,
      button_location: state.source.button_location,
      experience_name: state.summary.experienceName,
      route: state.summary.route,
      program_type: state.summary.programType,
    })
  }, [state])

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      if (closingHistorySteps.current > 0) {
        closingHistorySteps.current -= 1
        return
      }
      const historyState = event.state as ModalHistoryState | null
      const depth = typeof historyState?.depth === 'number' ? historyState.depth : 0
      modalHistoryDepth.current = depth
      modalHistoryPushes.current = depth
      syncStateFromUrl()
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [syncStateFromUrl])

  useEffect(() => {
    modalHistoryDepth.current = 0
    modalHistoryPushes.current = 0
    thankYouEligibleRef.current = false
    setState({ kind: 'closed' })
  }, [pathname])

  useEffect(() => {
    const currentSearch = window.location.search.replace(/^\?/, '')
    const parsed = parseModalUrl(pathname, currentSearch)
    if (rejectUnauthorizedThankYou(parsed)) return
    if (parsed.status === 'closed') return

    const pageContext = getBookingModalPageContext(pathname)

    if (parsed.status === 'open' && 'form' in parsed && parsed.form === 'plan' && 'step' in parsed) {
      setState((prev) => {
        if (prev.kind === 'plan') {
          return { ...prev, phase: 'form', step: parsed.step, channel: parsed.channel }
        }
        return {
          kind: 'plan',
          source: DEFAULT_PLAN_SOURCE,
          phase: 'form',
          step: parsed.step,
          channel: parsed.channel,
        }
      })
      return
    }

    if (parsed.status === 'open' && 'form' in parsed && parsed.form === 'book' && pageContext === 'experience') {
      setState((prev) => {
        if (prev.kind === 'experience') return { ...prev, phase: 'form', channel: parsed.channel }
        return prev
      })
      return
    }

    if (parsed.status === 'open' && 'thankYou' in parsed && parsed.thankYou && parsed.intent === 'plan') {
      setState((prev) => {
        if (prev.kind === 'plan') return { ...prev, phase: 'thank-you' }
        return {
          kind: 'plan',
          source: DEFAULT_PLAN_SOURCE,
          phase: 'thank-you',
          step: DEFAULT_PLAN_JOURNEY_STEP,
          channel: parsed.channel,
        }
      })
      return
    }

    if (parsed.status === 'open' && 'thankYou' in parsed && parsed.thankYou && parsed.intent === 'book' && pageContext === 'experience') {
      setState((prev) => {
        if (prev.kind === 'experience') return { ...prev, phase: 'thank-you' }
        return prev
      })
    }
  }, [pathname, rejectUnauthorizedThankYou])

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      <BookingModalLayer
        state={state}
        waNumber={waNumber}
        copy={copy}
        onClose={close}
        onPlanEmailThankYou={onPlanEmailThankYou}
        onExperienceEmailThankYou={onExperienceEmailThankYou}
        onPlanStepAdvance={onPlanStepAdvance}
        onPlanStepBack={onPlanStepBack}
        onPlanChannelSelect={onPlanChannelSelect}
        onExperienceChannelSelect={onExperienceChannelSelect}
      />
    </BookingModalContext.Provider>
  )
}
