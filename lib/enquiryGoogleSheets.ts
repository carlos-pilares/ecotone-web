import type { sheets_v4 } from 'googleapis'

import type { EnquiryPayload } from '@/lib/enquiryPayload'

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

/** Parse sheet tab name from e.g. `Sheet1!A:C` → `Sheet1`. Defaults to `Sheet1`. */
export function parseSheetTabFromAppendRange(appendRange: string): string {
  const trimmed = appendRange.trim()
  const bang = trimmed.indexOf('!')
  if (bang === -1) return 'Sheet1'
  const tab = trimmed.slice(0, bang).trim()
  return tab || 'Sheet1'
}

/** Append target spanning all enquiry columns (A–Q). */
export function structuredAppendRange(sheetTab: string): string {
  return `${sheetTab}!A:Q`
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
  const readRange = `${sheetTab}!A1:${columnLetter(ENQUIRY_SHEET_COLUMN_COUNT)}1`
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
    const writeRange = `${sheetTab}!A1:${columnLetter(ENQUIRY_SHEET_COLUMN_COUNT)}1`
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
