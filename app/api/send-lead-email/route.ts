import { timingSafeEqual } from 'node:crypto'

import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { applyTemplateVariables } from '@/lib/applyTemplateVariables'

export const runtime = 'nodejs'

const LOG = '[api/send-lead-email]'
const SECRET_HEADER = 'x-make-secret'

type SendLeadEmailBody = {
  leadId?: unknown
  to?: unknown
  subject?: unknown
  body?: unknown
  variables?: unknown
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function secretsMatch(provided: string | null, expected: string): boolean {
  if (!provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function errorResponse(
  status: number,
  leadId: string | null,
  error: string,
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      leadId: leadId ?? '',
      error,
    },
    { status },
  )
}

export async function POST(request: Request) {
  const expectedSecret = process.env.MAKE_LEAD_EMAIL_SECRET?.trim()
  if (!expectedSecret) {
    console.error(`${LOG} misconfigured: MAKE_LEAD_EMAIL_SECRET is not set`)
    return errorResponse(500, null, 'Server misconfigured')
  }

  const providedSecret = request.headers.get(SECRET_HEADER)
  if (!secretsMatch(providedSecret, expectedSecret)) {
    console.error(`${LOG} unauthorized: invalid or missing ${SECRET_HEADER}`)
    return errorResponse(401, null, 'Unauthorized')
  }

  let raw: SendLeadEmailBody
  try {
    raw = (await request.json()) as SendLeadEmailBody
  } catch {
    return errorResponse(400, null, 'Invalid JSON body')
  }

  const leadId = asNonEmptyString(raw.leadId)
  const to = asNonEmptyString(raw.to)
  const subject = asNonEmptyString(raw.subject)
  const body = asNonEmptyString(raw.body)

  if (!leadId) return errorResponse(400, leadId, 'Missing required field: leadId')
  if (!to) return errorResponse(400, leadId, 'Missing required field: to')
  if (!subject) return errorResponse(400, leadId, 'Missing required field: subject')
  if (!body) return errorResponse(400, leadId, 'Missing required field: body')

  const mergedSubject = applyTemplateVariables(subject, raw.variables)
  const mergedBody = applyTemplateVariables(body, raw.variables)
  const didMerge = raw.variables != null && typeof raw.variables === 'object' && !Array.isArray(raw.variables)

  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    console.error(`${LOG} misconfigured: RESEND_API_KEY is not set leadId=${leadId}`)
    return errorResponse(500, leadId, 'Server misconfigured')
  }

  const from = process.env.RESEND_FROM_EMAIL ?? 'Ecotone <onboarding@resend.dev>'
  const sentAt = new Date().toISOString()

  try {
    const resend = new Resend(apiKey)
    const sent = await resend.emails.send({
      from,
      to: [to],
      subject: mergedSubject,
      text: mergedBody,
    })

    if (sent.error) {
      console.error(
        `${LOG} resend error leadId=${leadId} message=${sent.error.message || 'Resend error'}`,
      )
      return errorResponse(502, leadId, sent.error.message || 'Resend error')
    }

    const resendMessageId = sent.data?.id ?? ''
    if (!resendMessageId) {
      console.error(`${LOG} resend returned no message id leadId=${leadId}`)
      return errorResponse(502, leadId, 'Resend returned no message id')
    }

    console.info(
      `${LOG} sent ok leadId=${leadId} resendMessageId=${resendMessageId} merge=${didMerge ? 'applied' : 'skipped'}`,
    )
    return NextResponse.json({
      success: true,
      leadId,
      resendMessageId,
      sentAt,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected send failure'
    console.error(`${LOG} send failed leadId=${leadId} message=${message}`)
    return errorResponse(500, leadId, message)
  }
}
