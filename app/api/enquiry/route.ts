import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { Resend } from 'resend'

import {
  buildGoogleSheetsRow,
  ensureSheetHeaders,
  parseSheetTabFromAppendRange,
  structuredAppendRange,
} from '@/lib/enquiryGoogleSheets'
import { formatEnquiryEmailBody, parseEnquiryPayload, type EnquiryPayload } from '@/lib/enquiryPayload'

export const runtime = 'nodejs'

const LOG = '[api/enquiry]'
const DEFAULT_NOTIFICATION_EMAIL = 'ecotone.experience@gmail.com'

function serializeSettledReason(reason: unknown): string {
  if (reason instanceof Error) {
    const extra = reason as Error & { response?: { status?: number; statusText?: string; data?: unknown } }
    const parts = [`message: ${reason.message}`, `stack:\n${reason.stack ?? '(no stack)'}`]
    if (extra.response != null) {
      parts.push(
        `httpStatus: ${String(extra.response.status)} ${String(extra.response.statusText ?? '')}`.trim(),
      )
      try {
        parts.push(`response.data: ${JSON.stringify(extra.response.data, null, 2)}`)
      } catch {
        parts.push(`response.data: (unserializable)`)
      }
    }
    const cause = 'cause' in reason ? (reason as Error & { cause?: unknown }).cause : undefined
    if (cause !== undefined) {
      parts.push(`cause: ${serializeSettledReason(cause)}`)
    }
    return parts.join('\n')
  }
  if (typeof reason === 'string') return reason
  try {
    return JSON.stringify(reason, null, 2)
  } catch {
    return String(reason)
  }
}

function logSettledOutcome(label: 'google_sheets' | 'resend_email', outcome: PromiseSettledResult<unknown>) {
  if (outcome.status === 'fulfilled') {
    console.info(`${LOG} ${label}: OK (fulfilled)`)
    return
  }
  console.error(`${LOG} ${label}: FAILED (rejected)`)
  console.error(`${LOG} ${label} reason:\n${serializeSettledReason(outcome.reason)}`)
}

function getPrivateKey(): string {
  const k = process.env.GOOGLE_PRIVATE_KEY
  if (!k) throw new Error('Missing GOOGLE_PRIVATE_KEY')
  return k.replace(/\\n/g, '\n')
}

function resolveNotificationRecipient(): string {
  return (process.env.NOTIFICATION_EMAIL?.trim() || DEFAULT_NOTIFICATION_EMAIL).toLowerCase()
}

async function appendEnquiryToSheet(payload: EnquiryPayload): Promise<void> {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
  if (!clientEmail || !spreadsheetId) throw new Error('Missing Google Sheets credentials')

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: getPrivateKey(),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const ts = new Date().toISOString()
  const appendRangeEnv = process.env.GOOGLE_SHEET_APPEND_RANGE ?? 'Sheet1!A:Q'
  const sheetTab = parseSheetTabFromAppendRange(appendRangeEnv)
  const appendRange = structuredAppendRange(sheetTab)

  await ensureSheetHeaders(sheets, spreadsheetId, sheetTab)
  const row = buildGoogleSheetsRow(ts, payload)

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: appendRange,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [row],
    },
  })
}

async function sendEnquiryNotification(payload: EnquiryPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = resolveNotificationRecipient()
  if (!apiKey) throw new Error('Missing RESEND_API_KEY')
  if (process.env.NODE_ENV === 'development') {
    console.log('[ENQUIRY RECIPIENT]', to)
  }

  const resend = new Resend(apiKey)
  const from = process.env.RESEND_FROM_EMAIL ?? 'Ecotone <onboarding@resend.dev>'
  const subject =
    payload.kind === 'plan_journey'
      ? 'New enquiry: Plan journey'
      : `New enquiry: Book experience — ${payload.experienceSummary.experienceName}`

  const sent = await resend.emails.send({
    from,
    to: [to],
    subject,
    text: formatEnquiryEmailBody(payload),
  })

  if (sent.error) {
    throw new Error(sent.error.message || 'Resend error')
  }
}

export async function POST(request: Request) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const payload = parseEnquiryPayload(raw)
  if (!payload) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const [sheetOutcome, emailOutcome] = await Promise.allSettled([
    appendEnquiryToSheet(payload),
    sendEnquiryNotification(payload),
  ])

  logSettledOutcome('google_sheets', sheetOutcome)
  logSettledOutcome('resend_email', emailOutcome)

  const sheetOk = sheetOutcome.status === 'fulfilled'
  const emailOk = emailOutcome.status === 'fulfilled'

  if (sheetOk && emailOk) {
    console.info(`${LOG} response: ok=true (both branches succeeded)`)
    return NextResponse.json({ ok: true })
  }

  console.error(
    `${LOG} response: ok=false status=500 (sheetOk=${String(sheetOk)} emailOk=${String(emailOk)})`,
  )
  return NextResponse.json({ ok: false }, { status: 500 })
}
