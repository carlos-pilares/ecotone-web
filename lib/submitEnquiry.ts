import type { EnquiryPayload } from '@/lib/enquiryPayload'

export type SubmitEnquiryResult =
  | { ok: true; leadId: string }
  | { ok: false; leadId?: undefined }

/** Fire-and-forget POST to `/api/enquiry`; errors are swallowed so UX never blocks. */
export function submitEnquiryInBackground(payload: EnquiryPayload): void {
  if (typeof window === 'undefined') return
  void submitEnquiry(payload).catch(() => {})
}

/** Awaitable POST to `/api/enquiry`. Returns lead id when the API responds with `{ ok: true }`. */
export async function submitEnquiry(payload: EnquiryPayload): Promise<SubmitEnquiryResult> {
  if (typeof window === 'undefined') return { ok: false }
  try {
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) return { ok: false }
    const data = (await res.json()) as { ok?: boolean; leadId?: string }
    if (data.ok === true && typeof data.leadId === 'string' && data.leadId.trim()) {
      return { ok: true, leadId: data.leadId.trim() }
    }
    return { ok: false }
  } catch {
    return { ok: false }
  }
}
