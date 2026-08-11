import type { sheets_v4 } from 'googleapis'

import { buildWonderBeyondSheetNotes, type EnquiryPayload } from '@/lib/enquiryPayload'
import type { NormalizedLead } from '@/lib/normalizedLead'

const LOG = '[api/enquiry/sheets]'

/** Column A–Q order for legacy enquiry append + optional header row. */
export const ENQUIRY_SHEET_HEADERS = [
  'Submitted At',
  'Source / Kind',
  'Flow',
  'Full Name',
  'Email',
  'Contact Channel',
  'Traveller Type',
  'Season / Period',
  'Approx Travel Date',
  'Party Size',
  'Experience Name',
  'Experience Route',
  'Experience Duration',
  'Experience Program Type',
  'Experience Price',
  'Message / Note',
  'Raw Payload',
] as const

export const ENQUIRY_SHEET_COLUMN_COUNT = ENQUIRY_SHEET_HEADERS.length

/**
 * Canonical normalised RAW lead table (`Raw_Leads`) — 19 columns A–S.
 * Do not add migration/debug columns here.
 */
export const NORMALIZED_SHEET_HEADERS = [
  'DATE & TIME',
  'LEAD ID',
  'TYPE OF LEAD',
  'ACQUISITION CHANNEL',
  'CONVERSATION CHANNEL',
  'CAMPAIGN NAME',
  'EXPERIENCE NAME',
  'LANDING PAGE',
  'FULL NAME',
  'EMAIL',
  'PHONE NUMBER',
  'TRAVELLER TYPE',
  'SEASON PERIOD',
  'TRAVEL DATE',
  'PARTY SIZE',
  'DURATION',
  'PRICE',
  'MESSAGE / NOTE',
  'RAW PAYLOAD',
] as const

export const NORMALIZED_SHEET_COLUMN_COUNT = NORMALIZED_SHEET_HEADERS.length

/**
 * Production worksheet title in spreadsheet `Ecotone Enquiries`.
 * Note the space: Google Sheets default UI title is often "Sheet 1", not "Sheet1".
 */
export const DEFAULT_ENQUIRY_SHEET_TAB = 'Sheet 1'

/** Operational default for the normalised RAW tab when env is set without override. */
export const DEFAULT_NORMALIZED_SHEET_TAB = 'Raw_Leads'

/** Parse sheet tab name from e.g. `Sheet1!A:C` or `'Sheet 1'!A:Q`. */
export function parseSheetTabFromAppendRange(appendRange: string): string | null {
  const trimmed = appendRange.trim()
  if (!trimmed) return null
  const bang = trimmed.indexOf('!')
  const rawTab = bang === -1 ? trimmed : trimmed.slice(0, bang).trim()
  if (!rawTab) return null
  // Strip optional A1 single-quotes: 'Sheet 1' → Sheet 1
  if (rawTab.startsWith("'") && rawTab.endsWith("'") && rawTab.length >= 2) {
    return rawTab.slice(1, -1).replace(/''/g, "'")
  }
  return rawTab
}

/**
 * Resolve the legacy enquiry worksheet tab name.
 * Precedence:
 * 1. GOOGLE_SHEETS_TAB_NAME
 * 2. Tab parsed from GOOGLE_SHEET_APPEND_RANGE (legacy)
 * 3. DEFAULT_ENQUIRY_SHEET_TAB ("Sheet 1")
 */
export function resolveEnquirySheetTabName(
  env: Record<string, string | undefined> = process.env,
): string {
  const fromTabEnv = env.GOOGLE_SHEETS_TAB_NAME?.trim()
  if (fromTabEnv) return fromTabEnv

  const fromRangeEnv = env.GOOGLE_SHEET_APPEND_RANGE?.trim()
  if (fromRangeEnv) {
    const parsed = parseSheetTabFromAppendRange(fromRangeEnv)
    if (parsed) return parsed
  }

  return DEFAULT_ENQUIRY_SHEET_TAB
}

/**
 * Resolve the normalised RAW tab name when dual-write is enabled.
 * Returns null when dual-write should be skipped (env unset/empty).
 *
 * Env: GOOGLE_SHEETS_NORMALIZED_TAB_NAME
 * - unset / empty → dual-write off
 * - any non-empty value → that tab name (typically `Raw_Leads`)
 */
export function resolveNormalizedSheetTabName(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const raw = env.GOOGLE_SHEETS_NORMALIZED_TAB_NAME
  if (raw === undefined) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  return trimmed
}

/**
 * Quote a sheet tab for A1 notation when it contains spaces or special characters.
 * Example: Sheet 1 → 'Sheet 1'
 */
export function quoteSheetTabForA1(sheetTab: string): string {
  const trimmed = sheetTab.trim()
  if (/^[A-Za-z0-9_]+$/.test(trimmed)) return trimmed
  return `'${trimmed.replace(/'/g, "''")}'`
}

/** Append target spanning all legacy enquiry columns (A–Q). */
export function structuredAppendRange(sheetTab: string): string {
  return structuredColumnAppendRange(sheetTab, ENQUIRY_SHEET_COLUMN_COUNT)
}

/** Append target spanning normalised columns (A–S). */
export function structuredNormalizedAppendRange(sheetTab: string): string {
  return structuredColumnAppendRange(sheetTab, NORMALIZED_SHEET_COLUMN_COUNT)
}

function structuredColumnAppendRange(sheetTab: string, columnCount: number): string {
  return `${quoteSheetTabForA1(sheetTab)}!A:${columnLetter(columnCount)}`
}

