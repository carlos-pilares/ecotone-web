/**
 * Normalisation unit checks (no Sheets/Resend).
 * Run: npx tsx scripts/testNormalizedLead.ts
 */
import assert from 'node:assert/strict'

import {
  buildNormalizedGoogleSheetsRow,
  formatPhoneNumberForSheetsCell,
  NORMALIZED_SHEET_HEADERS,
  resolveNormalizedSheetTabName,
} from '../lib/enquiryGoogleSheets'
import type { EnquiryPayload } from '../lib/enquiryPayload'
import {
  generateLeadId,
  deriveFirstName,
  normalizeEnquiryToLead,
} from '../lib/normalizedLead'

const FIXED_TS = '2026-08-11T21:00:00.000Z'
const FIXED_ID = 'ECO-260811-K4M8'

function planPayload(): EnquiryPayload {
  return {
    kind: 'plan_journey',
    fullName: 'Ada Lovelace',
    travellerType: 'couple',
    travellerTypeTitle: 'Couple',
    season: 'dry',
    seasonLine: 'Dry season',
    partySize: 2,
    contactChannel: 'email',
    email: 'ada@example.com',
    emailMessage: 'Hello',
    pageUrl: 'https://ecotone.eco/',
  }
}

function bookPayload(): EnquiryPayload {
  return {
    kind: 'book_experience',
    name: 'Grace Hopper',
    approxTravelDate: '2026-09',
    partySize: 3,
    contactChannel: 'email',
    email: 'grace@example.com',
    emailMessage: 'Please book',
    experienceSummary: {
      experienceName: 'Soqtapata Lodge',
      imageSrc: '/x.jpg',
      route: 'Manu',
      duration: '4 nights',
      programType: 'Lodge',
      priceLine: 'From $1,200',
      priceSub: 'pp',
    },
    pageUrl: 'https://ecotone.eco/experiences/manu-gradient-expedition-4d-3n',
  }
}

function wonderPayload(channel: 'form' | 'whatsapp'): EnquiryPayload {
  return {
    kind: 'wonder_beyond_the_wonder',
    flowType: 'wonder_beyond_the_wonder',
    flowLabel: 'Wonder Beyond the Wonder',
    fullName: 'Alan Turing',
    email: 'alan@example.com',
    phoneCountryCode: '+51',
    phone: '999888777',
    fullPhone: '+51 999888777',
    travelTiming: 'Within 6 months',
    groupSize: '2–4',
    interest: 'Birdwatching',
    contactChannel: channel,
    source: 'wonder-beyond-the-wonder-landing',
    pageUrl: 'https://ecotone.eco/wonder-beyond-the-wonder',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    gclid: '',
    gbraid: '',
    wbraid: '',
  }
}

function assertBlankFields(lead: ReturnType<typeof normalizeEnquiryToLead>, keys: Array<keyof typeof lead>) {
  for (const key of keys) {
    assert.equal(lead[key], '', `expected blank ${String(key)}`)
  }
}

// --- Lead ID ---
{
  const id = generateLeadId(new Date(FIXED_TS))
  assert.match(id, /^ECO-260811-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/)
}

// --- Plan Journey email ---
{
  const payload = planPayload()
  const lead = normalizeEnquiryToLead(payload, { dateTimeIso: FIXED_TS, leadId: FIXED_ID })
  assert.equal(lead.typeOfLead, 'General')
  assert.equal(lead.acquisitionChannel, 'Web Form')
  assert.equal(lead.conversationChannel, 'Email')
  assertBlankFields(lead, ['campaignName', 'experienceName', 'phoneNumber', 'travelDate', 'duration', 'price'])
  assert.equal(lead.landingPage, 'https://ecotone.eco/')
  assert.equal(lead.fullName, 'Ada Lovelace')
  assert.equal(lead.firstName, 'Ada')
  assert.equal(lead.travellerType, 'Couple')
  assert.equal(lead.seasonPeriod, 'Dry season')
  assert.equal(lead.partySize, '2')
  assert.equal(lead.messageNote, 'Hello')
  assert.equal(lead.rawPayload, JSON.stringify(payload))
  assert.ok(lead.rawPayload.includes('"kind":"plan_journey"'))
  assert.ok(!lead.rawPayload.includes(FIXED_ID), 'raw payload must not inject lead id')
}

// --- Book Experience email ---
{
  const payload = bookPayload()
  const lead = normalizeEnquiryToLead(payload, { dateTimeIso: FIXED_TS, leadId: FIXED_ID })
  assert.equal(lead.typeOfLead, 'Experience')
  assert.equal(lead.acquisitionChannel, 'Web Form')
  assert.equal(lead.conversationChannel, 'Email')
  assertBlankFields(lead, ['campaignName', 'phoneNumber', 'travellerType', 'seasonPeriod'])
  assert.equal(lead.landingPage, 'https://ecotone.eco/experiences/manu-gradient-expedition-4d-3n')
  assert.equal(lead.fullName, 'Grace Hopper')
  assert.equal(lead.firstName, 'Grace')
  assert.equal(lead.experienceName, 'Soqtapata Lodge')
  assert.equal(lead.travelDate, '2026-09')
  assert.equal(lead.duration, '4 nights')
  assert.equal(lead.price, 'From $1,200 pp')
  assert.equal(lead.rawPayload, JSON.stringify(payload))
}

