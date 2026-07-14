import type { EnquiryPayload } from '@/lib/enquiryPayload'

/** Fire-and-forget POST to `/api/enquiry`; errors are swallowed so UX never blocks. */
export function submitEnquiryInBackground(payload: EnquiryPayload): void {
  if (typeof window === 'undefined') return
  void submitEnquiry(payload).catch(() => {})
}

/** Awaitable POST to `/api/enquiry`. Returns true when the API responds with `{ ok: true }`. */
export async function submitEnquiry(payload: EnquiryPayload): Promise<boolean> {
  if (typeof window === 'undefined') return false
  try {
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) return false
    const data = (await res.json()) as { ok?: boolean }
    return data.ok === true
  } catch {
    return false
  }
}
