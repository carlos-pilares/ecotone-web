import type { sheets_v4 } from 'googleapis'

import { buildWonderBeyondSheetNotes, type EnquiryPayload } from '@/lib/enquiryPayload'

const LOG = '[api/enquiry/sheets]'

/** Column A–Q order for enquiry append + optional header row. */
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
 * Production worksheet title in spreadsheet `Ecotone Enquiries`.
 * Note the space: Google Sheets default UI title is often "Sheet 1", not "Sheet1".
 */
export const DEFAULT_ENQUIRY_SHEET_TAB = 'Sheet 1'

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
 * Resolve the enquiry worksheet tab name.
 * Precedence:
 * 1. GOOGLE_SHEETS_TAB_NAME
 * 2. Tab parsed from GOOGLE_SHEET_APPEND_RANGE (legacy)
 * 3. DEFAULT_ENQUIRY_SHEET_TAB ("Sheet 1")
 */
export function resolveEnquirySheetTabName(env: NodeJS.ProcessEnv = process.env): string {
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
 * Quote a sheet tab for A1 notation when it contains spaces or special characters.
 * Example: Sheet 1 → 'Sheet 1'
 */
export function quoteSheetTabForA1(sheetTab: string): string {
  const trimmed = sheetTab.trim()
  if (/^[A-Za-z0-9_]+$/.test(trimmed)) return trimmed
  return `'${trimmed.replace(/'/g, "''")}'`
}

/** Append target spanning all enquiry columns (A–Q). */
export function structuredAppendRange(sheetTab: string): string {
  return `${quoteSheetTabForA1(sheetTab)}!A:Q`
}

/** Header read/write range for row 1 across A–Q. */
export function structuredHeaderRange(sheetTab: string): string {
  return `${quoteSheetTabForA1(sheetTab)}!A1:${columnLetter(ENQUIRY_SHEET_COLUMN_COUNT)}1`
}

function isRowAllBlank(row: string[] | undefined): boolean {
  if (!row || row.length === 0) return true
  return row.every((cell) => cell === undefined || cell === null || String(cell).trim() === '')
}

function rowLooksLikeOurHeaders(row: string[] | undefined): boolean {
  return row?.[0]?.trim() === ENQUIRY_SHEET_HEADERS[0]
}

/**
 * If row 1 is empty, write the header row once.
 * If row 1 already starts with our first header, skip.
 * If row 1 has other non-empty content, do not overwrite — log and skip.
 */
export async function ensureSheetHeaders(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetTab: string,
): Promise<void> {
  const readRange = structuredHeaderRange(sheetTab)
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: readRange,
  })
  const firstRow = res.data.values?.[0] as string[] | undefined

  if (rowLooksLikeOurHeaders(firstRow)) {
    console.info(`${LOG} header row already present (matched "${ENQUIRY_SHEET_HEADERS[0]}")`)
    return
  }

  if (isRowAllBlank(firstRow)) {
    const writeRange = structuredHeaderRange(sheetTab)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: writeRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[...ENQUIRY_SHEET_HEADERS]] },
    })
    console.info(`${LOG} wrote header row to empty sheet row 1`)
    return
  }

  console.info(
    `${LOG} row 1 has content but is not our header row; skipping auto-header to avoid overwriting`,
  )
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

/** One data row (17 columns) for `values.append`. */
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
