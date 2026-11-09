import type { EnquiryPayload } from '@/lib/enquiryPayload'

/** Canonical lead shape for Sheets (`Raw_Leads`) and internal email. */
export type NormalizedLead = {
  leadId: string
  dateTimeIso: string
  typeOfLead: 'General' | 'Experience' | 'Campaign'
  acquisitionChannel: 'Web Form'
  conversationChannel: 'Email' | 'WhatsApp'
  campaignName: string
  experienceName: string
  landingPage: string
  fullName: string
  /** First non-empty token of `fullName` (before first space). */
  firstName: string
  email: string
  phoneNumber: string
  travellerType: string
  seasonPeriod: string
  travelDate: string
  partySize: string
  duration: string
  price: string
  messageNote: string
  /** Original submitted EnquiryPayload JSON (unchanged). */
  rawPayload: string
}

/** Crockford-like alphabet: unambiguous A–Z / 2–9 (no I, L, O, U, 0, 1). */
const LEAD_ID_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

const WONDER_CAMPAIGN_NAME = 'Wonder Beyond the Wonder'
const MANU_VOLUNTEER_CAMPAIGN_NAME = 'Volunteer Q4 2026'
const MANU_VOLUNTEER_EXPERIENCE_NAME = 'Volunteer Conservation'
const MANU_VOLUNTEER_LANDING_PATH = '/manu-conservation-volunteer'
const MANU_VOLUNTEER_PRICE_DISPLAY = 'US$2,200 | 30% off | US$1,540'
const MANU_VOLUNTEER_DURATION = '4 weeks'

const MFC2027_CAMPAIGN_NAME = 'Manu Field Crew 2027'
const MFC2027_LANDING_PATH = '/manu-field-crew-2027'
const MFC2027_SOURCE = 'manu-field-crew-2027-landing'
const MFC2027_PRICE_DISPLAY = 'US$2,600 | 30% off | US$1,820'

function resolveManuVolunteerLandingPage(pageUrl: string): string {
  const trimmed = pageUrl.trim()
  if (!trimmed) return MANU_VOLUNTEER_LANDING_PATH
  try {
    const pathname = new URL(trimmed, 'https://www.ecotone.eco').pathname.replace(/\/$/, '')
    if (pathname.startsWith('/manu-conservation-volunteer')) {
      return MANU_VOLUNTEER_LANDING_PATH
    }
    return pathname || MANU_VOLUNTEER_LANDING_PATH
  } catch {
    return MANU_VOLUNTEER_LANDING_PATH
  }
}

function isManuFieldCrew2027Payload(payload: {
  source: string
  pageUrl: string
}): boolean {
  if (payload.source.trim() === MFC2027_SOURCE) return true
  try {
    const pathname = new URL(payload.pageUrl.trim(), 'https://www.ecotone.eco').pathname.replace(
      /\/$/,
      '',
    )
    return pathname.startsWith(MFC2027_LANDING_PATH)
  } catch {
    return payload.pageUrl.includes(MFC2027_LANDING_PATH)
  }
}

function resolveMfc2027LandingPage(pageUrl: string): string {
  const trimmed = pageUrl.trim()
  if (!trimmed) return MFC2027_LANDING_PATH
  try {
    const pathname = new URL(trimmed, 'https://www.ecotone.eco').pathname.replace(/\/$/, '')
    if (pathname.startsWith(MFC2027_LANDING_PATH)) return MFC2027_LANDING_PATH
    return pathname || MFC2027_LANDING_PATH
  } catch {
    return MFC2027_LANDING_PATH
  }
}

/**
 * Generate `ECO-YYMMDD-XXXX` once per enquiry (server-side).
 * XXXX is 4 chars from a collision-resistant alphabet via crypto.getRandomValues.
 */
export function generateLeadId(at: Date = new Date()): string {
  const yy = String(at.getUTCFullYear()).slice(-2)
  const mm = String(at.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(at.getUTCDate()).padStart(2, '0')
  const suffix = randomLeadIdSuffix(4)
  return `ECO-${yy}${mm}${dd}-${suffix}`
}

function randomLeadIdSuffix(length: number): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < length; i++) {
    out += LEAD_ID_ALPHABET[bytes[i]! % LEAD_ID_ALPHABET.length]
  }
  return out
}

function blankIfNotProvided(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || trimmed.toLowerCase() === 'not provided') return ''
  return trimmed
}

/** First non-empty token before the first space; blank if full name is missing. */
export function deriveFirstName(fullName: string): string {
  const trimmed = fullName.trim()
  if (!trimmed) return ''
  return trimmed.split(/\s+/)[0] ?? ''
}

/**
 * Map a validated EnquiryPayload into the canonical normalised lead.
 * Does not mutate the original payload; RAW PAYLOAD is a fresh JSON snapshot.
 */
