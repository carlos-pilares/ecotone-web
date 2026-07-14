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

/** Wonder Beyond the Wonder campaign modal — WhatsApp / form lead. */
export type WonderBeyondEnquiryPayload = {
  kind: 'wonder_beyond_the_wonder'
  flowType: 'wonder_beyond_the_wonder'
  flowLabel: 'Wonder Beyond the Wonder'
  fullName: string
  email: string
  phoneCountryCode: string
  phone: string
  /** Normalized display phone (`+[code] [number]`) or `Not provided`. */
  fullPhone: string
  travelTiming: string
  groupSize: string
  interest: string
  contactChannel: 'whatsapp' | 'form'
  source: string
  pageUrl: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
  gclid: string
  gbraid: string
  wbraid: string
}

export type EnquiryPayload =
  | PlanJourneyEnquiryPayload
  | BookExperienceEnquiryPayload
  | WonderBeyondEnquiryPayload

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x)
}

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
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

/** Display phone as `+[code] [number]`, or `Not provided` when empty. */
export function formatWonderBeyondPhoneDisplay(
  phoneCountryCode: string,
  phone: string,
): string {
  const digits = phone.trim().replace(/^\+/, '').replace(/\s+/g, ' ').trim()
  if (!digits) return 'Not provided'

  const countryCode = phoneCountryCode.trim().replace(/\s+/g, '')
  if (!countryCode) {
    return digits.startsWith('+') ? digits : `+${digits}`
  }

  const normalizedCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`
  const prefix = normalizedCode.replace('+', '')
  const cleaned = digits.startsWith(prefix) ? digits.slice(prefix.length).trim() : digits
  const number = cleaned || digits
  return `${normalizedCode} ${number}`.replace(/\s+/g, ' ').trim()
}

export function buildWonderBeyondSheetNotes(payload: WonderBeyondEnquiryPayload): string {
  const phone =
    payload.fullPhone.trim() ||
    formatWonderBeyondPhoneDisplay(payload.phoneCountryCode, payload.phone)
  const interest = payload.interest.trim() || 'Not sure yet'
  return [
    `Phone: ${phone}`,
    `Interest: ${interest}`,
    `Submission method: ${payload.contactChannel}`,
    'Campaign: Wonder Beyond the Wonder',
  ].join('\n')
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

  if (input.kind === 'wonder_beyond_the_wonder') {
    const contactChannel = input.contactChannel
    if (contactChannel !== 'whatsapp' && contactChannel !== 'form') return null

    const fullName = asTrimmedString(input.fullName)
    const email = asTrimmedString(input.email)
    const travelTiming = asTrimmedString(input.travelTiming)
    const groupSize = asTrimmedString(input.groupSize)
    if (!fullName || !email || !travelTiming || !groupSize) return null

    const phoneCountryCode = asTrimmedString(input.phoneCountryCode)
    const phone = asTrimmedString(input.phone).replace(/[^\d\s]/g, '').replace(/\s+/g, ' ').trim()
    const fullPhone = formatWonderBeyondPhoneDisplay(phoneCountryCode, phone)

    return {
      kind: 'wonder_beyond_the_wonder',
      flowType: 'wonder_beyond_the_wonder',
      flowLabel: 'Wonder Beyond the Wonder',
      fullName,
      email,
      phoneCountryCode,
      phone,
      fullPhone,
      travelTiming,
      groupSize,
      interest: asTrimmedString(input.interest),
      contactChannel,
      source: asTrimmedString(input.source) || 'wonder-beyond-the-wonder-landing',
      pageUrl: asTrimmedString(input.pageUrl),
      utmSource: asTrimmedString(input.utmSource),
      utmMedium: asTrimmedString(input.utmMedium),
      utmCampaign: asTrimmedString(input.utmCampaign),
      utmTerm: asTrimmedString(input.utmTerm),
      utmContent: asTrimmedString(input.utmContent),
      gclid: asTrimmedString(input.gclid),
      gbraid: asTrimmedString(input.gbraid),
      wbraid: asTrimmedString(input.wbraid),
    }
  }

  return null
}

export function getEnquiryEmailSubject(payload: EnquiryPayload): string {
  if (payload.kind === 'plan_journey') return 'New enquiry: Plan journey'
  if (payload.kind === 'wonder_beyond_the_wonder') return 'New Wonder Beyond the Wonder lead'
  return `New enquiry: Book experience — ${payload.experienceSummary.experienceName}`
}

export function formatEnquiryEmailBody(payload: EnquiryPayload, submittedAtIso?: string): string {
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

  if (payload.kind === 'wonder_beyond_the_wonder') {
    const phone =
      payload.fullPhone.trim() ||
      formatWonderBeyondPhoneDisplay(payload.phoneCountryCode, payload.phone)
    const interest = payload.interest.trim() || 'Not sure yet'
    const submittedAt = submittedAtIso ?? new Date().toISOString()
    return [
      'New campaign lead: Wonder Beyond the Wonder',
      '',
      'Full name:',
      payload.fullName,
      '',
      'Email:',
      payload.email,
      '',
      'Phone:',
      phone,
      '',
      'Travel timing:',
      payload.travelTiming,
      '',
      'Group size:',
      payload.groupSize,
      '',
      'Interest:',
      interest,
      '',
      'Contact via:',
      payload.contactChannel,
      '',
      'Submitted at:',
      submittedAt,
      '',
      'Page URL:',
      payload.pageUrl || '—',
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
