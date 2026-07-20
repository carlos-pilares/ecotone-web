import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { Resend } from 'resend'

import {
  buildGoogleSheetsRow,
  ensureSheetHeaders,
  resolveEnquirySheetTabName,
  structuredAppendRange,
} from '@/lib/enquiryGoogleSheets'
import {
  formatEnquiryEmailBody,
  getEnquiryEmailSubject,
  parseEnquiryPayload,
  type EnquiryPayload,
} from '@/lib/enquiryPayload'

export const runtime = 'nodejs'

const LOG = '[api/enquiry]'
const DEFAULT_NOTIFICATION_EMAIL = 'info@ecotone.eco'

/**
 * Safe Google / Gaxios error summary for Vercel logs.
 * Includes message, HTTP status/code, and Sheets API error code when present.
 * Does not log credentials, private keys, lead PII, or request payloads.
 */
function serializeSheetsError(reason: unknown): string {
  if (!(reason instanceof Error)) {
    try {
      return JSON.stringify(reason)
    } catch {
      return String(reason)
    }
  }

  const extra = reason as Error & {
    code?: number | string
    status?: number | string
    response?: {
      status?: number
      statusText?: string
      data?: {
        error?: {
          code?: number
          message?: string
          status?: string
          errors?: Array<{ message?: string; reason?: string; domain?: string }>
        }
      }
    }
  }

  const apiError = extra.response?.data?.error
  const parts = [
    `message: ${reason.message}`,
    `httpStatus: ${String(extra.response?.status ?? extra.status ?? extra.code ?? 'unknown')}`,
  ]
  if (extra.response?.statusText) {
    parts.push(`httpStatusText: ${extra.response.statusText}`)
  }
  if (apiError?.code != null) parts.push(`apiCode: ${String(apiError.code)}`)
  if (apiError?.status) parts.push(`apiStatus: ${apiError.status}`)
  if (apiError?.message) parts.push(`apiMessage: ${apiError.message}`)
  if (apiError?.errors?.length) {
    const reasons = apiError.errors
      .map((e) => e.reason || e.message)
      .filter(Boolean)
      .join(', ')
    if (reasons) parts.push(`apiReasons: ${reasons}`)
  }
  return parts.join(' | ')
}

function serializeSettledReason(reason: unknown): string {
  if (reason instanceof Error) {
    // Prefer compact Sheets-safe summary when this looks like a Google API error.
    const maybeGaxios = reason as Error & { response?: { data?: unknown } }
    if (maybeGaxios.response?.data != null) {
      return serializeSheetsError(reason)
    }
    return `message: ${reason.message}`
  }
  if (typeof reason === 'string') return reason
  try {
    return JSON.stringify(reason)
  } catch {
    return String(reason)
  }
}

function logSettledOutcome(
  label: 'google_sheets' | 'resend_email',
  outcome: PromiseSettledResult<unknown>,
  context?: { sheetTab?: string; appendRange?: string; spreadsheetId?: string },
) {
  if (outcome.status === 'fulfilled') {
    console.info(`${LOG} ${label}: OK (fulfilled)`)
    return
  }
  console.error(`${LOG} ${label}: FAILED (rejected)`)
  if (label === 'google_sheets' && context) {
    console.error(
      `${LOG} ${label} context: spreadsheetId=${context.spreadsheetId ?? 'unknown'} sheetTab=${JSON.stringify(context.sheetTab ?? '')} appendRange=${JSON.stringify(context.appendRange ?? '')}`,
    )
  }
  console.error(`${LOG} ${label} reason: ${serializeSettledReason(outcome.reason)}`)
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
  const sheetTab = resolveEnquirySheetTabName()
  const appendRange = structuredAppendRange(sheetTab)

  console.info(
    `${LOG} sheets append target: spreadsheetId=${spreadsheetId} sheetTab=${JSON.stringify(sheetTab)} appendRange=${JSON.stringify(appendRange)}`,
  )

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
  const submittedAt = new Date().toISOString()
  const subject = getEnquiryEmailSubject(payload)

  const sent = await resend.emails.send({
    from,
    to: [to],
    subject,
    text: formatEnquiryEmailBody(payload, submittedAt),
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

  const sheetTab = resolveEnquirySheetTabName()
  const appendRange = structuredAppendRange(sheetTab)
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID?.trim() || undefined

  const [sheetOutcome, emailOutcome] = await Promise.allSettled([
    appendEnquiryToSheet(payload),
    sendEnquiryNotification(payload),
  ])

  logSettledOutcome('google_sheets', sheetOutcome, { sheetTab, appendRange, spreadsheetId })
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
