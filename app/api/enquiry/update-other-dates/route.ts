import { NextResponse } from 'next/server'
import { google } from 'googleapis'

import {
  resolveNormalizedSheetTabName,
  updateNormalizedLeadOtherDates,
} from '@/lib/enquiryGoogleSheets'

export const runtime = 'nodejs'

const LOG = '[api/enquiry/update-other-dates]'

/** Lead IDs are generated as ECO-YYMMDD-XXXX (Crockford-like alphabet). */
const LEAD_ID_PATTERN = /^ECO-\d{6}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/

const MAX_TRAVEL_DATE_LENGTH = 200
const MAX_MESSAGE_LENGTH = 2000

function getPrivateKey(): string {
  const k = process.env.GOOGLE_PRIVATE_KEY
  if (!k) throw new Error('Missing GOOGLE_PRIVATE_KEY')
  return k.replace(/\\n/g, '\n')
}

function createSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
  if (!clientEmail || !spreadsheetId) throw new Error('Missing Google Sheets credentials')

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: getPrivateKey(),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return {
    sheets: google.sheets({ version: 'v4', auth }),
    spreadsheetId,
  }
}

export async function POST(request: Request) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const body = raw as Record<string, unknown>
  const leadId = typeof body.leadId === 'string' ? body.leadId.trim() : ''
  const travelDate = typeof body.travelDate === 'string' ? body.travelDate.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (!leadId || !LEAD_ID_PATTERN.test(leadId)) {
    return NextResponse.json({ ok: false, error: 'invalid_lead_id' }, { status: 400 })
  }
  if (!travelDate) {
    return NextResponse.json({ ok: false, error: 'invalid_travel_date' }, { status: 400 })
  }
  if (travelDate.length > MAX_TRAVEL_DATE_LENGTH) {
    return NextResponse.json({ ok: false, error: 'travel_date_too_long' }, { status: 400 })
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ ok: false, error: 'message_too_long' }, { status: 400 })
  }

  try {
    const sheetTab = resolveNormalizedSheetTabName()
    const { sheets, spreadsheetId } = createSheetsClient()
    const result = await updateNormalizedLeadOtherDates(
      sheets,
      spreadsheetId,
      sheetTab,
      leadId,
      travelDate,
      message,
    )

    if (result.ok) {
      console.info(`${LOG} ok=true sheetTab=${JSON.stringify(sheetTab)} row=${result.rowNumber}`)
      return NextResponse.json({ ok: true })
    }

    if (result.reason === 'not_found') {
      console.error(`${LOG} ok=false reason=not_found`)
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
    }
    if (result.reason === 'duplicate_lead_id') {
      console.error(`${LOG} ok=false reason=duplicate_lead_id`)
      return NextResponse.json({ ok: false, error: 'duplicate_lead_id' }, { status: 409 })
    }
    if (result.reason === 'missing_headers') {
      console.error(`${LOG} ok=false reason=missing_headers`)
      return NextResponse.json({ ok: false, error: 'missing_headers' }, { status: 500 })
    }

    console.error(`${LOG} ok=false reason=sheets_error`)
    return NextResponse.json({ ok: false, error: 'sheets_error' }, { status: 500 })
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'unknown'
    console.error(`${LOG} ok=false reason=unhandled message=${messageText}`)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
