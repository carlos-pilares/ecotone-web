/** URL query model for in-page booking modals (History API, no route change). */

export type BookingModalPageContext = 'home' | 'experience' | 'lodge' | 'other'

export type BookingModalFormParam = 'plan' | 'book'

export type BookingEnquiryIntent = 'plan' | 'book'

export type ContactChannelSlug = 'email' | 'whatsapp'

/** Stable slugs for PlanJourneyModal steps (step 1 → 3). */
export const PLAN_JOURNEY_STEPS = ['travellers', 'details', 'contact'] as const

export type PlanJourneyStepSlug = (typeof PLAN_JOURNEY_STEPS)[number]

export const DEFAULT_PLAN_JOURNEY_STEP: PlanJourneyStepSlug = 'travellers'

export type ParsedModalUrl =
  | { status: 'closed' }
  | { status: 'open'; form: 'plan'; step: PlanJourneyStepSlug; channel: ContactChannelSlug | null }
  | { status: 'open'; form: 'book'; channel: ContactChannelSlug | null }
  | { status: 'open'; thankYou: true; intent: BookingEnquiryIntent; channel: ContactChannelSlug | null }

export function planStepSlugFromNumber(step: number): PlanJourneyStepSlug {
  const index = Math.min(PLAN_JOURNEY_STEPS.length, Math.max(1, step)) - 1
  return PLAN_JOURNEY_STEPS[index]!
}

export function planStepNumberFromSlug(slug: PlanJourneyStepSlug): number {
  const index = PLAN_JOURNEY_STEPS.indexOf(slug)
  return index >= 0 ? index + 1 : 1
}

export function parsePlanStepParam(raw: string | null | undefined): PlanJourneyStepSlug | null {
  const value = raw?.trim()
  if (!value) return null
  return (PLAN_JOURNEY_STEPS as readonly string[]).includes(value) ? (value as PlanJourneyStepSlug) : null
}

export function parseContactChannelParam(raw: string | null | undefined): ContactChannelSlug | null {
  const value = raw?.trim()
  if (value === 'email' || value === 'whatsapp') return value
  return null
}

export function getBookingModalPageContext(pathname: string): BookingModalPageContext {
  const path = (pathname.split('?')[0] ?? '/').replace(/\/$/, '') || '/'
  if (path === '/') return 'home'
  if (path.startsWith('/experiences/') && path.length > '/experiences/'.length) return 'experience'
  if (path.startsWith('/lodges/') && path.length > '/lodges/'.length) return 'lodge'
  return 'other'
}

/** Maps an open action to the `modal` query value for the current page. */
export function modalFormParamForOpen(
  pathname: string,
  kind: 'plan' | 'experience',
): BookingModalFormParam {
  if (kind === 'experience' || getBookingModalPageContext(pathname) === 'experience') {
    return 'book'
  }
  return 'plan'
}

export function parseModalUrl(pathname: string, search: string): ParsedModalUrl {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const modal = params.get('modal')?.trim()
  if (!modal) return { status: 'closed' }

  const channelParam = parseContactChannelParam(params.get('channel'))

  if (modal === 'thank-you') {
    const ctx = getBookingModalPageContext(pathname)
    const intentParam = params.get('intent')?.trim()
    if (intentParam === 'plan') {
      return { status: 'open', thankYou: true, intent: 'plan', channel: channelParam }
    }
    if (intentParam === 'book') {
      return { status: 'open', thankYou: true, intent: 'book', channel: channelParam }
    }
    if (ctx === 'experience') {
      return { status: 'open', thankYou: true, intent: 'book', channel: channelParam }
    }
    return { status: 'open', thankYou: true, intent: 'plan', channel: channelParam }
  }

  if (modal === 'plan') {
    const step = parsePlanStepParam(params.get('step')) ?? DEFAULT_PLAN_JOURNEY_STEP
    const channel = step === 'contact' ? channelParam : null
    return { status: 'open', form: 'plan', step, channel }
  }
  if (modal === 'book') {
    return { status: 'open', form: 'book', channel: channelParam }
  }
  return { status: 'closed' }
}

export function buildModalOpenSearch(
  pathname: string,
  currentSearch: string,
  kind: 'plan' | 'experience',
): string {
  const params = new URLSearchParams(stripLeadingQuestion(currentSearch))
  params.set('modal', modalFormParamForOpen(pathname, kind))
  params.delete('intent')
  params.delete('channel')
  if (kind === 'plan') {
    params.set('step', DEFAULT_PLAN_JOURNEY_STEP)
  } else {
    params.delete('step')
  }
  return params.toString()
}

export function buildPlanStepSearch(
  pathname: string,
  currentSearch: string,
  step: PlanJourneyStepSlug,
  channel?: ContactChannelSlug | null,
): string {
  const params = new URLSearchParams(stripLeadingQuestion(currentSearch))
  params.set('modal', 'plan')
  params.set('step', step)
  params.delete('intent')
  params.delete('channel')
  if (step === 'contact' && channel) {
    params.set('channel', channel)
  }
  return params.toString()
}

export function buildBookFormSearch(
  pathname: string,
  currentSearch: string,
  channel?: ContactChannelSlug | null,
): string {
  const params = new URLSearchParams(stripLeadingQuestion(currentSearch))
  params.set('modal', 'book')
  params.delete('intent')
  params.delete('step')
  if (channel) {
    params.set('channel', channel)
  } else {
    params.delete('channel')
  }
  return params.toString()
}

export function buildThankYouSearch(
  pathname: string,
  currentSearch: string,
  enquiryIntent: BookingEnquiryIntent,
  channel: ContactChannelSlug = 'email',
): string {
  const params = new URLSearchParams(stripLeadingQuestion(currentSearch))
  params.set('modal', 'thank-you')
  params.delete('step')
  params.set('channel', channel)
  const ctx = getBookingModalPageContext(pathname)
  if (ctx === 'home' || ctx === 'other') {
    params.set('intent', enquiryIntent)
  } else {
    params.delete('intent')
  }
  return params.toString()
}

export function buildClearModalSearch(currentSearch: string): string {
  const params = new URLSearchParams(stripLeadingQuestion(currentSearch))
  params.delete('modal')
  params.delete('intent')
  params.delete('step')
  params.delete('channel')
  return params.toString()
}

export function hrefFromPathAndSearch(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname
}

function stripLeadingQuestion(search: string): string {
  return search.startsWith('?') ? search.slice(1) : search
}