/** Header read/write range for row 1 across legacy A–Q. */
export function structuredHeaderRange(sheetTab: string): string {
  return structuredColumnHeaderRange(sheetTab, ENQUIRY_SHEET_COLUMN_COUNT)
}

/** Header read/write range for row 1 across normalised A–S. */
export function structuredNormalizedHeaderRange(sheetTab: string): string {
  return structuredColumnHeaderRange(sheetTab, NORMALIZED_SHEET_COLUMN_COUNT)
}

function structuredColumnHeaderRange(sheetTab: string, columnCount: number): string {
  return `${quoteSheetTabForA1(sheetTab)}!A1:${columnLetter(columnCount)}1`
}

function isRowAllBlank(row: string[] | undefined): boolean {
  if (!row || row.length === 0) return true
  return row.every((cell) => cell === undefined || cell === null || String(cell).trim() === '')
}

function rowLooksLikeHeaders(row: string[] | undefined, expectedFirstHeader: string): boolean {
  return row?.[0]?.trim() === expectedFirstHeader
}

async function ensureHeadersForTab(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetTab: string,
  headers: readonly string[],
): Promise<void> {
  const columnCount = headers.length
  const readRange = structuredColumnHeaderRange(sheetTab, columnCount)
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: readRange,
  })
  const firstRow = res.data.values?.[0] as string[] | undefined
  const expectedFirst = headers[0]!

  if (rowLooksLikeHeaders(firstRow, expectedFirst)) {
    console.info(`${LOG} header row already present (matched "${expectedFirst}") on tab ${JSON.stringify(sheetTab)}`)
    return
  }

  if (isRowAllBlank(firstRow)) {
    const writeRange = structuredColumnHeaderRange(sheetTab, columnCount)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: writeRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[...headers]] },
    })
    console.info(`${LOG} wrote header row to empty sheet row 1 on tab ${JSON.stringify(sheetTab)}`)
    return
  }

  console.info(
    `${LOG} row 1 has content but is not our header row on tab ${JSON.stringify(sheetTab)}; skipping auto-header to avoid overwriting`,
  )
}

/**
 * If row 1 is empty, write the legacy header row once.
 * If row 1 already starts with our first header, skip.
 * If row 1 has other non-empty content, do not overwrite — log and skip.
 */
export async function ensureSheetHeaders(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetTab: string,
): Promise<void> {
  await ensureHeadersForTab(sheets, spreadsheetId, sheetTab, ENQUIRY_SHEET_HEADERS)
}

/** Same behaviour as ensureSheetHeaders, for the normalised 19-column schema. */
export async function ensureNormalizedSheetHeaders(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetTab: string,
): Promise<void> {
  await ensureHeadersForTab(sheets, spreadsheetId, sheetTab, NORMALIZED_SHEET_HEADERS)
}

/** 1-based column index → Excel column letters (1→A, 26→Z, 27→AA). */
function columnLetter(n: number): string {
  if (n < 1) return 'A'
  let result = ''
  let num = n
  while (num > 0) {
    num -= 1
    result = String.fromCharCode(65 + (num % 26)) + result
    num = Math.floor(num / 26)
  }
  return result
}

/** One legacy data row (17 columns) for `values.append`. */
export function buildGoogleSheetsRow(submittedAtIso: string, payload: EnquiryPayload): string[] {
  const raw = JSON.stringify(payload)

  if (payload.kind === 'plan_journey') {
    return [
      submittedAtIso,
      payload.kind,
      'Plan journey',
      payload.fullName,
      payload.email,
      payload.contactChannel,
      payload.travellerTypeTitle ?? payload.travellerType ?? '',
      payload.seasonLine ?? payload.season ?? '',
      '',
      String(payload.partySize),
      '',
      '',
      '',
      '',
      '',
      payload.emailMessage,
      raw,
    ]
  }

  if (payload.kind === 'wonder_beyond_the_wonder') {
    return [
      submittedAtIso,
      payload.flowType,
      payload.flowLabel,
      payload.fullName,
      payload.email,
      payload.contactChannel,
      payload.interest,
      payload.travelTiming,
      '',
      payload.groupSize,
      'Wonder Beyond the Wonder',
      'Beyond Machu Picchu / Manu & Tropical Andes',
      '4-night experience',
      'Campaign benefit',
      'Up to 50% off selected 2026 Ecotone Experiences',
      buildWonderBeyondSheetNotes(payload),
      raw,
    ]
  }

  const s = payload.experienceSummary
  const price = [s.priceLine, s.priceSub].filter((x) => x && String(x).trim()).join(' ')

  return [
    submittedAtIso,
    payload.kind,
    'Book experience',
    payload.name,
    payload.email,
    payload.contactChannel,
    '',
    '',
    payload.approxTravelDate,
    String(payload.partySize),
    s.experienceName,
    s.route,
    s.duration,
    s.programType,
    price,
    payload.emailMessage,
    raw,
  ]
}

/** One normalised data row (19 columns) for `Raw_Leads`. */
export function buildNormalizedGoogleSheetsRow(lead: NormalizedLead): string[] {
  return [
    lead.dateTimeIso,
    lead.leadId,
    lead.typeOfLead,
    lead.acquisitionChannel,
    lead.conversationChannel,
    lead.campaignName,
    lead.experienceName,
    lead.landingPage,
    lead.fullName,
    lead.email,
    lead.phoneNumber,
    lead.travellerType,
    lead.seasonPeriod,
    lead.travelDate,
    lead.partySize,
    lead.duration,
    lead.price,
    lead.messageNote,
    lead.rawPayload,
  ]
}