// --- WBTW form ---
{
  const payload = wonderPayload('form')
  const lead = normalizeEnquiryToLead(payload, { dateTimeIso: FIXED_TS, leadId: FIXED_ID })
  assert.equal(lead.typeOfLead, 'Campaign')
  assert.equal(lead.acquisitionChannel, 'Web Form')
  assert.equal(lead.conversationChannel, 'Email')
  assert.equal(lead.campaignName, 'Wonder Beyond the Wonder')
  assertBlankFields(lead, ['experienceName', 'travelDate', 'duration', 'price', 'messageNote'])
  assert.equal(lead.travellerType, 'Birdwatching')
  assert.equal(lead.experienceName, '')
  assert.equal(lead.seasonPeriod, 'Within 6 months')
  assert.equal(lead.partySize, '2–4')
  assert.equal(lead.phoneNumber, '+51 999888777')
  assert.equal(lead.landingPage, 'https://ecotone.eco/wonder-beyond-the-wonder')
  assert.equal(lead.fullName, 'Alan Turing')
  assert.equal(lead.firstName, 'Alan')
  assert.ok(lead.rawPayload.includes('"interest":"Birdwatching"'))
  assert.ok(!lead.experienceName.includes('Birdwatching'))
}

// --- WBTW WhatsApp ---
{
  const payload = wonderPayload('whatsapp')
  const lead = normalizeEnquiryToLead(payload, { dateTimeIso: FIXED_TS, leadId: FIXED_ID })
  assert.equal(lead.conversationChannel, 'WhatsApp')
  assert.equal(lead.campaignName, 'Wonder Beyond the Wonder')
  assert.equal(lead.travellerType, 'Birdwatching')
  assert.equal(lead.experienceName, '')
}

// --- Phone "Not provided" → blank ---
{
  const payload = wonderPayload('form')
  if (payload.kind !== 'wonder_beyond_the_wonder') throw new Error('expected wonder payload')
  payload.fullPhone = 'Not provided'
  payload.phone = ''
  const lead = normalizeEnquiryToLead(payload, { dateTimeIso: FIXED_TS, leadId: FIXED_ID })
  assert.equal(lead.phoneNumber, '')
}

// --- First name derivation ---
{
  assert.equal(deriveFirstName('Carlos Test'), 'Carlos')
  assert.equal(deriveFirstName('Julie'), 'Julie')
  assert.equal(deriveFirstName('  Sarah Collins  '), 'Sarah')
  assert.equal(deriveFirstName(''), '')
  assert.equal(deriveFirstName('   '), '')
}

// --- International phone writes as Sheets text (leading ' marker; + preserved) ---
{
  assert.equal(formatPhoneNumberForSheetsCell('+447856123456'), "'+447856123456")
  assert.equal(formatPhoneNumberForSheetsCell('+51 999888777'), "'+51 999888777")
  assert.equal(formatPhoneNumberForSheetsCell(''), '')
  assert.equal(formatPhoneNumberForSheetsCell("'+447856123456"), "'+447856123456")

  const payload = wonderPayload('form')
  if (payload.kind !== 'wonder_beyond_the_wonder') throw new Error('expected wonder payload')
  payload.fullPhone = '+447856123456'
  const lead = normalizeEnquiryToLead(payload, { dateTimeIso: FIXED_TS, leadId: FIXED_ID })
  assert.equal(lead.phoneNumber, '+447856123456', 'normalized phone must keep + unchanged')
  const row = buildNormalizedGoogleSheetsRow(lead)
  assert.equal(row[11], "'+447856123456", 'Sheets cell must use text marker only at write layer')
  assert.ok(row[11].startsWith("'"))
  assert.ok(row[11].includes('+447856123456'))
}

// --- Sheet row order matches headers ---
{
  const lead = normalizeEnquiryToLead(planPayload(), { dateTimeIso: FIXED_TS, leadId: FIXED_ID })
  const row = buildNormalizedGoogleSheetsRow(lead)
  assert.equal(NORMALIZED_SHEET_HEADERS.length, 20)
  assert.equal(row.length, 20)
  assert.equal(NORMALIZED_SHEET_HEADERS[8], 'FULL NAME')
  assert.equal(NORMALIZED_SHEET_HEADERS[9], 'FIRST NAME')
  assert.equal(row[0], FIXED_TS)
  assert.equal(row[1], FIXED_ID)
  assert.equal(row[2], 'General')
  assert.equal(row[7], 'https://ecotone.eco/')
  assert.equal(row[8], 'Ada Lovelace')
  assert.equal(row[9], 'Ada')
  assert.equal(row[19], lead.rawPayload)
}

// --- Env gate for dual-write ---
{
  assert.equal(resolveNormalizedSheetTabName({}), null)
  assert.equal(resolveNormalizedSheetTabName({ GOOGLE_SHEETS_NORMALIZED_TAB_NAME: '' }), null)
  assert.equal(resolveNormalizedSheetTabName({ GOOGLE_SHEETS_NORMALIZED_TAB_NAME: '   ' }), null)
  assert.equal(
    resolveNormalizedSheetTabName({ GOOGLE_SHEETS_NORMALIZED_TAB_NAME: 'Raw_Leads' }),
    'Raw_Leads',
  )
}

console.log('testNormalizedLead: all assertions passed')