export function normalizeEnquiryToLead(
  payload: EnquiryPayload,
  options?: { dateTimeIso?: string; leadId?: string },
): NormalizedLead {
  const dateTimeIso = options?.dateTimeIso ?? new Date().toISOString()
  const leadId = options?.leadId ?? generateLeadId(new Date(dateTimeIso))
  const rawPayload = JSON.stringify(payload)

  if (payload.kind === 'plan_journey') {
    const fullName = payload.fullName
    return {
      leadId,
      dateTimeIso,
      typeOfLead: 'General',
      acquisitionChannel: 'Web Form',
      conversationChannel: 'Email',
      campaignName: '',
      experienceName: '',
      landingPage: payload.pageUrl.trim(),
      fullName,
      firstName: deriveFirstName(fullName),
      email: payload.email,
      phoneNumber: '',
      travellerType: (payload.travellerTypeTitle ?? payload.travellerType ?? '').trim(),
      seasonPeriod: (payload.seasonLine ?? payload.season ?? '').trim(),
      travelDate: '',
      partySize: String(payload.partySize),
      duration: '',
      price: '',
      messageNote: payload.emailMessage.trim(),
      rawPayload,
    }
  }

  if (payload.kind === 'book_experience') {
    const s = payload.experienceSummary
    const price = [s.priceLine, s.priceSub].filter((x) => x && String(x).trim()).join(' ')
    const fullName = payload.name
    return {
      leadId,
      dateTimeIso,
      typeOfLead: 'Experience',
      acquisitionChannel: 'Web Form',
      conversationChannel: 'Email',
      campaignName: '',
      experienceName: s.experienceName,
      landingPage: payload.pageUrl.trim(),
      fullName,
      firstName: deriveFirstName(fullName),
      email: payload.email,
      phoneNumber: '',
      travellerType: '',
      seasonPeriod: '',
      travelDate: payload.approxTravelDate.trim(),
      partySize: String(payload.partySize),
      duration: s.duration,
      price,
      messageNote: payload.emailMessage.trim(),
      rawPayload,
    }
  }

  if (payload.kind === 'wonder_beyond_the_wonder') {
    const fullName = payload.fullName
    return {
      leadId,
      dateTimeIso,
      typeOfLead: 'Campaign',
      acquisitionChannel: 'Web Form',
      conversationChannel: payload.contactChannel === 'whatsapp' ? 'WhatsApp' : 'Email',
      campaignName: WONDER_CAMPAIGN_NAME,
      experienceName: '',
      landingPage: payload.pageUrl.trim(),
      fullName,
      firstName: deriveFirstName(fullName),
      email: payload.email,
      phoneNumber: blankIfNotProvided(payload.fullPhone),
      travellerType: payload.interest.trim(),
      seasonPeriod: payload.travelTiming.trim(),
      travelDate: '',
      partySize: payload.groupSize.trim(),
      duration: '',
      price: '',
      messageNote: '',
      rawPayload,
    }
  }

  // manu_conservation_volunteer (includes Manu Field Crew 2027 via source/landing)
  const fullName = payload.fullName
  const isMfc2027 = isManuFieldCrew2027Payload(payload)
  return {
    leadId,
    dateTimeIso,
    typeOfLead: 'Campaign',
    acquisitionChannel: 'Web Form',
    conversationChannel: 'Email',
    campaignName: isMfc2027 ? MFC2027_CAMPAIGN_NAME : MANU_VOLUNTEER_CAMPAIGN_NAME,
    experienceName: MANU_VOLUNTEER_EXPERIENCE_NAME,
    landingPage: isMfc2027
      ? resolveMfc2027LandingPage(payload.pageUrl)
      : resolveManuVolunteerLandingPage(payload.pageUrl),
    fullName,
    firstName: deriveFirstName(fullName),
    email: payload.email,
    phoneNumber: blankIfNotProvided(payload.fullPhone),
    travellerType: '',
    seasonPeriod: payload.travelTiming.trim(),
    travelDate: '',
    partySize: payload.groupSize.trim(),
    duration: payload.duration.trim() || MANU_VOLUNTEER_DURATION,
    price: isMfc2027 ? MFC2027_PRICE_DISPLAY : MANU_VOLUNTEER_PRICE_DISPLAY,
    messageNote: '',
    rawPayload,
  }
}

export function getNormalizedLeadEmailSubject(lead: NormalizedLead): string {
  if (lead.typeOfLead === 'General') {
    return `New enquiry: Plan journey [${lead.leadId}]`
  }
  if (lead.typeOfLead === 'Campaign') {
    if (lead.campaignName === MANU_VOLUNTEER_CAMPAIGN_NAME) {
      return `New Manu Conservation Volunteer lead [${lead.leadId}]`
    }
    if (lead.campaignName === MFC2027_CAMPAIGN_NAME) {
      return `New Manu Field Crew 2027 lead [${lead.leadId}]`
    }
    return `New Wonder Beyond the Wonder lead [${lead.leadId}]`
  }
  const name = lead.experienceName.trim() || 'Experience'
  return `New enquiry: Book experience — ${name} [${lead.leadId}]`
}

export function formatNormalizedLeadEmailBody(lead: NormalizedLead): string {
  const lines = [
    `Lead ID: ${lead.leadId}`,
    `Submitted at: ${lead.dateTimeIso}`,
    `Type of lead: ${lead.typeOfLead}`,
    `Acquisition channel: ${lead.acquisitionChannel}`,
    `Conversation channel: ${lead.conversationChannel}`,
    '',
    `Full name: ${lead.fullName || '—'}`,
    `Email: ${lead.email || '—'}`,
    `Phone: ${lead.phoneNumber || '—'}`,
    '',
    `Campaign: ${lead.campaignName || '—'}`,
    `Experience: ${lead.experienceName || '—'}`,
    `Landing page: ${lead.landingPage || '—'}`,
    `Traveller type: ${lead.travellerType || '—'}`,
    `Season / period: ${lead.seasonPeriod || '—'}`,
    `Travel date: ${lead.travelDate || '—'}`,
    `Party size: ${lead.partySize || '—'}`,
    `Duration: ${lead.duration || '—'}`,
    `Price: ${lead.price || '—'}`,
    '',
    'Message / note:',
    lead.messageNote.trim() || '—',
  ]
  return lines.join('\n')
}
