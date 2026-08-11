import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { Resend } from 'resend'

import {
  buildGoogleSheetsRow,
  buildNormalizedGoogleSheetsRow,
  ensureNormalizedSheetHeaders,
  ensureSheetHeaders,
  resolveEnquirySheetTabName,
  resolveNormalizedSheetTabName,
  structuredAppendRange,
  structuredNormalizedAppendRange,
} from '@/lib/enquiryGoogleSheets'
import { parseEnquiryPayload, type EnquiryPayload } from '@/lib/enquiryPayload'
import {
  formatNormalizedLeadEmailBody,
  getNormalizedLeadEmailSubject,
  normalizeEnquiryToLead,
  type NormalizedLead,
} from '@/lib/normalizedLead'

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
  label: 'google_sheets' | 'google_sheets_normalized' | 'resend_email',
  outcome: PromiseSettledResult<unknown>,
  context?: { sheetTab?: string; appendRange?: string; spreadsheetId?: string },
) {
  if (outcome.status === 'fulfilled') {
    console.info(`${LOG} ${label}: OK (fulfilled)`)
    return
  }
  console.error(`${LOG} ${label}: FAILED (rejected)`)
  if ((label === 'google_sheets' || label === 'google_sheets_normalized') && context) {
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

/** Legacy tab append — unchanged schema (17 columns). */
async function appendEnquiryToLegacySheet(
  payload: EnquiryPayload,
  dateTimeIso: string,
): Promise<void> {
  const { sheets, spreadsheetId } = createSheetsClient()
  const sheetTab = resolveEnquirySheetTabName()
  const appendRange = structuredAppendRange(sheetTab)

  console.info(
    `${LOG} sheets append target (legacy): spreadsheetId=${spreadsheetId} sheetTab=${JSON.stringify(sheetTab)} appendRange=${JSON.stringify(appendRange)}`,
  )

  await ensureSheetHeaders(sheets, spreadsheetId, sheetTab)
  const row = buildGoogleSheetsRow(dateTimeIso, payload)

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

/** Canonical Raw_Leads append — 19 normalised columns. */
async function appendEnquiryToNormalizedSheet(lead: NormalizedLead): Promise<void> {
  const sheetTab = resolveNormalizedSheetTabName()
  if (!sheetTab) {
    throw new Error('Normalized sheet tab not configured')
  }

  const { sheets, spreadsheetId } = createSheetsClient()
  const appendRange = structuredNormalizedAppendRange(sheetTab)

  console.info(
    `${LOG} sheets append target (normalized): spreadsheetId=${spreadsheetId} sheetTab=${JSON.stringify(sheetTab)} appendRange=${JSON.stringify(appendRange)}`,
  )

  await ensureNormalizedSheetHeaders(sheets, spreadsheetId, sheetTab)
  const row = buildNormalizedGoogleSheetsRow(lead)

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

async function sendEnquiryNotification(lead: NormalizedLead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = resolveNotificationRecipient()
  if (!apiKey) throw new Error('Missing RESEND_API_KEY')
  if (process.env.NODE_ENV === 'development') {
    console.log('[ENQUIRY RECIPIENT]', to)
  }

  const resend = new Resend(apiKey)
  const from = process.env.RESEND_FROM_EMAIL ?? 'Ecotone <onboarding@resend.dev>'
  const subject = getNormalizedLeadEmailSubject(lead)

  const sent = await resend.emails.send({
    from,
    to: [to],
    subject,
    text: formatNormalizedLeadEmailBody(lead),
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

  const dateTimeIso = new Date().toISOString()
  const lead = normalizeEnquiryToLead(payload, { dateTimeIso })

  const legacySheetTab = resolveEnquirySheetTabName()
  const legacyAppendRange = structuredAppendRange(legacySheetTab)
  const normalizedSheetTab = resolveNormalizedSheetTabName()
  const normalizedAppendRange = normalizedSheetTab
    ? structuredNormalizedAppendRange(normalizedSheetTab)
    : undefined
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID?.trim() || undefined

  const tasks: Array<{
    label: 'google_sheets' | 'google_sheets_normalized' | 'resend_email'
    promise: Promise<unknown>
    context?: { sheetTab?: string; appendRange?: string; spreadsheetId?: string }
  }> = [
    {
      label: 'google_sheets',
      promise: appendEnquiryToLegacySheet(payload, dateTimeIso),
      context: { sheetTab: legacySheetTab, appendRange: legacyAppendRange, spreadsheetId },
    },
    {
      label: 'resend_email',
      promise: sendEnquiryNotification(lead),
    },
  ]

  if (normalizedSheetTab) {
    tasks.push({
      label: 'google_sheets_normalized',
      promise: appendEnquiryToNormalizedSheet(lead),
      context: {
        sheetTab: normalizedSheetTab,
        appendRange: normalizedAppendRange,
        spreadsheetId,
      },
    })
  } else {
    console.info(`${LOG} normalized sheets dual-write: skipped (GOOGLE_SHEETS_NORMALIZED_TAB_NAME unset)`)
  }

  const outcomes = await Promise.allSettled(tasks.map((t) => t.promise))

  let sheetOk = false
  let emailOk = false
  let normalizedOk: boolean | null = normalizedSheetTab ? false : null

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]!
    const outcome = outcomes[i]!
    logSettledOutcome(task.label, outcome, task.context)
    if (task.label === 'google_sheets') sheetOk = outcome.status === 'fulfilled'
    if (task.label === 'resend_email') emailOk = outcome.status === 'fulfilled'
    if (task.label === 'google_sheets_normalized') {
      normalizedOk = outcome.status === 'fulfilled'
    }
  }

  // Dual-write: when normalised tab is enabled, require it too so misconfig is visible.
  const allSheetsOk = normalizedOk === null ? sheetOk : sheetOk && normalizedOk

  if (allSheetsOk && emailOk) {
    console.info(
      `${LOG} response: ok=true (legacySheet=${String(sheetOk)} normalizedSheet=${String(normalizedOk)} email=${String(emailOk)} leadId=${lead.leadId})`,
    )
    return NextResponse.json({ ok: true })
  }

  console.error(
    `${LOG} response: ok=false status=500 (legacySheet=${String(sheetOk)} normalizedSheet=${String(normalizedOk)} email=${String(emailOk)} leadId=${lead.leadId})`,
  )
  return NextResponse.json({ ok: false }, { status: 500 })
}
