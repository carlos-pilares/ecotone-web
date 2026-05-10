import type { ExperienceBookingSummary } from '@/components/booking/types'

/** General “Plan journey” modal — email channel submission. */
export type PlanJourneyEnquiryPayload = {
  kind: 'plan_journey'
  fullName: string
  travellerType: string | null
  travellerTypeTitle: string | null
  season: string | null
  seasonLine: string | null
  partySize: number
  contactChannel: 'email'
  email: string
  emailMessage: string
}

/** “Book this experience” modal — email channel submission. */
export type BookExperienceEnquiryPayload = {
  kind: 'book_experience'
  name: string
  approxTravelDate: string
  partySize: number
  contactChannel: 'email'
  email: string
  emailMessage: string
  experienceSummary: ExperienceBookingSummary
}

export type EnquiryPayload = PlanJourneyEnquiryPayload | BookExperienceEnquiryPayload

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x)
}

function parseExperienceSummary(sum: unknown): ExperienceBookingSummary | null {
  if (!isRecord(sum)) return null
  const experienceName = sum.experienceName
  const imageSrc = sum.imageSrc
  const route = sum.route
  const duration = sum.duration
  const programType = sum.programType
  const priceLine = sum.priceLine
  if (
    typeof experienceName !== 'string' ||
    typeof imageSrc !== 'string' ||
    typeof route !== 'string' ||
    typeof duration !== 'string' ||
    typeof programType !== 'string' ||
    typeof priceLine !== 'string'
  ) {
    return null
  }
  const out: ExperienceBookingSummary = {
    experienceName,
    imageSrc,
    route,
    duration,
    programType,
    priceLine,
  }
  if (typeof sum.imageAlt === 'string') out.imageAlt = sum.imageAlt
  if (typeof sum.priceSub === 'string') out.priceSub = sum.priceSub
  return out
}

/** Parse and validate POST JSON. Returns null if invalid. */
export function parseEnquiryPayload(input: unknown): EnquiryPayload | null {
  if (!isRecord(input)) return null

  if (input.kind === 'plan_journey') {
    if (input.contactChannel !== 'email') return null
    const partySize = Number(input.partySize)
    if (!Number.isFinite(partySize) || partySize < 1) return null
    if (typeof input.fullName !== 'string' || typeof input.email !== 'string') return null
    return {
      kind: 'plan_journey',
      fullName: input.fullName,
      travellerType: typeof input.travellerType === 'string' ? input.travellerType : null,
      travellerTypeTitle: typeof input.travellerTypeTitle === 'string' ? input.travellerTypeTitle : null,
      season: typeof input.season === 'string' ? input.season : null,
      seasonLine: typeof input.seasonLine === 'string' ? input.seasonLine : null,
      partySize,
      contactChannel: 'email',
      email: input.email,
      emailMessage: typeof input.emailMessage === 'string' ? input.emailMessage : '',
    }
  }

  if (input.kind === 'book_experience') {
    if (input.contactChannel !== 'email') return null
    const partySize = Number(input.partySize)
    if (!Number.isFinite(partySize) || partySize < 1) return null
    if (typeof input.name !== 'string' || typeof input.approxTravelDate !== 'string' || typeof input.email !== 'string') {
      return null
    }
    const experienceSummary = parseExperienceSummary(input.experienceSummary)
    if (!experienceSummary) return null
    return {
      kind: 'book_experience',
      name: input.name,
      approxTravelDate: input.approxTravelDate,
      partySize,
      contactChannel: 'email',
      email: input.email,
      emailMessage: typeof input.emailMessage === 'string' ? input.emailMessage : '',
      experienceSummary,
    }
  }

  return null
}

export function formatEnquiryEmailBody(payload: EnquiryPayload): string {
  if (payload.kind === 'plan_journey') {
    return [
      'New enquiry — Plan journey (email)',
      '',
      `Name: ${payload.fullName}`,
      `Email: ${payload.email}`,
      `Traveller type: ${payload.travellerTypeTitle ?? payload.travellerType ?? '—'}`,
      `Season: ${payload.seasonLine ?? payload.season ?? '—'}`,
      `Party size: ${payload.partySize}`,
      '',
      'Message:',
      payload.emailMessage.trim() || '—',
    ].join('\n')
  }

  const s = payload.experienceSummary
  return [
    'New enquiry — Book experience (email)',
    '',
    `Experience: ${s.experienceName}`,
    `${s.programType} · ${s.route} · ${s.duration}`,
    `Price: ${s.priceLine}${s.priceSub ? ` ${s.priceSub}` : ''}`,
    '',
    `Guest name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Approx. travel date: ${payload.approxTravelDate}`,
    `Party size: ${payload.partySize}`,
    '',
    'Message:',
    payload.emailMessage.trim() || '—',
  ].join('\n')
}
